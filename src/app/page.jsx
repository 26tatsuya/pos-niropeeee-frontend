
// "use client";

// import { useState } from 'react';

// export default function Home() {
//   const [message, setMessage] = useState('');

//   const handleCheck = async () =>{
//     try{
//       const res = await fetch('http://127.0.0.1:8000/check');
//       const data = await res.json();
//       setMessage(data.message);
//     }catch(error){
//       console.error('Error fetching data:', error);
//     }
//   };


//   return (
//     <div className="flex flex-col">
//       <p className="text-2xl font-bold text-blue-600">POSアプリ</p>

//     <button className="btn btn-primary w-48" onClick={handleCheck}>check</button>
//     {message && <p>ああああ: {message}</p>}

//     </div>
//   );
// }

'use client';

import React, { useState } from 'react';
import QrcodeReaderComponent from './components/QrcodeReaderComponent';

const Home = () => {
  const [scannedResult, setScannedResult] = useState('');
  const [product, setProduct] = useState(null);

  const handleCheck = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/get-products?code=${scannedResult}`);
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await res.json();
      setProduct(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div className="flex flex-col">
      <p className="text-2xl font-bold text-blue-600">POSアプリ</p>
      <button className="btn btn-primary mt-4 w-48" onClick={handleCheck}>
        check
      </button>
      {product && (
        <div>
          <p>コード: {product.code}</p>
          <p>名前: {product.name}</p>
          <p>価格: {product.price}円</p>
        </div>
      )}
      <QrcodeReaderComponent onScan={setScannedResult} />
    </div>
  );
};

export default Home;
