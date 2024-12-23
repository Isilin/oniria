'use client';

import { ArmorWithProperties } from '@/lib/db/sheet';
import { useArmors } from '@/lib/hooks/use-armors';
import { useProperties } from '@/lib/hooks/use-properties';
import SwapIcon from '@mui/icons-material/SwapHoriz';
import { GridActionsCellItem, GridColDef } from '@mui/x-data-grid';
import { Property } from '@prisma/client';
import { useParams } from 'next/navigation';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import CustomCard from '../atoms/custom-card';
import DataTable from '../molecules/_shared/data-table';
import DeleteArmorAction from '../molecules/delete-armor-action';
import UpdateArmorAction from '../molecules/update-armor-action';

const ArmorsCard = () => {
  const { id } = useParams<{ id: string }>();
  const { armors, isLoading, createArmor } = useArmors(id);
  const { properties, isLoading: isPropertiesLoading } = useProperties();
  const { enqueueSnackbar } = useSnackbar();
  const [armorToUpdate, setArmorToUpdate] =
    useState<Partial<ArmorWithProperties>>(null);

  const handleCreate = () => {
    createArmor().then(() => {
      enqueueSnackbar('Armure ajoutée.', { variant: 'info' });
    });
  };

  const columns: GridColDef[] = [
    {
      field: 'name',
      type: 'string',
      headerName: 'Nom',
      editable: true,
      flex: 1, // required: https://stackoverflow.com/questions/78196344/i-am-building-a-react-component-using-mui-x-data-grid-i-see-an-empty-column-add
      renderCell: (params) => params.value || '-',
    },
    {
      field: 'protection',
      type: 'custom',
      headerName: 'Protection',
      align: 'center',
      headerAlign: 'center',
      editable: true,
      valueGetter: (value, row) => ({
        current_protection: row.current_protection || 0,
        protection: row.protection || 0,
      }),
      valueSetter: (value, row) => ({
        ...row,
        ...value,
      }),
      renderEditCell: (params) =>
        `${params.value.current_protection || 0} / ${params.value.protection || 0}`,
      renderCell: (params) =>
        `${params.value.current_protection || 0} / ${params.value.protection || 0}`,
    },
    {
      field: 'index',
      type: 'number',
      headerName: 'Indice',
      align: 'center',
      headerAlign: 'center',
      minWidth: 60,
      editable: true,
    },
    {
      field: 'bulk',
      type: 'number',
      headerName: 'Encombrement',
      align: 'center',
      headerAlign: 'center',
      editable: true,
      renderCell: (params) => params.value?.toString() + ' %',
    },
    {
      field: 'strength',
      type: 'number',
      headerName: 'Solidité',
      align: 'center',
      headerAlign: 'center',
      editable: true,
    },
    {
      field: 'prerequisite',
      headerName: 'Prérequis',
      align: 'center',
      headerAlign: 'center',
      editable: true,
      valueGetter: (value, row) => ({
        prerequisite_stat: row.prerequisite_stat,
        prerequisite_value: row.prerequisite_value,
      }),
      valueSetter: (value, row) => ({
        ...row,
        ...value,
      }),
      renderEditCell: (params) =>
        params.value.prerequisite_stat
          ? `${params.value.prerequisite_stat} ${params.value.prerequisite_value}`
          : '-',
      renderCell: (params) =>
        params.value.prerequisite_stat
          ? `${params.value.prerequisite_stat} ${params.value.prerequisite_value}`
          : '-',
    },
    {
      field: 'properties',
      headerName: 'Propriétés',
      align: 'center',
      headerAlign: 'center',
      editable: true,
      type: 'singleSelect',
      valueOptions: properties
        ?.map((property) => ({
          value: property.id,
          label: property.name,
        }))
        .concat({ value: '-1', label: '-' }),
      valueGetter: (value) => {
        return (value[0] as Property)?.id || '-1';
      },
      valueSetter: (value, row) => ({
        ...row,
        properties: value ? [properties.find((e) => e.id === value)] : [],
      }),
    },
    {
      field: 'quality',
      type: 'number',
      headerName: 'Qualité',
      align: 'center',
      headerAlign: 'center',
      editable: true,
    },
    {
      field: 'equipped',
      type: 'boolean',
      headerName: 'Équipé',
      align: 'center',
      headerAlign: 'center',
      editable: true,
    },
    {
      field: 'actions',
      type: 'actions',
      getActions: (params) => [
        <UpdateArmorAction
          key="update"
          armor={armorToUpdate}
          needUpdate={params.row.internal_id === armorToUpdate?.id}
          onUpdated={() => setArmorToUpdate(null)}
        />,
        <DeleteArmorAction key="delete" armorId={params.row.internal_id} />,
        <GridActionsCellItem
          key="exchange"
          label="Donner à..."
          icon={<SwapIcon />}
        />,
      ],
    },
  ];

  return (
    <CustomCard name="Armures">
      <DataTable
        columns={columns}
        data={armors || []}
        isLoading={isLoading || isPropertiesLoading}
        onCreate={handleCreate}
        onUpdate={(diff) =>
          setArmorToUpdate(diff as Partial<ArmorWithProperties>)
        }
        onError={() => {}}
      />
    </CustomCard>
  );
};

export default ArmorsCard;
