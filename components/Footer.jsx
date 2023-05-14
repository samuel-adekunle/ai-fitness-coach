import { Box, Container, Text } from '@chakra-ui/react'

export default function Footer() {
  const year = new Date().getFullYear()
  return <footer>
    <Box bg='#1C1B1F' paddingY='16'>
      <Container centerContent>
        <Text color='white' textAlign='center'>© {year} by {process.env.NEXT_PUBLIC_APP_NAME}. All rights reserved.</Text>
      </Container>
    </Box>
  </footer>
}