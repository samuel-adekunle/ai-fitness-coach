import Head from '@/components/Head';
import UserForm from '@/components/UserForm';
import { withPageAuthRequired } from '@auth0/nextjs-auth0/client'
import { Box, Container } from '@chakra-ui/react'

function Home() {
  return (
    <>
      <Head title={'Home'} />
      <main>
        <Box>
          <Container>
            <UserForm />
          </Container>
        </Box>
      </main>
    </>
  )
}

export default withPageAuthRequired(Home);