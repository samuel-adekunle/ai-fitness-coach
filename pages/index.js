import Head from 'next/head'
import { withPageAuthRequired } from '@auth0/nextjs-auth0/client'

function Home() {
  return (
    <>
      <Head>
        <title>GymBuddy</title>
      </Head>
      <main>
        <h1>GymBuddy</h1>
      </main>
    </>
  )
}

export default withPageAuthRequired(Home);