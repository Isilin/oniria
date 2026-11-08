'use client';

import { CatalogSkill } from '@/lib/db/sheet';
import { useCatalog } from '@/lib/hooks/use-catalog';
import { CollectionItem, useSheet } from '@/lib/hooks/use-sheet';
import { SKILL_COSTS, skillLabel, skillScope } from '@/lib/rules/xp';
import {
  DEGREE_COLORS,
  DEGREE_LABELS,
  SKILL_TYPE_LABELS,
  type SkillType,
} from '@/lib/sheet/display';
import { skillTree } from '@/lib/sheet/skill-tree';
import { SKILL_TYPES } from '@/lib/sheet/fields';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/DeleteOutlineOutlined';
import RestoreIcon from '@mui/icons-material/SettingsBackupRestore';
import StrikeIcon from '@mui/icons-material/StrikethroughS';
import SubdirectoryArrowRightIcon from '@mui/icons-material/SubdirectoryArrowRight';
import {
  Autocomplete,
  Box,
  Button,
  Chip,
  CircularProgress,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { useState } from 'react';
import EditableField from '../atoms/editable-field';
import LoadError from '../atoms/load-error';
import ScopeLock from '../atoms/scope-lock';
import { LostNote, Struck } from '../atoms/struck';
import DeleteConfirmation from '../molecules/_shared/delete-confirmation';
import MoreActions, { MoreAction } from '../molecules/_shared/more-actions';
import SectionCard from '../molecules/section-card';

type SheetSkill = CollectionItem<'skills'>;
const ADD_LABELS: Record<SkillType, string> = {
  GENERAL: 'Compétence générale',
  SPYRAL: 'Compétence spyrale',
  MARTIAL: 'Compétence martiale',
};

interface NodeProps {
  owned: SheetSkill;
  byId: Map<string, CatalogSkill>;
  childrenOf: Map<string, SheetSkill[]>;
  /** Compétences acquises et non rayées : les seuls prérequis possibles. */
  activeIds: Set<string>;
  editable: boolean;
  /** Partie validée : seul le MJ retire, via le dialogue de reprise. */
  isLocked: (skill: CatalogSkill | SheetSkill['skill']) => boolean;
  isAdmin: boolean;
  depth: number;
  onUpdate: (owned: SheetSkill, patch: Record<string, unknown>) => void;
  onDelete: (owned: SheetSkill) => void;
  /** MJ : rayer la compétence (gardée, barrée, sans effet) et la rétablir. */
  onStrike: (owned: SheetSkill) => void;
  onRestore: (owned: SheetSkill) => void;
}

const SkillNode = ({
  owned,
  byId,
  childrenOf,
  activeIds,
  editable: canEdit,
  isLocked,
  isAdmin,
  depth,
  onUpdate,
  onDelete,
  onStrike,
  onRestore,
}: NodeProps) => {
  const [confirm, setConfirm] = useState(false);
  const skill = byId.get(owned.skillId) ?? owned.skill;
  const locked = isLocked(skill);
  const lost = !!owned.lostAt;
  // Une compétence rayée ne se modifie plus : le MJ la rétablit d'abord.
  const editable = canEdit && !lost;
  const prerequisites =
    byId
      .get(owned.skillId)
      ?.prerequisites.filter((p) => activeIds.has(p.id))
      .map((p) => byId.get(p.id)) ?? [];
  const kids = childrenOf.get(owned.skillId) ?? [];
  const name = skillLabel(skill);

  // Rayer et rétablir (MJ), retirer : dans le menu de la ligne. Une
  // compétence rayée garde la trace de l'XP perdue : seul le MJ la retire.
  const remove: MoreAction = {
    label: 'Retirer',
    icon: <DeleteIcon fontSize="small" />,
    danger: true,
    onClick: () => (locked && !lost ? onDelete(owned) : setConfirm(true)),
  };
  const actions: MoreAction[] = !canEdit
    ? []
    : lost
      ? isAdmin
        ? [
            {
              label: 'Rétablir',
              icon: <RestoreIcon fontSize="small" />,
              onClick: () => onRestore(owned),
            },
            remove,
          ]
        : []
      : [
          ...(isAdmin
            ? [
                {
                  label: 'Rayer',
                  icon: <StrikeIcon fontSize="small" />,
                  onClick: () => onStrike(owned),
                },
              ]
            : []),
          ...(!locked || isAdmin ? [remove] : []),
        ];

  return (
    <Box>
      {/* Le degré à gauche, la corbeille au bout de la ligne ; seul le nom
          et sa précision passent à la ligne quand la colonne est étroite. */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          pl: depth * 3,
          py: 0.25,
        }}
      >
        {depth > 0 && (
          <SubdirectoryArrowRightIcon fontSize="small" color="disabled" />
        )}
        <Chip
          size="small"
          variant="outlined"
          color={lost ? 'default' : DEGREE_COLORS[skill.degree]}
          label={DEGREE_LABELS[skill.degree]}
          sx={lost ? { opacity: 0.6 } : undefined}
        />
        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'baseline',
            columnGap: 1,
          }}
        >
          <Struck struck={lost}>
            <Tooltip title={skill.description ?? ''} arrow>
              <Typography
                component="span"
                sx={
                  skill.description && !lost
                    ? { textDecoration: 'underline dotted', cursor: 'help' }
                    : {}
                }
              >
                {name}
              </Typography>
            </Tooltip>
            {(editable || owned.suffixe) && (
              <Typography
                component="span"
                variant="body2"
                color="textSecondary"
              >
                {' '}
                <EditableField
                  value={owned.suffixe}
                  editable={editable}
                  placeholder="+ précision"
                  aria-label={`Précision pour ${name}`}
                  onChange={(suffixe) => onUpdate(owned, { suffixe })}
                />
              </Typography>
            )}
          </Struck>
          {lost && <LostNote lostAt={owned.lostAt} lostXp={owned.lostXp} />}
          {editable && prerequisites.length > 1 && (
            <Select
              size="small"
              variant="standard"
              value={owned.prerequisiteId ?? ''}
              onChange={(e) =>
                onUpdate(owned, { prerequisiteId: e.target.value })
              }
              inputProps={{ 'aria-label': `Prérequis de ${name}` }}
            >
              {prerequisites.map((p) => (
                <MenuItem key={p.id} value={p.id}>
                  via {skillLabel(p)}
                </MenuItem>
              ))}
            </Select>
          )}
        </Box>
        {actions.length > 0 && (
          <MoreActions
            size="small"
            label={`Actions sur « ${name} »`}
            actions={actions}
          />
        )}
      </Box>
      <DeleteConfirmation
        open={confirm}
        onClose={() => setConfirm(false)}
        onValidated={() => onDelete(owned)}
        title={`Retirer « ${name} » ?`}
        message={
          lost
            ? "La compétence rayée disparaît de la fiche ; l'XP perdue reste au journal."
            : 'La compétence est retirée de la fiche.'
        }
        confirmLabel="Retirer"
      />
      {kids.map((child) => (
        <SkillNode
          key={child.id}
          owned={child}
          byId={byId}
          childrenOf={childrenOf}
          activeIds={activeIds}
          editable={canEdit}
          isLocked={isLocked}
          isAdmin={isAdmin}
          depth={depth + 1}
          onUpdate={onUpdate}
          onDelete={onDelete}
          onStrike={onStrike}
          onRestore={onRestore}
        />
      ))}
    </Box>
  );
};

