import React, { useEffect, useState } from 'react'
import { Image, Form, Row, Col } from 'react-bootstrap'
import { motion } from 'framer-motion'

import OrganizerLayout from '@/components/layout/organizer-layout'
import OrganizerTopBar from '@/components/organizer/organizer-top-bar'

export default function OrganizerEvent() {
  const [page, setPage] = useState(1)
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

useEffect(()=>{
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
        if (data.message == 'noDataFound') {
          console.log('尚未申請主辦單位')
        } else if (data.data.result[0]) {
          setPage(4)
        }
      })
      .catch((error) => console.error('Error fetching data:', error))
},[])

  useEffect(() => {
    setFormData({
      ...formData,
      organizer_type: organizerType
    });
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
      const response = await fetch('http://localhost:3005/api/organizer/add-organizer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include',
      })

      if (response.ok) {
        console.log('Organizer add successfully!')
        setPage(4)
      } else {
        console.error('Failed to update user.')
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const setPersonal = () => {
    setOrganizerType(0)
    setFormData((prevState) => ({
      ...prevState,
      owner_name: '',
      business_invoice: '',
    }))
  }

  const previousPage = () => {
    if (page > 1) {
      setPage(page - 1)
    }
  }
  const nextPage = () => {
    if (page < 3) {
      setPage(page + 1)
    }
  }

  return (
    <>
      <div className="d-flex organizer-container justify-content-center p-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          key={previousPage}
          className="organizer-main d-flex flex-column"
        >
          <Form onSubmit={handleSubmit}>
          <OrganizerTopBar title="升級主辦單位" />
          <div className="content bg-bg-gray rounded-4 p-4 h-100 d-flex flex-column justify-content-center align-items-center">
            <div className="step-window d-flex justify-content-center align-items-center">
              {page === 1 && (
                <motion.div
                  initial={{ opacity: 0, y: -30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h3>GOVENT 主辦單位條款</h3>
                  <h5>
                    歡迎您升級成為GOVENT主辦單位！請在升級前詳細閱讀以下條款：
                  </h5>
                  <hr />
                  <p>
                    主辦單位責任：升級為GOVENT主辦單位代表您願意承擔舉辦活動的責任，包括但不限於活動策劃、管理、宣傳和財務責任等。
                    <br />
                    活動內容：您需要確保您舉辦的活動內容符合當地法律法規，並且不包含任何違法、淫穢或具有攻擊性的內容。GOVENT有權對不符合要求的活動進行審查和處理。
                    <br />
                    費用支付：作為主辦單位，您需要支付GOVENT相關的活動管理費用，包括但不限於設置活動頁面、支付處理費等。
                    <br />
                    活動宣傳：您需要負責向您的目標受眾宣傳活動，GOVENT將協助您進行宣傳，但不承擔全部責任。
                    <br />
                    票務管理：您需要負責設置活動票種、定價、座位安排等票務相關事宜。GOVENT將提供相應的票務管理工具和支持。
                    <br />
                    客戶服務：作為主辦單位，您需要提供優質的客戶服務，解答參加者的問題和解決問題。
                    <br />
                    活動安全：您需要確保活動場地的安全性，並對活動期間可能發生的事故負責。
                    <br />
                    活動結算：活動結束後，GOVENT將根據您設置的票務信息進行結算，並在指定的時間內將款項轉至您的帳戶。
                    <br />
                    請您仔細閱讀以上條款，如有任何疑問，請隨時與我們的客戶服務團隊聯繫。
                    <br />
                  </p>
                </motion.div>
              )}
              {page === 2 && (
                <motion.div
                  initial={{ opacity: 0, y: -30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-center"
                >
                  <h5 className="mb-4">選擇主辦單位類型</h5>
                  <div className="d-flex">
                    <button
                      className={`text-center choice-btn btn company text-center ${organizerType === 0
                          ? 'btn-primary'
                          : 'btn-bg-gray-light'
                        }`}
                        type='button'   
                      onClick={() => {
                        setPersonal()
                      }}
                    >
                      <Image
                        src={
                          organizerType === 0
                            ? '/personal.gif'
                            : '/personal.png'
                        }
                      />
                      <h4 className="mb-4">個人</h4>
                    </button>
                    <button
                      className={`text-center choice-btn btn company ms-4 text-center ${organizerType === 1
                          ? 'btn-primary'
                          : 'btn-bg-gray-light'
                        }`}
                        type='button'
                      onClick={() => {
                        setOrganizerType(1)
                      }}
                    >
                      <Image
                        src={
                          organizerType === 1 ? '/company.gif' : '/company.png'
                        }
                      />
                      <h4 className="mb-4">公司／法人</h4>
                    </button>
                  </div>
                </motion.div>
              )}
              {page === 3 && (
                <motion.div
                initial={{ opacity: 0, y: -30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className='w-100 update-form' data-bs-theme="dark">
                  <Row>
                    <Col sm="8">
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
                    <Form.Text className='sm-p'>不可超過20字元</Form.Text>
                  </Form.Group>
                    </Col>
                    <Col sm="4">
                    <Form.Group className="mb-3" controlId="organizer_type">
                    <Form.Label>主辦單位類別</Form.Label>
                    <Form.Select
                        name="organizer_type"
                        value={formData.organizer_type}
                        className='text-normal-gray'
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
                      <Form.Group className="mb-3" controlId="business_invoice">
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
                    <Col sm="3">
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
                    <Col sm="3">
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
                    <Form.Text className='sm-p'>ex: 台南分行</Form.Text>
                  </Form.Group>
                    </Col>
                    <Col sm="6">
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
                    <Col sm="12">
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
                </div>
                </motion.div>
              )}
              {page === 4 && (
                <div className='text-center'>
                  <Image src='/success-add-organizer.webp' width={600}/>
                  <h3>您的申請正在審核中</h3>
                  <h6>約需2-3個工作天，請耐心等候</h6>
                </div>
              )}
            </div>
            <div className="text-center steps">
              <button
                className={`btn btn-primary me-3 ${page <= 1 || page > 3 ? 'd-none' : ''}`}
                type='button'
                onClick={previousPage}
              >
                上一步
              </button>
              <button className={`btn btn-primary ${page >= 3 ? 'd-none' : ''}`}
              type='button'
              onClick={nextPage}
              >
                下一步
              </button>
              <button className={`btn btn-primary ${page === 3 ? '' : 'd-none'}`}
              type='sumbit'
              >
                完成輸入，送出
              </button>
            </div>
          </div>
          </Form>
        </motion.div>
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
            border-radius: 20px;
            padding: 25px;
            width: 1200px;
            .content {
              position: relative;
            }
          }
          .step-window {
            width: 800px;
            height: 500px;
          }
          .steps {

          }
          .choice-btn {
            border-radius: 20px;
            width: 400px;
            height: 360px;
          }
          .update-form{
            .form-control,
            .form-select {
            background-color: var(--bg-gray-light-color);
            border: 1px solid var(--normal-gray-color);
            resize: none;
            &:disabled {
              background-color: var(--bg-gray-secondary-color);
            }
            &::placeholder {
              color: var(--normal-gray-color);
            }
            .form-label{
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
  return <OrganizerLayout title="升級主辦單位">{page}</OrganizerLayout>
}
