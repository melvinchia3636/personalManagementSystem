import { t } from 'i18next'
import { cookieParse } from 'pocketbase'
import { toast } from 'react-toastify'

export async function fetchChallenge(
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
): Promise<string> {
  return await fetch(
    `${import.meta.env.VITE_API_HOST}/journal/auth/challenge`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cookieParse(document.cookie).token}`
      }
    }
  ).then(async res => {
    const data = await res.json()
    if (res.ok && data.state === 'success') {
      return data.data
    } else {
      toast.error(t('journal.failedToUnlock'))
      setLoading(false)

      throw new Error(t('journal.failedToUnlock'))
    }
  })
}
