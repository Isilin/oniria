import { ArmorWithProperties } from '@/lib/db/sheet';
import { useArmor } from '@/lib/hooks/use-armors';
import { useParams } from 'next/navigation';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';

interface Props {
  armor: Partial<ArmorWithProperties>;
  needUpdate: boolean;
  onUpdated: () => void;
}

const UpdateArmorAction = ({ armor, needUpdate, onUpdated }: Props) => {
  const { id: sheetId } = useParams<{ id: string }>();
  const { updateArmor } = useArmor(armor?.id, sheetId);
  const { enqueueSnackbar } = useSnackbar();
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (needUpdate && !processing) {
      setProcessing(true);
      onUpdated();
      updateArmor({ ...armor }).then(() => {
        enqueueSnackbar('Armure modifiée.', { variant: 'info' });
        setProcessing(false);
      });
    }
  }, [armor, enqueueSnackbar, needUpdate, onUpdated, processing, updateArmor]);

  return <></>;
};

export default UpdateArmorAction;
