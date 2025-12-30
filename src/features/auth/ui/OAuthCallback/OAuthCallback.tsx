import { useEffect } from'react'
export const OAuthCallback = () => {
  useEffect(() => {

    const url = new URL(window.location.href)


    const code = url.searchParams.get('code')

    if (code && window.opener) {
      window.opener.postMessage({ code }, '*')
    }

    window.close()
  }, [])

  return <p>Logging you in...</p>
}