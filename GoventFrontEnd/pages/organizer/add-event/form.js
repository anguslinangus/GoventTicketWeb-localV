import React, { useState, useRef, useMemo, useEffect } from 'react'
import OrganizerSidebar from '@/components/organizer/organizer-sidebar'
import OrganizerLayout from '@/components/layout/organizer-layout'
import { Row, Col, Form, Button } from 'react-bootstrap'
import OrganizerTopBar from '@/components/organizer/organizer-top-bar'
import dynamic from 'next/dynamic'
import axios from 'axios'
import 'react-quill/dist/quill.core.css'
import 'react-quill/dist/quill.snow.css'
import { motion } from 'framer-motion'
import { useRouter } from 'next/router'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

import { counties } from '@/data/township'

const QuillNoSSRWrapper = dynamic(
  async () => {
    const { default: RQ } = await import('react-quill')
    const Component = ({ forwardedRef, ...props }) => (
      <RQ ref={forwardedRef} {...props} />
    )
    Component.displayName = 'QuillNoSSRWrapper'
    return Component
  },
  { ssr: false }
)

function OrganizerForm() {
  const router = useRouter()
  const editorRef = useRef(null)
  const inputRef = useRef(null)

  const [banner, setBanner] = useState(null)
  const [previewBanner, setPreviewBanner] = useState(null)
  const [quillContent, setQuillContent] = useState('')

  const [otherFormData, setOtherFormData] = useState({
    merchat_id: '',
    event_name: '',
    event_type_id: '',
    place: '',
    str: '',
    address: '',
    ticket_ins: '',
    start_date: '',
    end_date: '',
    sell_start_date: '',
    sell_end_date: '',
  })

  useEffect(() => {
    fetch('http://localhost:3005/api/organizer/', {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
      },
      credentials: 'include',
    })
      .then((response) => response.json())
      .then((data) => {
        setOtherFormData((prevState) => ({
          ...prevState,
          merchat_id: data.data.result[0].id,
        }))
        // console.log('id', data.data.result[0].id, otherFormData.merchat_id)
      })
      .catch((error) => console.error('Error fetching data:', error))
  }, [])

  const bannerChange = (event) => {
    const selectedFile = event.target.files[0]

    const maxSize = 5 * 1024 * 1024 // 5MB
    if (selectedFile.size > maxSize) {
      popAlert('檔案尺寸太大', '最大尺寸限制5MB，請壓縮圖片或重新選擇')
      return
    }

    // 文件格式
    const allowedFormats = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowedFormats.includes(selectedFile.type)) {
      popAlert('檔案格式錯誤', '兼容格式 jpg/jpeg/png/webp')
      return
    }

    if (selectedFile) {
      setBanner(selectedFile)

      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewBanner(reader.result)
      }
      reader.readAsDataURL(selectedFile)
    }
  }
  const popAlert = (title, text) => {
    withReactContent(Swal).fire({
      icon: 'error',
      title: title,
      text: text,
    })
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setOtherFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const CheckStartDateInput = (e) => {
    const { name, value } = e.target
    const today = new Date()
    today.setDate(today.getDate() + 7)
    if (new Date(value) < today) {
      popAlert('請重新選擇', '活動日期最早於 七日後 舉辦')
      inputRef.current.blur()
      setOtherFormData((prevState) => ({
        ...prevState,
        [name]: '',
      }))
      return
    }
  }

  const checkEndDateInput = (e) => {
    const { name, value } = e.target
    if (new Date(value) < new Date(otherFormData.start_date)) {
      popAlert('請重新選擇', '不可早於＂活動開始時間＂')
      inputRef.current.blur()
      setOtherFormData((prevState) => ({
        ...prevState,
        [name]: '',
      }))
      return
    }
  }

  const checkSellStartDateInput = (e) => {
    const { name, value } = e.target
    const startDate = new Date(otherFormData.start_date)
    startDate.setDate(startDate.getDate() - 7)
    const sellStartDate = new Date(value)
    if (sellStartDate < new Date()) {
      popAlert('請重新選擇', '不可早於現在時間')
      inputRef.current.blur()
      setOtherFormData((prevState) => ({
        ...prevState,
        [name]: '',
      }))
      return
    }
    if (sellStartDate > startDate) {
      popAlert('請重新選擇', '不可晚於活動開始前7天')
      inputRef.current.blur()
      setOtherFormData((prevState) => ({
        ...prevState,
        [name]: '',
      }))
      return
    }
  }

  const checkSellEndDateInput = (e) => {
    const { name, value } = e.target
    if (new Date(value) > new Date(otherFormData.start_date)) {
      popAlert('請重新選擇', '不可晚於＂活動開始時間＂')
      inputRef.current.blur()
      setOtherFormData((prevState) => ({
        ...prevState,
        [name]: '',
      }))
      return
    }
    if (new Date(value) < new Date(otherFormData.sell_start_date)) {
      popAlert('請重新選擇', '不可早於＂售票開始時間＂')
      inputRef.current.blur()
      setOtherFormData((prevState) => ({
        ...prevState,
        [name]: '',
      }))
      return
    }
  }

  const setSellStartDateInputToday = () => {
    const today = new Date()
    today.setHours(today.getHours() + 9)
    const formattedToday = today.toISOString().slice(0, 16)  // 格式為 'YYYY-MM-DDTHH:MM'
    setOtherFormData((prevState) => ({
      ...prevState,
      sell_start_date: formattedToday,
    }))
  }

  const setSellEndDateInput = () => {
    setOtherFormData((prevState) => ({
      ...prevState,
      sell_end_date: otherFormData.start_date,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      // 创建 FormData 对象
      const formData = new FormData()

      // 将其他表单数据添加到 FormData 中
      for (const key in otherFormData) {
        formData.append(key, otherFormData[key])
      }

      // 添加 content 和 banner 到 FormData 中
      formData.append('content', quillContent)
      formData.append('banner', banner)

      console.log('FormData:', formData)

      // 使用 axios 或其他 HTTP 客户端发送数据至服务器
      const response = await axios.post(
        'http://localhost:3005/api/organizer/add-event',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data', // 设置请求头为 multipart/form-data
          },
        }
      )

      console.log('表单提交成功:', response.data.data.event_id)
      router.push('/organizer/add-event/' + response.data.data.event_id)

      // 处理成功情况，比如显示成功消息或重定向
    } catch (error) {
      console.error('表单提交出错:', error)
    }
  }

  // ---------------------------------------------------------
  // 處理編輯器圖片上傳
  // ---------------------------------------------------------

  const modules = useMemo(() => {
    const imageHandler = () => {
      const input = document.createElement('input')
      input.setAttribute('type', 'file')
      input.setAttribute('accept', 'image/*')
      input.click()

      input.onchange = () => {
        const file = input.files[0]

        // file type is only image.
        if (/^image\//.test(file.type)) {
          saveToServer(file)
        } else {
          console.warn('You could only upload images.')
        }
      }
    }

    function saveToServer(file) {
      const fd = new FormData()
      fd.append('upload', file)

      const xhr = new XMLHttpRequest()
      xhr.open(
        'POST',
        'http://localhost:3005/api/organizer/contain-image',
        true
      )
      xhr.onload = () => {
        if (xhr.status === 201) {
          // this is callback data: url
          const url = JSON.parse(xhr.responseText).url
          console.log('上傳成功', url)

          if (editorRef.current) {
            editorRef.current.getEditor().insertEmbed(null, 'image', url)
          } else {
            console.error('Editor ref is not available')
          }
        }
      }
      xhr.send(fd)
    }

    return {
      toolbar: {
        container: [
          [{ size: ['small', false, 'large', 'huge'] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ align: [] }],
          [{ indent: '-1' }, { indent: '+1' }],
          [{ direction: 'rtl' }],
          ['blockquote', 'code-block'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          [{ color: [] }, { background: [] }],
          ['image'],
        ],

        handlers: {
          image: imageHandler,
        },
      },
    }
  }, []) // Add any dependencies for modules if needed

  return (
    <>
      <div className="d-flex organizer-container">
        <OrganizerSidebar />
        <div className="w-100 bg-bg-gray organizer-main d-flex flex-column">
          <OrganizerTopBar title="新增活動資訊" />
          <div className="d-flex flex-column align-items-center on-main justify-content-center">
            <h5 className="my-5">活動基本資料</h5>
            <div className="w-1200">
              <Form data-bs-theme="dark" onSubmit={handleSubmit}>
                <Row>
                  <Col sm="12">
                    <Form.Group className="mb-3" controlId="banner">
                      <Form.Label className="banner-upload object-fit flex-column d-flex align-items-center justify-content-center">
                        {!previewBanner && (
                          <motion.div
                            initial={{ y: 10 }}
                            whileHover={{ y: 0 }}
                            transition={{ duration: 0.2 }}
                            className="text-center"
                          >
                            <h2>
                              <i className="bi bi-image"></i>
                            </h2>
                            <h6>上傳活動banner（建議比例16:9）</h6>
                            <p>檔案大小限制5MB，兼容格式 jpg/png/webp</p>
                          </motion.div>
                        )}
                        {previewBanner && (
                          <motion.img
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.7 }}
                            src={previewBanner}
                            alt="Preview"
                          />
                        )}
                      </Form.Label>
                      <Form.Control
                        type="file"
                        name="banner"
                        accept="image/*"
                        onChange={bannerChange}
                        hidden
                      />
                    </Form.Group>
                  </Col>
                  <Col sm="12">
                    <Form.Group className="mb-3" controlId="place">
                      <Form.Label>活動名稱</Form.Label>
                      <Form.Control
                        type="text"
                        name="event_name"
                        value={otherFormData.event_name}
                        onChange={handleInputChange}
                        placeholder="請填寫活動名稱"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col sm="6">
                    <Form.Group className="mb-3" controlId="type">
                      <Form.Label>活動種類</Form.Label>
                      <Form.Select
                        name="event_type_id"
                        value={otherFormData.event_type_id}
                        onChange={handleInputChange}
                      >
                        <option value="" disabled defaultValue>
                          請選擇
                        </option>
                        <option value="1">演唱會</option>
                        <option value="2">展覽</option>
                        <option value="3">快閃期間限定活動</option>
                        <option value="4">市集</option>
                        <option value="5">粉絲見面會</option>
                        <option value="6">課程講座</option>
                        <option value="7">體育賽事</option>
                        <option value="8">景點門票</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col sm="6">
                    <Form.Group className="mb-3" controlId="place">
                      <Form.Label>活動地點</Form.Label>
                      <Form.Control
                        type="text"
                        name="place"
                        value={otherFormData.place}
                        onChange={handleInputChange}
                        placeholder="請填寫地點名稱 EX:台北小巨蛋"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col sm="3">
                    <Form.Group className="mb-3" controlId="city">
                      <Form.Label>縣市</Form.Label>

                      <Form.Select
                        name="str"
                        value={otherFormData.str}
                        onChange={handleInputChange}
                      >
                        <option value="" disabled defaultValue>
                          請選擇
                        </option>
                        {counties.map((city, index) => (
                          <option key={index + 1} value={city}>
                            {city}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col sm="9">
                    <Form.Group className="mb-3" controlId="address">
                      <Form.Label id="address">
                        <div>詳細地址</div>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="address"
                        value={otherFormData.address}
                        onChange={handleInputChange}
                        placeholder="請填寫地址"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <h5 className="my-5 text-center">活動內容</h5>
                  <Col sm="12">
                    <Form.Group className="mb-1" controlId="content">
                      <Form.Label>活動說明</Form.Label>
                    </Form.Group>
                  </Col>
                  <Col sm="12">
                    <QuillNoSSRWrapper
                      theme="snow"
                      forwardedRef={editorRef}
                      modules={modules}
                      value={quillContent}
                      onChange={setQuillContent}
                      required
                    />
                  </Col>
                  <Col sm="12">
                    <Form.Group className="mb-3" controlId="buyTicket">
                      <Form.Label className="pb-2">購票須知</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={5}
                        name="ticket_ins"
                        value={otherFormData.ticket_ins}
                        onChange={handleInputChange}
                        placeholder="請填寫購票須知"
                      />
                    </Form.Group>
                  </Col>
                  <h5 className="my-5 text-center">時間資訊</h5>
                  <Col sm="6">
                    <Form.Group className="mb-5" controlId="startTime">
                      <Form.Label id="startTime">
                        <div className="mb-2">活動開始時間</div>
                      </Form.Label>
                      <Form.Control
                        ref={inputRef}
                        type="datetime-local"
                        name="start_date"
                        value={otherFormData.start_date}
                        onChange={handleInputChange}
                        onBlur={CheckStartDateInput}
                      />
                    </Form.Group>
                  </Col>
                  {otherFormData.start_date && (
                    <Col sm="6">
                      <Form.Group className="mb-5" controlId="endTime">
                        <Form.Label id="endTime">
                          <div className="mb-2">活動結束時間</div>
                        </Form.Label>
                        <Form.Control
                        ref={inputRef}
                          type="datetime-local"
                          name="end_date"
                          value={otherFormData.end_date}
                          onChange={handleInputChange}
                          onBlur={checkEndDateInput}
                        />
                      </Form.Group>
                    </Col>
                  )}
                  {otherFormData.start_date && otherFormData.end_date && (
                    <Col sm="6">
                      <motion.div
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Form.Group className="mb-1" controlId="startSellTime">
                          <Form.Label id="startSellTime">
                            <div className="mb-2">開始售票時間</div>
                          </Form.Label>
                          <div className='d-flex'>
                          <Form.Control
                          className='me-3'
                          ref={inputRef}
                            type="datetime-local"
                            name="sell_start_date"
                            value={otherFormData.sell_start_date}
                            onChange={handleInputChange}
                            onBlur={checkSellStartDateInput}
                          />
                          <button type='button' className='btn btn-normal-gray' onClick={setSellStartDateInputToday}>設為今日</button>
                          </div>
                          <Form.Text className={`sm-p`}>
                            不可晚於＂活動開始時間＂
                          </Form.Text>
                        </Form.Group>
                      </motion.div>
                    </Col>
                  )}
                  {otherFormData.start_date &&
                    otherFormData.end_date &&
                    otherFormData.sell_start_date && (
                      <Col sm="6">
                        <motion.div
                          initial={{ y: 10, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Form.Group className="mb-1" controlId="endSellTime">
                            <Form.Label id="event-address">
                              <div className="mb-2">結束售票時間</div>
                            </Form.Label>
                            <div className='d-flex'>
                            <Form.Control
                            className='me-3'
                            ref={inputRef}
                              type="datetime-local"
                              name="sell_end_date"
                              value={otherFormData.sell_end_date}
                              onChange={handleInputChange}
                              onBlur={checkSellEndDateInput}
                            />
                            <button type='button' className='btn btn-normal-gray' onClick={setSellEndDateInput}>設為活動開始日</button>
                            </div>
                            <Form.Text className="sm-p">
                              不可晚於＂活動開始時間＂
                            </Form.Text>
                          </Form.Group>
                        </motion.div>
                      </Col>
                    )}
                  <div className="my-5 d-flex justify-content-center">
                    <Button className="px-5" variant="primary" type="submit">
                      <h6 className="m-0">下一步，填寫規格</h6>
                    </Button>
                  </div>
                </Row>
              </Form>
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
          .form-control,
          .form-select {
            background-color: var(--bg-gray-light-color);
            border: 1px solid var(--normal-gray-color);
            resize: none;
            &:disabled {
              background-color: var(--bg-gray-secondary-color);
            }
            &::placeholder {
              color: var(--normal-gray-color);
            }
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
          }
          .on-main {
            background-color: var(--bg-gray-secondary-color);
            border-radius: 10px;
            height: 100%;
          }
          .w-1200 {
            width: 1000px;
          }
          .banner-upload {
            width: 100%;
            height: 450px;
            border: 1px solid var(--normal-gray-color);
            border-radius: 10px;
            cursor: pointer;
            transition: 300ms;
            color: var(--normal-gray-light-color);
            overflow: hidden;
            &:hover {
              color: white;
            }
          }
          .quill {
            .ql-toolbar {
              background-color: var(--normal-gray-light-color);
              border-radius: 5px 5px 0 0;
            }
            .ql-container {
              height: 500px;
              border-radius: 0 0 5px 5px;
              border: 1px solid var(--normal-gray-color);
              background-color: var(--bg-gray-light-color);
              margin-bottom: 16px;
            }
          }
          .ticket-format-01 {
            border: 1px solid var(--normal-gray-color);
            border-radius: 5px;
            background-color: var(--bg-gray-light-color);
          }
          .object-fit {
            img {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
          }
          .btn {
  white-space: nowrap;
}
        `}
      </style>
    </>
  )
}

export default OrganizerForm

OrganizerForm.getLayout = function (page) {
  return <OrganizerLayout>{page}</OrganizerLayout>
}
