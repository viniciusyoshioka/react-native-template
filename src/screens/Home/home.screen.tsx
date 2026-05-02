import { useEffect } from 'react'

import { useHideSplashscreen } from './hooks'


export function Home() {


  const hideSplashscreen = useHideSplashscreen()


  useEffect(() => {
    hideSplashscreen()
  }, [])


  return null
}
