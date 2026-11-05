'use client';

import { Catalog } from '@/lib/db/sheet';
import useSWR from 'swr';
import fetcher, { request } from '../helpers/swr';

export const CATALOG_URL = '/api/catalog';

/** Catalogues de règles, chargés une fois et partagés par toute l'appli. */
export const useCatalog = () => {
  const {
    data: catalog,
    error,
    isLoading,
    mutate,
  } = useSWR<Catalog>(CATALOG_URL, fetcher, { revalidateOnFocus: false });

  const createProperty = async (name: string) => {
    const property = await request<Catalog['properties'][number]>(
      'POST',
      '/api/properties',
      { name },
    );
    await mutate();
    return property;
  };

  return {
    catalog,
    error,
    isLoading,
    /** Relit les catalogues (après une erreur de lecture). */
    retry: () => mutate(),
    createProperty,
  };
};
