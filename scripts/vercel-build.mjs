/**
 * Build Vercel.
 *
 * Par défaut, le build NE MODIFIE PAS la base de données. Variables (à
 * définir par environnement dans Vercel) :
 *
 * - RUN_MIGRATIONS=true : décrit la base dans les logs (nombre de lignes par
 *   table, rien de leur contenu) puis applique les migrations Prisma. Sur une
 *   base existante pas encore suivie par les migrations, la « baseline » n'est
 *   posée automatiquement que si la base correspond EXACTEMENT au schéma de
 *   référence (prisma/baseline/schema.prisma), et jamais en production.
 *   Sinon le build s'arrête sans rien modifier et affiche l'écart.
 * - SEED_CATALOG=true : remplit/complète les catalogues de règles (upsert).
 *
 * Avant, la commande de build du projet lançait `prisma db push` à chaque
 * déploiement, ce qui modifiait le schéma de la base de l'environnement,
 * y compris depuis une branche d'aperçu.
 */
import { execSync, spawnSync } from 'node:child_process';
import pg from 'pg';

const run = (command) => {
  console.log(`$ ${command}`);
  execSync(command, { stdio: 'inherit' });
};

const environment = process.env.VERCEL_ENV ?? 'local';
const databaseUrl =
  process.env.POSTGRES_URL_NON_POOLING ?? process.env.POSTGRES_PRISMA_URL;

const TABLES = [
  'users',
  'Whitelist',
  'Sheet',
  'Team',
  'CorpusType',
  'Corpus',
  'PotentialCategory',
  'PotentialType',
  'Potential',
  'Spyree',
  'Skill',
  'SheetSkill',
  'Property',
  'Armor',
  'MeleeWeapon',
  'RangeWeapon',
  'Item',
  'Trait',
  'Amee',
  'Spell',
  'Golem',
];

/** Décrit la base sans rien en montrer de sensible. */
const describeDatabase = async () => {
  const client = new pg.Client({ connectionString: databaseUrl });
  await client.connect();
  try {
    const host = new URL(databaseUrl).hostname.split('.')[0];
    const { rows } = await client.query(
      `select table_name from information_schema.tables
       where table_schema = 'public' and table_type = 'BASE TABLE'`,
    );
    const existing = new Set(rows.map((r) => r.table_name));
    console.log(`Base « ${host} » (${environment}) : ${existing.size} tables.`);
    for (const table of TABLES.filter((t) => existing.has(t))) {
      const res = await client.query(
        `select count(*)::int as n from "${table}"`,
      );
      console.log(`  ${table.padEnd(18)} ${res.rows[0].n} ligne(s)`);
    }
    return {
      empty: existing.size === 0,
      tracked: existing.has('_prisma_migrations'),
    };
  } finally {
    await client.end();
  }
};

/**
 * La base de production a été créée par Prisma 5, qui indexe les tables de
 * liaison (« _AToB ») par un index unique là où Prisma 7 attend une clé
 * primaire. C'est le seul écart toléré : la migration le corrige.
 */
const onlyJoinTableStyle = (diffSql) => {
  const statements = diffSql
    .split('\n')
    .filter((line) => line.trim() && !line.trim().startsWith('--'))
    .join(' ')
    .split(';')
    .map((statement) => statement.replace(/\s+/g, ' ').trim())
    .filter(Boolean);
  return (
    statements.length > 0 &&
    statements.every(
      (statement) =>
        /^ALTER TABLE "(_\w+)" ADD CONSTRAINT "\1_AB_pkey" PRIMARY KEY \("A", ?"B"\)$/.test(
          statement,
        ) || /^DROP INDEX "_\w+_AB_unique"$/.test(statement),
    )
  );
};

/** Pose la baseline uniquement si la base correspond au schéma de référence. */
const ensureBaseline = ({ empty, tracked }) => {
  if (empty || tracked) return;

  if (environment === 'production') {
    throw new Error(
      'Base de production non suivie par les migrations : la baseline doit ' +
        'être posée manuellement (voir README). Rien n’a été modifié.',
    );
  }

  const check = spawnSync(
    'npx',
    [
      'prisma',
      'migrate',
      'diff',
      '--from-config-datasource',
      '--to-schema',
      'prisma/baseline/schema.prisma',
      '--script',
      '--exit-code',
    ],
    { encoding: 'utf8' },
  );

  if (check.status === 0 || onlyJoinTableStyle(check.stdout)) {
    console.log('La base correspond au schéma de référence : baseline posée.');
    run('npx prisma migrate resolve --applied 0_baseline');
    return;
  }

  console.log(
    'Écart entre la base et le schéma de référence (SQL qui l’alignerait) :',
  );
  console.log(check.stdout || check.stderr);
  throw new Error(
    'La base ne correspond pas au schéma de référence : rien n’a été modifié.',
  );
};

run('npx prisma generate');

if (process.env.RUN_MIGRATIONS === 'true') {
  console.log(`Migrations activées pour l'environnement « ${environment} ».`);
  const state = await describeDatabase();
  ensureBaseline(state);
  run('npx prisma migrate deploy');
} else {
  console.log(
    `Base de données non modifiée pendant le build (${environment}, RUN_MIGRATIONS ≠ true).`,
  );
}

// Catalogues de règles (upsert uniquement : n'écrase ni ne supprime rien).
if (process.env.SEED_CATALOG === 'true') {
  run('npx prisma db seed');
}

run('npx next build');
