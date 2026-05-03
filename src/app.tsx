import { KeyboardProvider } from 'react-native-keyboard-controller'

import { StatusBar } from '@components'
import { FileSystemProvider, NitroFileSystem } from '@modules/file-system'
import { useSettings } from '@modules/settings'
import { Router } from '@routes'
import { AppThemeProvider } from '@theme'


export function App() {


  const { settings } = useSettings()
  const fileSystem = new NitroFileSystem()


  return (
    <>
      <KeyboardProvider>
        <StatusBar />

        <AppThemeProvider theme={settings.theme}>
          <FileSystemProvider fileSystem={fileSystem}>
            <Router />
          </FileSystemProvider>
        </AppThemeProvider>
      </KeyboardProvider>
    </>
  )
}
