import React from 'react'
import Card from 'react-bootstrap/Card'

export default function EventsRecommend() {
  return (
    <>
      <div className="container width-1200">
        <div className="row justify-content-center mt-5 width-1200">
          <div className="col-sm-12 cart-area">
            <h4 className="text-white">
              <i className="bi bi-fire text-primary-light me-2"></i>為你推薦
            </h4>
            <div className="row mt-3 mb-5 gy-3">
              <div className="col-sm-3 col-12">
                <Card className="custom-card text-white bg-bg-gray">
                  <Card.Img
                    variant="top"
                    src="../images/product/list/6-17.jpg"
                    style={{
                      objectFit: 'cover',
                      width: '100%',
                      height: '178px',
                    }}
                  />
                  <Card.Body className="d-flex justify-content-between flex-column">
                    <Card.Title className="h6">原嶼伯樂 品酩饕宴</Card.Title>
                    <div className="d-flex align-items-center justify-content-between w-100 mt-5">
                      <p className="text-normal-white border border-white rounded-5 py-1 px-2">
                        課程講座
                      </p>
                      <p className="text-primary-light">NT $ 800 起</p>
                    </div>
                  </Card.Body>
                </Card>
              </div>
              <div className="col-sm-3 col-12">
                <Card className="custom-card text-white bg-bg-gray">
                  <Card.Img
                    variant="top"
                    src="../images/product/list/2-02.jpg"
                    style={{
                      objectFit: 'cover',
                      width: '100%',
                      height: '178px',
                    }}
                  />
                  <Card.Body className="d-flex justify-content-between flex-column">
                    <Card.Title className="h6">
                      HELLO KITTY 50週年特展
                    </Card.Title>
                    <div className="d-flex align-items-center justify-content-between w-100">
                      <p className="text-normal-white border border-white rounded-5 py-1 px-2">
                        展覽
                      </p>
                      <p className="text-primary-light">NT $ 300 起</p>
                    </div>
                  </Card.Body>
                </Card>
              </div>
              <div className="col-sm-3 col-12">
                <Card className="custom-card text-white bg-bg-gray">
                  <Card.Img
                    variant="top"
                    src="../images/product/list/5-03.jpg"
                    style={{
                      objectFit: 'cover',
                      width: '100%',
                      height: '178px',
                    }}
                  />
                  <Card.Body className="d-flex justify-content-between flex-column">
                    <Card.Title className="h6">
                      DKZ宰燦見面會2023台北站
                    </Card.Title>
                    <div className="d-flex align-items-center justify-content-between w-100">
                      <p className="text-normal-white border border-white rounded-5 py-1 px-2">
                        粉絲見面會
                      </p>
                      <p className="text-primary-light">NT $ 1000 起</p>
                    </div>
                  </Card.Body>
                </Card>
              </div>
              <div className="col-sm-3 col-12">
                <Card className="custom-card text-white bg-bg-gray">
                  <Card.Img
                    variant="top"
                    src="../images/product/list/1-01.jpg"
                    style={{
                      objectFit: 'cover',
                      width: '100%',
                      height: '178px',
                    }}
                  />
                  <Card.Body className="d-flex justify-content-between flex-column">
                    <Card.Title className="h6">
                      OneRepublic 共和世代 高雄巨蛋
                    </Card.Title>
                    <div className="d-flex align-items-center justify-content-between w-100">
                      <p className="text-normal-white border border-white rounded-5 py-1 px-2">
                        演唱會
                      </p>
                      <p className="text-primary-light">NT $ 800 起</p>
                    </div>
                  </Card.Body>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style global jsx>
        {`
          .width-1200 {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0;
          }
          @media screen and (max-width: 576px) {
            .width-1200 {
              width: 380px;
            }
          }
        `}
      </style>
    </>
  )
}
