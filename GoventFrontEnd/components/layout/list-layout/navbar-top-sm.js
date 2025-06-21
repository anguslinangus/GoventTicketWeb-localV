import React, { useState } from 'react'
// import Dropdown from 'react-bootstrap/Dropdown'


export default function NavbarTopRwdSm(props) {
  const [activeButton, setActiveButton] = useState(2)

  // const [activeButton2, setSelectedOption] = useState(0)
  const handleClick = (buttonIndex) => {
    setActiveButton(buttonIndex)
  }
  const handleClickChang = () => {
    setActiveButton(activeButton === 0 ? 1 : 0)
  }

  //升降密元件
  const [recommendOrder, setRecommendOrder] = useState('')
  function SortButton({ onSort, sortOrder }) {
    return (
      <button
        className={`col-3 btn ${
          activeButton === 3 ? 'text-primary-deep' : 'text-white'
        }`}
        onClick={(sortOrder) => handleClick(3)}
      >
        <i className="bi bi-tags fs-5"></i>
        <div className="sm-p">推薦</div>
      </button>
    )
  }
  const [sortOrder, setSortOrder] = useState('asc')
  const sortEvents = () => {
    // 对 events 进行处理，将 null 值替换为 0，并将所有的 price 属性转换为数字类型
    const processedEvents = props.events.map((event) => ({
      ...event,
      pid: event.pid !== null ? parseFloat(event.pid) : 0,
    }))
    // console.log(processedEvents) //OK
    // 执行排序逻辑
    const sortedEvents = [...processedEvents].sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.pid - b.pid
      } else {
        return b.pid - a.pid
      }
    })

    // 更新状态
    props.setEvents(sortedEvents)
    // console.log('sortedEvents:', sortedEvents) //檢視是否可以成功排序ＯＫ
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
  }

  //地區排序元件
  function CityButton({ onCity, CityOrder }) {
    return (
      <button
        className={`col-3 btn  ${
          activeButton === 0 ? 'text-primary-deep ' : 'text-white'
        }`}
        onClick={() => handleClick(0)}
      >
        <i className="bi bi-map fs-5"></i>
        <div className="sm-p">地圖</div>
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
        className={`col-3 btn ${
          activeButton === 1 ? 'text-primary-deep' : 'text-white'
        }`}
        onClick={() => handleClick(1)}
      >
        <i className="bi bi-calendar2-event fs-4"></i>
        <div className="sm-p">日期</div>
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
        className={`col-3 btn ${
          activeButton === 2 ? 'text-primary-deep' : 'text-white'
        }`}
        onClick={() => handleClick(2)}
      >
        <i className="bi bi-currency-dollar fs-5"></i>
        <div className="sm-p">價格</div>
      </button>
    )
  }
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
      <section className="header d-sm-none d-block ">
        <CityButton onCity={props.onCityEvents} CityOrder={cityOrder} />

        {/* <button
          className={`col-3 btn ${
            activeButton === 1 ? 'text-primary-deep' : 'text-white'
          }`}
          onClick={() => handleClick(1)}
        >
          <i className="bi bi-sliders fs-4"></i>
          <div className="sm-p">類別</div>
        </button> */}
        <DateButton onDate={props.onDateEvents} dateOrder={dateOrder} />
        <PriceButton onPrice={props.onPriceEvents} PriceOrder={priceOrder} />

        <SortButton
          onSort={props.onRecommendEvents}
          sortOrder={recommendOrder}
        />
      </section>
    </>
  )
}
