
"use client";

import { useState } from 'react';

export default function Home() {
  const [message, setMessage] = useState('');

  const handleCheck = async () =>{
    try{
      const res = await fetch('http://127.0.0.1:8000/check');
      const data = await res.json();
      setMessage(data.message);
    }catch(error){
      console.error('Error fetching data:', error);
    }
  };


  return (
    <div className="flex flex-col">
      <p className="text-2xl font-bold text-blue-600">POSアプリ</p>

    <button className="btn btn-primary w-48" onClick={handleCheck}>check</button>
    {message && <p>ああああ: {message}</p>}

    </div>
  );
}