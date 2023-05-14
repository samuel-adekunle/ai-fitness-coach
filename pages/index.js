import Footer from '@/components/Footer';
import Plans from '@/components/Plans';
import Head from '@/components/Head';
import UserForm from '@/components/UserForm';
import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import { Box, Container, Heading, Stack, Text, Button } from '@chakra-ui/react';

function Home() {
  return (
    <>
      <Head title={'Home'} />
      <main>
        <Stack spacing='8' paddingY='8'>
        <Box>
          <Container>
            <Stack>
              <Heading textAlign='center' as='h1' size='xl'>{process.env.NEXT_PUBLIC_APP_NAME}</Heading>
              <Text textAlign='center' fontSize='xl'>Workout and Meal Plan Generator</Text>
            </Stack>
          </Container>
        </Box>
        <Box>
          <Container>
            <UserForm />
          </Container>
        </Box>
        <Box>
          <Container>
            <Plans />
          </Container>
        </Box>
        </Stack>
      </main>
      <Footer />
    </>
  )
}

export default withPageAuthRequired(Home);