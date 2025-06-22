// import Link from 'next/link'

export default function SearchForm() {
  return (
    <div className="ms-auto pe-3 mt-3 mt-lg-2">
      <form className="d-flex rounded" role="search">
        <div className="input-group position-relative d-inline-flex align-items-center">
        <i
            className="bi bi-search ps-3"
            role="presentation"
            style={{ right: 10, cursor: 'pointer', zIndex: 100 }}
          ></i>
          <input
            type="text"
            className="form-control border-0 custom-input-shadow-none ps-5"
            placeholder="搜尋"
            aria-label="from"
            aria-describedby="from"
            style={{
              borderRadius: 2.8,
            }}
          />
        </div>
      </form>
      <style global jsx>
{`
.bi-search{
  width: 40px;
  position: absolute;
  left: 0px
}
.form-control{
  transition: 300ms;
  background-color: rgba(87, 87, 87, 0.4);
}
.form-control:focus{
  background-color: rgba(50, 50, 50, 0.6);
}
`}
      </style>
    </div>
  )
}
