import React, { useState } from 'react'

const SearchForm = ({ onSearch }) => {
  const [searchWord, setSearchWord] = useState('')

  const handleChange = (e) => {
    setSearchWord(e.target.value)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch(searchWord) // 传递搜索关键字给父组件的搜索回调函数
  }

  return (
    <div className="ms-auto pe-1 mt-1 mt-lg-0">
      <form
        className="d-flex bg-search-bar rounded"
        role="search"
        onSubmit={handleSubmit} // 将handleSubmit函数绑定到表单的提交事件上
      >
        <div className="input-group position-relative d-inline-flex align-items-center">
          <i
            className="bi bi-search ps-3"
            role="presentation"
            style={{ right: 10, cursor: 'pointer', zIndex: 100 }}
          ></i>
          <input
            type="text"
            className="form-control border-0 bg-search-bar custom-input-shadow-none"
            placeholder="搜尋"
            aria-label="from"
            aria-describedby="from"
            value={searchWord} // 将searchWord状态绑定到input的value属性上，以确保它与用户的输入同步
            onChange={handleChange} // 将handleChange函数绑定到input的change事件上，以捕获用户的输入
            style={{
              borderRadius: 2.8,
            }}
          />
        </div>
      </form>
    </div>
  )
}

export default SearchForm
