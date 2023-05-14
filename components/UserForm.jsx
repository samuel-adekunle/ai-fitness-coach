import { Box, Input, Stack, Skeleton } from '@chakra-ui/react';
import useMe from '@/hooks/useMe';

export default function UserForm() {
  const { me, isLoading, isError } = useMe();
  if (isError) return <Box>
    Failed to load user form component
  </Box>

  return <Box>
    <Skeleton isLoaded={!isLoading}>
      <Stack>
        <Input placeholder="First name" />
      </Stack>
    </Skeleton>
  </Box>
}