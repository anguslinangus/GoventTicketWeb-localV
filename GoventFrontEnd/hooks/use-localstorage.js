import { useState } from 'react'

export default function useLocalStorage(key, initialValue) {
  // 用於存儲值的狀態
  // 使用 useState 的初始狀態函數，以便邏輯僅執行一次
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === 'undefined') {
      return initialValue
    }
    try {
      // 透過鍵從本地存儲中獲取值
      const item = window.localStorage.getItem(key)
      // 解析存儲的 JSON，如果不存在則返回初始值
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      // 如果出現錯誤，也返回初始值
      console.log(error)
      return initialValue
    }
  })
  // 返回 useState 的 setter 函數的包裝版本，它...
  // ... 將新值持久化到本地存儲中。
  const setValue = (value) => {
    try {
      // 允許值為函數，以保持與 useState 相同的 API
      const valueToStore =
        value instanceof Function ? value(storedValue) : value
      // 更新狀態
      setStoredValue(valueToStore)
      // 保存到本地存儲
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      // 一個更高級的實現應該處理錯誤情況
      console.log(error)
    }
  }
  return [storedValue, setValue]
}
