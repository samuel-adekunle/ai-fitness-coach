import { Box, Button, Text, Heading, Stack, FormControl, FormHelperText, FormErrorMessage, Skeleton, Center } from '@chakra-ui/react'
import { useState } from 'react'
import axios from 'axios'
import { useUser } from '@auth0/nextjs-auth0/client';

export default function Plans() {
  const [plans, setPlans] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { user: auth0User, isLoading } = useUser();

  const isVerified = auth0User?.email_verified ?? false;

  const onClickGeneratePlans = async (e) => {
    e.preventDefault();
    setIsGenerating(true);
    try {
      const res = await axios.post('/api/plans');
      if (!res.data.success) throw new Error(res.data.error);
      setPlans(res.data.data);
    }
    catch (error) {
      console.log(error);
      window.alert('Failed to generate plans');
    }
    setIsGenerating(false);
  }

  return <Box>
    <Stack spacing='4'>
      <Box>
        <Heading size='xl' as='h2' textAlign='center'>Personalised Plans</Heading>
      </Box>
      <Skeleton isLoaded={!isLoading}>
        <Center textAlign='center'>
          <Box>
            <FormControl isInvalid={!isVerified}>
              <Button
                colorScheme="blue" size="lg"
                isLoading={isGenerating}
                loadingText="Generating Plans..."
                onClick={onClickGeneratePlans}
                isDisabled={!isVerified}
              >
                Generate Plans
              </Button>
              {
                isVerified 
                  ? <FormHelperText>Click the button to generate personalised workout and meal plans.</FormHelperText>
                  : <FormErrorMessage>Please verify your email address to generate personalised plans.</FormErrorMessage>
              }
            </FormControl>
          </Box>
        </Center>
      </Skeleton>
      <Box hidden={!plans}>
        <Text>{plans}</Text>
      </Box>
    </Stack>
  </Box>
}