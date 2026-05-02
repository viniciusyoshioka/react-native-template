import type { Theme as NavigationTheme } from '@react-navigation/native'
import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationLightTheme,
} from '@react-navigation/native'
import type { MaterialTheme } from 'react-material-design-provider'
import {
  MaterialDarkTheme,
  MaterialLightTheme,
} from 'react-material-design-provider'
import type { MD3Theme } from 'react-native-paper'
import { MD3DarkTheme, MD3LightTheme } from 'react-native-paper'

import type { AppTheme } from '../app-theme.types.ts'
import { AppThemeDark, AppThemeLight } from '../themes'


export enum ThemeName {
  LIGHT = 'LIGHT',
  DARK = 'DARK',
}


export type ThemeObject = {
  appTheme: AppTheme
  materialTheme: MaterialTheme
  paperTheme: MD3Theme
  navigationTheme: NavigationTheme
}


type Themes = {
  [key in ThemeName]: ThemeObject
}

export const THEMES: Themes = {
  LIGHT: {
    appTheme: AppThemeLight,
    materialTheme: MaterialLightTheme,
    paperTheme: MD3LightTheme,
    navigationTheme: NavigationLightTheme,
  },
  DARK: {
    appTheme: AppThemeDark,
    materialTheme: MaterialDarkTheme,
    paperTheme: MD3DarkTheme,
    navigationTheme: NavigationDarkTheme,
  },
}
