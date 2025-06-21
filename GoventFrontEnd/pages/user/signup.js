import BackToMainPage from '@/components/user/backToMainPage'
import { counties, townships, postcodes } from '@/data/township'
import React, { useState } from 'react'
import Link from 'next/link'
import LoadingLayout from '@/components/layout/loading-layout'
import { useRouter } from 'next/router'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import toastStyle from '@/components/user/custom-toastify.module.css'

export default function Signup() {
  const router = useRouter()

  const [user, setUser] = useState({
    username: '',
    password: '',
    name: '',
    gender: '',
    birthday: '',
    cellphone: '',
    county: '',
    township: '',
    address: '',
  })

  const [countyIndex, setCountyIndex] = useState(-1)
  const [townshipIndex, setTownshipIndex] = useState(-1)

  //password visibility toggle
  const [passwordVisibility, setPasswordVisible] = useState(false)

  //checkbox agree terms
  const [termsAgreed, setTermsAgreed] = useState(false)

  //checking each input are correctly formatted
  const [usernameFormatValid, setUsernameFormatValid] = useState(true)
  const [phoneFormatValid, setPhoneFormatValid] = useState(true)
  const [passwordFormatValid, setPasswordFormatValid] = useState(true)
  const [birthdayFormatValid, setBirthdayFormatValid] = useState(true)

  //function for birthday checking
  const validateAge = (birthday) => {
    const today = new Date()
    const birthDate = new Date(birthday)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDifference = today.getMonth() - birthDate.getMonth()

    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--
    }

    setBirthdayFormatValid(age >= 18)
  }

  // checking all information are filled
  const [isAllFieldsFilled, setIsAllFieldsFilled] = useState(true)

  const handleSubmit = (e) => {
    e.preventDefault() //阻止表單送出

    const checkFieldsFilled =
      Object.values(user).every((field) => field) && termsAgreed

    if (
      usernameFormatValid &&
      phoneFormatValid &&
      passwordFormatValid &&
      birthdayFormatValid &&
      checkFieldsFilled
    ) {
      console.log({ user, countyIndex, townshipIndex })
    } else {
      setIsAllFieldsFilled(checkFieldsFilled)
      console.log('尚未註冊完成')
    }

    const formData = {
      username: user.username,
      password: user.password,
      name: user.name,
      gender: user.gender,
      birthday: user.birthday,
      cellphone: user.cellphone,
      county: user.county,
      township: user.township,
      address: user.address,
    }
    console.log(formData)

    let url = 'http://localhost:3005/api/user/signup'
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
      credentials: 'include',
    })
      .then((response) => {
        if (!response.ok) {
          // Directly throwing the response to be handled in the catch block
          throw response
        }
        return response.json()
      })
      .then((data) => {
        // Handle success
        console.log('Success:', data)
        toast.success('註冊成功，即將跳轉至登入頁面')
        setTimeout(() => {
          router.push('/user/signin')
        }, 5000)
      })
      .catch((errorResponse) => {
        // Handle HTTP errors
        if (errorResponse instanceof Response) {
          errorResponse
            .json()
            .then((errorData) => {
              console.log(
                'Error:',
                errorData.message || `Status: ${errorResponse.status}`
              )
            })
            .catch(() => {
              // Handle case where error response cannot be parsed as JSON
              console.log('Error: ', errorResponse.statusText)
            })
        } else {
          // Handle other errors (e.g., network error)
          console.log('Error: ', errorResponse.message)
        }
      })
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
            <form onSubmit={handleSubmit} method="post">
              <div className="px-5 py-5">
                <div className="text-white">
                  <h4 className="mainTitle-rwd">註冊帳號</h4>
                  <p className="text-normal-gray-light subTitle-rwd">
                    已經有帳號？
                    <Link href="/user/signin">點擊登入</Link>
                  </p>
                </div>
                <div className="registerForm">
                  {/* 帳號密碼 */}
                  <div className="text-black mt-3 row justify-content-between">
                    <div className="mb-3 col-sm-6 col-12">
                      <label
                        htmlFor="accountEmail"
                        className="form-label sm-p text-normal-gray-light"
                      >
                        email 帳號
                      </label>
                      <input
                        type="email"
                        className="form-control bg-normal-gray-light"
                        id="accountEmail"
                        name="accountEmail"
                        placeholder="請輸入 email 帳號"
                        value={user.username}
                        onChange={(e) => {
                          const value = e.target.value
                          setUser({ ...user, username: value })
                          // get input whether is correctly formatted or not, then return true or false
                          const emailFormat = /\S+@\S+\.\S+/
                          setUsernameFormatValid(emailFormat.test(value))
                        }}
                      />
                      {!usernameFormatValid && (
                        <div className="text-danger sm-p">
                          請輸入正確 Email 格式
                        </div>
                      )}
                    </div>
                    <div className="mb-3 text-black col-sm-6 col-12">
                      <label
                        htmlFor="accountPassword"
                        className="form-label sm-p text-normal-gray-light"
                      >
                        密碼
                      </label>
                      <div className="input-group">
                        <input
                          type={passwordVisibility ? 'password' : 'text'}
                          className="form-control bg-normal-gray-light"
                          id="accountPassword"
                          name="accountPassword"
                          placeholder="請輸入密碼"
                          value={user.password}
                          onChange={(e) => {
                            const value = e.target.value
                            setUser({ ...user, password: value })
                            //checking password input formation
                            const passwordFormat =
                              /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,14}$/ //6-14 characters, at least one letter and one number
                            setPasswordFormatValid(passwordFormat.test(value))
                          }}
                        />
                        <button
                          className={`bi ${
                            passwordVisibility
                              ? 'bi-eye-fill'
                              : 'bi-eye-slash-fill'
                          } btn text-normal-gray bg-normal-gray-light`}
                          onClick={(e) => {
                            e.preventDefault()
                            passwordVisibility
                              ? setPasswordVisible(false)
                              : setPasswordVisible(true)
                          }}
                        ></button>
                      </div>
                      {!passwordFormatValid && (
                        <div className="text-danger sm-p">
                          密碼須為 6-14 位數，包含數字及英文字母
                        </div>
                      )}
                    </div>
                  </div>
                  {/* 姓名性別出身年月日 */}
                  <div className="text-black row justify-content-between">
                    <div className="mb-3 col-sm-4 col-8">
                      <label
                        htmlFor="accountName"
                        className="form-label sm-p text-normal-gray-light"
                      >
                        姓名
                      </label>
                      <input
                        type="text"
                        className="form-control bg-normal-gray-light"
                        id="accountName"
                        placeholder="請輸入姓名"
                        name="accountName"
                        value={user.name}
                        onChange={(e) => {
                          setUser({ ...user, name: e.target.value })
                        }}
                      />
                    </div>
                    <div className="mb-3 col-sm-2 col-4">
                      <label
                        htmlFor="accountSex"
                        className="form-label sm-p text-normal-gray-light"
                      >
                        性別
                      </label>
                      <select
                        className="form-select bg-normal-gray-light"
                        id="accountSex"
                        name="accountSex"
                        value={user.gender}
                        onChange={(e) =>
                          setUser({ ...user, gender: e.target.value })
                        }
                      >
                        <option className="bg-normal-gray-light" value="">
                          請選擇
                        </option>
                        <option className="bg-normal-gray-light" value="0">
                          女
                        </option>
                        <option className="bg-normal-gray-light" value="1">
                          男
                        </option>
                      </select>
                    </div>
                    <div className="mb-3 text-black col-sm-6 col-12">
                      <label
                        htmlFor="accountBirth"
                        className="form-label sm-p text-normal-gray-light"
                      >
                        出身年月日
                      </label>
                      <div className="input-group">
                        <input
                          type="date"
                          className="form-control bg-normal-gray-light"
                          id="accountBirth"
                          placeholder="請選擇"
                          name="accountBirth"
                          value={user.birthday}
                          onChange={(e) => {
                            const newBirthday = e.target.value
                            setUser({ ...user, birthday: newBirthday })
                            validateAge(newBirthday)
                          }}
                        />
                      </div>
                      {!birthdayFormatValid && (
                        <div className="text-danger sm-p">
                          必須年滿 18 歲才能註冊
                        </div>
                      )}
                    </div>
                  </div>
                  {/* 手機 */}
                  <div className="text-black row justify-content-between">
                    <div className="mb-3 col-sm-6 col-12">
                      <label
                        htmlFor="accountCellphone"
                        className="form-label sm-p text-normal-gray-light"
                      >
                        手機
                      </label>
                      <input
                        type="phone"
                        className="form-control bg-normal-gray-light"
                        id="accountCellphone"
                        placeholder="請輸入手機號碼"
                        name="accountCellphone"
                        value={user.cellphone}
                        onChange={(e) => {
                          const value = e.target.value
                          setUser({ ...user, cellphone: value })
                          //checking phone input formation
                          const phoneFormat = /^09\d{8}$/
                          setPhoneFormatValid(phoneFormat.test(value))
                        }}
                      />
                      {!phoneFormatValid && (
                        <div className="text-danger sm-p">
                          手機須以 09 開頭，長度 10 位數字
                        </div>
                      )}
                    </div>
                  </div>
                  {/* 縣市鄉鎮地址 */}
                  <div className="text-black row justify-content-between">
                    <div className="mb-3 col-sm-3 col-6">
                      <label
                        htmlFor="accountCounty"
                        className="form-label sm-p text-normal-gray-light"
                      >
                        居住縣市
                      </label>
                      <select
                        className="form-select bg-normal-gray-light"
                        id="accountCounty"
                        name={countyIndex}
                        onChange={(e) => {
                          const selectedIndex = e.target.selectedIndex // 獲取選中項目的索引
                          const selectedOption = e.target.options[selectedIndex] // 獲取選中的<option>
                          const county = selectedOption.getAttribute('data-c') // 從選中的<option>獲取data-c屬性的值
                          setCountyIndex(Number(e.target.value))
                          setUser({ ...user, county: county })
                        }}
                      >
                        <option className="bg-normal-gray-light" value={-1}>
                          請選擇縣市
                        </option>
                        {counties.map((v, i) => {
                          return (
                            <option key={i} value={i} data-c={v}>
                              {v}
                            </option>
                          )
                        })}
                      </select>
                    </div>
                    <div className="mb-3 col-sm-3 col-6">
                      <label
                        htmlFor="accountDistrict"
                        className="form-label sm-p text-normal-gray-light"
                      >
                        鄉鎮區
                      </label>
                      <select
                        className="form-select bg-normal-gray-light"
                        id="accountDistrict"
                        name="accountDistrict"
                        value={townshipIndex}
                        onChange={(e) => {
                          const selectedIndex = e.target.selectedIndex // 獲取選中項目的索引
                          const selectedOption = e.target.options[selectedIndex] // 獲取選中的<option>
                          const township = selectedOption.getAttribute('data-t') // 從選中的<option>獲取data-c屬性的值
                          setTownshipIndex(Number(e.target.value))
                          setUser({ ...user, township: township })
                        }}
                      >
                        <option className="bg-normal-gray-light" value={-1}>
                          請選擇鄉鎮區
                        </option>
                        {countyIndex > -1 &&
                          townships[countyIndex].map((v, i) => {
                            return (
                              <option key={i} value={i} data-t={v}>
                                {v}
                              </option>
                            )
                          })}
                      </select>
                    </div>
                    <div className="mb-3 text-black col-sm-6 col-12">
                      <label
                        htmlFor="accountAddress"
                        className="form-label sm-p text-normal-gray-light"
                      >
                        詳細地址
                      </label>
                      <div className="input-group">
                        <input
                          type="text"
                          className="form-control bg-normal-gray-light"
                          id="accountAddress"
                          placeholder="請輸入地址"
                          name="accountAddress"
                          value={user.address}
                          onChange={(e) => {
                            setUser({ ...user, address: e.target.value })
                          }}
                        />
                        <i className="bi bi-pin-map border-0 address btn text-normal-gray bg-normal-gray-light"></i>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mb-3 form-check d-flex justify-content-center align-items-center registerDeclaration">
                  <div className="d-flex align-items-center">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="agreeTerms"
                      checked={termsAgreed}
                      onChange={(e) => {
                        setTermsAgreed(e.target.checked)
                      }}
                    />
                    <label className="form-check-label" htmlFor="agreeTerms">
                      <div className=" text-white sm-p px-2">
                        我已閱讀並同意
                        <span className="text-primary">會員註冊條款</span>
                      </div>
                    </label>
                  </div>
                </div>
                <div className="registerButton">
                  <button
                    type="submit"
                    className="btn btn-primary text-white w-100"
                  >
                    註冊
                  </button>
                </div>
                {!isAllFieldsFilled && (
                  <div className="text-danger text-center">
                    所有資訊都必須填寫，並同意條款
                  </div>
                )}
              </div>
            </form>
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
            select {
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
            @media screen and (max-width: 435px){
              margin-top: 30px;
            }
          }
          .formBackground {
            border-radius: 10px;
            width: 720px;
            height: 620px;
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
              border-radius: none;
              width: 430px;
            }
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

          .registerForm {
            @media screen and (max-width: 435px) {
              max-width: 430px;
            }
          }

          .registerDeclaration {
            @media screen and (max-width: 435px) {
              max-width: 430px;
            }
          }

          .registerButton {
            @media screen and (max-width: 435px) {
              max-width: 430px;
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
          .btn-primary {
            border-radius: 5px;
          }
          .bi-eye-fill {
            border-radius: 5px;
            opacity: 0.5;
          }
          .bi-pin-map {
            border-radius: 5px;
            opacity: 0.5;
          }
        `}
      </style>
    </>
  )
}

Signup.getLayout = function (page) {
  return <LoadingLayout title="註冊">{page}</LoadingLayout>
}
