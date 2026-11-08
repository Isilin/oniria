'use no memo';

import {
  ClipPath,
  Defs,
  G,
  Line,
  Rect,
  Svg,
  Text,
  View,
} from '@react-pdf/renderer';
import {
  ALL_SCOPES,
  creationStep,
  POOLS,
  type Scope,
  SCOPE_BY_KEY,
} from '@/lib/rules/xp';
import {
  CREATION_STEPS,
  formatAmounts,
  xpStatusLabel,
} from '@/lib/sheet/display';
import type { SheetModel } from '../model';
import { LockIcon, StepMarker } from '../ornaments';
import { Chip, InfoNote, SectionHeading } from '../primitives';
import { CONTENT_WIDTH, INK, s } from '../styles';

type Part = 'spent' | 'pending' | 'left' | 'negative';

const PART_LABELS: Record<Part, string> = {
  spent: 'Dépensée',
  pending: 'À payer à la validation',
  left: 'Restante',
  negative: 'Solde négatif',
};

const BAR_HEIGHT = 8;
const POOL_GAP = 14;
const POOL_WIDTH = (CONTENT_WIDTH - 2 * POOL_GAP) / 3;

/** Un morceau de la barre : aplat, hachures ou contour, comme à l'écran. */
const Segment = ({
  part,
  x,
  width,
  id,
}: {
  part: Part;
  x: number;
  width: number;
  id: string;
}) => {
  if (part === 'spent') {
    return (
      <Rect x={x} y={0} width={width} height={BAR_HEIGHT} fill={INK.pen} />
    );
  }
  if (part === 'negative') {
    return (
      <Rect x={x} y={0} width={width} height={BAR_HEIGHT} fill={INK.error} />
    );
  }
  if (part === 'left') {
    return (
      <Rect
        x={x + 0.55}
        y={0.55}
        width={Math.max(0, width - 1.1)}
        height={BAR_HEIGHT - 1.1}
        fill={INK.pen}
        fillOpacity={0.14}
        stroke={INK.pen}
        strokeWidth={1.1}
      />
    );
  }
  // Dû à la validation : rayures d'encre bleue.
  const lines = [];
  for (let k = -BAR_HEIGHT; k < width; k += 3) {
    lines.push(
      <Line
        key={k}
        x1={x + k}
        y1={BAR_HEIGHT}
        x2={x + k + BAR_HEIGHT}
        y2={0}
        stroke={INK.pen}
        strokeWidth={1}
      />,
    );
  }
  return (
    <G>
      <Defs>
        <ClipPath id={id}>
          <Rect x={x} y={0} width={width} height={BAR_HEIGHT} />
        </ClipPath>
      </Defs>
      <G clipPath={`url(#${id})`}>{lines}</G>
    </G>
  );
};

const barParts = (left: number, spent: number, pending: number) => {
  const negative = Math.max(0, -left);
  const reserved = Math.min(pending, Math.max(0, left));
  return (
    [
      { part: 'spent', value: Math.max(0, spent - negative) },
      { part: 'negative', value: negative },
      { part: 'pending', value: reserved },
      { part: 'left', value: Math.max(0, left - reserved) },
    ] as { part: Part; value: number }[]
  ).filter((p) => p.value > 0);
};

const XpBar = ({
  width,
  left,
  spent,
  pending,
  id,
}: {
  width: number;
  left: number;
  spent: number;
  pending: number;
  id: string;
}) => {
  const parts = barParts(left, spent, pending);
  const scale = parts.reduce((t, p) => t + p.value, 0);
  let x = 0;
  return (
    <Svg width={width} height={BAR_HEIGHT}>
      {scale === 0 ? (
        <Rect
          x={0.5}
          y={0.5}
          width={width - 1}
          height={BAR_HEIGHT - 1}
          fill="none"
          stroke={INK.hairline}
          strokeWidth={1}
        />
      ) : (
        parts.map((p, i) => {
          const w = (p.value / scale) * width;
          const segment = (
            <Segment
              key={p.part}
              part={p.part}
              x={x}
              width={w}
              id={`${id}-${i}`}
            />
          );
          x += w;
          return segment;
        })
      )}
    </Svg>
  );
};

