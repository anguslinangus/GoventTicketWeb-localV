import React, { createContext, useState, useContext, useEffect } from 'react'

//建立context
const CartContext = createContext()
// 创建 context

export default function useFav() {
  //連接資料庫
  const [fav, setFav] = useState([])

  useEffect(() => {
    const getFav = async () => {
      try {
        const response = await fetch('http://localhost:3005/api/Fav')
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        const data = await response.json()
        setFav(data.data ? data.data.posts : [])
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    getFav()
  }, [])

  //新增
  const addFavToDatabase = async (pid, uid) => {
    try {
      const response = await fetch(
        `http://localhost:3005/api/Fav/${pid}/${uid}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ pid }), //
        }
      )
      const data = await response.json()
      return data
    } catch (error) {
      throw new Error('Error adding to favorites:', error)
    }
  }

  return { fav, addFavToDatabase }
}
