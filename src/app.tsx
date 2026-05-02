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
      <StatusBar />

      <AppThemeProvider theme={settings.theme}>
        <FileSystemProvider fileSystem={fileSystem}>
          <Router />
        </FileSystemProvider>
      </AppThemeProvider>
    </>
  )
}
