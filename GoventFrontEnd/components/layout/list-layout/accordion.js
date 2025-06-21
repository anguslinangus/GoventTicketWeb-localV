import Accordion from 'react-bootstrap/Accordion'

function AlwaysOpenExample() {
  return (
    <>
      <Accordion defaultActiveKey={['0']} alwaysOpen className=" no-border">
        <Accordion.Item eventKey="0" className="bg-bg-gray text-white">
          <Accordion.Header style={{ backgroundColor: 'pink' }}>
            <input type="checkbox" className="form-check-input" />
            <label className="form-check-label" htmlFor="flexCheckDefault">
              北部地區
            </label>
          </Accordion.Header>
          <Accordion.Body>
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                value=""
                id="flexCheckDefault"
              />
              <label className="form-check-label" htmlFor="flexCheckDefault">
                台北市
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                value=""
                id="flexCheckChecked"
              />
              <label className="form-check-label" htmlFor="flexCheckChecked">
                新北市
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                value=""
                id="flexCheckChecked"
              />
              <label className="form-check-label" htmlFor="flexCheckChecked">
                桃園市
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                value=""
                id="flexCheckChecked"
              />
              <label className="form-check-label" htmlFor="flexCheckChecked">
                基隆市
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                value=""
                id="flexCheckChecked"
              />
              <label className="form-check-label" htmlFor="flexCheckChecked">
                新竹市
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                value=""
                id="flexCheckChecked"
              />
              <label className="form-check-label" htmlFor="flexCheckChecked">
                新竹縣
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                value=""
                id="flexCheckChecked"
              />
              <label className="form-check-label" htmlFor="flexCheckChecked">
                宜蘭縣
              </label>
            </div>
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="1" className="bg-bg-gray text-white">
          <Accordion.Header className="bg-primary">
            <input type="checkbox" className="form-check-input" />
            <label className="form-check-label" htmlFor="flexCheckDefault">
              中部地區
            </label>
          </Accordion.Header>
          <Accordion.Body>
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                value=""
                id="flexCheckDefault"
              />
              <label className="form-check-label" htmlFor="flexCheckDefault">
                苗栗縣
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                value=""
                id="flexCheckChecked"
              />
              <label className="form-check-label" htmlFor="flexCheckChecked">
                台中市
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                value=""
                id="flexCheckChecked"
              />
              <label className="form-check-label" htmlFor="flexCheckChecked">
                南投縣
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                value=""
                id="flexCheckChecked"
              />
              <label className="form-check-label" htmlFor="flexCheckChecked">
                彰化縣
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                value=""
                id="flexCheckChecked"
              />
              <label className="form-check-label" htmlFor="flexCheckChecked">
                雲林縣
              </label>
            </div>
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="2" className="bg-bg-gray text-white">
          <Accordion.Header className="bg-primary">
            <input type="checkbox" className="form-check-input" />
            <label className="form-check-label" htmlFor="flexCheckDefault">
              南部地區
            </label>
          </Accordion.Header>
          <Accordion.Body>
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                value=""
                id="flexCheckDefault"
              />
              <label className="form-check-label" htmlFor="flexCheckDefault">
                嘉義縣
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                value=""
                id="flexCheckChecked"
              />
              <label className="form-check-label" htmlFor="flexCheckChecked">
                嘉義市
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                value=""
                id="flexCheckChecked"
              />
              <label className="form-check-label" htmlFor="flexCheckChecked">
                台南市
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                value=""
                id="flexCheckChecked"
              />
              <label className="form-check-label" htmlFor="flexCheckChecked">
                高雄市
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                value=""
                id="flexCheckChecked"
              />
              <label className="form-check-label" htmlFor="flexCheckChecked">
                屏東縣
              </label>
            </div>
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="3" className="bg-bg-gray text-white">
          <Accordion.Header>
            <input type="checkbox" className="form-check-input" />
            <label className="form-check-label" htmlFor="flexCheckDefault">
              東部地區
            </label>
          </Accordion.Header>
          <Accordion.Body>
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                value=""
                id="flexCheckDefault"
              />
              <label className="form-check-label" htmlFor="flexCheckDefault">
                花蓮縣
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                value=""
                id="flexCheckChecked"
              />
              <label className="form-check-label" htmlFor="flexCheckChecked">
                台東縣
              </label>
            </div>
          </Accordion.Body>
        </Accordion.Item>
        <style global jsx>
          {`
            .accordion-button:not(.collapse) {
              color: #ffffff;
              background-color: #151515;
              box-shadow: inset 0 -1px 0 rgb(0 0 0 / 13%);
              padding: 12px 0px 0px 0px;
              gap: 8px;
            }
          `}
        </style>
      </Accordion>
    </>
  )
}
export default AlwaysOpenExample
