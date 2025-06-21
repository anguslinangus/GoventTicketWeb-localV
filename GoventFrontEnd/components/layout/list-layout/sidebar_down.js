import React, { useState, useEffect } from 'react'
import City from '@/data/event/str.json'

export default function SideBarDown() {
  const categories = [
    '演唱會',
    '展覽',
    '快閃活動',
    '市集',
    '粉絲見面會',
    '課程講座',
    '體育賽事',
    '景點門票',
  ]
  const [selectedCategories, setSelectedCategories] = useState({})

  const handleOnChange = (category) => {
    const newSelectedCategories = {
      ...selectedCategories,
      [category]: !selectedCategories[category],
    }

    // 更新選中的類別
    setSelectedCategories(newSelectedCategories)

    // 檢查是否所有單獨的類別都被選中了
    const allSelected = categories.every((cat) => newSelectedCategories[cat])
    // 如果是，也選中"所有類型"
    if (allSelected) {
      newSelectedCategories['所有類型'] = true
      setSelectedCategories(newSelectedCategories)
    } else if (selectedCategories['所有類型'] && !allSelected) {
      // 如果"所有類型"是選中的但不是所有類別都選中，取消選中"所有類型"
      newSelectedCategories['所有類型'] = false
      setSelectedCategories(newSelectedCategories)
    }
  }

  // 當選擇"所有類型"時的處理
  const handleSelectAll = () => {
    const newSelection = {}
    if (!selectedCategories['所有類型']) {
      categories.forEach((cat) => (newSelection[cat] = true))
      newSelection['所有類型'] = true
    } else {
      categories.forEach((cat) => (newSelection[cat] = false))
      newSelection['所有類型'] = false
    }
    setSelectedCategories(newSelection)
  }

  //程式篩選

  const city = City
  const [regions, setRegions] = useState([]) // 用于存储从 JSON 文件中获取的地区选项
  const [selectedRegions, setSelectedRegions] = useState({}) // 用于存储选中的地区

  // 从 JSON 文件中获取选项并存储到状态中
  useEffect(() => {
    // 这里假设 jsonData 是你提供的 JSON 数据
    const treeData = convertToTree(city)
    setRegions(treeData)
  }, [])

  // 处理地区复选框的点击事件
  const handleRegionCheckboxChange = (regionId, isChecked) => {
    setSelectedRegions((prevState) => ({
      ...prevState,
      [regionId]: isChecked,
    }))
  }

  // 辅助函数：将扁平结构的数据转换成树形结构
  function convertToTree(data) {
    const map = new Map()

    // 将数据映射到 map 中
    data.forEach((item) => {
      map.set(item.id, { ...item, children: [] })
    })

    // 构建树形结构
    const result = []
    data.forEach((item) => {
      if (item.parent_id !== null) {
        map.get(item.parent_id).children.push(map.get(item.id))
      } else {
        result.push(map.get(item.id))
      }
    })

    return result
  }

  return (
    <div className="sidebar me-3 col-md-2 col-3">
      <div className="upSidebar">
        <h6>活動種類</h6>
        <div className="form-group">
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              checked={!!selectedCategories['所有類型']}
              onChange={handleSelectAll}
              id="flexCheckAll"
            />
            <label className="form-check-label" htmlFor="flexCheckAll">
              所有類型
            </label>
          </div>
          {categories.map((category, index) => (
            <div className="form-check" key={index}>
              <input
                className="form-check-input"
                type="checkbox"
                checked={!!selectedCategories[category]}
                onChange={() => handleOnChange(category)}
                id={`flexCheck${index}`}
              />
              <label className="form-check-label" htmlFor={`flexCheck${index}`}>
                {category}
              </label>
            </div>
          ))}
        </div>
      </div>
      <hr />
      <div className="downSidebar no-border">
        <h6>地區</h6>
        <div className="accordion" id="accordionExample">
          {/* 渲染地区复选框 */}
          {regions.map((region) => (
            <div
              key={region.id}
              className="accordion-item bg-bg-gray text-white"
            >
              {/* title */}
              <h2 className="accordion-header" id={`heading-${region.id}`}>
                <button
                  className="accordion-button p-1 gap-2 bg-bg-gray text-white"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target={`#collapse-${region.id}`}
                  aria-expanded="true"
                  aria-controls={`collapse-${region.id}`}
                >
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={selectedRegions[region.id] || false}
                    onChange={(e) =>
                      handleRegionCheckboxChange(region.id, e.target.checked)
                    }
                  />
                  <label
                    className="form-check-label"
                    htmlFor={`flexCheck-${region.id}`}
                  >
                    {region.name}
                  </label>
                </button>
              </h2>
              {/* selection */}
              <div
                id={`collapse-${region.id}`}
                className="accordion-collapse collapse show"
                aria-labelledby={`heading-${region.id}`}
                data-bs-parent="#accordionExample"
              >
                <div className="accordion-body">
                  {/* 渲染地区下属城市复选框 */}
                  {region.children.map((city) => (
                    <div key={city.id} className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={`flexCheck-${city.id}`}
                        checked={selectedRegions[city.id] || false}
                        onChange={(e) =>
                          handleRegionCheckboxChange(city.id, e.target.checked)
                        }
                      />
                      <label
                        className="form-check-label"
                        htmlFor={`flexCheck-${city.id}`}
                      >
                        {city.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
