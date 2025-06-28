// *老師提供的範例
import React, { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { addFav, removeFav } from '@/services/user'
//* 獲得會員有加在我的最愛的商品id，回傳為id陣列
//  */
// export const getFavs = async () => {
//   return await axiosInstance.get('/favorites')
// }
// /**
//  * 新增商品id在該會員的我的最愛清單中的
//  */
// export const addFav = async (pid) => {
//   return await axiosInstance.put(`/favorites/${pid}`)
// }
// /**
//  * 移除商品id在該會員的我的最愛清單中的
//  */
// export const removeFav = async (pid) => {
//   return await axiosInstance.delete(`/favorites/${pid}`)
// }
import toast from 'react-hot-toast'

import { FaHeart } from "react-icons/fa6";
import { CiHeart } from 'react-icons/ci'

// 愛心設定
const Heart = ({ size = 20, color = 'red' }) => (
  <svg
    className="heart"
    viewBox="0 0 32 29.6"
    style={{ opacity: 1, width: size, fill: color, position: 'relative' }}
  >
    <path d="M23.6 0c-3.4 0-6.3 2.7-7.6 5.6C14.7 2.7 11.8 0 8.4 0 3.8 0 0 3.8 0 8.4c0 9.4 9.5 11.9 16 21.2 6.1-9.3 16-12.1 16-21.2C32 3.8 28.2 0 23.6 0z" />
  </svg>
)

export default function FavIcon({ id, pid }) {
  // 使用 pid 或 id，優先使用 pid
  const productId = pid || id
  // const [activeButton, setActiveButton] = useState(0)
  // const handleClick = () => {
  //   setActiveButton(activeButton === 0 ? 1 : 0)
  // }

  // 由context取得auth-判斷是否能執行add或remove用，favorites決定愛心圖案用
  const { auth, favorites, setFavorites } = useAuth()

  const handleTriggerFav = (pid) => {
    // 確保 favorites 是陣列
    const favArray = favorites || []
    // 在陣列中->移出
    if (favArray.includes(pid)) {
      setFavorites(favArray.filter((v) => v !== pid))
    } else {
      //不在陣列中加入
      setFavorites([...favArray, pid])
    }
  }

  //  新增
  const handleAddFav = async (pid) => {
    console.log('=== 點擊添加收藏 ===', { pid, auth, favorites })
    
    try {
      const res = await addFav(pid)
      console.log('添加收藏 API 響應:', res)
      
      if (res.data.status === 'success') {
        // 伺服器成功後，更新context中favorites的狀態，頁面上的圖示才會對應更動
        handleTriggerFav(pid)
        toast.success(`商品 id=${pid} 新增成功!`)
      } else {
        toast.error(`新增失敗: ${res.data.message || '未知錯誤'}`)
      }
    } catch (error) {
      console.error('添加收藏錯誤:', error)
      toast.error(`收藏失敗: ${error.message}`)
    }
  }

  // 刪除
  const handleRemoveFav = async (pid) => {
    console.log('=== 點擊移除收藏 ===', { pid, auth, favorites })
    
    try {
      const res = await removeFav(pid)
      console.log('移除收藏 API 響應:', res)
      
      if (res.data.status === 'success') {
        // 伺服器成功後，更新context中favorites的狀態，頁面上的圖示才會對應更動
        handleTriggerFav(pid)
        toast.success(`商品 id=${pid} 刪除成功!`)
      } else {
        toast.error(`刪除失敗: ${res.data.message || '未知錯誤'}`)
      }
    } catch (error) {
      console.error('移除收藏錯誤:', error)
      toast.error(`取消收藏失敗: ${error.message}`)
    }
  }

  return (
    <>
      {/* 由favorites狀態決定呈現實心or空心愛愛圖示 */}
      {(favorites || []).includes(productId) ? (
        <button
          className={`btn`}
          style={{
            position: 'absolute',
            right: 5,
            top: 5,
            padding: '8px',  // 增加點擊區域
            border: 'none',
            zIndex: 10,      // 確保在其他元素之上
            minWidth: '32px', // 最小寬度
            minHeight: '32px', // 最小高度
            background: 'transparent', // 透明背景
          }}
          onClick={(e) => {
            // 阻止事件冒泡，避免觸發父層的 Link
            e.preventDefault()
            e.stopPropagation()
            
            // 沒登入不能用
            if (!auth.isAuthenticated) {
              return toast.error('請登入會員才能使用')
            }

            handleRemoveFav(productId)
          }}
        >
          <Heart />
        </button>
      ) : (
        <button
          className={`btn`}
          style={{
            position: 'absolute',
            right: 5,
            top: 5,
            padding: '8px',  // 增加點擊區域
            border: 'none',
            zIndex: 10,      // 確保在其他元素之上
            minWidth: '32px', // 最小寬度
            minHeight: '32px', // 最小高度
            background: 'transparent', // 透明背景
          }}
          onClick={(e) => {
            // 阻止事件冒泡，避免觸發父層的 Link
            e.preventDefault()
            e.stopPropagation()
            
            // 沒登入不能用
            if (!auth.isAuthenticated) {
              return toast.error('請登入會員才能使用')
            }

            handleAddFav(productId)
          }}
        >
          {/* <i
          style={{ opacity: 0.8 }}
          className="px-2 py-1 rounded-3 bi bi-heart-fill fs-5"
        ></i> */}
          <Heart color="white" />
        </button>
      )}
    </>
  )
}
