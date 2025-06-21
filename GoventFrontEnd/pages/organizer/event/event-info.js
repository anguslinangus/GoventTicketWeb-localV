import React, { useState } from 'react'
import OrganizerLayout from '@/components/layout/organizer-layout'
import OrganizerEventSidebar from '@/components/organizer/organizer-event-sidebar'
import OrganizerTopBar from '@/components/organizer/organizer-top-bar'
import { Row, Col } from 'react-bootstrap'
import { motion } from 'framer-motion'

export default function OrganizerEvent() {
  const [selectedButton, setSelectedButton] = useState(1)

  const handleRadioChange = (value) => {
    setSelectedButton(value)
  }

  return (
    <>
      <div className="d-flex organizer-container">
        <OrganizerEventSidebar />
        <div className="w-100 bg-bg-gray organizer-main d-flex flex-column">
          <OrganizerTopBar title="活動資訊總覽" />
          <div className='p-4'>
            <Row className="gx-4">
              <Col sm="6">
                <div className="object-fit">
                  <img src="https://i.kfs.io/article5_cover/global/9415739v2/fit/800x420.jpg" />
                </div>
                <Row className='mt-4'>
                  <Col sm="3">
                    <div className="control-bgc">
                      
                      <div className="text-center py-4">
                        <h4>
                          <i className="bi bi-lightning-fill text-success"></i>
                        </h4>
                        <h4>上架中</h4>
                      </div>
                    </div>
                  </Col>
                  <Col sm="3">
                    <div className="control-bgc">
                      
                      <div className="text-center py-4">
                        <h4>
                          <i className="bi bi-bookmark-fill text-normal-gray-light"></i>
                        </h4>
                        <h4>926</h4>
                      </div>
                    </div>
                  </Col>
                  <Col sm="3">
                    <div className="control-bgc ratio ratio-1x1">
                      
                      <div className="text-center py-4">
                        <h4>2,412</h4>
                      </div>
                    </div>
                  </Col>
                  <Col sm="3">
                    <div className="control-bgc d-flex align-items-center h-100">
                      <div className="text-center">
                        <h4>7,718,400</h4>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Col>
              <Col sm="6">
                <div>
                  <h4>
                    YOASOBI演唱會2024台北站｜YOASOBI ASIA TOUR
                    2023-2024 Solo Concert in Taipei
                  </h4>
                  <div className='sm-p mb-3 pb-1'>活動編號：33169126</div>
                  <div className="d-flex align-items-center">
                    <p className="me-3 tabs">活動地點</p>
                    <div>
                      <h6 className="m-0">ZAPP TAIPEI</h6>
                      <p className='sm-p'>台北市中正區中山南路21號</p>
                    </div>
                  </div>
                </div>
                <hr className='my-3' />
                <div className="d-flex align-items-center mb-3">
                  <p className="me-3 tabs">活動類別</p>
                  <h6 className="m-0">演唱會</h6>
                </div>
                <div className="d-flex align-items-center mb-3">
                  <p className="me-3 tabs">活動時間</p>
                  <h6 className="m-0">2024/01/21 12:00 － 2024/01/22 12:00</h6>
                </div>
                <div className="d-flex align-items-center">
                  <p className="me-3 tabs">售票時間</p>
                  <h6 className="m-0">2024/01/21 12:00 － 2024/01/22 12:00</h6>
                </div>
              </Col>
            </Row>

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
          .control-bgc {
            background-color: var(--bg-gray-secondary-color);
            border-radius: 10px;
          }
          .p-20 {
            padding: 20px;
          }
          .object-fit {
            border-radius: 10px;
            overflow: hidden;
            img {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
          }
          .tabs{
            background-color: var(--bg-gray-secondary-color);
            padding: 7px 10px;
            border-radius: 5px;
            color: var(--normal-gray-light-color);
          }
        `}
      </style>
    </>
  )
}

OrganizerEvent.getLayout = function (page) {
  return <OrganizerLayout>{page}</OrganizerLayout>
}
