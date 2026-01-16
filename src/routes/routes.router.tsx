import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { Home } from '@screens/Home/home.screen.jsx'
import type { ScreenParams } from './routes.types.ts'


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
