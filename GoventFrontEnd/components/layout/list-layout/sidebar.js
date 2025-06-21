import React, { useState, useEffect, useContext } from 'react'
import City from '@/data/event/str.json'
import { CategoriesProvider, useCategories } from '@/hooks/use-categories'

import { useRouter } from 'next/router'

export default function Sidebar(props) {
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

  // const { setSelectedCategories, selectedCategories } = useCategories()//鉤子

  const [selectedCategories, setSelectedCategories] = useState({})
  const [selectedRegions, setSelectedRegions] = useState({})

  const router = useRouter()
  useEffect(() => {
    // 解析 URL 参数
    const { query } = router
    // 如果 URL 中包含特定参数，则设置状态
    if (query.category) {
      setSelectedCategories({ [query.category]: true })
      console.log('Selected Categories after setting:', selectedCategories)
    }
    // else if (query.regionName) {
    //   setSelectedRegions({ [query.regionName]: true })
    // }
    if (query.regionName) {
      const regionNames = query.regionName.split(',')
      const newSelectedRegions = {}
      regionNames.forEach((regionName) => {
        newSelectedRegions[regionName] = true
      })
      setSelectedRegions(newSelectedRegions)
    }
  }, [router.query])

  useEffect(() => {
    const selectedCategoriesArray = Object.keys(selectedCategories).filter(
      (category) => selectedCategories[category]
    )
    const selectedRegionsNames = Object.keys(selectedRegions).filter(
      (regionOrCityName) => selectedRegions[regionOrCityName]
    )

    // 回傳選擇的篩選條件給父元素
    props.onFilterChange(selectedCategoriesArray, selectedRegionsNames)
  }, [selectedCategories, selectedRegions])

  const handleOnChange = (category) => {
    const newSelectedCategories = {
      ...selectedCategories,
      [category]: !selectedCategories[category],
    }
    setSelectedCategories(newSelectedCategories)
  }
  console.log(selectedRegions)
  console.log(selectedCategories)
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

  // const handleRegionCheckboxChange = (regionName, isChecked) => {
  //   setSelectedRegions((prevState) => ({
  //     ...prevState,
  //     [regionName]: isChecked,
  //   }))
  // }

  // const handleCityCheckboxChange = (cityName, isChecked) => {
  //   setSelectedRegions((prevState) => ({
  //     ...prevState,
  //     [cityName]: isChecked,
  //   }))
  // }

  const handleRegionCheckboxChange = (regionName, isChecked) => {
    const region = City.find((r) => r.name === regionName)
    const updatedRegions = { ...selectedRegions, [regionName]: isChecked }

    // 更新该地区下所有城市的选中状态
    region.cities.forEach((city) => {
      updatedRegions[city.name] = isChecked
    })

    setSelectedRegions(updatedRegions)
  }

  const handleCityCheckboxChange = (cityName, isChecked) => {
    const updatedRegions = { ...selectedRegions, [cityName]: isChecked }

    // 检查如果所有同地区的城市都被选中/取消选中，相应更新地区的选中状态
    const region = City.find((r) =>
      r.cities.some((city) => city.name === cityName)
    )
    const allCitiesChecked = region.cities.every((city) =>
      updatedRegions[city.name] !== undefined
        ? updatedRegions[city.name]
        : false
    )
    const anyCityChecked = region.cities.some(
      (city) => updatedRegions[city.name] === true
    )

    // 如果所有城市都选中，则地区选中；如果有一个城市未选中，地区取消选中
    updatedRegions[region.name] = allCitiesChecked && anyCityChecked

    setSelectedRegions(updatedRegions)
  }

  return (
    <>
      <div className="upSidebar mb-4">
        <h5 className='mb-3'>活動種類</h5>
        <div className="form-group">
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              checked={!!selectedCategories['所有類型']}
              onChange={handleSelectAll}
              id="flexCheckAll"
            />
            <label className="form-check-label mb-2" htmlFor="flexCheckAll">
              所有類型
            </label>
          </div>
          {categories.map((category, index) => (
            <div className="form-check mb-2" key={index}>
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
      <hr className='mb-4'/>
      <div className="downSidebar no-border">
        <h5 className='mb-3'>地區</h5>
        <div className="accordion" id="accordionExample">
          {City.map((region) => (
            <div
              key={region.id}
              className="accordion-item regionColor text-white mb-2"
            >
              <h2 className="accordion-header" id={`heading-${region.id}`}>
                <button
                  className="accordion-button p-0 gap-2 text-white"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target={`#collapse-${region.id}`}
                  aria-expanded="true"
                  aria-controls={`collapse-${region.id}`}
                >
                  <input
                    type="checkbox"
                    className="form-check-input m-0"
                    checked={selectedRegions[region.name] || false}
                    onChange={(e) =>
                      handleRegionCheckboxChange(region.name, e.target.checked)
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
              <div
                id={`collapse-${region.id}`}
                className="accordion-collapse collapse show"
                aria-labelledby={`heading-${region.id}`}
                data-bs-parent="#accordionExample"
              >
                <div className="accordion-body">
                  {region.cities.map((city) => (
                    <div key={city.id} className="form-check mb-1">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={`flexCheck-${city.id}`}
                        checked={selectedRegions[city.name] || false}
                        onChange={(e) =>
                          handleCityCheckboxChange(city.name, e.target.checked)
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
      <style global jsx>{`
      input{
        background-color: white;
      }
        .regionColor {
          background-color: #151515;
          color: #fff;
        }
        .accordion-item, .accordion-button{
          background-color: #00000000 !important;
        }
        .accordion-button:focus{
          box-shadow: none !important;
        }
        .collapsed::after {
          background-image: var(--bs-accordion-btn-active-icon);
        }
      `}</style>
    </>
  )
}
