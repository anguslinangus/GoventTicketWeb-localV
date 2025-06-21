import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function EventsBar() {
  const [isHovered, setIsHovered] = useState(false)
  const [event, setEvent] = useState(1)
  const [eventImg, setEventImg] = useState(
    '/images/index-silder/ed-sheeran.jpg'
  )
  return (
    <>
      <div className="d-flex justify-content-center ">
        <div className="width-1200">
          <h4 className="mb-5 text-center">熱門活動</h4>
          <div className="d-flex events-bar">
            <div
              className="show-control d-flex flex-column"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {event === 1 && (
                <>
                  <motion.div
                    className={`show-event d-flex flex-column justify-content-between ${
                      isHovered ? 'active' : ''
                    }`}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div>
                      <div className="secondary-title h6">Ed Sheeran</div>
                    </div>
                    <motion.div
                      className="event-content"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.4, delay: 0.2 }}
                    >
                      <h6>
                        <i className="bi bi-chevron-right pe-2"></i>2024.05.31
                      </h6>
                      <h3>Ed Sheeran 紅髮艾德 2024TOUR世界巡迴演唱會</h3>
                      <hr />
                      <p>
                        紅髮艾德 Ed Sheeran
                        擁有眾多膾炙人口金曲，各項登峰造極的紀錄，今年更是解鎖英國百億串流數，成為史上第一位榮獲「Gold
                        BRIT Billion Award（全英百億級大賞）」殊榮肯定的歌手！
                      </p>
                    </motion.div>
                    <div className="gradient-overlay"></div>
                  </motion.div>
                  <Link
                    href="/product/45991162"
                    className={`event-link d-flex justify-content-between text-white ${
                      isHovered ? '' : 'hide'
                    }`}
                  >
                    <h6 className="m-0">前往詳情</h6>
                    <i
                      className={`bi bi-arrow-right text-white icon h5 m-0`}
                    ></i>
                  </Link>
                </>
              )}
              {event === 2 && (
                <>
                  <motion.div
                    className={`show-event d-flex flex-column justify-content-between ${
                      isHovered ? 'active' : ''
                    }`}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div>
                      <div className="secondary-title h6">國立台灣美術館</div>
                    </div>
                    <motion.div
                      className="event-content"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.4, delay: 0.2 }}
                    >
                      <h6>
                        <i className="bi bi-chevron-right pe-2"></i>2024.03.16
                      </h6>
                      <h3>目光之外－2024臺灣國際光影藝術節</h3>
                      <hr />
                      <p>
                        「2024臺灣國際光影藝術節」集結四年來所凝聚的展演能量為底蘊，同時回應當下的時代與環境，以「目光之外」為題，邀請國內外９組藝術家提出社會意識的流變與反思，期待透過觀看的過程，引發觀者的自我對話與探討，在光與非光之間，以過往的積累加乘當下的理解，擾動未來的更多可能。
                      </p>
                    </motion.div>
                    <div className="gradient-overlay"></div>
                  </motion.div>
                  <Link
                    href="/product/45991162"
                    className={`event-link d-flex justify-content-between text-white ${
                      isHovered ? '' : 'hide'
                    }`}
                  >
                    <h6 className="m-0">前往詳情</h6>
                    <i
                      className={`bi bi-arrow-right text-white icon h5 m-0`}
                    ></i>
                  </Link>
                </>
              )}
              {event === 3 && (
                <>
                  <motion.div
                    className={`show-event d-flex flex-column justify-content-between ${
                      isHovered ? 'active' : ''
                    }`}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div>
                      <div className="secondary-title h6">金馬影展TGHFF</div>
                    </div>
                    <motion.div
                      className="event-content"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.4, delay: 0.2 }}
                    >
                      <h6>
                        <i className="bi bi-chevron-right pe-2"></i>2024.04.12
                      </h6>
                      <h3>2024金馬奇幻影展</h3>
                      <hr />
                      <p>
                        2024金馬奇幻影展焦點導演專題推出美國兄弟檔名導柯恩兄弟的七部早期經典。適逢柯恩兄弟首部劇情長片《血迷宮（導演版）》（Blood
                        Simple Director's
                        Cut）問世40週年，影展特別邀來4K數位修復導演版本，另外還有被評選為影史百大喜劇的《扶養亞歷桑納》（Raising
                        Arizona），囊括坎城影展金棕櫚、導演、男主角三項大獎的《巴頓芬克》（Barton
                        Fink），以及他們首度榮獲奧斯卡的《冰血暴》（Fargo）和Cult片經典《謀殺綠腳趾》（The
                        Big Lebowski），好看又好聽的《霹靂高手》（O Brother,
                        Where Art
                        Thou），還有影史地位水漲船高的《黑幫龍虎門》（Miller's
                        Crossing）等精彩作品。
                      </p>
                    </motion.div>
                    <div className="gradient-overlay"></div>
                  </motion.div>
                  <Link
                    href="/product/45991162"
                    className={`event-link d-flex justify-content-between text-white ${
                      isHovered ? '' : 'hide'
                    }`}
                  >
                    <h6 className="m-0">前往詳情</h6>
                    <i
                      className={`bi bi-arrow-right text-white icon h5 m-0`}
                    ></i>
                  </Link>
                </>
              )}
            </div>
            <div className="other-events d-flex flex-column ms-3">
              <div
                className={`event-btn mb-3 ${event === 1 ? 'active' : ''}`}
                onMouseEnter={() => {
                  setEvent(1)
                  setEventImg('/images/index-silder/ed-sheeran.jpg')
                }}
              ></div>
              <div
                className={`event-btn mb-3 ${event === 2 ? 'active' : ''}`}
                onMouseEnter={() => {
                  setEvent(2)
                  setEventImg('/images/index-silder/shadowinthelight.jpg')
                }}
              ></div>
              <div
                className={`event-btn ${event === 3 ? 'active' : ''}`}
                onMouseEnter={() => {
                  setEvent(3)
                  setEventImg('/images/index-silder/ejyq59ghbkmafkstakut.jpg')
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
      <style global jsx>
        {`
          .events-bar {
            height: 400px;
            overflow: hidden;
            .show-control {
              flex: 1;
              .event-link {
                border-radius: 0 0 10px 10px;
                background-color: var(--primary-color);
                padding: 10px 30px;
                opacity: 1;
                transition: 300ms;
                height: 45px;
              }
              .event-link.hide {
                height: 0;
                padding: 0px 30px;
              }
            }
            .show-event {
              position: relative;
              flex: 1;
              padding: 30px;
              border-radius: 10px;
              background: url('${eventImg}');
              background-size: cover;
              background-position: center;
              overflow: hidden;
              .secondary-title {
                display: inline-block;
                padding: 10px 20px;
                border: 1px solid var(--normal-gray-light-color);
                border-radius: 5px;
              }
              .event-content {
                text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.5);
                z-index: 9;
              }
              .gradient-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(
                  rgba(0, 0, 0, 0) 50%,
                  rgba(0, 0, 0, 0.9)
                );
                z-index: 0;
              }
            }
            .show-event.active {
              border-radius: 10px 10px 0 0;
            }
            .other-events {
              width: 30px;
              .event-btn {
                transition: 300ms;
                flex: 1;
                background-color: var(--normal-gray-color);
                border-radius: 10px;
                display: flex;
                justify-content: center;
                align-items: center;
              }
              .event-btn.active {
                flex: 2;
                background-color: var(--normal-gray-light-color);
              }
            }
          }
        `}
      </style>
    </>
  )
}
