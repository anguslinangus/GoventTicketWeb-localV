/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useRef } from 'react'

export default function CheckboxInput({
  Content = '',
  inputID = '',
  change = () => {},
}) {
  function handleCheckboxChange(e) {
    const checkedValue = e.target.checked
    console.log('子元件', checkedValue)
    change(checkedValue)
  }
  return (
    <>
      <div className="">
        <div className="round d-flex">
          <label htmlFor={inputID} className="checkbox-container p">
            {Content}
            <input
              type="checkbox"
              id={inputID}
              className="input-ref"
              onChange={handleCheckboxChange}
              name={inputID}
            />
            <span className="checkmark"></span>
          </label>
        </div>
      </div>
      <style jsx>
        {`
          .checkbox-container {
            display: block;
            position: relative;
            padding-left: 25px;
            margin-bottom: 12px;
            cursor: pointer;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
          }

          /* Hide the browser's default checkbox */
          .checkbox-container input {
            position: absolute;
            opacity: 0;
            cursor: pointer;
            height: 0;
            width: 0;
          }

          /* Create a custom checkbox */
          .checkmark {
            position: absolute;
            border-radius: 30px;
            top: 2px;
            left: 0;
            height: 20px;
            width: 20px;
            background-color: #eee;
          }

          /* On mouse-over, add a grey background color */
          .checkbox-container:hover input ~ .checkmark {
            background-color: #ccc;
          }

          /* When the checkbox is checked, add a blue background */
          .checkbox-container input:checked ~ .checkmark {
            background-color: #f16e0f;
          }

          /* Create the checkmark/indicator (hidden when not checked) */
          .checkmark:after {
            content: '';
            position: absolute;
            display: none;
          }

          /* Show the checkmark when checked */
          .checkbox-container input:checked ~ .checkmark:after {
            display: block;
          }

          /* Style the checkmark/indicator */
          .checkbox-container .checkmark:after {
            left: 8px;
            top: 3.5px;
            width: 5px;
            height: 10px;
            border: solid white;
            border-width: 0 3px 3px 0;
            -webkit-transform: rotate(45deg);
            -ms-transform: rotate(45deg);
            transform: rotate(45deg);
          }
        `}
      </style>
    </>
  )
}
