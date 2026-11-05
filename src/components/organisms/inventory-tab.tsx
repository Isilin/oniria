'use client';

import { useCatalog } from '@/lib/hooks/use-catalog';
import { useNotifyError } from '@/lib/hooks/use-notify-error';
import { useSheet } from '@/lib/hooks/use-sheet';
import { CHARACTERISTICS, meetsPrerequisite, normalizeStat } from '@/lib/rules';
import WarningIcon from '@mui/icons-material/WarningAmber';
import {
  Autocomplete,
  Box,
  Chip,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { useSession } from 'next-auth/react';
import EditableField from '../atoms/editable-field';
import SectionCard from '../molecules/section-card';
import SheetField from '../molecules/sheet-field';
import { Column } from './collection-table';
import SheetCollection from './sheet-collection';

type Property = { id: string; name: string | null; description: string | null };

type Equipment = {
  id: string;
  prerequisite_stat?: string | null;
  prerequisite_value?: number | null;
  properties?: Property[];
} & Record<string, unknown>;

type EquipmentCollection = 'armors' | 'meleeWeapons' | 'rangeWeapons';

const ARMOR_TYPES = [
  { value: 'LOW', label: 'Légère' },
  { value: 'PARTIAL', label: 'Partielle' },
  { value: 'FULL', label: 'Complète' },
];

/**
 * Propriétés de l'équipement, choisies dans le catalogue. Les MJ peuvent
 * en créer une nouvelle en tapant son nom.
 */
const Properties = ({
  id,
  row,
  onChange,
}: {
  id: string;
  row: Equipment;
  onChange: (ids: string[]) => void;
}) => {
  const { canEdit } = useSheet(id);
  const { catalog, createProperty } = useCatalog();
  const { data: session } = useSession();
  const notifyError = useNotifyError();
  const isAdmin = session?.user?.role === 'ADMIN';
  const value = row.properties ?? [];

  if (!canEdit) {
    return value.length ? (
      <Box
        sx={{
          display: 'flex',
          gap: 0.5,
          flexWrap: 'wrap',
        }}
      >
        {value.map((p) => (
          <Tooltip key={p.id} title={p.description ?? ''}>
            <Chip size="small" label={p.name} />
          </Tooltip>
        ))}
      </Box>
    ) : (
      '-'
    );
  }

  return (
    <Autocomplete<Property | string, true, false, boolean>
      multiple
      size="small"
      freeSolo={isAdmin}
      sx={{ minWidth: 160 }}
      options={catalog?.properties ?? []}
      value={value}
      getOptionLabel={(p) => (typeof p === 'string' ? p : (p.name ?? ''))}
      isOptionEqualToValue={(a, b) =>
        typeof a !== 'string' && typeof b !== 'string' && a.id === b.id
      }
      onChange={async (e, selected) => {
        try {
          const ids = await Promise.all(
            selected.map(async (p) =>
              typeof p === 'string' ? (await createProperty(p)).id : p.id,
            ),
          );
          onChange(ids);
        } catch (error) {
          notifyError(error);
        }
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="standard"
          placeholder={value.length ? '' : '-'}
          slotProps={{
            ...params.slotProps,
            htmlInput: {
              ...params.slotProps.htmlInput,
              'aria-label': 'Propriétés',
            },
          }}
        />
      )}
      noOptionsText={
        isAdmin ? 'Tapez un nom pour créer' : 'Aucune propriété au catalogue'
      }
    />
  );
};

const STAT_OPTIONS = CHARACTERISTICS.map((c) => ({
  value: c.key,
  label: c.abbr,
}));

const Prerequisite = ({
  id,
  row,
  onChange,
}: {
  id: string;
  row: Equipment;
  onChange: (patch: Partial<Equipment>) => void;
}) => {
  const { computed, canEdit } = useSheet(id);
  const met = meetsPrerequisite(
    computed.values,
    row.prerequisite_stat,
    row.prerequisite_value,
  );
  const stat = CHARACTERISTICS.find(
    (c) => c.key === normalizeStat(row.prerequisite_stat),
  );

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 0.5,
      }}
    >
      {canEdit ? (
        <>
          <Select
            size="small"
            variant="standard"
            value={stat?.key ?? ''}
            displayEmpty
            onChange={(e) =>
              onChange({ prerequisite_stat: e.target.value || null })
            }
            inputProps={{ 'aria-label': 'Caractère requis' }}
          >
            <MenuItem value="">
              <Box component="span" sx={{ color: 'text.secondary' }}>
                -
              </Box>
            </MenuItem>
            {STAT_OPTIONS.map((o) => (
              <MenuItem key={o.value} value={o.value}>
                {o.label}
              </MenuItem>
            ))}
          </Select>
          <EditableField
            value={row.prerequisite_value}
            type="number"
            minWidth={50}
            aria-label="Valeur requise"
            onChange={(raw) =>
              onChange({ prerequisite_value: raw === '' ? null : Number(raw) })
            }
          />
        </>
      ) : (
        <Typography variant="body1" component="span">
          {stat ? `${stat.abbr} ${row.prerequisite_value ?? ''}` : '-'}
        </Typography>
      )}
      {!met && stat && (
        <Tooltip
          title={`${stat.label} insuffisante (${computed.values[stat.key]} / ${row.prerequisite_value})`}
        >
          <WarningIcon color="warning" fontSize="small" />
        </Tooltip>
      )}
    </Box>
  );
};

