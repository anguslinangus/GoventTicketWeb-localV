import React, { useState } from 'react'

export default function PasswordVisibility() {
  // user information
  const [user, setUser] = useState({
    account: '',
    password: '',
  })

  // password visibility toggle
  const [passwordVisible, setPasswordVisible] = useState(false)

  return (
    <>
      <div className="mb-3 text-black">
        <label
          htmlFor="accountPassword"
          className="form-label sm-p text-normal-gray-light"
        >
          密碼
        </label>
        <div className="input-group">
          <input
            type={passwordVisible ? 'text' : 'password'}
            className="form-control bg-normal-gray-light"
            id="accountPassword"
            placeholder="請輸入密碼"
            name="accountPassword"
            value={user.password}
            onChange={(e) => {
              setUser({ ...user, password: e.target.value })
            }}
          />
          <button
            className={`bi ${
              passwordVisible ? 'bi-eye-fill' : 'bi-eye-slash-fill'
            } btn text-normal-gray bg-normal-gray-light`}
            onClick={() => {
              passwordVisible
                ? setPasswordVisible(false)
                : setPasswordVisible(true)
            }}
          ></button>
        </div>
      </div>
    </>
  )
}
