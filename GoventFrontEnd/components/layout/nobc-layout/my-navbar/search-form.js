// import Link from 'next/link'

export default function SearchForm() {
  return (
    <div className="ms-auto pe-3 mt-3 mt-lg-2">
      <form className="d-flex bg-search-bar rounded" role="search">
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
            style={{
              borderRadius: 2.8,
            }}
          />
        </div>
      </form>
    </div>
  )
}
