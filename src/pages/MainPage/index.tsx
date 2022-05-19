import { NextSeo } from 'next-seo'
import dynamic from 'next/dynamic'

import { Page } from '../_App/interfaces'
// import { CarView } from './View'

const CarView = dynamic(import('./View'), {
  ssr: false,
})

export const MainPage: Page = () => {
  return (
    <>
      <NextSeo title="Main page" description="Main page description" />

      <CarView />
    </>
  )
}

/**
 * Example.
 * Commit this if not needed.
 *
 * Get data before render page
 */
MainPage.getInitialProps = () => {
  return {
    statusCode: 200,
  }
}

export default MainPage
