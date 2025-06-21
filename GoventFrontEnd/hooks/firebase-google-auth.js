// hooks/useGoogleAuth.js
import { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
} from 'firebase/auth'
import { getApps, initializeApp } from 'firebase/app'
import { firebaseConfig } from '@/configs/firebaseConfigs'
import { useAuth } from './use-auth'
import toast from 'react-hot-toast'

if (!getApps().length) {
  initializeApp(firebaseConfig)
}

const auth = getAuth()
const provider = new GoogleAuthProvider()

const GoogleAuthContext = createContext()

export const GoogleAuthAuthProvider = ({ children }) => {
  const [googleAuth, setGoogleAuth] = useState({
    isAuthenticated: false,
    user: null,
  })
  const router = useRouter()
  const [user, setUser] = useState(null)
  const { signIn, setAuth } = useAuth()

  const signInWithGoogle = async () => {
    try {
      const res = await signInWithPopup(auth, provider)
      const user = res.user

      setUser(user)

      const googleUser = {
        google_uid: user.uid,
        name: user.displayName,
        email: user.email,
        photo_url: user.photoURL,
      }
      console.log(googleUser)
      const response = await fetch(
        'http://localhost:3005/api/user/googleSignIn',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ googleUser }),
          credentials: 'include',
        }
      )

      if (!response.ok) throw new Error('Google 登入失敗')
      const { token, user: userData } = await response.json()
      console.log(userData)

      signIn(userData)
      setGoogleAuth({ isAuthenticated: true, user: userData, token })
      console.log({ isAuthenticated: true, user: userData, token })
      setTimeout(() => {
        router.push('/')
      }, 3000)
      // Handle the response data here
      // For example, you might want to set some state with the data
    } catch (error) {
      console.error('登入出現錯誤', error)
      toast.error(error.message)
    }
  }

  const signOutWithGoogle = async () => {
    try {
      await firebaseSignOut(auth)
      setGoogleAuth({ isAuthenticated: false, user: null })
      //這邊可以進行登出轉移
      // router.push('/user/signin')
    } catch (error) {
      console.error('登出出現錯誤', error)
    }
  }

  useEffect(() => {
    if (router.isReady && !googleAuth.isAuthenticated) {
      // handleCheckAuth()
    }
    // eslint-disable-next-line
  }, [router.isReady, router.pathname])

  return (
    <GoogleAuthContext.Provider
      value={{
        googleAuth,
        signInWithGoogle,
        signOutWithGoogle,
      }}
    >
      {children}
    </GoogleAuthContext.Provider>
  )
}

export const useGoogleAuth = () => useContext(GoogleAuthContext)
