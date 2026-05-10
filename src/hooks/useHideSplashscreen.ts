import { useCallback } from 'react'
import { hide } from 'react-native-bootsplash'


export function useHideSplashscreen() {


  const hideSplashscreen = useCallback(() => {
    hide({ fade: true })
  }, [])


  return hideSplashscreen
}
