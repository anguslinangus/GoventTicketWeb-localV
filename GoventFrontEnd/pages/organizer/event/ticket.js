import React, { useState } from 'react'
import OrganizerLayout from '@/components/layout/organizer-layout'
import OrganizerEventSidebar from '@/components/organizer/organizer-event-sidebar'
import OrganizerTopBar from '@/components/organizer/organizer-top-bar'
import { Table, Button, ButtonGroup , ButtonToolbar } from 'react-bootstrap'



export default function OrganizerEventTicket() {
  const [selectedButton, setSelectedButton] = useState(1)

  const handleRadioChange = (value) => {
    setSelectedButton(value)
  }

  const TableRow = ({ key, tx, ts, date, name, ticketType }) => (
    <tr key={key}>
      <td>{tx}</td>
      <td>{ts}</td>
      <td>{date}</td>
      <td>{name}</td>
      <td>{ticketType}</td>
    </tr>
  );

  const rowData = { tx: 'tx44659984521', ts: 'ts55565323214', date: '2023-12-05 18:00:00', name: '林小鴨', ticketType: '1F站票' };

  // 生成包含十個相同數據的陣列
  const data = Array.from({ length: 14 }, (_, index) => ({ key: index + 1, ...rowData }));

  return (
    <>
      <div className="d-flex organizer-container">
        <OrganizerEventSidebar />
        <div className="w-100 bg-bg-gray organizer-main d-flex flex-column">
          <OrganizerTopBar title="票卷管理" />
          <div className='control-bgc p-4 flex-1'>
            <div className="d-flex justify-content-between align-items-center text-normal-gray-light mb-4">
              <div>共列出17檔活動</div>
              <div className="d-flex align-items-center">
                <i className="bi bi-search pe-3"></i>
                <input className="form-control on-search" />
              </div>
            </div>
            <Table bordered hover variant="dark" className='table-color'>
              <thead>
                <tr>
                  <th>訂單編號</th>
                  <th>票卷編號</th>
                  <th>訂單建立時間</th>
                  <th>購買者</th>
                  <th>票種</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <TableRow key={item.key} {...item} />
                ))}
              </tbody>
            </Table>
            <div className="d-flex justify-content-center pt-2">
                    <ButtonToolbar aria-label="Toolbar with button groups">
                      <ButtonGroup className="me-2" aria-label="First group">
                        <Button>1</Button> <Button>2</Button> <Button>3</Button>{' '}
                        <Button>4</Button>
                      </ButtonGroup>
                    </ButtonToolbar>
                  </div>
          </div>
        </div>
      </div>
      <style global jsx>
        {`
          body {
            background-color: var(--bg-dark-color);
            color: var(--normal-white-color);
          }
          .sm-p {
            color: var(--normal-gray-light-color);
          }
          .organizer-container {
            width: 100%;
            min-height: 100vh;
          }
          .organizer-main {
            border-radius: 30px 0 0 30px;
            padding: 25px;
            height: 100vh;
          }
          .control-bgc{
            background-color: var(--bg-gray-secondary-color);
            border-radius: 10px;
          }
          .object-fit{
            border-radius: 10px;
            overflow: hidden;
            img{
              width:100%;
              height: 100%;
              object-fit: cover;
            }
          }
          .table-color{
            tr th{
              background-color: var(--primary-color);
              text-align: center;
              border: 1px solid var(--normal-gray-color);
            }
            tr td{
              background-color: var(--bg-gray-secondary-color);
              text-align: center;
              border: 1px solid var(--normal-gray-color);
            }
          }
          .flex-1{
            flex: 1;
          }
        `}
      </style>
    </>
  )
}

OrganizerEventTicket.getLayout = function (page) {
  return <OrganizerLayout title="票卷管理 - GOVENT">{page}</OrganizerLayout>
}
