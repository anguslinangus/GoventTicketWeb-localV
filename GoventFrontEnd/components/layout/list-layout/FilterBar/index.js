import React, { useEffect } from 'react'
import PriceRangeRadio from './PriceRangeRadio'
import TagCheckbox from './TagCheckbox'

function FilterBar({
  priceRangeTypes,
  priceRange,
  setPriceRange,
  categories,
  category="",
  setCategory=()=>{},}) {
 
  const handleChecked = (e) => {
    console.log(e.target.value)
    const value = e.target.value
    
    if (category.includes(value)) {
      const newTags = category.filter((v) => v !== value)
      console.log(newTags);
      setCategory(newTags)
    }else{
      return setCategory([...category, value])
    }
  }
  console.log(category);
  
  return (
    <>
      <h2 className="grid-title">
        <i className="fa fa-filter"></i> 過濾
      </h2>
      <hr />

      <h4>價格</h4>

      {priceRangeTypes.map((value, i) => (
        <PriceRangeRadio
          key={i}
          value={value}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
        />
      ))}

      <hr />

      <h4>
        標籤
        <button className="btn btn-link btn-sm" onClick={() => setCategory([])}>
          重設
        </button>
      </h4>

      <p>有包含勾選標籤均會顯示</p>
      {categories.map((value, i) => (
        <TagCheckbox
          value={value}
          key={i}
          category={category}
          handleChecked={handleChecked}
        />
      ))}

      <div className="padding"></div>
    </>
  )
}

export default FilterBar
