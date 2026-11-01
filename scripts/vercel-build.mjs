/**
 * Build Vercel.
 *
 * Par défaut, le build NE MODIFIE PAS la base de données. Les migrations
 * Prisma ne sont appliquées que si la variable RUN_MIGRATIONS vaut « true »
 * pour l'environnement concerné (à activer volontairement dans Vercel, par
 * exemple pour l'aperçu branché sur la copie de test Neon).
 *
 * Avant, la commande de build du projet lançait `prisma db push` à chaque
 * déploiement, ce qui modifiait le schéma de la base de l'environnement,
 * y compris depuis une branche d'aperçu.
 */
import { execSync } from 'node:child_process';

const run = (command) => {
  console.log(`$ ${command}`);
  execSync(command, { stdio: 'inherit' });
};

const environment = process.env.VERCEL_ENV ?? 'local';

run('npx prisma generate');

if (process.env.RUN_MIGRATIONS === 'true') {
  console.log(`Migrations activées pour l'environnement « ${environment} ».`);
  run('npx prisma migrate deploy');
} else {
  console.log(
    `Base de données non modifiée pendant le build (${environment}, RUN_MIGRATIONS ≠ true).`,
  );
}

run('npx next build');