const InventoryTab = ({ id }: { id: string }) => {
  const { computed, updateItem } = useSheet(id);

  const propertiesColumn = (
    collection: EquipmentCollection,
  ): Column<Equipment> => ({
    key: 'properties',
    label: 'Propriétés',
    render: (row) => (
      <Properties
        id={id}
        row={row}
        onChange={(ids) => updateItem(collection, row.id, { properties: ids })}
      />
    ),
  });

  const prerequisiteColumn = (
    collection: EquipmentCollection,
  ): Column<Equipment> => ({
    key: 'prerequisite_stat',
    label: 'Prérequis',
    render: (row) => (
      <Prerequisite
        id={id}
        row={row}
        onChange={(patch) => updateItem(collection, row.id, patch)}
      />
    ),
  });

  const equipped: Column<Equipment> = {
    key: 'equipped',
    label: 'Porté',
    type: 'boolean',
    width: 60,
    tooltip:
      "L'équipement porté compte dans la protection et l'encombrement de la fiche.",
  };
  const bulk: Column<Equipment> = {
    key: 'bulk',
    label: 'Enc. (%)',
    type: 'number',
    tooltip: 'Encombrement en %',
  };
  const solidity: Column<Equipment> = {
    key: 'solidity',
    label: 'Solidité',
    type: 'number',
  };
  const quality: Column<Equipment> = {
    key: 'quality',
    label: 'Qualité',
    type: 'number',
  };

  return (
    // Des sections de la feuille, comme l'onglet Caractéristiques : un titre
    // frappé et son filet, pas de cartes.
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        width: '100%',
        pt: 2,
      }}
    >
      {/* Ce que l'équipement porté donne au combat : une ligne tapée. */}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          columnGap: 4,
          rowGap: 0.5,
        }}
      >
        <SheetField label="Dégâts (Force)" value={computed.damage} />
        <SheetField
          label="Protection"
          value={
            computed.protection.max
              ? `${computed.protection.current}/${computed.protection.max}`
              : '-'
          }
        />
        <SheetField label="Encombrement" value={`${computed.bulk} %`} />
      </Box>
      <SectionCard title="Armes de mêlée">
        <SheetCollection
          id={id}
          collection="meleeWeapons"
          addLabel="Ajouter une arme de mêlée"
          emptyLabel="Aucune arme de mêlée."
          columns={[
            equipped,
            { key: 'name', label: 'Nom' },
            { key: 'damage', label: 'Dégâts', type: 'number' },
            { key: 'extend', label: 'Allonge', type: 'number' },
            bulk,
            solidity,
            prerequisiteColumn('meleeWeapons'),
            propertiesColumn('meleeWeapons'),
            quality,
          ]}
        />
      </SectionCard>
      <SectionCard title="Armes de tir">
        <SheetCollection
          id={id}
          collection="rangeWeapons"
          addLabel="Ajouter une arme de tir"
          emptyLabel="Aucune arme de tir."
          columns={[
            equipped,
            { key: 'name', label: 'Nom' },
            { key: 'damage', label: 'Dégâts', type: 'number' },
            {
              key: 'penetration_damage',
              label: 'Pénétration',
              type: 'number',
              tooltip: 'Dégâts de pénétration',
            },
            { key: 'velocity', label: 'Vélocité', type: 'number' },
            { key: 'rate', label: 'Cadence', type: 'number' },
            {
              key: 'reload_rate',
              label: 'Recharg.',
              type: 'number',
              tooltip: 'Rechargement',
            },
            {
              key: 'low_range',
              label: 'Courte',
              type: 'number',
              tooltip: 'Portée courte',
            },
            {
              key: 'medium_range',
              label: 'Moyenne',
              type: 'number',
              tooltip: 'Portée moyenne',
            },
            {
              key: 'long_range',
              label: 'Longue',
              type: 'number',
              tooltip: 'Portée longue',
            },
            bulk,
            solidity,
            prerequisiteColumn('rangeWeapons'),
            propertiesColumn('rangeWeapons'),
            quality,
          ]}
        />
      </SectionCard>
      <SectionCard title="Armures">
        <SheetCollection
          id={id}
          collection="armors"
          addLabel="Ajouter une armure"
          emptyLabel="Aucune armure."
          columns={[
            equipped,
            { key: 'name', label: 'Nom' },
            {
              key: 'current_protection',
              label: 'Protection',
              type: 'number',
              tooltip: 'Protection actuelle (vide = intacte)',
              display: (row) =>
                `${row.current_protection ?? row.protection ?? '-'}`,
            },
            {
              key: 'protection',
              label: 'Max',
              type: 'number',
              tooltip: 'Protection maximale',
            },
            { key: 'index', label: 'Indice', type: 'number' },
            {
              key: 'type',
              label: 'Type',
              type: 'select',
              options: ARMOR_TYPES,
            },
            bulk,
            solidity,
            prerequisiteColumn('armors'),
            propertiesColumn('armors'),
            quality,
          ]}
        />
      </SectionCard>
      <SectionCard title="Objets">
        <SheetCollection
          id={id}
          collection="items"
          defaults={{ quantity: 1 }}
          addLabel="Ajouter un objet"
          emptyLabel="Besace vide."
          columns={[
            { key: 'name', label: 'Objet' },
            {
              key: 'quantity',
              label: 'Quantité',
              type: 'number',
              width: 100,
            },
            { key: 'description', label: 'Notes' },
          ]}
        />
      </SectionCard>
    </Box>
  );
};

export default InventoryTab;
