import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
  ThemeProvider,
} from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { Home } from '@screens/Home'
import { useAppTheme } from '@theme'
import type { ScreenParams } from './routes.types.ts'


const NativeStack = createNativeStackNavigator<ScreenParams>()


export function Router() {


  const { isDark } = useAppTheme()

  const navigationTheme = isDark ? DarkTheme : DefaultTheme


  return (
    <NavigationContainer>
      <ThemeProvider value={navigationTheme}>
        <NativeStack.Navigator initialRouteName={'Home'}>
          <NativeStack.Screen name={'Home'} component={Home} />
        </NativeStack.Navigator>
      </ThemeProvider>
    </NavigationContainer>
  )
}
