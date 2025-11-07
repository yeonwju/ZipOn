export {}

declare global {
  interface Window {
    __swReg?: ServiceWorkerRegistration
  }

  interface WindowEventMap {
    'sw-update-available': CustomEvent<void>
  }
}
