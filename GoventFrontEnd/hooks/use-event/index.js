import React, { useState, useEffect } from 'react'
// import { CiGlass } from 'react-icons/ci'

export default function useEvents() {
  const [data, setData] = useState()
  const [error, setError] = useState()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      fetch('http://localhost:3005/api/events')
        .then((res) => res.json())
        .then((text) => {
          // setData(text)
          setData(text.data ? text.data.posts : [])
        })
    }

    fetchData()
  }, [])
  // console.log(data);
  return {
    loading,
    data,
    error,
  }
}
