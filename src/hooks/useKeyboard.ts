import { useEffect } from 'react'
import type { KeyboardEventListener, KeyboardEventName } from 'react-native'
import { Keyboard } from 'react-native'


export function useKeyboard(
  eventName: KeyboardEventName,
  keyboardFunction: KeyboardEventListener,
) {
  useEffect(() => {
    const subscription = Keyboard.addListener(eventName, keyboardFunction)
    return () => subscription.remove()
  }, [eventName, keyboardFunction])
}
