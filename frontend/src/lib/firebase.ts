import { initializeApp } from 'firebase/app'
import { getMessaging, getToken, onMessage } from 'firebase/messaging'

const firebaseConfig = {
  apiKey: 'AIzaSyDpO3fOehMwqRvbujS9MKHZs1Tb7ht7XVI',
  authDomain: 'zipon-b45c7.firebaseapp.com',
  projectId: 'zipon-b45c7',
  storageBucket: 'zipon-b45c7.appspot.com',
  messagingSenderId: '270803338199',
  appId: '1:270803338199:web:40ce961744ab98211a0192',
}

const app = initializeApp(firebaseConfig)
export const messaging = typeof window !== 'undefined' ? getMessaging(app) : null

export const requestFCMToken = async () => {
  if (!messaging) return null
  try {
    const permission = await Notification.requestPermission()
    if (permission !== 'granted') {
      console.warn('알림 권한이 거부되었습니다.')
      return null
    }

    const token = await getToken(messaging, {
      vapidKey:
        'BPoXJBeAKezZjiCdoengki4Z1_3e-t4CQIpLcYy_DJxVoXIJD7MJFWJcSHOgNigU3JPSFeHTNkBMFtdNHpc7gIk',
      serviceWorkerRegistration: await navigator.serviceWorker.ready,
    })
    console.log('FCM Token:', token)
    return token
  } catch (error) {
    console.error('FCM Token 발급 오류:', error)
    return null
  }
}

if (typeof window !== 'undefined' && messaging) {
  onMessage(messaging, payload => {
    const { title, body, icon } = payload.notification ?? {}
    if (!title || !body) return

    const titleText = title ?? '알림'
    const bodyText = body ?? ''
    const iconUrl = icon ?? '/icon.png'

    new Notification(titleText, {
      body: bodyText,
      icon: iconUrl,
    })
  })
}
