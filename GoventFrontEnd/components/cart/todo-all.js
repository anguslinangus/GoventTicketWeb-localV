import React from 'react'
import Col from 'react-bootstrap/Col'
import toastStyle from '@/components/user/custom-toastify.module.css'

export default function TodoAll({
  handleToggleSelectedAll = () => {},
  cartItems,
  setCartItems,
}) {
  // console.log(cartItems)
  return (
    <>
      {cartItems && cartItems.length > 0 ? (
        <Col className="text-white d-flex align-items-center justify-content-end">
          <label className="me-4 d-flex align-items-center justify-content-end form-check-label">
            <input
              type="checkbox"
              checked={cartItems.every((v) => v.checked)}
              onChange={(e) => {
                // 切換所有的項目
                handleToggleSelectedAll(e.target.checked, 0)
              }}
              className="checkbox-large form-check-input"
            />
            <p className="ms-2 text-nowrap">全選票券</p>
            <button
              type="button"
              className="p btn d-flex justify-content-center align-items-center text-white text-nowrap"
              data-bs-toggle="modal"
              data-bs-target="#deleteall"
            >
              / <i className="bi bi-trash-fill text-primary-light mx-1 "></i>
              清空購物車
            </button>
          </label>
        </Col>
      ) : (
        ''
      )}
      {/* 吐司 */}
      <div
        className="modal fade"
        id="deleteall"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabindex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className={`${toastStyle.myToastcart} modal-content`}>
            <div className="modal-header border-0">
              <h6 className="modal-title" id="staticBackdropLabel">
                是否清空所有購物車內容?
              </h6>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary p"
                data-bs-dismiss="modal"
              >
                再考慮一下
              </button>
              <button
                type="button"
                className="btn btn-primary p text-white"
                data-bs-dismiss="modal"
                onClick={() => {
                  setTimeout(() => {
                    setCartItems([])
                  }, 650)
                }}
              >
                移除
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
