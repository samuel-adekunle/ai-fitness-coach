import swr from 'swr';
import { fetcher } from '@/lib/fetcher';

export default function useMe() {
  const { data, error, isLoading, mutate } = swr('/api/me', fetcher);

  if (data && !data.success) {
    console.log(data.error)
  }

  return {
    me: data && data.data,
    isLoading,
    isError: (data && !data.success) || error,
    mutate,
  };
}