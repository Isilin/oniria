'use client';

import { CatalogPotential } from '@/lib/db/sheet';
import { useCatalog } from '@/lib/hooks/use-catalog';
import { useSheet } from '@/lib/hooks/use-sheet';
import { CHARACTERISTICS, normalizeStat, toRoman } from '@/lib/rules';
import AddIcon from '@mui/icons-material/Add';
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { useState } from 'react';
import SheetCollection from './sheet-collection';

const STAT_OPTIONS = [
  ...CHARACTERISTICS.map((c) => ({ value: c.key, label: c.label })),
  { value: 'health', label: 'Santé' },
];

const potentialLabel = (p: CatalogPotential) => `${p.type.name} - ${p.name}`;

/** Choix d'un potentiel dans le catalogue, classé par catégorie. */
const AddPotential = ({ id }: { id: string }) => {
  const { catalog } = useCatalog();
  const { sheet, createItem } = useSheet(id);
  const [value, setValue] = useState<CatalogPotential | null>(null);
  const owned = new Set(sheet.spyree.map((s) => s.potentialId));

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
                {p.description}
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
          if (await createItem('spyree', { potentialId: value.id, level: 1 }))
            setValue(null);
        }}
      >
        Ajouter
      </Button>
    </Box>
  );
};

const SchemesCard = ({ id }: { id: string }) => {
  const { catalog } = useCatalog();
  const { sheet } = useSheet(id);
  const corpusTypes = catalog?.corpusTypes ?? [];
  const usedTypes = new Set(sheet.corpus.map((c) => c.typeId));
  const nextType =
    corpusTypes.find((t) => !usedTypes.has(t.id)) ?? corpusTypes[0];

  return (
    <Card>
      <CardContent>
        <Typography variant="h4" align="center" gutterBottom>
          Schémas
        </Typography>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, lg: 6 }}>
            <SheetCollection
              id={id}
              collection="corpus"
              title="Le Corpus"
              defaults={nextType ? { typeId: nextType.id } : undefined}
              addLabel="Ajouter un aspect"
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
                  options: STAT_OPTIONS,
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
              title="La Spyrée"
              emptyLabel="Aucun potentiel."
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
      </CardContent>
    </Card>
  );
};

export default SchemesCard;
