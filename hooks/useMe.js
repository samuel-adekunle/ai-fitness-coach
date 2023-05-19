import swr from 'swr';
import { fetcher } from '@/lib/fetcher';

export default function useMe() {
  const { data, isLoading, mutate } = swr('/api/me', fetcher);

  return {
    me: data && data.data,
    isLoading,
    mutate,
  };
}