/** Choix d'une compétence du catalogue dont un prérequis est acquis. */
const AddSkill = ({
  type,
  skills,
  byId,
  ownedIds,
  activeIds,
  onAdd,
}: {
  type: SkillType;
  skills: CatalogSkill[];
  byId: Map<string, CatalogSkill>;
  /** Acquises, rayées ou non : on ne les ajoute pas une deuxième fois. */
  ownedIds: Set<string>;
  /** Acquises et non rayées : les seuls prérequis possibles. */
  activeIds: Set<string>;
  onAdd: (skill: CatalogSkill) => Promise<unknown>;
}) => {
  const [value, setValue] = useState<CatalogSkill | null>(null);

  const missing = (skill: CatalogSkill) =>
    skill.prerequisites.length > 0 &&
    !skill.prerequisites.some((p) => activeIds.has(p.id));

  const hint = (skill: CatalogSkill) => {
    if (ownedIds.has(skill.id) && !activeIds.has(skill.id))
      return 'Rayée : le MJ peut la rétablir';
    if (ownedIds.has(skill.id)) return 'Déjà acquise';
    if (missing(skill))
      return `Nécessite : ${skill.prerequisites
        .map((p) => byId.get(p.id))
        .filter(Boolean)
        .map(skillLabel)
        .join(' ou ')}`;
    return skill.description ?? '';
  };

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 1,
        alignItems: 'center',
        mt: 1,
      }}
    >
      <Autocomplete
        size="small"
        sx={{ flexGrow: 1, maxWidth: 360 }}
        options={skills}
        groupBy={(s) => s.category}
        getOptionLabel={(s) =>
          `${skillLabel(s)} (${DEGREE_LABELS[s.degree]}, ${SKILL_COSTS[s.degree]} XP)`
        }
        getOptionDisabled={(s) => ownedIds.has(s.id) || missing(s)}
        renderOption={(props, s) => {
          const { key, ...rest } = props as typeof props & { key: string };
          return (
            <li key={key} {...rest}>
              <Box>
                <Typography variant="body2">
                  {skillLabel(s)}{' '}
                  <Typography component="span" variant="caption">
                    · {DEGREE_LABELS[s.degree]} · {SKILL_COSTS[s.degree]} XP
                  </Typography>
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {hint(s)}
                </Typography>
              </Box>
            </li>
          );
        }}
        value={value}
        onChange={(e, s) => setValue(s)}
        renderInput={(params) => (
          <TextField {...params} label={ADD_LABELS[type]} />
        )}
        noOptionsText="Aucune compétence"
      />
      <Button
        size="small"
        startIcon={<AddIcon />}
        disabled={!value}
        onClick={async () => {
          if (await onAdd(value)) setValue(null);
        }}
      >
        Ajouter
      </Button>
    </Box>
  );
};

