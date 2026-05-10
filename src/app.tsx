import { useMemo } from 'react'
import { KeyboardProvider } from 'react-native-keyboard-controller'

import { StatusBar } from '@components'
import {
  AppDataSource,
  DatabaseProvider,
  LogDataSource,
  TypeOrmDatabase,
} from '@database'
import { FileSystemProvider, NitroFileSystem } from '@modules/file-system'
import { useSettings } from '@modules/settings'
import { Router } from '@routes'
import { AppThemeProvider } from '@theme'


export function App() {


  const { settings } = useSettings()

  const fileSystem = useMemo(() => {
    return new NitroFileSystem()
  }, [])

  const typeormDatabase = useMemo(() => {
    return new TypeOrmDatabase({
      APP: AppDataSource,
      LOG: LogDataSource,
    })
  }, [])


  return (
    <>
      <KeyboardProvider>
        <StatusBar />

        <AppThemeProvider theme={settings.theme}>
          <FileSystemProvider fileSystem={fileSystem}>
            <DatabaseProvider database={typeormDatabase}>
              <Router />
            </DatabaseProvider>
          </FileSystemProvider>
        </AppThemeProvider>
      </KeyboardProvider>
    </>
  )
}
