'use no memo';

import { Text, View } from '@react-pdf/renderer';
import { toRoman } from '@/lib/rules';
import { skillLabel } from '@/lib/rules/xp';
import {
  corpusStatLabel,
  DEGREE_COLORS,
  DEGREE_LABELS,
  potentialLabel,
  SKILL_TYPE_LABELS,
  type SkillDegree,
  type SkillType,
} from '@/lib/sheet/display';
import { rootsByType, skillTree } from '@/lib/sheet/skill-tree';
import type { SheetModel } from '../model';
import { SubArrow } from '../ornaments';
import {
  Chip,
  GroupTitle,
  LostNote,
  PdfTable,
  Section,
  StrikeLine,
} from '../primitives';
import { INK, s } from '../styles';
import { pdfText } from '../text';

type Sheet = SheetModel['sheet'];
type Corpus = Sheet['corpus'][number];
type Spyree = Sheet['spyree'][number];
type Amee = Sheet['amee'][number];
type OwnedSkill = Sheet['skills'][number];
type Spell = Sheet['spells'][number];
type Golem = Sheet['golems'][number];

const DEGREE_INKS: Record<(typeof DEGREE_COLORS)[SkillDegree], string> = {
  primary: INK.pen,
  secondary: INK.secondary,
  success: INK.success,
  warning: INK.warning,
};

const Group = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <View style={{ marginBottom: 10 }}>
    <GroupTitle title={title} rule={false} />
    {children}
  </View>
);

/** Schémas : le Corpus, la Spyrée, l'Âmée. */
export const Schemes = ({ model }: { model: SheetModel }) => {
  const { sheet } = model;
  return (
    <Section title="Schémas">
      <Group title="Le Corpus">
        <PdfTable<Corpus>
          rows={sheet.corpus}
          empty="Aucun aspect."
          columns={[
            { label: 'Type', weight: 1.4, value: (c) => c.type?.name },
            { label: 'Nom', weight: 1.8, hand: true, value: (c) => c.name },
            {
              label: 'Bonus',
              weight: 1.1,
              value: (c) => (c.stat ? corpusStatLabel(c.stat) : null),
            },
            {
              label: '+',
              width: 26,
              align: 'right',
              hand: true,
              value: (c) => c.bonus,
            },
            {
              label: 'Description',
              weight: 3,
              hand: true,
              value: (c) => c.description,
            },
          ]}
        />
      </Group>
      <Group title="La Spyrée">
        <PdfTable<Spyree>
          rows={sheet.spyree}
          empty="Aucun potentiel."
          columns={[
            {
              label: 'Potentiel',
              weight: 5,
              value: (p) => (p.potential ? potentialLabel(p.potential) : null),
            },
            {
              label: 'Rang',
              width: 40,
              align: 'right',
              hand: true,
              value: (p) => toRoman(p.level ?? 0),
            },
          ]}
        />
      </Group>
      <Group title="L’Âmée">
        <PdfTable<Amee>
          rows={sheet.amee}
          empty="Aucune âmée."
          columns={[
            { label: 'Nom', weight: 2, hand: true, value: (a) => a.name },
            {
              label: 'Notes',
              weight: 5,
              hand: true,
              value: (a) => a.description,
            },
          ]}
        />
      </Group>
    </Section>
  );
};

const SkillNode = ({
  owned,
  childrenOf,
  depth,
}: {
  owned: OwnedSkill;
  childrenOf: Map<string, OwnedSkill[]>;
  depth: number;
}) => {
  const { skill } = owned;
  const degree = skill.degree as SkillDegree;
  const lost = !!owned.lostAt;
  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingLeft: depth * 9,
          paddingVertical: 1.2,
          opacity: lost ? 0.55 : 1,
        }}
        wrap={false}
      >
        {depth > 0 && (
          <View style={{ marginRight: 2 }}>
            <SubArrow />
          </View>
        )}
        <Chip
          label={DEGREE_LABELS[degree] ?? degree}
          color={DEGREE_INKS[DEGREE_COLORS[degree]] ?? INK.print}
        />
        <Text
          style={[
            s.body,
            { fontSize: 7.8, marginLeft: 3, flexGrow: 1, flexBasis: 0 },
          ]}
        >
          {pdfText(skillLabel(skill))}
          {owned.suffixe ? (
            <Text style={[s.handCell, { fontSize: 10 }]}>
              {` ${pdfText(owned.suffixe)}`}
            </Text>
          ) : null}
        </Text>
        {lost && <StrikeLine top={6} />}
      </View>
      {lost && (
        <View style={{ paddingLeft: depth * 9 + 26, marginTop: -1 }}>
          <LostNote lostXp={owned.lostXp} />
        </View>
      )}
      {(childrenOf.get(owned.skillId) ?? []).map((child) => (
        <SkillNode
          key={child.id}
          owned={child}
          childrenOf={childrenOf}
          depth={depth + 1}
        />
      ))}
    </View>
  );
};

