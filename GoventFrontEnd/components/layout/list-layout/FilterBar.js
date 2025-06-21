// import React from 'react'
// import Categories from '@/data/event/activity_category.json'

// const FilterBar = ({ categories, category, setCategory }) => {
//   const handleCheckboxChange = (event) => {
//     const { value, checked } = event.target
//     if (checked) {
//       setCategory([...category, value])
//     } else {
//       setCategory(category.filter((cat) => cat !== value))
//     }
//   }

//   return (
//     <div>
//       {categories.map((cat) => (
//         <div key={cat}>
//           <label>
//             <input
//               type="checkbox"
//               value={cat}
//               checked={category.includes(cat)}
//               onChange={handleCheckboxChange}
//             />
//             {cat}
//           </label>
//         </div>
//       ))}
//     </div>
//   )
// }

// export default FilterBar
