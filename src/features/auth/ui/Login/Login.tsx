import { useLoginMutation } from '@/features/auth/api/authApi.ts'
import { Path } from '@/common/routing';

export const Login = () => {
  const [login] = useLoginMutation()

  const loginHandler = () => {
    const redirectUri = `${window.location.origin}${Path.OAuthRedirect}`
    const callbackUrl = encodeURIComponent(redirectUri)
    const url = `${import.meta.env.VITE_BASE_URL}/auth/oauth-redirect?callbackUrl=${callbackUrl}`

    window.open(url, 'oauthPopup', 'width=500, height=600')


    const receiveMessage = async (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return

      const { code } = event.data
      if (!code) return


      window.removeEventListener('message', receiveMessage)
      login({ code, redirectUri, rememberMe: false })
    }


    window.addEventListener('message', receiveMessage)
  }

  return (
    <button type={'button'} onClick={loginHandler}>
      login
    </button>
  )
}
