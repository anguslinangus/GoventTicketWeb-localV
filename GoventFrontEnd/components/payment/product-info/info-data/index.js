import React from 'react'
import { Image } from 'react-bootstrap'
export default function InfoData() {
  return (
    <div className="product-info d-flex mb-3 bg-bg-gray-secondary rounded-4 px-4 py-3 justify-content-around">
      <div className="product-image col-md-3 ">
        <Image
          src="/images/product/detail/info-1.png"
          alt=""
          className="rounded-3 img-thumbnail"
        />
      </div>
      <div className="product-content col-md-8 d-flex flex-column justify-content-between">
        <div className="product-title mb-1 h6">
          YOASOBI演唱會2024台北站｜YOASOBI ASIA TOUR 2023-2024 Solo Concert in
          Taipei
        </div>
        <div className="product-type mb-1 p">1F 站位</div>
        <div className="product-date d-flex ">
          <div className="date-range d-flex me-2">
            <i className="bi bi-calendar-week text-primary me-1"></i>
            <p className="d-flex align-items-center p">2024-01-21</p>
          </div>
          <div className="date-time d-flex me-2">
            <i className="bi bi-clock text-primary me-1"></i>
            <p className="d-flex align-items-center p">18:00</p>
          </div>
          <div className="product-people d-flex me-1 me-2">
            <i className="bi bi-person-fill text-primary"></i>
            <p className="d-flex align-items-center p">人數X2</p>
          </div>
        </div>
      </div>
    </div>
  )
}
