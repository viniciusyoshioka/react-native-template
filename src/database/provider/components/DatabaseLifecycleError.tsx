import { useEffect } from 'react'
import { ScrollView } from 'react-native'
import { Text } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'

import { useHideSplashscreen } from '@hooks'
import { Namespaces, useLocale } from '@locale'
import { useAppTheme } from '@theme'
import type { DatabaseLifecycleResponse } from '../hooks'


function DatabaseInitializationError() {


  const { colors } = useAppTheme()
  const { t } = useLocale()


  return (
    <SafeAreaView
      style={{
        backgroundColor: colors.background,
      }}
    >
      <ScrollView
        contentContainerStyle={{
          alignItems: 'flex-start',
          justifyContent: 'center',
          height: '100%',
          padding: 16,
        }}
      >
        <Text
          variant={'bodyLarge'}
          style={{ width: '100%', textAlign: 'center' }}
        >
          {t(
            'database_initialization_error_title',
            { ns: Namespaces.INITIALIZATION },
          )}
        </Text>

        <Text variant={'bodyMedium'}>
          {t(
            'database_initialization_error_description',
            { ns: Namespaces.INITIALIZATION },
          )}
        </Text>

        <Text variant={'bodyMedium'}>
          &bull; {t(
            'database_initialization_error_description_option_1',
            { ns: Namespaces.INITIALIZATION },
          )}
        </Text>

        <Text variant={'bodyMedium'}>
          &bull; {t(
            'database_initialization_error_description_option_2',
            { ns: Namespaces.INITIALIZATION },
          )}
        </Text>

        <Text variant={'bodyMedium'}>
          &bull; {t(
            'database_initialization_error_description_option_3',
            { ns: Namespaces.INITIALIZATION },
          )}
        </Text>
      </ScrollView>
    </SafeAreaView>
  )
}


function DatabaseMigrationError() {


  const { colors } = useAppTheme()
  const { t } = useLocale()


  return (
    <SafeAreaView
      style={{
        backgroundColor: colors.background,
      }}
    >
      <ScrollView
        contentContainerStyle={{
          alignItems: 'flex-start',
          justifyContent: 'center',
          height: '100%',
          padding: 16,
        }}
      >
        <Text
          variant={'bodyLarge'}
          style={{ width: '100%', textAlign: 'center' }}
        >
          {t(
            'database_migration_error_title',
            { ns: Namespaces.INITIALIZATION },
          )}
        </Text>

        <Text variant={'bodyMedium'}>
          {t(
            'database_migration_error_description',
            { ns: Namespaces.INITIALIZATION },
          )}
        </Text>

        <Text variant={'bodyMedium'}>
          &bull; {t(
            'database_migration_error_description_option_1',
            { ns: Namespaces.INITIALIZATION },
          )}
        </Text>

        <Text variant={'bodyMedium'}>
          &bull; {t(
            'database_migration_error_description_option_2',
            { ns: Namespaces.INITIALIZATION },
          )}
        </Text>

        <Text variant={'bodyMedium'}>
          &bull; {t(
            'database_migration_error_description_option_3',
            { ns: Namespaces.INITIALIZATION },
          )}
        </Text>
      </ScrollView>
    </SafeAreaView>
  )
}


function DatabaseCloseError() {


  const { colors } = useAppTheme()
  const { t } = useLocale()


  return (
    <SafeAreaView
      style={{
        backgroundColor: colors.background,
      }}
    >
      <ScrollView
        contentContainerStyle={{
          alignItems: 'flex-start',
          justifyContent: 'center',
          height: '100%',
          padding: 16,
        }}
      >
        <Text
          variant={'bodyLarge'}
          style={{ width: '100%', textAlign: 'center' }}
        >
          {t(
            'database_close_error_title',
            { ns: Namespaces.INITIALIZATION },
          )}
        </Text>

        <Text variant={'bodyMedium'}>
          {t(
            'database_close_error_description',
            { ns: Namespaces.INITIALIZATION },
          )}
        </Text>
      </ScrollView>
    </SafeAreaView>
  )
}


export function DatabaseLifecycleError(props: DatabaseLifecycleResponse) {


  const hideSplashscreen = useHideSplashscreen()

  useEffect(() => {
    hideSplashscreen()
  }, [])


  const hasInitializationError = props.initializationErrors
  if (hasInitializationError) {
    return <DatabaseInitializationError />
  }

  const hasMigrationError = props.migrationErrors
  if (hasMigrationError) {
    return <DatabaseMigrationError />
  }

  const hasCloseError = props.closeErrors
  if (hasCloseError) {
    return <DatabaseCloseError />
  }

  return null
}
