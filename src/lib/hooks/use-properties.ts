import { Property } from '@prisma/client';
import useSWR from 'swr';
import fetcher from '../helpers/swr';

export const useProperties = () => {
  const {
    data: properties,
    error,
    isLoading,
  } = useSWR<Property[]>(`/api/properties`, fetcher);

  return {
    properties,
    error,
    isLoading,
  };
};
