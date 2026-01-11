import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { Home } from '../screens/Home/home.screen.tsx'
import type { ScreenParams } from './routes.types.ts'


// eslint-disable-next-line @typescript-eslint/no-unsafe-call
const NativeStack = createNativeStackNavigator<ScreenParams>()


export function Router() {
  return (
    <NavigationContainer>
      <NativeStack.Navigator initialRouteName={'Home'}>
        <NativeStack.Screen name={'Home'} component={Home} />
      </NativeStack.Navigator>
    </NavigationContainer>
  )
}
