import React from 'react'
import Image from 'next/image'
import Accordion from 'react-bootstrap/Accordion'
import Link from 'next/link'

export default function OrganizerEventSidebar() {
  return (
    <>
      <div className="organizer-sidebar d-flex flex-column justify-content-between">
        <div>
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
          <div className='ms-4 ps-1 mb-4 mt-2'>
            <Link href="/organizer/event" className="text-link">
              <i className="bi bi-arrow-left pe-3 text-primary-light"></i>
              返回列表
            </Link>
          </div>
          <div className='ms-4 ps-1 mb-4'>
            <Link href="event-info" className="text-link">
              <i className="bi bi-speedometer pe-3 text-primary-light"></i>
              活動資訊總覽
            </Link>
          </div>
          <div className='ms-4 ps-1'>
            <Link href="ticket" className="text-link">
              <i className="bi bi-ticket-detailed-fill pe-3 text-primary-light"></i>
              票卷管理
            </Link>
          </div>
          
        </div>
        <div className="d-flex justify-content-center sm-p py-5">
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
          }
        `}
      </style>
    </>
  )
}
