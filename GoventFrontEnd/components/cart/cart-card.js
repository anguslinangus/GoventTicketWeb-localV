import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'react-bootstrap/Image'
import toastStyle from '@/components/user/custom-toastify.module.css'
import { Modal } from 'react-bootstrap'
import { imageBaseUrl } from '@/configs'

export default function CartCard({
  foundMt = () => {},
  removeItem = () => {},
  calcTotalItemstotal = 0,
  calcTotalPricetotal = 0,
  incrementOne = () => {},
  decrementOne = () => {},
  setCartItems = () => {},
  newtoggleCheckbox = () => {},
  cartItems = [],
  MerchantIds = [],
  handleToggleSelectedAll = () => {},
}) {
  const [showModal, setShowModal] = useState(false)
  // console.log(showModal)

  const checkAllChecked = (cartItems) => {
    let allUnchecked = true

    cartItems.forEach((Items) => {
      if (Items.checked) {
        allUnchecked = false
        return // 如果有一个選中了就跳出循環
      }
    })

    setShowModal(allUnchecked) // 如果所有選項都未選中，則顯示
    return !allUnchecked // 是否有任何選項被選中
  }
  // console.log(cartItems)
  // console.log(MerchantIds)
  return (
    <>
      <div className="rwd-text">
        {MerchantIds.map((v, i) => {
          return (
            <div key={i}>
              <div className="border-0 cart-card border-bottom border-normal-gray">
                <div className="d-flex align-items-center justify-content-between my-3 text-center">
                  <div className="d-flex align-items-center">
                    <input
                      type="checkbox"
                      checked={cartItems
                        .filter((v1) => v1.merchantId === v)
                        .every((v1) => v1.checked)}
                      onChange={(e) => {
                        // console.log(v)
                        handleToggleSelectedAll(e.target.checked, v)
                      }}
                      className="ms-4 checkbox-large form-check-input"
                    />
                    <div className="ms-4 text-primary-light">{foundMt(v)}</div>
                  </div>
                  <div className="me-4">
                    <i className="bi bi-chevron-right text-white"></i>
                  </div>
                </div>
              </div>
              {/* 票券 */}
              {cartItems
                .filter((item) => item.merchantId === v)
                .map((v, i) => {
                  /* 使用 split() 方法分割日期時間字串 */
                  {
                    /* const [datePart, timePart] = v.holdingTime.split(' ') */
                  }
                  return (
                    <div key={i}>
                      <div className="border-bottom border-normal-gray event">
                        <div className="border-0 cart-card row g-0 py-3">
                          <div className="col-sm-2 col-4 d-flex align-items-center ms-4">
                            <input
                              type="checkbox"
                              checked={v.checked}
                              onChange={() => {
                                // 這裡要作toggle completed狀態的動作
                                setCartItems(newtoggleCheckbox(cartItems, v.id))
                              }}
                              className="me-4 checkbox-large form-check-input"
                            />
                            <div className="bg-normal-white rounded-4 product-img">
                              <Image
                                src={`${imageBaseUrl}/banner/${v.images}`}
                                className=" rounded-start object-fit-cover"
                                alt="..."
                              />
                            </div>
                          </div>

                          <div className="col-sm-9 col-7 row">
                            <div className="card-body col-sm-8 col">
                              <h6 className="card-title card-text d-flex justify-content-between align-items-center text-white truncatetext">
                                {v.eventName}
                              </h6>
                              <p className="card-text text-primary-light mt-2">
                                {v.ticketName}
                              </p>
                              <div className="iconbar text-white d-flex align-items-center mt-2 row">
                                <div className="col-sm-6 col-12 d-flex justify-content-start align-items-center">
                                  <i className="bi bi-calendar-week text-primary-light"></i>
                                  <p className="text-white ms-2">
                                    {v.holdingTime.split(' ')[0]}
                                  </p>
                                </div>
                                <div className="col-sm-6 col-12 d-flex justify-content-start align-items-center">
                                  <i className="bi bi-clock text-primary-light"></i>
                                  <p className="text-white ms-2">
                                    {v.holdingTime.split(' ')[1]}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="col-sm-4 col row d-flex justify-content-center align-items-center pb-3 pb-sm-0">
                              <div className="col-sm-6 d-flex justify-content-start align-items-center">
                                <i className="bi bi-person-fill text-primary-light"></i>
                                <button
                                  className="btn"
                                  onClick={() => {
                                    decrementOne(cartItems, v.id)
                                  }}
                                >
                                  <i className="bi bi-dash-circle text-white"></i>
                                </button>
                                <p className="text-white">{v.qty}</p>
                                <button
                                  className="btn"
                                  onClick={() => {
                                    incrementOne(cartItems, v.id)
                                    console.log(v)
                                  }}
                                >
                                  <i className="bi bi-plus-circle text-white"></i>
                                </button>
                              </div>
                              <p className="col-sm-6 text-white">
                                NT ${parseInt(v.price).toLocaleString()}
                                /張
                              </p>
                            </div>
                          </div>
                          <div className="col-1 d-flex justify-content-center align-items-center">
                            <div className="btn me-5 me-sm-0">
                              <button
                                type="button"
                                className="p btn d-flex justify-content-center align-items-center text-white text-nowrap"
                                data-bs-toggle="modal"
                                data-bs-target={`#delete-${v.id}`}
                              >
                                <i className="bi bi-trash-fill text-primary-light me-1"></i>
                                刪除
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* 吐司 */}
                      <div
                        className="modal fade"
                        id={`delete-${v.id}`}
                        data-bs-backdrop="static"
                        data-bs-keyboard="false"
                        tabindex="-1"
                        aria-labelledby="staticBackdropLabel"
                        aria-hidden="true"
                      >
                        <div className="modal-dialog modal-dialog-centered">
                          <div
                            // className=""
                            className={`${toastStyle.myToastcart} modal-content`}
                          >
                            <div className="modal-header border-0">
                              <h6
                                className="modal-title"
                                id="staticBackdropLabel"
                              >
                                是否要移除此張票券?
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
                                    // console.log(v)
                                    // console.log(v.id)
                                    removeItem(cartItems, v.id)
                                  }, 650)
                                }}
                              >
                                移除
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
            </div>
          )
        })}
      </div>
      <div className="border-0 cart-card d-none d-sm-block">
        <div className="d-flex justify-content-end align-items-center m-4">
          <p className="text-primary-light ms-3">
            已選取 {calcTotalItemstotal} 張票券
          </p>
          <h5 className="text-white ms-3">總金額 NT {calcTotalPricetotal}</h5>
          <h6 className="btn btn-primary-deep ms-4">
            <Link
              href="/payment"
              className="text-white"
              onClick={(e) => {
                if (!checkAllChecked(cartItems)) {
                  e.preventDefault() // 阻止默认行为
                }
              }}
            >
              前往結帳
            </Link>
          </h6>
        </div>
      </div>
      {/* 吐司 */}
      <Modal
        show={showModal} // 控制模态框显示
        onHide={() => setShowModal(false)} // 点击模态框外部或关闭按钮时关闭模态框
        centered
      >
        <Modal.Header closeButton className={`${toastStyle.myToastcart}`}>
          <Modal.Title
            id="example-modal-sizes-title-lg"
            className="h4 text-primary"
          >
            注意!
          </Modal.Title>
        </Modal.Header>
        <Modal.Body closeButton className={`${toastStyle.myToastcart} `}>
          請勾選需購買的票券
        </Modal.Body>
      </Modal>
    </>
  )
}
