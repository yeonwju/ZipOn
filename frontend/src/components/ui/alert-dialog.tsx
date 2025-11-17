'use client'

import * as React from 'react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './dialog'

export type AlertType = 'success' | 'error' | 'confirm'

interface AlertDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  type: AlertType
  title?: string
  description: string
  confirmText?: string
  cancelText?: string
  onConfirm?: () => void
  onCancel?: () => void
}

export function AlertDialog({
  open,
  onOpenChange,
  type,
  title,
  description,
  confirmText = '확인',
  cancelText = '취소',
  onConfirm,
  onCancel,
}: AlertDialogProps) {
  const handleConfirm = () => {
    onConfirm?.()
    onOpenChange(false)
  }

  const handleCancel = () => {
    onCancel?.()
    onOpenChange(false)
  }

  const getButtonStyle = (buttonType: 'confirm' | 'cancel') => {
    if (buttonType === 'cancel') {
      return 'rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 active:bg-gray-100'
    }

    switch (type) {
      case 'success':
        return 'rounded-lg bg-blue-500 px-3 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-600 active:bg-blue-700'
      case 'error':
        return 'rounded-lg bg-red-500 px-3 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-600 active:bg-red-700'
      case 'confirm':
        return 'rounded-lg bg-blue-500 px-3 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-600 active:bg-blue-700'
      default:
        return 'rounded-lg bg-blue-500 px-3 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-600 active:bg-blue-700'
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-4/5 max-w-sm rounded-2xl bg-white" showCloseButton={false}>
        <DialogHeader className="gap-3">
          <DialogTitle className={title ? 'text-center text-lg font-bold' : 'sr-only'}>
            {title || '알림'}
          </DialogTitle>
          <DialogDescription className="text-center text-sm text-gray-600">
            {description}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-2">
          {type === 'confirm' ? (
            <div className="flex w-full flex-row gap-2">
              <button onClick={handleCancel} className={`${getButtonStyle('cancel')} flex-1`}>
                {cancelText}
              </button>
              <button onClick={handleConfirm} className={`${getButtonStyle('confirm')} flex-1`}>
                {confirmText}
              </button>
            </div>
          ) : (
            <button onClick={handleConfirm} className={`${getButtonStyle('confirm')} w-full`}>
              {confirmText}
            </button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Hook for easier usage
export function useAlertDialog() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [config, setConfig] = React.useState<Omit<AlertDialogProps, 'open' | 'onOpenChange'>>({
    type: 'success',
    description: '',
  })

  const showAlert = React.useCallback(
    (newConfig: Omit<AlertDialogProps, 'open' | 'onOpenChange'>) => {
      setConfig(newConfig)
      setIsOpen(true)
    },
    []
  )

  const showSuccess = React.useCallback(
    (description: string, onConfirm?: () => void) => {
      showAlert({
        type: 'success',
        description,
        confirmText: '확인',
        onConfirm,
      })
    },
    [showAlert]
  )

  const showError = React.useCallback(
    (description: string, onConfirm?: () => void) => {
      showAlert({
        type: 'error',
        description,
        confirmText: '확인',
        onConfirm,
      })
    },
    [showAlert]
  )

  const showConfirm = React.useCallback(
    (
      description: string,
      onConfirm?: () => void,
      onCancel?: () => void,
      options?: { confirmText?: string; cancelText?: string }
    ) => {
      showAlert({
        type: 'confirm',
        description,
        confirmText: options?.confirmText || '확인',
        cancelText: options?.cancelText || '취소',
        onConfirm,
        onCancel,
      })
    },
    [showAlert]
  )

  const AlertDialogComponent = React.useCallback(
    () => <AlertDialog open={isOpen} onOpenChange={setIsOpen} {...config} />,
    [isOpen, config]
  )

  return {
    showSuccess,
    showError,
    showConfirm,
    AlertDialog: AlertDialogComponent,
  }
}
