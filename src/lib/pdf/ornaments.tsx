'use no memo';

import {
  Circle,
  Defs,
  Ellipse,
  G,
  Line,
  Path,
  Polygon,
  RadialGradient,
  Rect,
  Stop,
  Svg,
} from '@react-pdf/renderer';
import {
  litPath,
  MOON_PHASES,
  PLANET,
  planetArc,
  planetDots,
  planetFraction,
} from '@/lib/sky';
import { INK } from './styles';

/**
 * Ornements et petits dessins du carnet, en SVG de react-pdf : les mêmes
 * formes qu'à l'écran (src/components/atoms/ornaments.tsx, moon-gauge.tsx),
 * sans les filtres d'aquarelle que le PDF ne sait pas rendre (lavis à plat).
 * Composants sans état ni hook (voir render.tsx).
 */

/** Petite sphère armillaire, devant les titres de section. */
export const Armillary = ({ size = 11 }: { size?: number }) => (
  <Svg viewBox="0 0 20 20" width={size} height={size}>
    <Circle
      cx={10}
      cy={10}
      r={8}
      fill="none"
      stroke={INK.print}
      strokeWidth={0.9}
    />
    <Ellipse
      cx={10}
      cy={10}
      rx={8}
      ry={3}
      fill="none"
      stroke={INK.print}
      strokeWidth={0.8}
    />
    <Ellipse
      cx={10}
      cy={10}
      rx={3}
      ry={8}
      fill="none"
      stroke={INK.print}
      strokeWidth={0.8}
    />
    <Circle cx={10} cy={10} r={1.4} fill={INK.print} />
  </Svg>
);

/** Fleuron : une lune entre deux filets. */
export const Fleuron = () => (
  <Svg viewBox="0 0 28 12" width={20} height={8.6}>
    <Path d="M1 6h8M19 6h8" stroke={INK.print} strokeWidth={0.8} />
    <Circle
      cx={14}
      cy={6}
      r={3.4}
      fill="none"
      stroke={INK.print}
      strokeWidth={0.8}
    />
    <Path
      d="M14 2.6 a3.4 3.4 0 0 1 0 6.8 a2 3.4 0 0 0 0 -6.8"
      fill={INK.print}
    />
  </Svg>
);

/** La frise des phases de la lune, au bandeau-titre. */
export const MoonPhases = () => (
  <Svg viewBox="0 0 190 22" width={114} height={13.2}>
    {MOON_PHASES.map((fraction, i) => {
      const cx = 11 + i * 21;
      const lit = litPath(fraction, cx, 11, 6.5);
      return (
        <G key={i}>
          <Circle
            cx={cx}
            cy={11}
            r={6.5}
            fill="none"
            stroke={INK.print}
            strokeWidth={0.8}
          />
          {lit && <Path d={lit} fill={INK.print} />}
        </G>
      );
    })}
  </Svg>
);

/**
 * Une Existence en planète d'atlas : orbite imprimée en pointillés, phase
 * peinte au lavis selon la valeur, un point coché à la plume par point.
 */
export const Planet = ({
  current,
  max,
  color,
  size = 44,
  small = false,
}: {
  current: number;
  max: number;
  color: string;
  size?: number;
  /** Le Maï : dessiné plus petit dans la même boîte. */
  small?: boolean;
}) => {
  const { C, DISC, ARC_START, ARC_SPAN } = PLANET;
  const fraction = planetFraction(current, max);
  const lit = litPath(fraction, C, C, DISC);
  const { dotted, dots } = planetDots(max, current);
  return (
    <Svg
      viewBox={small ? '-16 -16 96 96' : '-4 -4 72 72'}
      width={size}
      height={size}
    >
      <Ellipse
        cx={C}
        cy={C}
        rx={31}
        ry={10.5}
        transform={`rotate(-16 ${C} ${C})`}
        fill="none"
        stroke={INK.print}
        strokeWidth={0.6}
        strokeDasharray="1.5 3"
        strokeOpacity={0.6}
      />
      <Circle cx={C} cy={C} r={DISC + 3} fill={color} fillOpacity={0.14} />
      {lit && <Path d={lit} fill={color} fillOpacity={0.62} />}
      <Circle
        cx={C}
        cy={C}
        r={DISC}
        fill="none"
        stroke={INK.print}
        strokeWidth={1.1}
      />
      {dotted ? (
        dots.map(({ x, y, filled }, i) => (
          <G key={i}>
            <Circle
              cx={x}
              cy={y}
              r={3.3}
              fill={INK.paper}
              stroke={INK.print}
              strokeWidth={0.9}
            />
            {filled && <Circle cx={x} cy={y} r={2.2} fill={INK.pen} />}
          </G>
        ))
      ) : (
        <G>
          <Path
            d={planetArc(ARC_START, ARC_START + ARC_SPAN)}
            fill="none"
            stroke={INK.print}
            strokeOpacity={0.3}
            strokeWidth={2}
          />
          {fraction > 0 && (
            <Path
              d={planetArc(ARC_START, ARC_START + ARC_SPAN * fraction)}
              fill="none"
              stroke={INK.pen}
              strokeWidth={2.4}
              strokeLinecap="round"
            />
          )}
        </G>
      )}
    </Svg>
  );
};

