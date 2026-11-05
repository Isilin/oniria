'use client';

import {
  Amounts,
  checkSplit,
  PointsOptions,
  PointsPlan,
  POOL_LABELS,
  POOLS,
  Scope,
  SCOPE_BY_KEY,
  sum,
  suggestSplit,
  XpChange,
  zero,
} from '@/lib/rules/xp';
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

/** Réponse d'un dialogue : ce qu'on envoie à l'API dans `xp`. */
export interface XpAnswer {
  split?: Amounts;
  gift?: boolean;
  refund?: boolean;
}

export interface PurchaseRequest {
  change: XpChange;
  /** XP restante de la fiche. */
  balance: Amounts;
  isAdmin: boolean;
}

export interface RemovalRequest {
  change: XpChange;
  /** Ce qui serait rendu : payé (par catégorie) et offert. */
  refund: { amounts: Amounts; offered: number; missing: number };
}

/** Réponse du dialogue des points : ce qu'on envoie à l'API dans `xp`. */
export interface PointsAnswer {
  splits?: Partial<Record<Scope, Amounts>>;
  gift?: boolean;
  refund?: boolean;
}

export interface PointsRequest {
  /** Les points en attente, avec la répartition proposée. */
  plan: PointsPlan;
  isAdmin: boolean;
  /** Recalcule le plan avec les choix faits dans le dialogue. */
  evaluate: (options: PointsOptions) => PointsPlan;
}

interface XpDialogs {
  askPurchase: (request: PurchaseRequest) => Promise<XpAnswer | null>;
  askRemoval: (request: RemovalRequest) => Promise<XpAnswer | null>;
  askPoints: (request: PointsRequest) => Promise<PointsAnswer | null>;
}

type Pending =
  | {
      kind: 'purchase';
      request: PurchaseRequest;
      resolve: (a: XpAnswer | null) => void;
    }
  | {
      kind: 'removal';
      request: RemovalRequest;
      resolve: (a: XpAnswer | null) => void;
    }
  | {
      kind: 'points';
      request: PointsRequest;
      resolve: (a: PointsAnswer | null) => void;
    };

const XpDialogContext = createContext<XpDialogs | null>(null);

export const useXpDialogs = () => useContext(XpDialogContext);

/** Texte « Éprouver 10 · Vivre 5 » d'un montant. */
// Espaces insécables : un montant reste collé à sa catégorie (« Vivre 160 »)
// et le point médian ne commence jamais une ligne.
export const formatAmounts = (amounts: Amounts, empty = '0') =>
  POOLS.filter((p) => amounts[p.key])
    .map((p) => `${p.label} ${amounts[p.key]}`)
    .join(' · ') || empty;

/** Saisie d'un montant par catégorie (attribution, répartition…). */
export const AmountsFields = ({
  value,
  onChange,
  allowed,
  balance,
  allowNegative = false,
}: {
  value: Amounts;
  onChange: (value: Amounts) => void;
  allowed?: string[];
  balance?: Amounts;
  allowNegative?: boolean;
}) => (
  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
    {POOLS.map((pool) => {
      const disabled = allowed ? !allowed.includes(pool.key) : false;
      return (
        <TextField
          key={pool.key}
          label={pool.label}
          type="number"
          size="small"
          disabled={disabled}
          value={disabled ? '' : value[pool.key]}
          onChange={(e) => {
            const number = Math.trunc(Number(e.target.value) || 0);
            onChange({
              ...value,
              [pool.key]: allowNegative ? number : Math.max(0, number),
            });
          }}
          helperText={
            balance && !disabled ? `reste ${balance[pool.key]}` : undefined
          }
          sx={{ width: 120 }}
          slotProps={{
            htmlInput: { min: allowNegative ? undefined : 0, step: 1 },
          }}
        />
      );
    })}
  </Box>
);

