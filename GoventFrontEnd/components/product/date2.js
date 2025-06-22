import React, { useState, useEffect } from 'react'

// chunk - 依size分成子陣列，ex. chunk([1, 2, 3, 4, 5], 2) -> [[1,2],[3,4],[5]]
const chunk = (arr, size) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
    arr.slice(i * size, i * size + size)
  )

export default function Calendar({ events, sellStartDate = '', sellEndDate = '' }) {

  //const [events, setEvents] = useState([])

  // useEffect(() => {
  //   fetchEventData()
  // }, [])

  // const fetchEventData = async (params) => {
  //   const searchParams = new URLSearchParams(params)
  //   try {
  //     const res = await fetch(`http://localhost:3005/api/info?${searchParams}`)
  //     const eventData = await res.json()
  //     setEvents(eventData) // 將獲取的資料存入狀態中
  //   } catch (error) {
  //     console.error('獲取資料時發生錯誤:', error)
  //   }
  // }

  // 一開始未選中日期
  const [myDate, setMyDate] = useState(0)

  //設定售票起始日
  const now = new Date()

  console.log(new Date(sellStartDate))
  console.log(sellStartDate)
  console.log(sellEndDate);
  


  // 要得到今天的西元年使用Date物件的getFullYear()，要得到月份使用getMonth()(注意回傳為 0~11)
  const nowY = now.getFullYear()

  // nowM =1-12
  const nowM = now.getMonth() + 1 //注意回傳為 0~11
  const preM = now.getMonth() - 1 //注意回傳為 0~11

  // nowD
  const nowD = now.getDate() //注意回傳為 0~11

  // 星期
  const weekDayList = ['日', '一', '二', '三', '四', '五', '六']

  // 本月有幾天
  // (上個月的最後一天是幾號)
  const days = new Date(nowY, nowM, 0).getDate()

  // 這個月的第一天是星期幾(0-6) (月份為0-11)
  const firstDay = new Date(nowY, nowM - 1, 1).getDay()

  //------ 以下開始產生資料陣列
  // 最前面塞入空白字串的陣列
  const emptyData = Array(firstDay).fill('')

  // 有值的陣列1 ~ days
  // 如何建立一個陣列包含1...N數字
  const valueData = Array(days)
    .fill('')
    .map((v, i) => i + 1)

  // 合併兩陣列為一長陣列
  const allData = [...emptyData, ...valueData]
  //------ 以下準備呈現在網頁上
  const allDataChunks = chunk(allData, 7)

  const handleDateClick = (item) => {
    setMyDate(item);
  }
  

  return (
    <>
      <div className="calendar">
        <div className="d-flex subtitle justify-content-around align-items-center">
          <h5 id="yearAndMonth" className="col-4">{`${nowY}`}</h5>
          <h5 id="yearAndMonth" className="col-4">{`${nowM}月`}</h5>
          <div className="d-flex pb-1">
            <button className="leftBtn">
              <i className="bi bi-caret-left-fill"></i>
            </button>
            <div className="month"></div>
            <button className="rightBtn">
              <i className="bi bi-caret-right-fill"></i>
            </button>
          </div>
        </div>

        <table border="1">
          <thead id="title">
            <tr>
              {weekDayList.map(function (v, i) {
                return <th key={i}>{v}</th>
              })}
            </tr>
          </thead>
          <tbody id="data">

            {allDataChunks.map((v, i) => {
              return (
                <tr key={i}>
                  {v.map((item, idx) => {
                    const currentDate = new Date(nowY, nowM - 1, item);
        const isSelectable = currentDate >= new Date(sellStartDate) && currentDate <= new Date(sellEndDate);

                    return (
                      <td
                        key={idx}
                        onClick={() => {
                          handleDateClick(item)
                        }}
                        // className={`${new Date(`${nowY}-${nowM}-${item}`) >= new Date(sellStartDate) && new Date(`${nowY}-${nowM}-${item}`) <= new Date(sellEndDate) ? 'selectable' : ''}`}
                        className={isSelectable ? 'selectable' : ''}
                        style={{ cursor: 'pointer' }}
                        role="presentation"
                      >
                        {item}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
            {/* {allDataChunks.map((v, i) => {
              return (
                <tr key={i}>
                  {v.map((item, idx) => (
                    <td
                      key={idx}
                      onClick={() => {
                        if (item) setMyDate(item)
                      }}
                      className={`${nowD === item ? 'today' : ''} ${
                        myDate === item ? 'chosen-date' : ''
                      }`}
                      style={{ cursor: 'pointer' }}
                      role="presentation"
                    >
                      {item}
                    </td>
                  ))}
                </tr>
              )
            })} */}
          </tbody>
        </table>
      </div>
      <style jsx>
        {`
          .selectable {
            background-color: #ff6600;
          }
          .calendar {
            padding-top: 5px;
            background-color: #323232;
            border-radius: 10px;
          }
          .subtitle {
            padding: 10px;
            border-bottom: 1px solid white;
          }

          table {
            width: 400px;
            height: 250px;
            background-color: #323232;
            border: none;
            border-radius: 10px;
            margin-top: 10px;
          }

          .today {
            background-color: DarkOrange;
          }

          .chosen-date {
            background-color: coral;
          }

          .leftBtn {
            font-size: 24px;
            font-weight: bold;
            cursor: pointer;
            color: #fff;
            border: none;
            background: none;
          }

          .rightBtn {
            font-size: 24px;
            font-weight: bold;
            cursor: pointer;
            color: #fff;
            border: none;
            background: none;
          }

          @media screen and (max-width: 576px) {
            .calendar {
              border: 1px solid white;
              border-radius: 10px;
            }
            table {
              border-radius: 10px;
              margin-top: 10px;
            }
          }
        `}
      </style>
    </>
  )
}
