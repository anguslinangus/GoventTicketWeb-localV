import { result } from 'lodash'
import React, { createContext, useState, useContext, useEffect } from 'react'
import useLocalStorage from '@/hooks/use-localstorage'
const _ = require('lodash')

//建立context
const CartContext = createContext()

export function CartProvider({
  children,
  initialCartItems = [], //初始化購物車的加入項目
  localStorageKey1 = 'cartItems', //初始化localStorage的鍵名
}) {
  // localStorage中儲存 items、MtItems。如果localStorage有此鍵中的值，則套入使用作為初始items、MtItems。
  let items = initialCartItems
  if (!items.length) {
    try {
      // 修正nextjs中window is undefined的問題
      if (typeof window !== 'undefined') {
        const item = window.localStorage.getItem(localStorageKey1)
        // 剖析存儲的json，如果沒有則返回初始值
        items = item ? JSON.parse(item) : []
      }
    } catch (error) {
      items = []
      console.log(error)
    }
  }

  // 加入到購物車中的項目
  const [cartItems, setCartItems] = useState(items)
  // console.log(cartItems)

  //儲存有多少商家
  const MerchantIds = _.uniq(items.map((item) => item.merchantId))
  // 初始化 setValue(localStoage), setValue用於存入localStorage中
  const [storedValue, setValue] = useLocalStorage(localStorageKey1, items)
  //連接資料庫
  const [Mt, setMt] = useState([])
  // console.log(Mt)
  //結帳
  const [pay, setPay] = useState([])
  // 過濾出所有符合條件的項目
  const paynews = cartItems.filter((item) => item.checked === true)

  //重新定義公司
  useEffect(() => {
    const getCartMt = async () => {
      try {
        const response = await fetch('http://localhost:3005/api/cart')
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        const data = await response.json()
        setMt(data.data ? data.data.posts : [])
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    getCartMt()
    setPay(paynews)
  }, [])
  // 當 cartItems 更動時 -> 更動 localStorage 中的值 -> 更動 cartState
  useEffect(() => {
    // 使用字串比較
    if (JSON.stringify(cartItems) !== storedValue) {
      setValue(cartItems)
    }
    setCartItems(cartItems)
    // eslint-disable-next-line
}, [cartItems])


  //資料庫-用id尋找商家name
  const foundMt = (MtId) => {
    const foundItem = Mt.find((item) => item.id === MtId)
    // console.log(foundItem)
    const bankName = foundItem?.name
    return bankName
  }
  //添加ok
  const addItem = (item) => {
    if(!item){
      console.log('沒有選取');
      return
    }
    // 在新商品對象中添加 checked 屬性
    console.log(item)
    const newItem = { ...item, checked: false }

    // 檢查是否已存在相同的商品，如果是，則執行 increment
    const foundIndex = cartItems.findIndex(
      (v) => v.id === item.id && v.holdingTime === item.holdingTime
    )
    if (foundIndex > -1) {
      increment(cartItems, item.id)
    } else {
      // 否則將新商品加入購物車
      const newItems = [...cartItems, newItem]
      setCartItems(newItems)
    }
  }
  //遞增 ok
  const getItemById = (items, id) => {
    return items.find((item) => item.id === id)
  }
  const increment = (items, id) => {
    const newItems = items.map((v, i) => {
      if (v.id === id) return { ...v, qty: v.qty + getItemById(items, id).qty }
      else return v
    })
    setCartItems(newItems)
  }
  //移除 ok
  const removeItem = (items, id) => {
    const newItems = items.filter((item) => item.id !== id)
    setCartItems(newItems)
  }
  //`incrementOne ok
  const incrementOne = (items, id) => {
    // console.log(items)
    const newItems = items.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          qty: item.qty + 1 > 0 ? item.qty + 1 : 1,
        }
      }
      return item // 返回原始的項目
    })
    setCartItems(newItems)
  }
  // decrementOne ok
  const decrementOne = (items, id) => {
    // console.log(items)
    const newItems = items
      .map((item) => {
        if (item.id === id) {
          const newQty = item.qty - 1 > 0 ? item.qty - 1 : 0
          if (newQty === 0) {
            // 如果數量為零，不返回該項目，即移除該項目
            return null
          } else {
            // 否則更新數量並返回項目
            return {
              ...item,
              qty: newQty,
            }
          }
        }
        return item // 返回原始的項目
      })
      .filter((item) => item !== null) // 過濾掉為 null 的項目
    setCartItems(newItems)
  }
  //計算數量
  //數量ok
  const calcTotalItems = () => {
    let total = 0
    cartItems.forEach((cartitem) => {
      if (cartitem.checked === true) {
        total += cartitem.qty
      }
    })
    return total
  }
  const calcTotalItemstotal = calcTotalItems()
  //Navbar ok
  const NavbarcalcTotalItems = () => {
    let total = 0
    for (let i = 0; i < cartItems.length; i++) {
      total += cartItems[i].qty
    }
    return total
  }
  const NavbaralcTotalItemstotal = NavbarcalcTotalItems()
  //總金額ok
  const calcTotalPrice = () => {
    let total = 0
    cartItems.forEach((cartitem) => {
      if (cartitem.checked === true) {
        total += cartitem.qty * cartitem.price
      }
    })
    return total
  }
  const calcTotalPricetotal = parseInt(calcTotalPrice()).toLocaleString()

  //checkbox內容
  //更改
  const handleToggleSelectedAll = (nextChecked, mid = 0) => {
    if (mid === 0) {
      // 全選強制修改所有項目的checked屬性
      const nextPetsX = cartItems.map((v, i) => {
        return { ...v, checked: nextChecked }
      })
      setCartItems(nextPetsX)
    } else {
      // 強制修改所有項目的checked屬性
      const nextPetsX = cartItems.map((v, i) => {
        if (v.merchantId === mid) return { ...v, checked: nextChecked }
        else return v
      })

      setCartItems(nextPetsX)
    }
  }
  // 用來切換checked屬性的純函式
  const newtoggleCheckbox = (cartItems, id) => {
    return cartItems.map((v, i) => {
      // 如果物件資料中的id屬性符合傳入的id時，則切換(or反相)checked的布林值
      if (v.id === id) return { ...v, checked: !v.checked }
      // 否則直接回傳原本的物件值
      else return v
    })
  }
  //最外(上)元件階層包裹提供者元件，讓⽗⺟元件可以提供它
  return (
    <CartContext.Provider
      value={{
        cartItems,
        setCartItems,
        addItem,
        removeItem,
        calcTotalItemstotal,
        calcTotalPricetotal,
        foundMt,
        calcTotalItems,
        incrementOne,
        decrementOne,
        NavbaralcTotalItemstotal,
        handleToggleSelectedAll,
        newtoggleCheckbox,
        MerchantIds,
        pay,
        setPay,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}
//在任何子元件層級深度,使用 useContext 勾子讀取它
export const useCart = () => useContext(CartContext)
