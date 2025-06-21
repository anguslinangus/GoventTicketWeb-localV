import SingleMapDetail from '@/components/product/SingleMapDetail'
import { useState, useEffect } from 'react'

function Map() {
  // 給一個預設的中心點
  const [lat, setLat] = useState(25.033198)
  const [lng, setLng] = useState(121.543575)

   // 儲存地標的數據
   const [landmarks, setLandmarks] = useState([
    // { lat: 25.033198, lng: 121.543575, title: '測試', content: 'this is a sample string' },
    { lat: 25.026312, lng: 121.543439, title: '捷運科技大樓站', content: 'this is another sample string' },
    { lat: 25.032728, lng: 121.545635, title: '台北市政府', content: 'this is another sample string' },
    { lat: 25.037531, lng: 121.565732, title: '松山文創園區', content: 'this is another sample string' },
    { lat: 25.041457, lng: 121.569365, title: '台北101', content: 'this is another sample string' },

  ]);

  useEffect(() => {
    console.log(lat)
  }, [lat])

  useEffect(() => {
    console.log(lng)
  }, [lng])

  return (
    <>
      {/* <GeocodeSearch setLat={setLat} setLng={setLng} /> */}
      {/* {landmarks.map((landmark, i) => ( */}
        <SingleMapDetail
          // key={i}
          lat={landmarks[0].lat}
          lng={landmarks[0].lng}
          // infoTitle={landmark.title}
          // infoContent={landmark.content}
          landmarks={landmarks}
        />
      {/* ))} */}
    </>
  )
}

export default Map


// import React, { Component } from 'react';
// import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';

// const mapStyles = {
//   width: '100%',
//   height: '100%',
// };

// const locations = [
//   { lat: 22.5789248, lng: 120.3000704 },
//   { latitude: 22.7007095, longitude: 120.2960015 },
//   // 更多位置...
// ];

// const formattedLocations = locations.map(location => ({
//   Position: {
//     PositionLat: location.lat || location.latitude,
//     PositionLon: location.lng || location.longitude,
//   }
// }));

// class MapContainer extends Component {
//   constructor(props) {
//     super(props);
//   }

//   render() {
//     return (
//       <Map
//         google={this.props.google}
//         zoom={8}
//         style={mapStyles}
//         initialCenter={{ lat: 23.5, lng: 120 }}
//       >
//         {this.props.data.map((d, i) => (
//           <Marker
//             key={i}
//             position={{ lat: d.Position.PositionLat, lng: d.Position.PositionLon }}
//           />
//         ))}
//       </Map>
//     );
//   }
// }

// export default GoogleApiWrapper({
//   apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY // 使用環境變數
// })(MapContainer);

// // 在另一個元件中使用 MapContainer
// // <MapContainer data={formattedLocations} />