const Swatch = ({ part }: { part: Part }) => (
  <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10 }}>
    <View style={{ width: 14 }}>
      <XpBar
        width={14}
        id={`legend-${part}`}
        left={
          part === 'left'
            ? 1
            : part === 'negative'
              ? -1
              : part === 'pending'
                ? 1
                : 0
        }
        spent={part === 'spent' ? 1 : part === 'negative' ? 1 : 0}
        pending={part === 'pending' ? 1 : 0}
      />
    </View>
    <Text style={[s.caption, { marginLeft: 3 }]}>{PART_LABELS[part]}</Text>
  </View>
);

const scopeLabels = (scopes: Scope[]) =>
  scopes.map((scope) => SCOPE_BY_KEY[scope].label).join(', ');

const missingText = (missingByScope: Partial<Record<Scope, number>>) =>
  Object.entries(missingByScope)
    .map(([scope, m]) => `${SCOPE_BY_KEY[scope as Scope].label} ${m}`)
    .join(', ');

/** La création en trois temps, comme à l'écran, sans les boutons. */
const CreationSteps = ({ model }: { model: SheetModel }) => {
  const { xp } = model;
  const step = creationStep(xp);
  if (step === null) return null;
  const due = xp.dues.reduce((t, d) => t + d.amount, 0);
  const missing = Object.values(xp.missingByScope).reduce((t, m) => t + m, 0);
  const details: Record<number, string | null> = {
    1:
      step === 1
        ? 'En attente du MJ.'
        : `Reçue\u00a0: ${formatAmounts(xp.gained)}.`,
    2:
      step === 2
        ? `Il manque ${missing}\u00a0XP\u00a0: ${missingText(xp.missingByScope)}.`
        : null,
    3:
      step === 3
        ? due === 0
          ? 'Rien à payer.'
          : `À payer\u00a0: ${due}\u00a0XP (${formatAmounts(xp.allocation.total)}).`
        : null,
  };
  return (
    <InfoNote title="Créer la fiche en trois temps">
      {CREATION_STEPS.map((label, index) => {
        const n = index + 1;
        const done = n < step;
        const current = n === step;
        return (
          <View key={n} style={{ flexDirection: 'row', marginTop: 3 }}>
            <View style={{ width: 12, height: 12, marginRight: 6 }}>
              <StepMarker done={done} current={current} />
              {!done && (
                <Text
                  style={[
                    s.caption,
                    {
                      position: 'absolute',
                      top: 1.8,
                      left: 0,
                      right: 0,
                      textAlign: 'center',
                      fontSize: 6.5,
                      color: current ? INK.print : INK.pale,
                    },
                  ]}
                >
                  {n}
                </Text>
              )}
            </View>
            <View style={{ flexShrink: 1 }}>
              <Text
                style={[
                  s.body,
                  current
                    ? { fontWeight: 700 }
                    : done
                      ? {}
                      : { color: INK.pale },
                ]}
              >
                {label}
              </Text>
              {details[n] && (
                <Text
                  style={[s.caption, n === 2 ? { color: INK.warning } : {}]}
                >
                  {details[n]}
                </Text>
              )}
            </View>
          </View>
        );
      })}
    </InfoNote>
  );
};