const PER_ROW = 3;

/**
 * Compétences : Générales, Spyrales, Martiales ; dans chaque type, une
 * catégorie par colonne, trois par ligne, l'arbre des prérequis en retrait.
 */
export const Skills = ({ model }: { model: SheetModel }) => {
  const { roots, childrenOf } = skillTree(model.sheet.skills);
  const byType = rootsByType(roots, (o) => o.skill);
  return (
    <Section title="Compétences">
      {byType.map(({ type, categories }) => {
        const rows = [];
        for (let i = 0; i < categories.length; i += PER_ROW) {
          rows.push(categories.slice(i, i + PER_ROW));
        }
        return (
          <View key={type} style={{ marginBottom: 8 }}>
            <GroupTitle title={SKILL_TYPE_LABELS[type as SkillType]} />
            {categories.length === 0 && (
              <Text style={s.empty}>Aucune compétence.</Text>
            )}
            {rows.map((row, r) => (
              <View
                key={r}
                style={{ flexDirection: 'row', marginTop: 3 }}
                wrap={false}
              >
                {row.map(({ category, roots: categoryRoots }, i) => (
                  <View
                    key={category}
                    style={{
                      flexGrow: 1,
                      flexBasis: 0,
                      marginLeft: i ? 12 : 0,
                    }}
                  >
                    <Text style={[s.label, { fontSize: 6.5, marginBottom: 1 }]}>
                      {pdfText(category)}
                    </Text>
                    {categoryRoots.map((owned) => (
                      <SkillNode
                        key={owned.id}
                        owned={owned}
                        childrenOf={childrenOf}
                        depth={0}
                      />
                    ))}
                  </View>
                ))}
                {/* Ligne incomplète : les colonnes gardent leur largeur. */}
                {Array.from({ length: PER_ROW - row.length }, (_, i) => (
                  <View
                    key={`blank-${i}`}
                    style={{ flexGrow: 1, flexBasis: 0, marginLeft: 12 }}
                  />
                ))}
              </View>
            ))}
          </View>
        );
      })}
    </Section>
  );
};

/** Sortilèges et Golem. */
export const Magic = ({ model }: { model: SheetModel }) => {
  const { sheet } = model;
  return (
    <>
      <Section title="Sortilèges">
        <PdfTable<Spell>
          rows={sheet.spells}
          empty="Aucun sortilège."
          columns={[
            { label: 'Nom', weight: 1.5, hand: true, value: (x) => x.name },
            {
              label: 'Incantation',
              weight: 1.5,
              hand: true,
              value: (x) => x.incantation,
            },
            {
              label: 'Ciblage',
              weight: 1,
              hand: true,
              value: (x) => x.targeting,
            },
            { label: 'Durée', weight: 1, hand: true, value: (x) => x.duration },
            { label: 'Effets', weight: 3, hand: true, value: (x) => x.effect },
          ]}
        />
      </Section>
      <Section title="Golem">
        <PdfTable<Golem>
          rows={sheet.golems}
          empty="Aucun golem."
          columns={[
            { label: 'Nom', weight: 1.2, hand: true, value: (x) => x.name },
            {
              label: 'Artefact',
              weight: 2,
              hand: true,
              value: (x) => x.artefact,
            },
            {
              label: 'Symbiose',
              weight: 2,
              hand: true,
              value: (x) => x.symbiosis,
            },
            { label: 'Cœur', weight: 2, hand: true, value: (x) => x.heart },
          ]}
        />
      </Section>
    </>
  );
};
