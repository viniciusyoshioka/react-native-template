import { useMemo } from 'react'

import { DatabaseNames, DatabaseProvider, NitroSqliteDatabase } from '@database'
import { useSettings } from '@modules/settings'
import { Router } from '@routes'
import { AppThemeProvider } from '@theme'


export function App() {


  const { settings } = useSettings()


  const databases = useMemo(() => ({
    [DatabaseNames.APP]: new NitroSqliteDatabase('app-database.sqlite'),
    [DatabaseNames.LOG]: new NitroSqliteDatabase('log-database.sqlite'),
  }), [])


  return (
    <AppThemeProvider theme={settings.theme}>
      <DatabaseProvider databases={databases}>
        <Router />
      </DatabaseProvider>
    </AppThemeProvider>
  )
}
