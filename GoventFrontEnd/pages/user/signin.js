import BackToMainPage from '@/components/user/backToMainPage'
import PasswordVisibility from '@/components/user/passwordVisibility'
import React, { useState, useEffect } from 'react'
import { Form } from 'react-bootstrap'
import Link from 'next/link'
import { ToastContainer, toast } from 'react-toastify'
import toastStyle from '@/components/user/custom-toastify.module.css'
import LoadingLayout from '@/components/layout/loading-layout'
import { useRouter } from 'next/router'
import { useAuth } from '@/hooks/use-auth'
import { useGoogleAuth } from '@/hooks/firebase-google-auth'
import 'react-toastify/dist/ReactToastify.css'

export default function Signin() {
  const router = useRouter()
  // handle auth, googleAuth hooks
  const { signIn, setAuth } = useAuth()
  const { signInWithGoogle } = useGoogleAuth()

  // user information
  const [user, setUser] = useState({
    username: '',
    password: '',
  })

  // password visibility toggle
  const [passwordVisible, setPasswordVisible] = useState(false)

  // username checkbox function
  const [rememberusername, setRememberusername] = useState(false)

  // google Signin
  const handleSignInWithGoogle = async () => {
    await signInWithGoogle()
    toast.success('google 登入成功，將自動跳轉至首頁')
  }

  useEffect(() => {
    const storedusername = localStorage.getItem('username')
    if (storedusername) {
      setUser((prevState) => ({
        ...prevState,
        username: storedusername,
      }))
      setRememberusername(true)
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()

    // rememberusername
    if (rememberusername) {
      localStorage.setItem('username', user.username)
    } else {
      localStorage.removeItem('username')
    }

    const formData = {
      username: user.username,
      password: user.password,
    }
    // console.log(formData)

    try {
      const response = await fetch('http://localhost:3005/api/user/signin', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('登入失敗')
      }

      const data = await response.json()
      signIn(data.user)
      toast.success('登入成功，將自動跳轉至首頁')
      // console.log(data.user)
      // router.push('/')
    } catch (error) {
      console.error('登入錯誤', error)
      toast.error(error.message)
    }

    // let url = 'http://localhost:3005/api/user/signin'
    // fetch(url, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(formData),
    //   credentials: 'include', // Necessary for cookies to be sent with requests cross-origin
    // })
    //   .then((response) => {
    //     if (!response.ok) {
    //       throw new Error('登入失敗')
    //     }
    //     return response.json
    //   })
    //   .then((data) => {
    //     console.log('登入成功:', data)
    //     router.push('/')
    //     // Handle success scenario, e.g., redirect to a dashboard or store the JWT token.
    //   })
    //   .catch((error) => {
    //     console.error('登入錯誤', error)
    //     toast.error(error.message)
    //     // Handle errors, e.g., display a message to the user.
    //   })
  }

  return (
    <>
      <div className="background d-flex justify-content-center">
        <div className="component-all">
          <BackToMainPage />
          <ToastContainer
            position="top-center"
            toastClassName={toastStyle.myToast}
          />
          <div className="formBackground">
            <Form method="post">
              <div className="px-5 py-5">
                <div className="text-white">
                  <h4 className="mainTitle-rwd">歡迎回來</h4>
                  <p className="subTitle-rwd">繼續下一趟美好旅程吧！</p>
                </div>
                <div className="text-black mt-4">
                  <div className="mb-3">
                    <label
                      htmlFor="usernameEmail"
                      className="form-label sm-p text-normal-gray-light"
                    >
                      帳號
                    </label>
                    <input
                      type="email"
                      className="form-control bg-normal-gray-light"
                      id="usernameEmail"
                      placeholder="請輸入帳號"
                      name="usernameEmail"
                      value={user.username}
                      onChange={(e) => {
                        setUser({ ...user, username: e.target.value })
                      }}
                    />
                  </div>
                  {/* <PasswordVisibility /> */}
                  <div className="mb-3 text-black">
                    <label
                      htmlFor="usernamePassword"
                      className="form-label sm-p text-normal-gray-light"
                    >
                      密碼
                    </label>
                    <div className="input-group">
                      <input
                        type={passwordVisible ? 'text' : 'password'}
                        className="form-control bg-normal-gray-light"
                        id="usernamePassword"
                        placeholder="請輸入密碼"
                        name="usernamePassword"
                        value={user.password}
                        onChange={(e) => {
                          setUser({ ...user, password: e.target.value })
                        }}
                      />
                      <button
                        className={`bi ${
                          passwordVisible ? 'bi-eye-fill' : 'bi-eye-slash-fill'
                        } btn text-normal-gray bg-normal-gray-light`}
                        onClick={(e) => {
                          e.preventDefault()
                          passwordVisible
                            ? setPasswordVisible(false)
                            : setPasswordVisible(true)
                        }}
                      ></button>
                    </div>
                  </div>
                </div>
                <div className="mb-4 form-check d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="rememberusername"
                      checked={rememberusername}
                      onChange={(e) => setRememberusername(e.target.checked)}
                    />
                    <label
                      className="form-check-label text-white sm-p px-2"
                      htmlFor="rememberusername"
                    >
                      記住我的帳號
                    </label>
                  </div>
                  <Link href="/user/forgetPassword">
                    <div className="sm-p d-flex align-items-center">
                      忘記密碼
                    </div>
                  </Link>
                </div>
                <div>
                  <button
                    type="submit"
                    className="btn btn-primary text-white w-100"
                    onClick={handleSubmit}
                  >
                    登入
                  </button>
                </div>
                <div className="text-center p-2">
                  <span className="text-white sm-p">
                    還沒有帳號？
                    <Link href="/user/signup">
                      <span className="sm-p">點擊註冊</span>
                    </Link>
                  </span>
                </div>
                <div className="text-white text-center xs-p my-4">
                  <span>OR</span>
                </div>
                <div className="d-flex justify-content-between text-white row">
                  <button
                    className="btn-lg btn btn-outline-light text-white col-5 googleLoginButton"
                    onClick={(e) => {
                      e.preventDefault()
                      handleSignInWithGoogle()
                    }}
                  >
                    <div className="sm-p py-1">
                      <i className="bi bi-google me-2"></i>google 登入
                    </div>
                  </button>
                  <div className="btn-lg btn btn-outline-light text-white col-5 xLoginButton">
                    <div className="sm-p py-1">
                      <i className="bi bi-twitter-x"></i> 登入
                    </div>
                  </div>
                </div>
              </div>
            </Form>
          </div>
          <div className="d-flex justify-content-center goventLogo">
            <img src="/images/govent-angus/govent-logo.png" />
          </div>
        </div>
      </div>
      <style jsx>
        {`
          .background {
            background-image: url(/images/govent-angus/loginPage-BG.jpg);
            background-size: cover;
            background-position: center;
            // height: 100vh;
            letter-spacing: 2px;
            input {
              border-radius: 5px;
              opacity: 0.5;
            }
            @media screen and (max-width: 435px) {
              background: linear-gradient(
                  180deg,
                  rgba(0, 0, 0, 0.8) 0%,
                  rgba(34, 34, 34, 0.8) 100%
                ),
                url('/images/govent-angus/loginPage-BG.jpg') lightgray 50% /
                  cover no-repeat;
              height: 100vh;
              letter-spacing: 2px;
            }
          }
          .component-all {
            margin-top: 150px;
          }
          .formBackground {
            border-radius: 10px;
            width: 420px;
            height: 580px;
            background: linear-gradient(
              180deg,
              rgba(18, 18, 18, 0.9) 0%,
              rgba(40, 40, 40, 0.49) 100%
            );

            /* bg-blur + shadow */
            box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
            backdrop-filter: blur(7.5px);

            @media screen and (max-width: 435px) {
              background: none;
              box-shadow: none;
              backdrop-filter: none;
            }
            .mainTitle-rwd {
              @media screen and (max-width: 435px) {
                font-size: 36px;
              }
            }
            .subTitle-rwd {
              @media screen and (max-width: 435px) {
                font-size: 16px;
              }
            }
            .googleLoginButton {
              @media screen and (max-width: 435px) {
                margin-left: 12px;
              }
            }
            .xLoginButton {
              @media screen and (max-width: 435px) {
                margin-right: 12px;
              }
            }
          }

          .goventLogo {
            margin-top: 150px;
            margin-bottom: 50px;
            height: 30px;
            @media screen and (max-width: 435px) {
              img {
                display: none;
              }
            }
          }
          .btn-outline-light {
            border-radius: 5px;
          }
          .btn-primary {
            border-radius: 5px;
          }
          .bi-eye-fill {
            border-radius: 5px;
            opacity: 0.5;
          }
          // toast
          .dark-toast {
            background-color: #404040;
          }
        `}
      </style>
    </>
  )
}

Signin.getLayout = function (page) {
  return <LoadingLayout title="登入">{page}</LoadingLayout>
}
