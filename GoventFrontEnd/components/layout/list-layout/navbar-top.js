import React, { useState, useEffect } from 'react'
// 引入活動資料
import EventCard from '@/components/layout/list-layout/event_card'
// import useEvents from '@/hooks/use-event'
// import Dropdown from 'react-bootstrap/Dropdown'

export default function NavbarTopRwdSm(props) {
  // 裝取資料設定狀態
  // const { data } = useEvents()
  // const [events, setEvents] = useState([])
  // useEffect(() => {
  //   if (data) {
  //     setEvents(data)
  //   }
  // }, [data])
  // console.log(events)//OK
  // console.log(props) //OK=>跟父元件的引入標籤做連接
  //因為是子元件，把 const pricedEvents = events.map((event) => “events”改為"props"

  //升降密元件
  function SortButton({ onSort, sortOrder }) {
    return (
      <button
        onClick={() => onSort('price')}
        className="btn no-border rounded-0 text-white"
      >
        {/* Sort {sortOrder === 'asc' ? 'Ascending' : 'Descending'} */}
        排序方式
        <i
          className={`bi ${
            sortOrder === 'asc' ? 'bi-sort-down' : 'bi-sort-up '
          } btn-primary-deep`}
        ></i>
      </button>
    )
  }
  //＊升降密排序
  // console.log(events)//OK
  const [sortOrder, setSortOrder] = useState('asc')
  const sortEvents = () => {
    // 对 events 进行处理，将 null 值替换为 0，并将所有的 price 属性转换为数字类型
    const processedEvents = props.events.map((event) => ({
      ...event,
      // price: event.price !== null ? parseFloat(event.price) : 0,
    }))
    // console.log(processedEvents) //OK
    // 执行排序逻辑
    const sortedEvents = [...processedEvents].sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.price - b.price
      } else {
        return b.price - a.price
      }
    })

    // 更新状态
    props.setEvents(sortedEvents)
    // console.log('sortedEvents:', sortedEvents) //檢視是否可以成功排序ＯＫ
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
  }
  // console.log(sortOrder) //檢查按鈕狀態OK

  //地區排序元件
  function CityButton({ onCity, CityOrder }) {
    return (
      <button
        onClick={() => onCity()}
        className={`btn ${
          cityOrder === 'asc' ? 'text-primary-deep' : 'text-white'
        }
        } pb-0 rounded-0 no-border`}
      >
        地區
      </button>
    )
  }
  //*地區排序元件
  const [cityOrder, setCityOrder] = useState('asc')
  const cityEvents = () => {
    const cityMap = {
      台北市: 1,
      新北市: 2,
      桃園市: 3,
      基隆市: 4,
      新竹市: 5,
      新竹縣: 6,
      宜蘭縣: 7,
      苗栗縣: 8,
      台中市: 9,
      南投縣: 10,
      彰化縣: 11,
      雲林縣: 12,
      嘉義縣: 13,
      嘉義市: 14,
      台南市: 15,
      高雄市: 16,
      屏東縣: 17,
      花蓮縣: 18,
      台東縣: 19,
    }

    const processedEvents = props.events.map((event) => ({
      ...event,
      // 假设城市名称存储在属性 str 中
      cityValue: cityMap[event.str] || 0, // 获取城市对应的数字值，如果城市不存在于映射中，则使用默认值 0
    }))

    const sortedEvents = [...processedEvents].sort((a, b) => {
      // 使用城市数字值进行比较
      if (cityOrder === 'asc') {
        return a.cityValue - b.cityValue
      } else {
        return b.cityValue - a.cityValue
      }
    })

    props.setEvents(sortedEvents)
    setCityOrder(cityOrder === 'asc' ? 'desc' : 'asc')
    // console.log('sortedEvents:', sortedEvents) // 检查是否可以成功排序
  }

  //*日期排序元件
  function DateButton({ onDate, dateOrder }) {
    return (
      <button
        onClick={() => onDate()}
        className={`btn ${
          dateOrder === 'asc' ? 'text-primary-deep' : 'text-white'
        }
        } pb-0 rounded-0 no-border`}
      >
        日期
      </button>
    )
  }
  //日期排序
  // console.log(events)//OK
  const [dateOrder, setDateOrder] = useState('asc')
  const dateEvents = () => {
    const datedEvents = props.events.map((event) => ({
      ...event,
      date: new Date(event.start_date).getTime(),
    }))

    const sortedEvents = [...datedEvents].sort((a, b) => {
      if (dateOrder === 'asc') {
        return a.date - b.date
      } else {
        return b.date - a.date
      }
    })
    props.setEvents(sortedEvents)
    setDateOrder(dateOrder === 'asc' ? 'desc' : 'asc')
    // console.log('sortedEvents:', sortedEvents) //檢視是否可以成功排序ＯＫ
  }

  //價格排序元件
  const priceSortedEvents = () => {
    const dataToSend = 'Data from child component'
    props.onPrice(dataToSend)
  }

  function PriceButton({ onPrice, PriceOrder }) {
    return (
      <button
        onClick={() => {
          priceEvents()
          onPrice(props.events)
        }}
        className={`btn ${
          priceOrder === 'asc' ? 'text-primary-deep' : 'text-white'
        } pb-0 rounded-0 no-border`}
      >
        價格
      </button>
    )
  }
  //*價格排序元件
  const [priceOrder, setPriceOrder] = useState('asc')

  const priceEvents = () => {
    // 对 events 进行处理，将 null 值替换为 0，并将所有的 price 属性转换为数字类型
    //**將props.map改為props.events.map來解析回傳後的內容
    const pricedEvents = props.events.map((event) => ({
      ...event,
      price: event.price !== null ? parseFloat(event.price) : 0,
    }))

    // 执行排序逻辑
    const sortedEvents = [...pricedEvents].sort((a, b) => {
      if (priceOrder === 'asc') {
        return a.price - b.price
      } else {
        return b.price - a.price
      }
    })

    // 更新状态
    props.setEvents(sortedEvents)
    // console.log('sortedEvents:', sortedEvents) //檢視是否可以成功排序ＯＫ
    setPriceOrder(priceOrder === 'asc' ? 'desc' : 'asc')
  }

  return (
    <>
      <selector className="header-m d-none d-sm-block">
        <section className="d-flex justify-content- between">
          <div className="sort_icon">
            {/* <SortButton onSort={sortEvents} sortOrder={sortOrder} /> */}
            <SortButton onSort={sortEvents} sortOrder={sortOrder} />
          </div>

          <div className="d-flex">
            <div
              style={
                {
                  // backgroundColor: activeButton2 === 0 ? '#151515' : '#c55708',
                  // borderBottom:
                  //   activeButton === 0
                  //     ? '3px solid #c55708'
                  //     : '3px solid #151515',
                }
              }
            >
              <button
                className={`btn text-primary-deep 
                pb-0 rounded-0 no-border`}
              >
                推薦
              </button>
            </div>
            <div
              style={{
                borderBottom:
                  dateOrder === 'asc'
                    ? '3px solid #c55708'
                    : '3px solid #151515',
              }}
            >
              <DateButton onDate={dateEvents} dateOrder={dateOrder} />
            </div>
            <div
              style={{
                borderBottom:
                  priceOrder === 'asc'
                    ? '3px solid #c55708'
                    : '3px solid #151515',
              }}
            >
              <PriceButton onPrice={priceEvents} priceOrder={priceOrder} />
            </div>
            <div
              style={{
                borderBottom:
                  cityOrder === 'asc'
                    ? '3px solid #c55708'
                    : '3px solid #151515',
              }}
            >
              {/* <CityButton onCity={cityEvents} cityOrder={cityOrder} /> */}
              <CityButton onCity={cityEvents} cityOrder={cityOrder} />
            </div>
          </div>
        </section>
      </selector>
    </>
  )
}
