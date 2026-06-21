import { memo, useCallback } from 'react'
import { Button, Dialog, Text } from 'react-native-paper'

import type { AlertButton, AlertItemData } from '../alert.types.ts'
import { useAlert } from '../provider'


interface AlertProps {
  alertStackItem: AlertItemData
}


// TODO: Create type variants
export const Alert = memo((props: AlertProps) => {
  const { alertStackItem } = props

  const { id, title, description, type, buttons } = alertStackItem


  const alert = useAlert()


  const dismissItself = useCallback(() => {
    alert.dismiss(id)
  }, [alert, id])


  const AlertButton = useCallback((params: { alertButton: AlertButton }) => {
    const { alertButton } = params

    const onPress = () => {
      alertButton.onPress({
        dismiss: dismissItself,
      })
    }

    return (
      <Button onPress={onPress}>
        {alertButton.label}
      </Button>
    )
  }, [dismissItself])


  return (
    <Dialog visible={true} onDismiss={dismissItself}>
      <Dialog.Title>
        {title}
      </Dialog.Title>

      {description && (
        <Dialog.Content>
          <Text variant={'bodyMedium'}>
            {description}
          </Text>
        </Dialog.Content>
      )}

      <Dialog.Actions>
        {buttons?.map((button, index) => (
          // TODO: Add default button
          <AlertButton key={index} alertButton={button} />
        ))}
      </Dialog.Actions>
    </Dialog>
  )
})
