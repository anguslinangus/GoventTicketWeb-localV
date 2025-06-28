export default function MyFooter() {
  return (
    <footer className="footer mt-auto pt-5 d-none d-xxl-block">
      <div className="bg-primary py-3">
        <div className="container d-flex justify-content-between align-items-end my-4">
          <div className="d-flex">
            <div className="mx-5">
              <h6 className="text-normal-black mb-3">認識GOVENT</h6>
              <p className="text-normal-black">關於我們</p>
            </div>
            <div>
              <h6 className="text-normal-black mb-3">服務條款</h6>
              <p className="text-normal-black my-1">服務條款</p>
              <p className="text-normal-black my-1">隱私權政策</p>
              <p className="text-normal-black my-1">Cookie 政策</p>
            </div>
          </div>
                  <div>
          <div className="mb-3 text-end">
            <img src="/govent-logo-black.png" alt="" />
          </div>
          <p className="text-muted">
            COPYRIGHT © 2024 GOVENT All right reserved
          </p>
        </div>
        </div>
      </div>
    </footer>
  )
}