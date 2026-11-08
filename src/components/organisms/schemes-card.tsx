'use client';

import { CatalogPotential } from '@/lib/db/sheet';
import { useCatalog } from '@/lib/hooks/use-catalog';
import { useSheet } from '@/lib/hooks/use-sheet';
import { normalizeStat, toRoman } from '@/lib/rules';
import { activeOnly } from '@/lib/rules/lost';
import { corpusAspectCost, SPYREE_STEPS, spyreeCost } from '@/lib/rules/xp';
import { CORPUS_STAT_OPTIONS, potentialLabel } from '@/lib/sheet/display';
import AddIcon from '@mui/icons-material/Add';
import {
  Autocomplete,
  Box,
  Button,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { useState } from 'react';
import ScopeLock from '../atoms/scope-lock';
import SectionCard from '../molecules/section-card';
import SheetCollection from './sheet-collection';

const SPYREE_TOOLTIP = `Prix de chaque passage de rang : ${SPYREE_STEPS.map(
  (step, i) => `${toRoman(i + 1)} ${step}`,
).join(', ')} XP.`;

/** Choix d'un potentiel dans le catalogue, classé par catégorie. */
const AddPotential = ({ id }: { id: string }) => {
  const { catalog } = useCatalog();
  const { sheet, createItem } = useSheet(id);
  const [value, setValue] = useState<CatalogPotential | null>(null);
  const owned = new Set(sheet.spyree.map((s) => s.potentialId));
  // Un potentiel rayé ne se rachète pas : le MJ le rétablit.
  const struck = new Set(
    sheet.spyree.filter((s) => s.lostAt).map((s) => s.potentialId),
  );

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
        options={catalog?.potentials ?? []}
        loading={!catalog}
        groupBy={(p) => p.type.category.name}
        getOptionLabel={potentialLabel}
        getOptionDisabled={(p) => owned.has(p.id)}
        renderOption={(props, p) => (
          <li {...props} key={p.id}>
            <Box>
              <Typography variant="body2">{potentialLabel(p)}</Typography>
              <Typography variant="caption" color="textSecondary">
                {struck.has(p.id)
                  ? 'Rayé : le MJ peut le rétablir.'
                  : p.description}
              </Typography>
            </Box>
          </li>
        )}
        value={value}
        onChange={(e, p) => setValue(p)}
        renderInput={(params) => (
          <TextField {...params} label="Potentiel à ajouter" />
        )}
        noOptionsText="Aucun potentiel"
      />
      <Button
        size="small"
        startIcon={<AddIcon />}
        disabled={!value}
        onClick={async () => {
          // Garde explicite : le React Compiler lit `value.id` dès le rendu
          // pour mémoriser ce gestionnaire, alors que `value` y est nul.
          if (!value) return;
          if (await createItem('spyree', { potentialId: value.id, level: 1 }))
            setValue(null);
        }}
      >
        Ajouter ({spyreeCost(1)} XP)
      </Button>
    </Box>
  );
};

const SchemesCard = ({ id }: { id: string }) => {
  const { catalog } = useCatalog();
  const { sheet, isLocked, isAdmin } = useSheet(id);
  const corpusLocked = isLocked('corpus');
  const spyreeLocked = isLocked('spyree');
  const corpusTypes = catalog?.corpusTypes ?? [];
  // Le rang du Corpus (et son prix) ne compte que les aspects actifs.
  const activeCorpus = activeOnly(sheet.corpus);
  const usedTypes = new Set(activeCorpus.map((c) => c.typeId));
  const nextType =
    corpusTypes.find((t) => !usedTypes.has(t.id)) ?? corpusTypes[0];

  return (
    <SectionCard title="Schémas">
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, lg: 6 }}>
          <SheetCollection
            id={id}
            collection="corpus"
            title={
              <Typography variant="h5">
                Le Corpus
                <ScopeLock locked={corpusLocked} />
              </Typography>
            }
            defaults={nextType ? { typeId: nextType.id } : undefined}
            addLabel={`Ajouter un aspect (${corpusAspectCost(activeCorpus.length + 1)} XP)`}
            deletable={!corpusLocked || isAdmin}
            confirmDelete={!corpusLocked}
            emptyLabel="Aucun aspect."
            itemLabel={(c) => `${c.type?.name ?? ''} : ${c.name ?? ''}`}
            columns={[
              {
                key: 'typeId',
                label: 'Type',
                type: 'select',
                required: true,
                options: corpusTypes.map((t) => ({
                  value: t.id,
                  label: t.name,
                })),
              },
              { key: 'name', label: 'Nom' },
              {
                key: 'stat',
                label: 'Bonus',
                type: 'select',
                options: CORPUS_STAT_OPTIONS,
                normalize: (v) => normalizeStat(v as string),
                tooltip:
                  "Le bonus s'ajoute à la marge des facultés dont ce caractère est le majeur (ou à la santé maximale).",
              },
              { key: 'bonus', label: '+', type: 'number', width: 60 },
              { key: 'description', label: 'Description', type: 'multiline' },
            ]}
          />
        </Grid>
        <Grid
          size={{ xs: 12, lg: 6 }}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
          }}
        >
          <SheetCollection
            id={id}
            collection="spyree"
            title={
              <Typography variant="h5">
                La Spyrée
                <ScopeLock locked={spyreeLocked} />
              </Typography>
            }
            emptyLabel="Aucun potentiel."
            deletable={!spyreeLocked || isAdmin}
            confirmDelete={!spyreeLocked}
            addControl={<AddPotential id={id} />}
            itemLabel={(s) => s.potential?.name ?? ''}
            columns={[
              {
                key: 'potentialId',
                label: 'Potentiel',
                render: (row) => (
                  <Tooltip title={row.potential.description} arrow>
                    <span style={{ textDecoration: 'underline dotted' }}>
                      {potentialLabel(row.potential)}
                    </span>
                  </Tooltip>
                ),
              },
              {
                key: 'level',
                label: 'Rang',
                type: 'number',
                width: 80,
                tooltip: SPYREE_TOOLTIP,
                display: (row) => toRoman(row.level),
              },
            ]}
          />
          <SheetCollection
            id={id}
            collection="amee"
            title="L'Âmée"
            addLabel="Ajouter"
            emptyLabel="Aucune âmée."
            columns={[
              { key: 'name', label: 'Nom' },
              { key: 'description', label: 'Notes', type: 'multiline' },
            ]}
          />
        </Grid>
      </Grid>
    </SectionCard>
  );
};

export default SchemesCard;
