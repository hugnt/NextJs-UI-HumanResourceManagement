import { useRouter } from 'next/router';

export const useQueryString = () => {
  const router = useRouter();
  const { query } = router;
  
  return query; // This will be an object containing the query parameters
};