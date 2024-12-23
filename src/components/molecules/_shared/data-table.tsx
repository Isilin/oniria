import { difference } from '@/lib/helpers/difference';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import { DataGrid, GridColDef, useGridApiRef } from '@mui/x-data-grid';
import { useCallback, useEffect, useState } from 'react';
import AddRow from './add-row';

interface Props {
  columns: GridColDef[];
  data: Array<object & { id: string }>;
  isLoading: boolean;
  onCreate: () => void;
  onUpdate: (diff: unknown & { id: string }) => void;
  onError: () => void;
}

const DataTable = ({
  columns,
  data,
  isLoading,
  onCreate,
  onUpdate,
  onError,
}: Props) => {
  const apiRef = useGridApiRef();
  useEffect(() => {
    if (!isLoading) {
      apiRef.current.autosizeColumns({
        expand: true,
        includeHeaders: true,
      });
    }
  }, [apiRef, isLoading]);

  const [loadingUpdate, setLoadingUpdate] = useState(false);

  const handleUpdate = useCallback(
    (updatedRow, oldRow) => {
      setLoadingUpdate(true);
      const diff = difference(updatedRow, oldRow);
      if (Object.keys(diff).length > 0) {
        onUpdate({ ...diff, id: updatedRow.internal_id });
      }
      setLoadingUpdate(false);
      return updatedRow;
    },
    [onUpdate],
  );

  const handleError = useCallback(() => {
    onError();
  }, [onError]);

  return (
    <TableContainer component={Paper}>
      <DataGrid
        apiRef={apiRef}
        disableColumnMenu
        disableColumnSorting
        disableColumnResize
        hideFooter
        autosizeOnMount
        autosizeOptions={{
          expand: true,
          includeHeaders: true,
        }}
        columns={columns}
        rows={data.map((d, index) => ({ ...d, id: index, internal_id: d.id }))}
        loading={isLoading || loadingUpdate}
        slotProps={{
          loadingOverlay: {
            variant: 'skeleton',
            noRowsVariant: 'skeleton',
          },
        }}
        processRowUpdate={handleUpdate}
        onProcessRowUpdateError={handleError}
      />
      <Table>
        <TableBody>
          <AddRow onAdd={onCreate} />
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DataTable;