const SkillsCard = ({ id }: { id: string }) => {
  const { catalog, error: catalogError, retry: retryCatalog } = useCatalog();
  const {
    sheet,
    canEdit,
    isAdmin,
    isLocked,
    createItem,
    updateItem,
    deleteItem,
    strikeItem,
    restoreItem,
  } = useSheet(id);

  if (!catalog) {
    // Sans catalogue, pas de compétences à montrer : on le dit au lieu de
    // tourner sans fin.
    return catalogError ? (
      <LoadError
        what="Les compétences n'ont pas pu être lues."
        error={catalogError}
        onRetry={retryCatalog}
      />
    ) : (
      <CircularProgress />
    );
  }

  const byId = new Map(catalog.skills.map((s) => [s.id, s]));
  const skillOf = (owned: SheetSkill) => byId.get(owned.skillId) ?? owned.skill;
  // Arbre : une compétence acquise est rangée sous le prérequis qui l'a permise.
  // Une compétence rayée reste rangée dans l'arbre, mais n'est plus un
  // prérequis.
  const { roots, childrenOf, ownedIds } = skillTree(sheet.skills);
  const activeIds = new Set(
    sheet.skills.filter((s) => !s.lostAt).map((s) => s.skillId),
  );

  const onUpdate = (owned: SheetSkill, patch: Record<string, unknown>) =>
    updateItem('skills', owned.id, patch);
  const onDelete = (owned: SheetSkill) => deleteItem('skills', owned.id);
  const onStrike = (owned: SheetSkill) => strikeItem('skills', owned.id);
  const onRestore = (owned: SheetSkill) => restoreItem('skills', owned.id);
  const skillLocked = (skill: { type: SkillType }) =>
    isLocked(skillScope(skill.type));

  return (
    <SectionCard title="Compétences">
      {/* Trois colonnes seulement quand elles ont la place (1200 px) : un
          arbre de compétences a besoin de largeur. */}
      <Grid container spacing={4}>
        {SKILL_TYPES.map((type) => {
          const typeRoots = roots.filter((r) => skillOf(r).type === type);
          const categories = [
            ...new Set(typeRoots.map((r) => skillOf(r).category)),
          ];
          return (
            <Grid key={type} size={{ xs: 12, md: 6, lg: 4 }}>
              <Typography variant="h5">
                {SKILL_TYPE_LABELS[type]}
                <ScopeLock locked={isLocked(skillScope(type))} />
              </Typography>
              {categories.length === 0 && (
                <Typography variant="body2" color="textSecondary">
                  Aucune compétence.
                </Typography>
              )}
              {categories.map((category) => (
                <Box
                  key={category}
                  sx={{
                    mb: 1,
                  }}
                >
                  <Typography variant="subtitle2" color="textSecondary">
                    {category}
                  </Typography>
                  {typeRoots
                    .filter((r) => skillOf(r).category === category)
                    .map((owned) => (
                      <SkillNode
                        key={owned.id}
                        owned={owned}
                        byId={byId}
                        childrenOf={childrenOf}
                        activeIds={activeIds}
                        editable={canEdit}
                        isLocked={skillLocked}
                        isAdmin={isAdmin}
                        depth={0}
                        onUpdate={onUpdate}
                        onDelete={onDelete}
                        onStrike={onStrike}
                        onRestore={onRestore}
                      />
                    ))}
                </Box>
              ))}
              {canEdit && (
                <AddSkill
                  type={type}
                  skills={catalog.skills.filter((s) => s.type === type)}
                  byId={byId}
                  ownedIds={ownedIds}
                  activeIds={activeIds}
                  onAdd={(skill) => createItem('skills', { skillId: skill.id })}
                />
              )}
            </Grid>
          );
        })}
      </Grid>
    </SectionCard>
  );
};

export default SkillsCard;
