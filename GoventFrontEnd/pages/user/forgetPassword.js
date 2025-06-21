import BackToMainPage from '@/components/user/backToMainPage'
import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Form } from 'react-bootstrap'
import styles from '@/components/user/forgetPassword.module.css'
import LoadingLayout from '@/components/layout/loading-layout'
import { useRouter } from 'next/router'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import toastStyle from '@/components/user/custom-toastify.module.css'

export default function ForgetPassword() {
  const router = useRouter()

  const [user, setUser] = useState({
    emailAuth: '',
    codeAuth: '',
    newPasswordAuth: '',
  })

  const [isEmailValid, setIsEmailValid] = useState(false)

  //寄送驗證碼
  const [buttonDisabled, setButtonDisabled] = useState(false)
  const [countdown, setCountdown] = useState(15)

  //驗證驗證碼
  const [isCodeVerified, setIsCodeVerified] = useState(false)

  // email 格式驗證
  const isValidEmail = (email) => {
    //If a match is found, .test() returns true; otherwise, it returns false
    return /\S+@\S+\.\S+/.test(email)
  }

  // 新密碼格式驗證
  const [passwordFormatValid, setPasswordFormatValid] = useState(true)

  const sendVerificationCode = async () => {
    const email = user.emailAuth

    try {
      // Disable button and start countdown
      setButtonDisabled(true)
      let tempCountdown = 15
      setCountdown(tempCountdown)

      const timer = setInterval(() => {
        tempCountdown -= 1
        setCountdown(tempCountdown)

        if (tempCountdown <= 0) {
          clearInterval(timer)
          setButtonDisabled(false) // Re-enable button when countdown finishes
        }
      }, 1000)

      const response = await fetch(
        'http://localhost:3005/api/user/forgetPasswordEmail',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        }
      )

      if (!response.ok) throw new Error('此 email 尚未註冊成為會員')

      const { code: verificationCode } = await response.json()
      console.log(verificationCode)
      toast.success('重設密碼驗證信已寄出，請至您的信箱查看')
    } catch (error) {
      console.error(error)
      toast.error(error.message)
      setButtonDisabled(false)
    }
  }

  const validateCode = async () => {
    const email = user.emailAuth
    const validationCode = user.codeAuth

    try {
      const response = await fetch(
        'http://localhost:3005/api/user/validateResetCode',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, code: validationCode }),
        }
      )

      if (!response.ok) throw new Error('Invalid code')

      const responseValidationCode = await response.json()
      console.log(responseValidationCode)
      toast.success('驗證成功，請輸入新密碼')
      setIsCodeVerified(true)
    } catch (error) {
      console.error(error)
      toast.error('驗證碼錯誤')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newPassword = user.newPasswordAuth
    const username = user.emailAuth
    console.log(newPassword)
    if (passwordFormatValid) {
      try {
        const response = await fetch(
          'http://localhost:3005/api/user/resetPassword',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, newPassword }),
          }
        )
        if (!response.ok) throw new Error('新密碼不能與舊密碼相同')
        const updatedPassword = await response.json()
        console.log(updatedPassword)
        toast.success('密碼重設成功，請重新登入，將為您跳轉至登入頁面')
        setTimeout(() => {
          router.push('/user/signin')
        }, 5000)
      } catch (error) {
        console.error(error)
        toast.error(error.message)
      }
    }
  }

  return (
    <>
      <ToastContainer
        position="top-center"
        toastClassName={toastStyle.myToast}
      />
      <div className="background d-flex justify-content-center">
        <div className="component-all">
          <BackToMainPage />
          <div className="formBackground">
            <Form>
              <div className="px-5 py-5">
                <div className="text-white">
                  <h4 className="mainTitle-rwd">忘記密碼</h4>
                  <p className="subTitle-rwd">
                    回到
                    <Link href="/user/signin">
                      <span className="">登入</span>
                    </Link>
                    或
                    <Link href="/user/signup">
                      <span className="">註冊帳號</span>
                    </Link>
                  </p>
                </div>
                <div className="text-black mt-4">
                  <div className="mb-3">
                    <label
                      htmlFor="accountAuthEmail"
                      className="form-label sm-p text-normal-gray-light"
                    >
                      輸入你註冊會員的電子信箱
                    </label>
                    <div className="input-group">
                      <input
                        type="email"
                        className="form-control bg-normal-gray-light"
                        id="accountAuthEmail"
                        placeholder="請輸入 email"
                        name="accountAuthEmail"
                        value={user.emailAuth}
                        onChange={(e) => {
                          setUser({ ...user, emailAuth: e.target.value })
                          setIsEmailValid(isValidEmail(e.target.value))
                        }}
                      />
                      <button
                        className="btn btn-primary authButton text-white px-2 sm-p d-flex justify-content-center align-items-center"
                        onClick={(e) => {
                          e.preventDefault()
                          sendVerificationCode()
                        }}
                        disabled={buttonDisabled}
                      >
                        {buttonDisabled
                          ? `重新寄送：${countdown} 秒`
                          : '點選寄送驗證碼'}
                      </button>
                    </div>
                  </div>
                  <div
                    className={`${styles.authButtonVisible} ${
                      isEmailValid ? styles.slideOutAnimation : ''
                    } mb-3 text-black`}
                  >
                    <label
                      htmlFor="accountAuthCode"
                      className="form-label sm-p text-normal-gray-light"
                    >
                      輸入驗證碼
                    </label>
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control bg-normal-gray-light"
                        id="accountAuthCode"
                        placeholder="請輸入驗證碼"
                        name="accountAuthCode"
                        value={user.codeAuth}
                        onChange={(e) => {
                          setUser({ ...user, codeAuth: e.target.value })
                        }}
                      />
                      <button
                        className="btn btn-primary authButton text-white px-2 sm-p d-flex justify-content-center align-items-center"
                        onClick={(e) => {
                          e.preventDefault()
                          validateCode()
                        }}
                      >
                        驗證驗證碼
                      </button>
                    </div>
                  </div>
                  <div
                    className={`${styles.authButtonVisible} ${
                      isCodeVerified ? styles.slideOutAnimation : ''
                    } mb-3 text-black
                      `}
                  >
                    <label
                      htmlFor="accountAuthCode"
                      className="form-label sm-p text-normal-gray-light"
                    >
                      輸入新密碼
                    </label>
                    <div className="input-group">
                      <input
                        type="passwordVisible"
                        className="form-control bg-normal-gray-light"
                        id="accountAuthNewPassword"
                        placeholder="請輸入新密碼"
                        name="accountAuthNewPassword"
                        value={user.newPasswordAuth}
                        onChange={(e) => {
                          setUser({
                            ...user,
                            newPasswordAuth: e.target.value,
                          })
                          //checking password input formation
                          const passwordFormat =
                            /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,14}$/ //6-14 characters, at least one letter and one number
                          setPasswordFormatValid(
                            passwordFormat.test(e.target.value)
                          )
                        }}
                      />
                    </div>
                    {!passwordFormatValid && (
                      <div className="text-danger sm-p">
                        密碼須為 6-14 位數，包含數字及英文字母
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <button
                    type="submit"
                    className="btn btn-primary text-white w-100 mt-5"
                    onClick={handleSubmit}
                  >
                    重設密碼
                  </button>
                  <div className="text-center text-normal-gray-light sm-p mt-3">
                    點選重設密碼將會跳轉到登入畫面
                    <br />
                    請使用新設密碼進行登入
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
          .form-control:focus {
            box-shadow: none; // Removes the glow effect
            outline: none; // Removes the outline on focus
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
        `}
      </style>
    </>
  )
}

ForgetPassword.getLayout = function (page) {
  return <LoadingLayout title="忘記密碼">{page}</LoadingLayout>
}
