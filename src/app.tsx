import { useSettings } from './modules/settings'
import { Router } from './routes'
import { AppThemeProvider } from './theme'


export function App() {


  const { settings } = useSettings()


  return (
    <AppThemeProvider theme={settings.theme}>
      <Router />
    </AppThemeProvider>
  )
}
