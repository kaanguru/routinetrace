import { useQuery } from '@tanstack/react-query';

import { getUser } from '~/utils/auth/getUser';

export default function useUser() {
  return useQuery({
    queryKey: ['user'],
    queryFn: getUser,
  });
}
