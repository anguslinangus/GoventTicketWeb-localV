import React, { useState } from 'react'
import Form from 'react-bootstrap/Form'
import Link from 'next/link'
import { motion } from 'framer-motion'

import OrganizerLayout from '@/components/layout/organizer-layout'
import OrganizerSidebar from '@/components/organizer/organizer-sidebar'
import OrganizerTerms from '@/components/organizer/organizer-terms'
import OrganizerTopBar from '@/components/organizer/organizer-top-bar'

export default function OrganizerAddEvent() {
  const [isChecked, setIsChecked] = useState(false)

  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked)
  }

  return (
    <>
      <div className="d-flex organizer-container">
        <OrganizerSidebar />
        <div className="w-100 bg-bg-gray organizer-main d-flex flex-column">
          <OrganizerTopBar title="新增活動" />
          <div className="on-main d-flex flex-column align-items-center justify-content-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="d-flex flex-column align-items-center justify-content-center"
            >
              <h5 className="mb-4">活動上架規範同意書</h5>
              <div className="p-4 border border-normal-gray rounded-4 terms-container mb-3">
                <OrganizerTerms />
              </div>
              <Form.Check // prettier-ignore
                className="mb-3"
                type="checkbox"
                id="1"
                checked={isChecked}
                onChange={handleCheckboxChange}
                label={`本人已詳細閱讀，並同意以上條款`}
              />
              <div className={`mt-3 fake-height`}>
                <Link href="add-event/form">
                  <motion.button
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`btn btn-primary next-step ${
                      isChecked ? 'checked' : ''
                    }`}
                  >
                    <h6 className="m-0">開始新增</h6>
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      <style global jsx>
        {`
          body {
            background-color: var(--bg-dark-color);
            color: var(--normal-white-color);
          }
          .sm-p {
            color: var(--normal-gray-light-color);
          }
          .organizer-container {
            width: 100%;
            min-height: 100vh;
          }
          .organizer-main {
            border-radius: 30px 0 0 30px;
            padding: 25px;
            height: 100vh;
          }
          .on-main {
            background-color: var(--bg-gray-secondary-color);
            border-radius: 10px;
            flex: 1;
          }
          .terms-container {
            width: 1000px;
            height: 500px;
            overflow: scroll;
          }
          .fake-height {
            height: 50px;
          }
          .next-step {
            display: none;
            transition: 300ms;
          }
          .next-step.checked {
            display: block;
          }
        `}
      </style>
    </>
  )
}

OrganizerAddEvent.getLayout = function (page) {
  return <OrganizerLayout>{page}</OrganizerLayout>
}