/**
 * Lavis de la teinte de lune derrière la plaque : deux taches au dégradé
 * radial, d'autant plus présentes que le Devenir est élevé.
 */
export const TintWash = ({
  color,
  opacity,
  width,
  height,
}: {
  color: string;
  opacity: number;
  width: number;
  height: number;
}) => (
  <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
    <Defs>
      <RadialGradient id="wash" cx="50%" cy="50%" r="50%">
        <Stop offset="0" stopColor={color} stopOpacity={opacity} />
        <Stop offset="0.6" stopColor={color} stopOpacity={opacity * 0.45} />
        <Stop offset="1" stopColor={color} stopOpacity={0} />
      </RadialGradient>
    </Defs>
    <Ellipse
      cx={58}
      cy={height * 0.45}
      rx={130}
      ry={height * 0.75}
      fill="url(#wash)"
    />
    <Ellipse
      cx={170}
      cy={height * 0.2}
      rx={90}
      ry={height * 0.45}
      fill="url(#wash)"
    />
  </Svg>
);

/** La lune teintée du portrait, quand il n'y a pas d'image. */
export const PortraitMoon = ({
  color,
  width,
  height,
}: {
  color: string;
  width: number;
  height: number;
}) => (
  <Svg width={width} height={height} viewBox="0 0 96 108">
    <Ellipse
      cx={48}
      cy={52}
      rx={44}
      ry={14}
      transform="rotate(-18 48 52)"
      fill="none"
      stroke={INK.print}
      strokeWidth={0.7}
      strokeDasharray="1.5 3"
      strokeOpacity={0.6}
    />
    <Circle cx={48} cy={52} r={27} fill={color} fillOpacity={0.3} />
    <Circle
      cx={48}
      cy={52}
      r={25}
      fill="none"
      stroke={INK.print}
      strokeWidth={1.1}
    />
  </Svg>
);

/** Case imprimée, cochée à la plume. */
export const Checkbox = ({
  checked,
  size = 8,
}: {
  checked: boolean;
  size?: number;
}) => (
  <Svg viewBox="0 0 10 10" width={size} height={size}>
    <Rect
      x={0.6}
      y={0.6}
      width={8.8}
      height={8.8}
      fill="none"
      stroke={INK.print}
      strokeWidth={0.9}
    />
    {checked && (
      <Path
        d="M2.2 5.2 L4.2 7.3 L8 2.4"
        fill="none"
        stroke={INK.pen}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    )}
  </Svg>
);

/** Flèche « ↳ » d'une compétence rangée sous son prérequis. */
export const SubArrow = () => (
  <Svg viewBox="0 0 10 10" width={6.5} height={6.5}>
    <Path
      d="M2 1 V6 H8 M6 4 L8 6 L6 8"
      fill="none"
      stroke={INK.pale}
      strokeWidth={1}
    />
  </Svg>
);

/** Triangle d'avertissement (prérequis non rempli). */
export const WarnIcon = () => (
  <Svg viewBox="0 0 12 12" width={7.5} height={7.5}>
    <Polygon
      points="6,1 11.2,10.6 0.8,10.6"
      fill="none"
      stroke={INK.warning}
      strokeWidth={1}
    />
    <Line
      x1={6}
      y1={4.3}
      x2={6}
      y2={7.4}
      stroke={INK.warning}
      strokeWidth={1.1}
    />
    <Circle cx={6} cy={8.9} r={0.6} fill={INK.warning} />
  </Svg>
);

/** Cadenas : partie validée (fermé) ou modifiable (ouvert). */
export const LockIcon = ({ open, color }: { open: boolean; color: string }) => (
  <Svg viewBox="0 0 12 12" width={7} height={7}>
    <Rect
      x={2}
      y={5.2}
      width={8}
      height={5.8}
      fill="none"
      stroke={color}
      strokeWidth={1}
    />
    <Path
      d={
        open
          ? 'M4 5.2 V3.4 A2 2 0 0 1 8 3.2'
          : 'M4 5.2 V3.6 A2 2 0 0 1 8 3.6 V5.2'
      }
      fill="none"
      stroke={color}
      strokeWidth={1}
    />
  </Svg>
);

/** Marque d'une étape : cercle imprimé et son numéro, ou coche à la plume. */
export const StepMarker = ({
  done,
  current,
}: {
  done: boolean;
  current: boolean;
}) => (
  <Svg viewBox="0 0 24 24" width={12} height={12}>
    <Circle
      cx={12}
      cy={12}
      r={10}
      fill="none"
      stroke={INK.print}
      strokeWidth={current ? 1.5 : 1}
      strokeOpacity={current || done ? 1 : 0.4}
    />
    {done && (
      <Path
        d="M7 12.5 L10.5 16 L17.5 7.5"
        fill="none"
        stroke={INK.pen}
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    )}
  </Svg>
);
