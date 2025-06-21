import React, { useState, useEffect } from 'react'
import 'react-datepicker/dist/react-datepicker.css'
import EventsRecommend from '@/components/events-recommend'
import Calendar from '@/components/product/date2'
import Link from 'next/link'


export default function Detail() {
  // 假設初始狀態是未選擇
  const [selected, setSelected] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [eventInfo, setEventInfo] = useState([]);
  const [qty, setQty] = useState(1)

  const [sellStartDate, setSellStartDate] = useState('');
  const [sellEndDate, setSellEndDate] = useState('');

  //設日期狀態()
  const [dateStart, setDateStart] = useState('')
  const [dateEnd, setDateEnd] = useState('')
  const [timeStart,setTimeStart] = useState('')
  const [timeEnd,setTimeEnd] = useState('')
  const [sellTime,setSellTime] = useState('')

  let date1, date2, time1,time2 ,date3,time3;

  useEffect(() => {

    fetch('http://localhost:3005/api/info')
      .then((response) => response.json())
      .then((data) => {
        // 檢查是否有資料並設定到 state 中
        if (data && data.data) {
          console.log('success:', data?.data.posts);
          setEventInfo(data?.data.posts[0])

          // 建立日期物件 // 因為eventInfo 還沒設定好不能使用, 故使用data?.data.posts[0]
          const startDate = data?.data.posts[0].start_date; 
          const endDate = data?.data.posts[0].end_date;
          
          // console.log(startDate);
          // console.log(endDate);

          [date1, time1] = startDate.split('T');
          [date2, time2] = endDate.split('T');
          [date3,time3] = sellStartDate.split('T');
          time3 = time3.substring(0, 5); 
          
          setSellStartDate(data?.data.posts[0].sell_start_date)
          setSellEndDate(data?.data.posts[0].sell_end_date)

          //狀態接變數值
          setDateStart(date1)
          setDateEnd(date2)
          setTimeStart(time1)
          setTimeEnd(time2)
          setSellTime(time3)
        }
      })
      .catch((error) => console.error('Error fetching data:', error))

  }, [])
  // console.log(eventInfo);
  // console.log(timeStart);
  console.log(sellEndDate);
  console.log(sellTime);
  
  



  const handleSelection = () => {
    setSelected(!selected)  // 切換選擇狀態
  }

  const handleDate = (date) => {
    setSelectedDate(date);
  };

  const handleTime = (time) => {
    setSelectedTime(time);
  };


  const handleDecrease = () => {
    if (qty > 1) {
      setQty(qty - 1)
    }
  }
  const handleIncrease = () => {
    setQty(qty + 1)
  }

  const totalAmount = selected ? eventInfo.price * qty : 0;
  

  const addToCart = () => {
    const cartData = {
      selectedDate,
      selectedTime,
      qty,
      totalAmount
    };

  };


  return (
    <>

      {/* {data?.data.posts.map((v) => ( */}
      <>
        <section>
          <div className=" d-flex p-4 d-none d-xxl-inline-flex">
            <p>
              首頁 <i className="bi bi-chevron-right"></i>
            </p>
            <p>
              演唱會 <i className="bi bi-chevron-right"></i>
            </p>
            <p className="text-primary-light">
              YOASOBI 演唱會 <i className="bi bi-chevron-right"></i>
            </p>
          </div>

          <div>
            <div className="position-relative">
              <div className="d-flex justify-content-between d-block d-xxl-none">
                <Link href="/product/list">
                  <button className="nav-btn opacity-50 position-absolute top-0 start-0">
                    <i className="bi bi-arrow-left text-normal-gray-light"></i>
                  </button>
                </Link>

                <div className="position-absolute top-0 end-0">
                  <Link href="">
                    <button className="nav-btn opacity-50">
                      <i className="bi bi-heart text-normal-gray-light"></i>
                    </button>
                  </Link>
                  <Link href="/cart/">
                    <button className="nav-btn opacity-50">
                      <i className="bi bi-cart3 text-normal-gray-light"></i>
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div>
            <img
              src={`/images/product/list/${eventInfo.image?.split(',')[0]}`}
              className="object-fit-cover"
              alt=""
            />
          </div>
        </section>

        <main>
          <div className="wrapper">
            <section className="title">

              <div key={eventInfo.id} className="d-flex align-items-center justify-content-between mt-3">
                <h5 className="border-5 border-start border-primary px-2">
                  YOASOBI
                </h5>
                <button
                  type="button"
                  className="store btn btn-primary-deep-50 d-none d-xxl-block"
                >
                  <i className="bi bi-heart me-2" />
                  收藏
                </button>
              </div>
              <div>
                <h3 className="my-4">
                  {eventInfo.event_name}
                  {/* <span className="d-none d-xxl-inline-flex">
                    ｜YOASOBI ASIA TOUR 2023-2024 Solo Concert in Taipei
                  </span> */}
                </h3>
                <h6 className="text-normal-gray-light">
                  <i className="bi bi-calendar me-2 d-none d-xxl-inline-flex" />
                  {dateStart}~{dateEnd}
                </h6>
                <h6>
                  <i className="bi bi-geo-alt me-2 d-none d-xxl-inline-flex" />
                  {eventInfo.place}
                </h6>
                <p className="mx-4 text-secondary-02">
                  {eventInfo.address}
                </p>
                <hr className="d-none d-xxl-block" />
              </div>
              <div className="d-flex text-normal-gray-light">
                <h6>
                  <i className="bi bi-exclamation-triangle me-2" />
                  禁止取消
                </h6>
                <h6>
                  <i className="bi bi-box2 mx-2" />
                  電子票證
                </h6>
              </div>
              <hr />
            </section>
            <section>
              <div className="d-flex align-items-center mt-5">
                <h4 className="border-5 border-start border-primary px-2">
                  選擇方案
                </h4>
              </div>
              <div className="row justify-content-center seat1 mt-3">
                <h4 className="col-lg-9 col-sm-6">1F 站位</h4>
                <h4 className="col-lg-2 col-sm-4">NT$ 3,200</h4>
                <button className="store col-lg-1 col-sm-2 btn btn-primary-deep">
                  選擇
                </button>
              </div>
              <div className="row seat1 mt-3">
                <h4 className="col-lg-9 col-sm-6">{eventInfo.ticket_name}</h4>
                <h4 className="col-lg-2 col-sm-4">NT$ {parseInt(eventInfo.price ).toLocaleString()}</h4>
                <button className="store col-lg-1 col-sm-2 btn btn-primary-deep" onClick={handleSelection}>
                  {selected ? '已選擇' : '選擇'}
                </button>
                <div className="d-flex mt-4 d-none d-xxl-inline-flex">
                  <h5 className="me-5">憑證兌換期限</h5>
                  <p className="ms-1">
                    需要按照預訂日期及當天開放時間內兌換，逾期失效
                  </p>
                </div>
                <div className="d-flex mt-4 d-none d-xxl-inline-flex">
                  <h5 className="me-5">取消政策</h5>
                  <p className="ms-5 mb-3">
                    商品一經訂購完成後，即不可取消、更改訂單，亦不得請求退款
                    <br />
                    供應商需2-5個工作天進行取消流程，依照您購買的商品取消政策收取手續費，並於取消流程完成後14個工作天內退款。
                  </p>
                </div>
                <hr className="d-none d-xxl-block" />
                <div className="d-flex d-none d-xxl-inline-flex">
                  <div className="me-5">
                    <h5 className="mb-5">選擇日期</h5>
                    <div className="text-center">
                      <Calendar onChange={handleDate} sellStartDate={sellStartDate} sellEndDate={sellEndDate}/>

                    </div>
                  </div>
                  <div>
                    <h5 className="mb-5">選擇時間</h5>
                    <button className="store fs-5 p-2 btn btn-primary-deep" onClick={() => handleTime('17:00')}>
                      {sellTime}
                    </button>
                    <h5 className="my-5">數量</h5>
                    <div className="d-flex align-items-center">
                      <i
                        type="button"
                        className="bi bi-dash-circle me-2 icon"
                        onClick={handleDecrease}
                      />
                      <h5 className="px-3 py-2 bg-dark rounded">{qty}</h5>
                      <i
                        type="button"
                        className="bi bi-plus-circle ms-2 icon"
                        onClick={handleIncrease}
                      />
                    </div>
                    <div className="d-flex my-5">
                      <h5 className="">總金額</h5>
                      <h4 className="dollar">NT$ {totalAmount}</h4>
                    </div>
                    <div className="d-flex justify-content-end mb-3">
                      <Link href={`/cart`}>
                        <button className="store fs-5 me-2 p-2 btn btn-primary-deep" onClick={addToCart}>
                          加入購物車
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </section>


            <section className="row">
              <div className="left col-lg-8 col-sm-12">
                <div className="d-flex align-items-center mt-5">
                  <h4 className="border-5 border-start border-primary px-2">
                    活動介紹
                  </h4>
                </div>
                <p className="my-3">
                  由Ayase與ikura組成、出道曲「夜に駆ける」日前突破十億次串流播放的日本超人氣樂團YOASOBI，於官方社群平台宣佈展開首個海外巡迴演唱會！根據官方公佈的行程，YOASOBI
                  2023年12月初將分別登場演出，而專場演唱會台北站的時間則定在
                  2024年1月21日舉辦，更多詳細演場會資訊將陸續公布，粉絲們記得密切鎖定！
                </p>
                <img
                  className="mt-3 object-fit-cover"
                  src="/images/product/detail/info-1.png"
                  alt=""
                />
                <p className="py-3 d-none d-xxl-block">YOASOBI 將在台北開唱！</p>
                <img
                  className="mt-3 object-fit-cover d-none d-xxl-block"
                  src="/images/product/detail/info-2.png"
                  alt=""
                />
                <p className="py-3 d-none d-xxl-block">
                  成為在日本最熱門話題 紅遍亞洲
                </p>
                <img
                  className="mt-3 object-fit-cover d-none d-xxl-block"
                  src="/images/product/detail/info-3.png"
                  alt=""
                />
                <p className="py-3 d-none d-xxl-block">出道後的第二次台灣巡迴</p>
              </div>
              <div className="right d-none d-xxl-block col-3">
                <div className="row seat1 mt-3">
                  <h5 className="col-12 mb-3">NT$ 2,800 - 3200</h5>
                  <button className="store col-12 btn btn-primary-deep">
                    立即購買
                  </button>
                </div>
                <a type="button" className="d-flex align-items-center mt-5">
                  <h5 className="border-5 border-start border-primary px-2 text-white">
                    活動介紹
                  </h5>
                </a>
                <a type="button" className="d-flex align-items-center mt-3">
                  <h5 className="border-5 border-start border-primary px-2 text-white">
                    購買須知
                  </h5>
                </a>
                <a type="button" className="d-flex align-items-center mt-3">
                  <h5 className="border-5 border-start border-primary px-2 text-white">
                    使用方式
                  </h5>
                </a>
                <a type="button" className="d-flex align-items-center mt-3">
                  <h5 className="border-5 border-start border-primary px-2 text-white">
                    活動評價
                  </h5>
                </a>
              </div>
            </section>
            <section className="left col-lg-8 col-sm-12">
              <div className="d-flex align-items-center mt-5">
                <h4 className="border-5 border-start border-primary px-2">
                  購買須知
                </h4>
              </div>
              <p className="lh-lg mt-4">
                1.本次活動購票進場採實名制，每位會員帳號限購2張票券。
                <br />
                2.若購買1張票券，該張票券填寫的參加者姓名須為購票會員帳號姓名，若購買2張票券，其中1張票券填寫的參加者姓名須為購票會員帳號姓名，請於購票前先至「會員專區」→「個人資料」確認會員姓名是否與會員本人證件姓名相符且完整填寫，恕不接受購票中及購票後修改，若經查核購票當下的「會員姓名」與填寫的「參加者姓名」無一符合者，主辦單位及遠大售票有權取消該會員於此活動購買之全數票券。若因事後修改會員資料，經核對後與購票當下資訊不符合者，主辦單位及遠大售票有權取消該會員於此活動購買之全數票券。(以上紅字部分為10/27新增實名制規定)
                <br />
                3.一個證件號僅能購買一張票券，請勿將個人資料提供給他人，以免影響自身購買權益。
                <br />
                4.系統列印票券時，將帶入購票頁面填寫的參加者資料，請確實填寫每位參加者的「身分證姓名」及「身分證證字號」，外籍人士請填寫「護照姓名」及「護照號碼」，購票時請務必確認每張票券對應之參加者資料填寫正確，以免影響入場權益。
                <br />
                5.實名制票券的參加者「姓名」及「證件字號」如填寫有誤將不接受任何形式變更資料，僅接受退票期限內申請退票，請務必確認再進行結帳。
                <br />
                6.詳細實施規則請見購票頁面說明，並建議提前加入會員，於「會員專區」→「個人資料」→「信用卡資訊」登錄信用卡完成驗證手續，以便進行購票流程。
              </p>
            </section>
            <section className="left col-lg-8 col-sm-12">
              <div className="d-flex align-items-center mt-5">
                <h4 className="border-5 border-start border-primary px-2">
                  使用方法
                </h4>
              </div>
              <p className="my-4">
                <i className="bi bi-dot" />
                入場專用QRCODE將會寄送到您的會員email，或請至會員中心＞訂單＞票卷內點擊出示使用。
              </p>
            </section>

            <section className="left col-lg-8 col-sm-12">
              <div className="d-flex align-items-center mt-5 mb-4">
                <h4 className="border-5 border-start border-primary px-2">
                  活動評價
                </h4>
              </div>
              <div className="d-flex justify-content-between">
                <div className="d-flex ms-4">
                  <h5 className="store p-3 bg-primary-deep ">4.0</h5>
                  <div className="ms-3">
                    <div className="mb-2">
                      <i className="bi bi-star-fill text-primary"></i>
                      <i className="bi bi-star-fill text-primary ms-2"></i>
                      <i className="bi bi-star-fill text-primary ms-2"></i>
                      <i className="bi bi-star-fill text-primary ms-2"></i>
                      <i className="bi bi-star-fill ms-2"></i>
                    </div>
                    <h6>1,273則評價</h6>
                  </div>
                </div>
                <div className="dropdown">
                  <button
                    className="btn btn-secondary p-2 border-white text-white dropdown-toggle"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    推薦
                  </button>
                  <ul className="dropdown-menu bg-normal-gray">
                    <li>
                      <a className="dropdown-item text-secondary-03" href="#">
                        最新評分
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item text-secondary-03" href="#">
                        最高評分
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item text-secondary-03" href="#">
                        最低評分
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <hr className="d-none d-xxl-block" />

              <div>
                <div className="d-flex my-5 ms-4 d-none d-xxl-inline-flex">
                  <div>
                    <img
                      className="avatar rounded-circle bg-normal-white me-4"
                      src="/images/product/detail/25.png"
                      alt=""
                    />
                  </div>
                  <div>
                    <div className="d-flex">
                      <h5>王小鴨</h5>
                      <button className="text-normal-black bg-secondary-01 rounded-4 ms-3 px-3">
                        金鴨會員
                      </button>
                    </div>
                    <div className="d-flex align-items-center mt-2 ">
                      <div className="mb-2">
                        <i className="bi bi-star-fill text-primary"></i>
                        <i className="bi bi-star-fill text-primary ms-2"></i>
                        <i className="bi bi-star-fill text-primary ms-2"></i>
                        <i className="bi bi-star-fill text-primary ms-2"></i>
                        <i className="bi bi-star-fill ms-2"></i>
                      </div>
                      <p className="ms-4">2023/12/29</p>
                    </div>
                    <div className="bg-bg-gray-secondary p-4 rounded-3">
                      <h6 className="fw-bold pb-2">方便又快速的入場方式</h6>
                      <p className="pb-2">
                        高空居高臨下非常壯觀，白天可以看得很清楚很遠，夜景看城市燈火通明，像是在飛機上看下來一樣美麗。
                      </p>
                    </div>
                  </div>
                </div>
                <hr className="d-none d-xxl-block" />
                <div className="d-flex my-5 ms-4 d-none d-xxl-inline-flex">
                  <div>
                    <img
                      className="avatar rounded-circle bg-normal-white me-4"
                      src="/images/product/detail/25.png"
                      alt=""
                    />
                  </div>
                  <div>
                    <div className="d-flex">
                      <h5>王小鴨</h5>
                      <button className="text-normal-black bg-secondary-01 rounded-4 ms-3 px-3">
                        金鴨會員
                      </button>
                    </div>
                    <div className="d-flex align-items-center mt-2">
                      <div className="mb-2">
                        <i className="bi bi-star-fill text-primary"></i>
                        <i className="bi bi-star-fill text-primary ms-2"></i>
                        <i className="bi bi-star-fill text-primary ms-2"></i>
                        <i className="bi bi-star-fill text-primary ms-2"></i>
                        <i className="bi bi-star-fill ms-2"></i>
                      </div>
                      <p className="ms-4">2023/12/29</p>
                    </div>
                    <div className="bg-bg-gray-secondary p-4 rounded-3">
                      <h6 className="fw-bold pb-2">方便又快速的入場方式</h6>
                      <p className="pb-2">
                        高空居高臨下非常壯觀，白天可以看得很清楚很遠，夜景看城市燈火通明，像是在飛機上看下來一樣美麗。
                      </p>
                    </div>
                  </div>
                </div>
                <hr className="d-none d-xxl-block" />

                <div className="d-flex my-5 ms-4 d-none d-xxl-inline-flex">
                  <div>
                    <img
                      className="avatar rounded-circle bg-normal-white me-4"
                      src="/images/product/detail/25.png"
                      alt=""
                    />
                  </div>
                  <div>
                    <div className="d-flex">
                      <h5>王小鴨</h5>
                      <button className="text-normal-black bg-secondary-01 rounded-4 ms-3 px-3">
                        金鴨會員
                      </button>
                    </div>
                    <div className="d-flex align-items-center mt-2">
                      <div className="mb-2">
                        <i className="bi bi-star-fill text-primary"></i>
                        <i className="bi bi-star-fill text-primary ms-2"></i>
                        <i className="bi bi-star-fill text-primary ms-2"></i>
                        <i className="bi bi-star-fill text-primary ms-2"></i>
                        <i className="bi bi-star-fill ms-2"></i>
                      </div>
                      <p className="ms-4">2023/12/29</p>
                    </div>
                    <div className="bg-bg-gray-secondary p-4 rounded-3">
                      <h6 className="fw-bold pb-2">方便又快速的入場方式</h6>
                      <p className="pb-2">
                        高空居高臨下非常壯觀，白天可以看得很清楚很遠，夜景看城市燈火通明，像是在飛機上看下來一樣美麗。
                      </p>
                    </div>
                  </div>
                </div>

                <div className="d-block d-xxl-none bg-bg-gray-secondary p-3 my-5 rounded-4">
                  <div className="d-flex my-2 ms-2">
                    <div>
                      <img
                        className="avatar rounded-circle bg-normal-white me-4"
                        src="/images/product/detail/25.png"
                        alt=""
                      />
                    </div>
                    <div>
                      <div className="d-flex">
                        <h5>王小鴨</h5>
                        <button className="text-normal-black bg-secondary-01 rounded-4 ms-3 px-3">
                          金鴨會員
                        </button>
                      </div>
                      <div className="d-flex align-items-center mt-2 justify-content-between">
                        <div className="mb-2">
                          <i className="bi bi-star-fill text-primary"></i>
                          <i className="bi bi-star-fill text-primary ms-2"></i>
                          <i className="bi bi-star-fill text-primary ms-2"></i>
                          <i className="bi bi-star-fill text-primary ms-2"></i>
                          <i className="bi bi-star-fill ms-2"></i>
                        </div>
                        <p>2023/12/29</p>
                      </div>
                      <div className="">
                        <h6 className="fw-bold py-2">方便又快速的入場方式</h6>
                        <p className="pb-2">
                          高空居高臨下非常壯觀，白天可以看得很清楚很遠，夜景看城市燈火通明，像是在飛機上看下來一樣美麗。
                        </p>
                      </div>
                    </div>
                  </div>
                  <button className="bg-bg-gray-secondary p-2 rounded-3 text-white border-normal-white col-12">
                    更多評論
                  </button>
                </div>
              </div>

              <div
                className="btn-toolbar justify-content-center mt-5 pt-4"
                role="toolbar"
                aria-label="Toolbar with button groups"
              >
                <div
                  className="btn-group d-none d-xxl-inline-flex"
                  role="group"
                  aria-label="group"
                >
                  <button type="button" className="btn btn-primary">
                    1
                  </button>
                  <button type="button" className="btn btn-secondary text-white">
                    2
                  </button>
                  <button type="button" className="btn btn-secondary">
                    3
                  </button>
                  <button type="button" className="btn btn-secondary">
                    4
                  </button>
                  <button type="button" className="btn btn-secondary">
                    5
                  </button>
                  <button type="button" className="btn btn-secondary">
                    6
                  </button>
                  <button
                    type="button"
                    className="btn btn-normal-gray"
                    aria-label="next"
                  >
                    &raquo;
                  </button>
                </div>
              </div>
            </section>

            <section className="d-none d-xxl-inline-flex">
              <EventsRecommend />
            </section>
          </div>
          <div className="d-inline-flex d-xxl-none align-items-center justify-content-center col-12 bg-bg-gray-secondary p-3 rounded-3">
            <h5 className="col-8">NT$ 3,200 起</h5>
            <button
              className="store fs-6 fw-bold p-2 btn btn-primary col-3"
              data-bs-toggle="modal"
              data-bs-target="#exampleModal"
            >
              選擇規格<i className="bi bi-chevron-bar-up"></i>
            </button>
          </div>

          <div
            className="modal fade"
            id="exampleModal"
            tabindex="-1"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog">
              <div className="modal-content bg-bg-gray-secondary">
                <div className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">
                    選擇規格
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="d-flex justify-content-between seat1 mt-3">
                    <h5 className="">1F 站位</h5>
                    <h5 className="">NT$ 3,200</h5>
                    <button className="store col-2 btn btn-primary-deep">
                      選擇
                    </button>
                  </div>
                  <div className="d-flex justify-content-between seat1 my-3">
                    <h5 className="">2F 座位</h5>
                    <h5 className="">NT$ 3,200</h5>
                    <button className="store col-2 btn btn-primary-deep">
                      選擇
                    </button>
                  </div>
                  <div className="text-center mx-4">
                    <Calendar />
                  </div>

                  <br />

                  <div className="d-flex align-items-center justify-content-between mt-3 border border-1 p-2 rounded-4">
                    <h5 className="ms-2 text-secondary-03">數量</h5>
                    <div className="d-flex align-items-center">
                      <i
                        type="button"
                        className="bi bi-dash-circle me-2 icon"
                        onClick={handleDecrease}
                      />
                      <h5 className="px-3">{qty}</h5>
                      <i
                        type="button"
                        className="bi bi-plus-circle ms-2 icon me-2"
                        onClick={handleIncrease}
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-primary-deep text-white"
                    data-bs-dismiss="modal"
                  >
                    加入購物車
                  </button>
                  <button type="button" className="btn btn-primary text-white">
                    立即訂購
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </>
      {/* ))}    */}

      <style global jsx>
        {`
          body {
            background-color: #151515;
            color: #fff;
          }

          .object-fit-cover {
            width: 100%;
            object-fit: cover;
          }

          .wrapper {
            max-width: 80%;
            margin: 50px auto;
          }

          .store {
            color: white;
            border-radius: 5px;
            border: none;
            padding: 5px 7px;
          }

          .seat1 {
            color: white;
            background: #686868c8;
            padding: 15px;
            border-radius: 10px;
          }
           {
            /* .cost {
            padding-top: 100px;
            margin-bottom: 50px;
          } */
          }

          .dollar {
            margin-left: 430px;
          }
          .icon {
            font-size: 30px;
          }
          .cart {
            margin-left: 300px;
          }
          .left {
             {
              /* max-width: 70%; */
            }
            margin-right: 20px;
          }
          .right {
             {
              /* max-width: 30%; */
            }
            margin: 40px auto;
          }
          .avatar {
            width: 60px;
            height: 60px;
          }
          .custom-card {
            border: none;
            background-color: #151515;
            border-radius: 5px;
            overflow: hidden;
          }

          @media screen and (max-width: 576px) {
            .wrapper {
              max-width: 90%;
            }

            main > .container {
              padding: 0;
            }

            .object-fit-cover {
              height: 300px;
            }

            .nav-btn {
              width: 48px;
              height: 48px;
              border-radius: 10px;
              .icon {
                font-size: 32px;
                font-weight: bold;
              }
            }

            .title {
              h3: 26px;
              h5: 14px;
              h6: 14px;
              .mx-4 {
                margin-left: 0 !important;
                margin-bottom: 20px;
              }
            }
            .seat1 {
              margin: 0;
            }
            .btn-toolbar {
              display: none;
            }
          }
        `}
      </style>
    </>
  )
}
