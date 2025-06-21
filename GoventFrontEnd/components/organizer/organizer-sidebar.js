import React from 'react'
import Image from 'next/image'
import Accordion from 'react-bootstrap/Accordion'
import Link from 'next/link'

export default function OrganizerSidebar() {
  return (
    <>
      <div className="organizer-sidebar d-flex flex-column justify-content-between">
        <div className='sticky-top'>
          <div className="d-flex justify-content-center align-items-center logo-bar">
            <Image
              src="/govent-logo.png"
              alt=""
              width={100}
              height={24}
              priority
            />
            <h6 className="m-0 ps-2">主辦中心</h6>
          </div>
          <Accordion
            defaultActiveKey="0"
            className="on-nav px-2"
            data-bs-theme="dark"
          >
            <Accordion.Item eventKey="0">
              <Accordion.Header>
                <i className="bi bi-calendar-fill pe-3 text-primary-light"></i>
                活動管理
              </Accordion.Header>
              <Accordion.Body className="py-1">
                <ul className="m-0">
                  <li>
                    <Link href="/organizer/event">活動清單</Link>
                  </li>
                  <li>
                    <Link href="/organizer/add-event">新增活動</Link>
                  </li>
                </ul>
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1">
              <Accordion.Header>
                <i className="bi bi-gear-fill pe-3 text-primary-light"></i>
                商家設定
              </Accordion.Header>
              <Accordion.Body className="py-1">
                <ul className="m-0">
                  <li>
                    <Link href="/organizer/setting">前台資訊編輯</Link>
                  </li>
                </ul>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </div>
        <div className="d-flex justify-content-center sm-p py-5 sticky-bottom">
          COPYRIGHT © 2024
          <br />
          GOVENT All rights reserved.
        </div>
      </div>
      <style global jsx>
        {`
          .organizer-sidebar {
            width: 280px;

            .logo-bar {
              height: 120px;
            }
            .on-nav {
              * {
                border: 0;
                color: white;
              }
              .accordion-body {
                background-color: var(--bg-dark-color);
                li {
                  list-style-type: none;
                  padding-bottom: 12px;
                  a {
                    transition: 0.4s;
                    &:focus,
                    &:active,
                    &:hover {
                      color: var(--primary-light-color);
                    }
                  }
                }
              }
            }
            .accordion-button {
              background-color: var(--bg-dark-color);
              box-shadow: none;
              border: 0;
              &:focus,
              &:active,
              &:hover {
                color: var(--primary-light-color);
              }
            }
            .sticky-top{
              position: sticky;
              top: 0;
            }
            .sticky-bottom{
              position: sticky;
              bottom: 0;
            }
          }
        `}
      </style>
    </>
  )
}
