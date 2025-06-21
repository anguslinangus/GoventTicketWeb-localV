// import { useEffect } from 'react'
// import React, { useState } from 'react'
// import Link from 'next/link'

// // import FavFcon from '@/components/fav-test/fav-icon'
// import FavIcon from '@/components/layout/list-layout/fav-icon'

// // 引入活動資料
// import useEvents from '@/hooks/use-event'

// // 假活動資料
// // import event from '@/data/event/event.json'
// // console.log(event)

// export default function EventCard({
//   link = {},
//   image = {},
//   category = {},
//   eventTime = {},
//   str = {},
//   startDate = {},
// }) {
//   const { data } = useEvents()

//   // 分頁
//   const [events, setEvents] = useState([])
//   const [currentPage, setCurrentPage] = useState(1)
//   const [postsPerPage, setPostsPerPage] = useState(15)

//   //頁碼
//   const lastPostIndex = currentPage * postsPerPage
//   const firstPostIndex = lastPostIndex - postsPerPage
//   const currentEvents = events.slice(firstPostIndex, lastPostIndex)

//   return (
//     <>
//       {data?.map((v) => (
//         <div key={v.id} className="col-md-4 col-sm-6 ">
//           <Link
//             href={`/product/product-info?id=${v.id}`}
//             className="col-md-4 col-sm-6"
//             key={v.id}
//             style={{ textDecoration: 'none' }}
//           >
//             <div className="card  stretched-link bg-bg-gray-secondary text-white px-0 no-border">
//               <figure>
//                 <img
//                   src={`/images/product/list/${v.image?.split(',')[0]}`}
//                   alt=""
//                   className="card-img-top"
//                 />
//               </figure>
//               {/* <FavIcon id={v.id} /> */}
//               {/* <FavFcon/> */}

//               <div className="card-body">
//                 <p className=" text-normal-gray-light">{v.category_name}</p>
//                 <h5 className="card-title">{v.event_name}</h5>
//                 <div className="">
//                   <h6 className="text-primary-deep">${v.price || 0}起</h6>
//                   <div className="d-flex justify-content-between">
//                     <p className="text-normal-gray-light mb-2">{v.str}</p>
//                     <span className="text-normal-gray-light">
//                       {v.start_date.substring(0, 10)}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </Link>
//         </div>
//       ))}
//     </>
//   )
// }
