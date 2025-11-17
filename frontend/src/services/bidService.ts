import { authFetch } from '@/lib/fetch'

export async function bid(auctionSeq: number, amount: number) {
  try {
    const result = await authFetch.post('/api/v1/auction/bid', { auctionSeq, amount })

    if (result.status === 200) {
      console.log('success : ', result.message)
      return { success: true, message: result.message }
    } else {
      console.log('fail : ', result.message)
      return { success: false, message: result.message }
    }
  } catch (error) {
    console.log('error : ', error)
    return { success: false, message: error }
  }
}