/** Expérience : état, trois catégories et leurs barres, alertes. */
export const Experience = ({ model }: { model: SheetModel }) => {
  const { computed, xp } = model;
  const status = xpStatusLabel(xp);
  const draft = xp.unlocked.length > 0;
  const creation = xp.unlocked.length === ALL_SCOPES.length;
  const due = xp.dues.reduce((t, d) => t + d.amount, 0);
  const missing = Object.values(xp.missingByScope).reduce((t, m) => t + m, 0);
  const { consistency } = xp;
  const color = draft ? INK.warning : INK.print;
  const legend: Part[] = [
    'spent',
    ...(POOLS.some((p) => xp.allocation.total[p.key] > 0)
      ? (['pending'] as const)
      : []),
    'left',
    ...(POOLS.some((p) => xp.left[p.key] < 0) ? (['negative'] as const) : []),
  ];
  const mismatches = Object.entries(consistency.byScope).filter(
    ([, v]) => v.expected !== v.recorded,
  );

  return (
    <View wrap={false}>
      <SectionHeading title="Expérience">
        <Chip
          label={status}
          color={color}
          icon={<LockIcon open={draft} color={color} />}
        />
      </SectionHeading>
      <Text style={[s.caption, { marginBottom: 6 }]}>
        {`Investie dans les caractères\u00a0: ${computed.characteristicsCost}\u00a0XP (1\u00a0XP par point jusqu’à 25, 2 jusqu’à 50, 4 jusqu’à 75, 8 au-delà).`}
      </Text>
      <View style={{ flexDirection: 'row' }}>
        {POOLS.map((pool, i) => (
          <View
            key={pool.key}
            style={{ flexGrow: 1, flexBasis: 0, marginLeft: i ? POOL_GAP : 0 }}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
              }}
            >
              <Text style={s.group}>{pool.label}</Text>
              <Text style={s.caption}>
                {'reste '}
                <Text
                  style={[
                    s.total,
                    { fontSize: 11 },
                    xp.left[pool.key] < 0 ? { color: INK.error } : {},
                  ]}
                >
                  {xp.left[pool.key]}
                </Text>
                {` / ${xp.gained[pool.key]}`}
              </Text>
            </View>
            <Text style={[s.caption, { minHeight: 18, marginBottom: 3 }]}>
              {pool.description}
            </Text>
            <XpBar
              width={POOL_WIDTH}
              id={`bar-${pool.key}`}
              left={xp.left[pool.key]}
              spent={xp.spent[pool.key]}
              pending={xp.allocation.total[pool.key]}
            />
          </View>
        ))}
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 5 }}>
        {legend.map((part) => (
          <Swatch key={part} part={part} />
        ))}
      </View>

      <CreationSteps model={model} />

      {draft && !creation && (
        <InfoNote
          title={`Reset\u00a0: ${scopeLabels(xp.unlocked)} se modifie librement`}
          color={xp.allocation.feasible ? INK.info : INK.warning}
        >
          <Text style={s.body}>
            {due === 0
              ? 'Rien à payer pour le moment.'
              : xp.allocation.feasible
                ? `À payer à la validation\u00a0: ${due}\u00a0XP (${formatAmounts(xp.allocation.total)}).`
                : `À payer à la validation\u00a0: ${due}\u00a0XP. Il manque ${missing}\u00a0XP\u00a0: ${missingText(xp.missingByScope)}.`}
          </Text>
        </InfoNote>
      )}

      {consistency.diff !== 0 && (
        <InfoNote title="Le compte n’est pas bon" color={INK.warning}>
          <Text style={s.body}>
            {`${draft ? 'Les parties validées valent' : 'La fiche vaut'} ${consistency.expected}\u00a0XP, mais ${consistency.recorded}\u00a0XP sont enregistrés comme dépensés pour elles\u00a0: ${
              consistency.diff > 0
                ? `${consistency.diff}\u00a0XP n’ont pas été payés.`
                : `${-consistency.diff}\u00a0XP ont été payés en trop.`
            }${
              consistency.legacy > 0
                ? ` Dont ${consistency.legacy}\u00a0XP de dépenses reprises de l’ancienne fiche, non détaillées.`
                : mismatches.length > 0
                  ? ` En cause\u00a0: ${mismatches
                      .map(
                        ([scope, v]) =>
                          `${SCOPE_BY_KEY[scope as Scope].label} (vaut ${v.expected}, payé ${v.recorded})`,
                      )
                      .join(', ')}.`
                  : ''
            } Le MJ peut accorder un reset pour tout recalculer.`}
          </Text>
        </InfoNote>
      )}
    </View>
  );
};
