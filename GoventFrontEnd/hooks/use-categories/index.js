import { useState, useContext, createContext, useEffect } from 'react'
import { useRouter } from 'next/router'

const CategoriesContext = createContext(null)

export const CategoriesProvider = ({ children }) => {
  const [selectedCategories, setSelectedCategories] = useState({})
  console.log(selectedCategories)
  return (
    <CategoriesContext.Provider
      value={{
        setSelectedCategories,
        selectedCategories,
      }}
    >
      {children}
    </CategoriesContext.Provider>
  )
}

export const useCategories = () => useContext(CategoriesContext)
