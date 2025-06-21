import React, { useEffect, useState } from 'react'
import { Row, Col, Form } from 'react-bootstrap'
import { motion } from 'framer-motion'

import OrganizerLayout from '@/components/layout/organizer-layout'
import OrganizerSidebar from '@/components/organizer/organizer-sidebar'
import OrganizerTopBar from '@/components/organizer/organizer-top-bar'

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

export default function OrganizerEvent() {
  const [organizerType, setOrganizerType] = useState(0)
  const [formData, setFormData] = useState({
    organizer_type: '',
    name: '',
    bank_code: '',
    bank_branch: '',
    bank_name: '',
    amount_number: '',
    owner_name: '',
    business_invoice: '',
  })

  const successSwal = () => {
    withReactContent(Swal)
    .fire({
      icon: 'success',
      title: '更新成功',
    })
    .then((result) => {
        if (result.isConfirmed) {
            getOrgainzer()
        }
      })
    
  }

const getOrgainzer = () => {
    fetch('http://localhost:3005/api/organizer/', {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
      },
      credentials: 'include',
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.message)
        if (data && data.data) {
          setFormData(data.data.result[0])
          setOrganizerType(data.data.result[0].organizer_type)
        }
      })
      .catch((error) => console.error('Error fetching data:', error))
}

  useEffect(() => {
    getOrgainzer()
  }, [])

  useEffect(() => {
    setFormData({
      ...formData,
      organizer_type: organizerType,
    })
  }, [organizerType])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const titleChange = (e) => {
    const { name, value } = e.target
    if (value.length <= 20) {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }))
    }
  }

  const businessInvoiceInputChange = (e) => {
    const { name, value } = e.target
    if (/^\d*$/.test(value) && value.length <= 8) {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }))
    }
  }

  const bankCodeInputChange = (e) => {
    const { name, value } = e.target
    if (/^\d*$/.test(value) && value.length <= 3) {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }))
    }
  }

  const bankAmountInputChange = (e) => {
    const { name, value } = e.target
    if (/^\d*$/.test(value)) {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await fetch(
        'http://localhost:3005/api/organizer/update-organizer',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
          credentials: 'include',
        }
      )

      if (response.ok) {
        console.log('Organizer update successfully!')
        successSwal()
      } else {
        console.error('Failed to update user.')
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <>
      <div className="d-flex organizer-container">
        <OrganizerSidebar />
        <div className="w-100 bg-bg-gray organizer-main d-flex flex-column">
          <OrganizerTopBar title="前台資訊編輯" />
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="event-nav flex-grow-1 d-flex justify-content-center"
          >
            <div className="setting-form p-5">
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col sm="10">
                    <Form.Group className="mb-3" controlId="name">
                      <Form.Label>主辦單位名稱</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={titleChange}
                        placeholder="請填寫主辦單位名稱"
                        required
                      />
                      <Form.Text className="sm-p">不可超過20字元</Form.Text>
                    </Form.Group>
                  </Col>
                  <Col sm="2">
                    <Form.Group className="mb-3" controlId="organizer_type">
                      <Form.Label>主辦單位類別</Form.Label>
                      <Form.Select
                        name="organizer_type"
                        value={formData.organizer_type}
                        className="text-normal-gray"
                        disabled
                      >
                        <option value="0">個人</option>
                        <option value="1">公司／法人</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  {organizerType === 1 ? (
                    <>
                      <Col sm="6">
                        <Form.Group className="mb-3" controlId="owner_name">
                          <Form.Label>公司抬頭</Form.Label>
                          <Form.Control
                            type="text"
                            name="owner_name"
                            value={formData.owner_name}
                            onChange={handleInputChange}
                            placeholder="請填寫公司抬頭"
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col sm="6">
                        <Form.Group
                          className="mb-3"
                          controlId="business_invoice"
                        >
                          <Form.Label>統一編號</Form.Label>
                          <Form.Control
                            type="text"
                            name="business_invoice"
                            value={formData.business_invoice}
                            onChange={businessInvoiceInputChange}
                            placeholder="請填寫統一編號"
                            required
                          />
                        </Form.Group>
                      </Col>
                    </>
                  ) : (
                    <></>
                  )}
                  <Col sm="2">
                    <Form.Group className="mb-3" controlId="bank_code">
                      <Form.Label>銀行代碼</Form.Label>
                      <Form.Control
                        type="number"
                        name="bank_code"
                        value={formData.bank_code}
                        onChange={bankCodeInputChange}
                        placeholder="請填寫銀行代碼"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col sm="2">
                    <Form.Group className="mb-3" controlId="bank_branch">
                      <Form.Label>分行名稱</Form.Label>
                      <Form.Control
                        type="text"
                        name="bank_branch"
                        value={formData.bank_branch}
                        onChange={handleInputChange}
                        placeholder="請填寫分行名稱"
                        required
                      />
                      <Form.Text className="sm-p">ex: 台南分行</Form.Text>
                    </Form.Group>
                  </Col>
                  <Col sm="4">
                    <Form.Group className="mb-3" controlId="bank_name">
                      <Form.Label>收款帳戶名稱</Form.Label>
                      <Form.Control
                        type="text"
                        name="bank_name"
                        value={formData.bank_name}
                        onChange={handleInputChange}
                        placeholder="請填寫銀行名稱"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col sm="4">
                    <Form.Group className="mb-3" controlId="amount_number">
                      <Form.Label>收款銀行帳號</Form.Label>
                      <Form.Control
                        type="text"
                        name="amount_number"
                        value={formData.amount_number}
                        onChange={bankAmountInputChange}
                        placeholder="請填寫銀行帳號"
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <div className='d-flex justify-content-end'>
                <button className={`btn btn-primary`} type='sumbit'>
                <h6 className='m-0'>編輯完成，送出</h6>
              </button>
                </div>
              </Form>
            </div>
          </motion.div>
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
          .setting-form {
            .form-control,
            .form-select {
              background-color: var(--bg-gray-light-color);
              border: 1px solid var(--normal-gray-color);
              resize: none;
              color: white;
              &:disabled {
                background-color: var(--bg-gray-secondary-color);
              }
              &::placeholder {
                color: var(--normal-gray-color);
              }
              .form-label {
                font-size: 12px;
              }
            }
          }
        `}
      </style>
    </>
  )
}

OrganizerEvent.getLayout = function (page) {
  return <OrganizerLayout title="前台資訊編輯">{page}</OrganizerLayout>
}
