import Head from 'next/head'
import Image from 'next/image'
import CamVOD from '../components/players/vod/CamVod'
import styles from '../styles/Home.module.css'
import getCamera from '../components/hooks/camera/getCamera'
import CamView from '../components/ui/camera/CamView'

export default function Home() {

  const { data, error } = getCamera("6238f75848bc505102562c39")
  if(error) return <span>Error</span>
  if(!data) return <span>Loading ...</span>

  return (
    <div >
      <Head>
        <title> Midl Ai </title>
        <meta name="description" content="Surveillance Made Easy" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className=" min-h-[100vh] bg-[#fff]">
        <CamView camera={data.camera} />
      </main>

      
    </div>
  )
}
