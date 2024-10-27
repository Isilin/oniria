'use client';

import { SheetGetResult } from '@/app/api/sheet/route';
import { Sheet } from '@prisma/client';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { ExtendedSheetWithUser, SheetWithUser } from '../db/sheet';
import fetcher from '../helpers/swr';

export const useSheets = () => {
  const {
    data: sheets,
    error,
    isLoading,
  } = useSWR<SheetGetResult>('/api/sheet', fetcher);

  const { trigger: createSheet } = useSWRMutation(
    '/api/sheet',
    (url, { arg }: { arg: Partial<Sheet> }) => {
      return fetch(url, {
        method: 'POST',
        body: JSON.stringify(arg),
      });
    },
  );

  return {
    sheets,
    error,
    isLoading,
    createSheet,
  };
};

export const useSheet = (id) => {
  const {
    data: sheet,
    error,
    isLoading,
  } = useSWR<ExtendedSheetWithUser>(`/api/sheet/${id}`, fetcher);

  const { trigger: mutate } = useSWRMutation(
    `/api/sheet/${id}`,
    (url, { arg }: { arg: Partial<SheetWithUser> }) => {
      return fetch(url, {
        method: 'PATCH',
        body: JSON.stringify(arg),
      }).then((res) => res.json());
    },
  );

  return {
    sheet,
    error,
    isLoading,
    mutate,
  };
};