const PurchaseDialog = ({
  request: { change, balance, isAdmin },
  onClose,
}: {
  request: PurchaseRequest;
  onClose: (answer: XpAnswer | null) => void;
}) => {
  const scope = SCOPE_BY_KEY[change.scope];
  const suggestion = useMemo(
    () => suggestSplit(change.delta, change.scope, balance),
    [change, balance],
  );
  const [split, setSplit] = useState<Amounts>(suggestion.split);
  const [gift, setGift] = useState(false);
  const error = gift
    ? null
    : checkSplit(split, change.delta, change.scope, balance);

  return (
    <Dialog open onClose={() => onClose(null)} maxWidth="sm" fullWidth>
      <DialogTitle>Dépenser de l&apos;expérience</DialogTitle>
      <DialogContent>
        <Typography variant="h6">{change.label}</Typography>
        <Typography gutterBottom>
          Coût : <strong>{change.delta} XP</strong>
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {scope.label} se paie avec :{' '}
          {scope.pools.map((p) => POOL_LABELS[p]).join(', ')}. La dépense est
          définitive : seul le MJ pourra la reprendre.
        </Typography>
        {!gift && (
          <AmountsFields
            value={split}
            onChange={setSplit}
            allowed={scope.pools}
            balance={balance}
          />
        )}
        {!gift && suggestion.missing > 0 && (
          <Alert severity="warning" sx={{ mt: 2 }}>
            XP insuffisante : il manque {suggestion.missing} XP.
          </Alert>
        )}
        {!gift && error && suggestion.missing === 0 && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
        {isAdmin && (
          <FormControlLabel
            sx={{ mt: 1, display: 'flex' }}
            control={
              <Checkbox
                checked={gift}
                onChange={(e) => setGift(e.target.checked)}
              />
            }
            label="Offert par le MJ (aucune XP dépensée)"
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose(null)}>Annuler</Button>
        <Button
          variant="contained"
          disabled={!!error}
          onClick={() => onClose(gift ? { gift: true } : { split })}
        >
          {gift ? 'Offrir' : `Dépenser ${sum(split)} XP`}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const RemovalDialog = ({
  request: { change, refund },
  onClose,
}: {
  request: RemovalRequest;
  onClose: (answer: XpAnswer | null) => void;
}) => {
  const [mode, setMode] = useState<'refund' | 'loss'>('refund');
  const paid = sum(refund.amounts);

  return (
    <Dialog open onClose={() => onClose(null)} maxWidth="sm" fullWidth>
      <DialogTitle>Reprendre un élément validé</DialogTitle>
      <DialogContent>
        <Typography variant="h6">{change.label}</Typography>
        <Typography gutterBottom>
          Valeur : <strong>{-change.delta} XP</strong>
          {refund.offered > 0 && ` (dont ${refund.offered} offerts)`}
        </Typography>
        <RadioGroup
          value={mode}
          onChange={(e) => setMode(e.target.value as 'refund' | 'loss')}
        >
          <FormControlLabel
            value="refund"
            control={<Radio />}
            label={
              paid > 0
                ? `Rembourser : ${formatAmounts(refund.amounts)}`
                : 'Rembourser (rien à rendre : rien n’a été payé)'
            }
          />
          <FormControlLabel
            value="loss"
            control={<Radio />}
            label="Ne pas rembourser : l'XP est perdue"
          />
        </RadioGroup>
        {refund.missing > 0 && (
          <Alert severity="info" sx={{ mt: 1 }}>
            {refund.missing} XP de cette valeur n&apos;apparaissent pas dans le
            journal (fiche reprise ou compte inexact) : ils ne peuvent pas être
            rendus.
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose(null)}>Annuler</Button>
        <Button
          variant="contained"
          color="warning"
          onClick={() => onClose({ refund: mode === 'refund' })}
        >
          Confirmer
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const lineCost = (line: PointsPlan['lines'][number]) =>
  line.free
    ? 'libre'
    : line.delta > 0
      ? `${line.delta} XP`
      : `reprise de ${-line.delta} XP`;

/**
 * Validation des points ajoutés aux caractères : répartition proposée pour
 * chaque partie (modifiable) ; pour le MJ, cadeau des achats et
 * remboursement (ou perte) des baisses.
 */
const PointsDialog = ({
  request: { plan: initial, isAdmin, evaluate },
  onClose,
}: {
  request: PointsRequest;
  onClose: (answer: PointsAnswer | null) => void;
}) => {
  const [refund, setRefund] = useState(true);
  const [gift, setGift] = useState(false);
  const [splits, setSplits] = useState(initial.splits);
  const suggestion = useMemo(() => evaluate({ refund }), [evaluate, refund]);
  const plan = useMemo(
    () => evaluate({ splits, gift, refund }),
    [evaluate, splits, gift, refund],
  );
  const buying = plan.dues.length > 0 && !gift;
  const refunded = plan.removals.reduce(
    (total, r) => ({
      feel: total.feel + r.taken.feel,
      learn: total.learn + r.taken.learn,
      live: total.live + r.taken.live,
    }),
    zero(),
  );
  const unrecorded = plan.removals.reduce((t, r) => t + r.missing, 0);

  return (
    <Dialog open onClose={() => onClose(null)} maxWidth="sm" fullWidth>
      <DialogTitle>Valider les points</DialogTitle>
      <DialogContent>
        <Box component="ul" sx={{ pl: 2.5, mt: 0 }}>
          {plan.lines.map((line) => (
            <Typography component="li" key={line.key}>
              {line.label} : <strong>{lineCost(line)}</strong>
            </Typography>
          ))}
        </Box>
        {plan.lines.some((l) => l.free) && (
          <Typography variant="body2" color="textSecondary" gutterBottom>
            Les parties débloquées ne coûtent rien maintenant : leur coût sera
            payé à la validation de la fiche.
          </Typography>
        )}
        {buying && (
          <>
            <Typography gutterBottom sx={{ mt: 1 }}>
              Coût : <strong>{plan.cost} XP</strong>
            </Typography>
            <Typography variant="body2" color="textSecondary">
              La dépense est définitive : seul le MJ pourra la reprendre.
            </Typography>
            {plan.dues.map((due) => {
              const scope = SCOPE_BY_KEY[due.scope];
              return (
                <Box key={due.scope} sx={{ mt: 2 }}>
                  <Typography variant="subtitle2">
                    {scope.label} : {due.amount} XP, payés avec{' '}
                    {scope.pools.map((p) => POOL_LABELS[p]).join(', ')}
                  </Typography>
                  <AmountsFields
                    value={splits[due.scope] ?? zero()}
                    onChange={(split) =>
                      setSplits({ ...splits, [due.scope]: split })
                    }
                    allowed={scope.pools}
                    balance={plan.balance}
                  />
                </Box>
              );
            })}
          </>
        )}
        {buying && suggestion.missing > 0 && (
          <Alert severity="warning" sx={{ mt: 2 }}>
            XP insuffisante : il manque {suggestion.missing} XP.
          </Alert>
        )}
        {buying && plan.error && suggestion.missing === 0 && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {plan.error}
          </Alert>
        )}
        {isAdmin && plan.dues.length > 0 && (
          <FormControlLabel
            sx={{ mt: 1, display: 'flex' }}
            control={
              <Checkbox
                checked={gift}
                onChange={(e) => setGift(e.target.checked)}
              />
            }
            label="Offert par le MJ (aucune XP dépensée)"
          />
        )}
        {plan.removals.length > 0 && (
          <>
            <Typography variant="subtitle2" sx={{ mt: 2 }}>
              Baisses
            </Typography>
            <RadioGroup
              value={refund ? 'refund' : 'loss'}
              onChange={(e) => {
                const value = e.target.value === 'refund';
                setRefund(value);
                setSplits(evaluate({ refund: value }).splits);
              }}
            >
              <FormControlLabel
                value="refund"
                control={<Radio />}
                label={
                  sum(refunded) > 0
                    ? `Rembourser : ${formatAmounts(refunded)}`
                    : 'Rembourser (rien à rendre : rien n’a été payé)'
                }
              />
              <FormControlLabel
                value="loss"
                control={<Radio />}
                label="Ne pas rembourser : l'XP est perdue"
              />
            </RadioGroup>
            {unrecorded > 0 && (
              <Alert severity="info" sx={{ mt: 1 }}>
                {unrecorded} XP de cette valeur n&apos;apparaissent pas dans le
                journal (fiche reprise ou compte inexact) : ils ne peuvent pas
                être rendus.
              </Alert>
            )}
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose(null)}>Annuler</Button>
        <Button
          variant="contained"
          disabled={buying && !!plan.error}
          onClick={() =>
            onClose({ splits: buying ? splits : undefined, gift, refund })
          }
        >
          {buying ? `Dépenser ${plan.cost} XP` : 'Valider'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

/**
 * Fournit les dialogues de paiement : achat (répartition proposée,
 * modifiable), reprise par le MJ (remboursement ou perte) et validation des
 * points des caractères.
 */
export const XpDialogProvider = ({ children }: { children: ReactNode }) => {
  const [pending, setPending] = useState<Pending | null>(null);

  const askPurchase = useCallback(
    (request: PurchaseRequest) =>
      new Promise<XpAnswer | null>((resolve) =>
        setPending({ kind: 'purchase', request, resolve }),
      ),
    [],
  );
  const askRemoval = useCallback(
    (request: RemovalRequest) =>
      new Promise<XpAnswer | null>((resolve) =>
        setPending({ kind: 'removal', request, resolve }),
      ),
    [],
  );
  const askPoints = useCallback(
    (request: PointsRequest) =>
      new Promise<PointsAnswer | null>((resolve) =>
        setPending({ kind: 'points', request, resolve }),
      ),
    [],
  );
  const value = useMemo(
    () => ({ askPurchase, askRemoval, askPoints }),
    [askPurchase, askRemoval, askPoints],
  );

  const close = (answer: (XpAnswer & PointsAnswer) | null) => {
    pending?.resolve(answer);
    setPending(null);
  };

  return (
    <XpDialogContext.Provider value={value}>
      {children}
      {pending?.kind === 'purchase' && (
        <PurchaseDialog request={pending.request} onClose={close} />
      )}
      {pending?.kind === 'removal' && (
        <RemovalDialog request={pending.request} onClose={close} />
      )}
      {pending?.kind === 'points' && (
        <PointsDialog request={pending.request} onClose={close} />
      )}
    </XpDialogContext.Provider>
  );
};
