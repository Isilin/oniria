'use client';

import { useSheet } from '@/lib/hooks/use-sheet';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import PreviewValue from '../atoms/preview-value';
import SheetField from '../molecules/sheet-field';

const FaceCard = ({ id }: { id: string }) => {
  const { sheet, computed, base, canEdit, update } = useSheet(id);

  return (
    <Card>
      <CardContent>
        <Typography variant="h4" align="center" gutterBottom>
          Visage
        </Typography>
        <Typography variant="h5">Le Soi</Typography>
        <SheetField
          label="Nom"
          type="text"
          value={sheet.name}
          editable={canEdit}
          onEdit={(newVal) => update({ name: newVal || 'Sans nom' })}
        />
        <SheetField
          label="Âge"
          value={sheet.age}
          postValue={sheet.age ? 'ans' : undefined}
          editable={canEdit}
          onEdit={(newVal) => update({ age: newVal ? Number(newVal) : null })}
        />
        <Typography variant="h5" sx={{ mt: 1 }}>
          L&apos;Autre
        </Typography>
        <SheetField
          label="Maï"
          value={sheet.current_mai ?? computed.mai}
          tooltip="Maximum : Âme / 10"
          postValue={
            <>
              /{' '}
              <PreviewValue before={base.mai} delta={computed.mai - base.mai}>
                {computed.mai}
              </PreviewValue>
            </>
          }
          editable={canEdit}
          onEdit={(newVal) =>
            update({ current_mai: newVal === '' ? null : Number(newVal) })
          }
        />
        <Typography variant="h5" sx={{ mt: 1 }}>
          Le Monde
        </Typography>
        <SheetField
          label="Aspect"
          type="text"
          value={sheet.aspect}
          editable={canEdit}
          onEdit={(newVal) => update({ aspect: newVal })}
        />
        <SheetField
          label="Devenir"
          type="text"
          value={sheet.become}
          editable={canEdit}
          onEdit={(newVal) => update({ become: newVal })}
        />
      </CardContent>
    </Card>
  );
};

export default FaceCard;
