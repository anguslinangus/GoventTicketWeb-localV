import React, { useEffect, useState } from 'react'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Toast from 'react-bootstrap/Toast'

export default function GoventToast({ radioValue = '', children }) {
  const [show, setShow] = useState(false)

  const toggleShow = () => {
    if (radioValue == 'creditCard') {
      setShow(true)
    } else if (radioValue == 'LinePay') {
      setShow(false)
    }
  }
  useEffect(() => {
    toggleShow()
  }, [radioValue])

  return (
    <>
      <Row>
        <Col className="my-3">
          <Toast bg="secondary" show={show} style={{ width: '100%' }}>
            <Toast.Body md={12}>{children}</Toast.Body>
          </Toast>
        </Col>
      </Row>
    </>
  )
}
