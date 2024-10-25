// 'use client';

// import React, { useState } from 'react';
// import QrcodeReaderComponent from './components/QrcodeReaderComponent';

// const Home = () => {
//   const [scannedResult, setScannedResult] = useState('');
//   const [product, setProduct] = useState(null);

//   const handleCheck = async () => {
//     try {
//       const res = await fetch(`https://tech0-gen-7-step4-studentwebapp-pos-34-dwgygndxcgeqb8b4.eastus-01.azurewebsites.net/get-products?code=${scannedResult}`);
//       if (!res.ok) {
//         throw new Error('Network response was not ok');
//       }
//       const data = await res.json();
//       setProduct(data);
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     }
//   };

//   return (
//     <div className="flex flex-col">
//       <p className="text-2xl font-bold text-blue-600">POSアプリ</p>
//       <button className="btn btn-primary mt-4 w-48" onClick={handleCheck}>
//         check
//       </button>
//       {product && (
//         <div>
//           <p>コード: {product.code}</p>
//           <p>名前: {product.name}</p>
//           <p>価格: {product.price}円</p>
//         </div>
//       )}
//       <QrcodeReaderComponent onScan={setScannedResult} />
//     </div>
//   );
// };

// export default Home;

"use client";

import React, { useState, useEffect } from "react";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";

export default function Home() {
  const [barcode, setBarcode] = useState("");
  const [scannedResult, setScannedResult] = useState('');
  const [product, setProduct] = useState(null);
  const [cart, setCart] = useState([]);
  const [scanner, setScanner] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalAmountExclTax, setTotalAmountExclTax] = useState(0);

  const initScanner = () => {
    const html5QrCode = new Html5Qrcode("reader");
    setScanner(html5QrCode);

    Html5Qrcode.getCameras().then((cameras) => {
      if (cameras && cameras.length) {
        const cameraId = cameras[0].id;

        html5QrCode
          .start(
            cameraId,
            {
              fps: 10,
              qrbox: 250,
              formatsToSupport: [Html5QrcodeSupportedFormats.CODE_128],
            },
            (decodedText) => {
              setBarcode(decodedText);
              fetchProductDetails(decodedText); // バーコードがデコードされたら商品詳細を取得
            },
            (errorMessage) => {
              console.log("スキャンエラー:", errorMessage);
            }
          )
          .catch((err) => {
            console.error("バーコードスキャナーの初期化エラー:", err);
          });

        setIsScanning(true);
      } else {
        console.log("カメラが見つかりませんでした。");
      }
    }).catch((err) => {
      console.error("カメラの取得エラー:", err);
    });
  };

  const stopScanner = () => {
    if (scanner) {
      scanner.stop().then(() => {
        console.log("スキャナーを停止しました");
        setIsScanning(false);
      });
    }
  };

  const fetchProductDetails = async () => {
    try {
      const response = await fetch(`https://tech0-gen-7-step4-studentwebapp-pos-34-dwgygndxcgeqb8b4.eastus-01.azurewebsites.net/get-products?code=${scannedResult}`);
      const data = await response.json();
      if (data) {
        setProduct(data);
      } else {
        setProduct({ name: "商品がマスタに未登録です", price: 0 });
      }
    } catch (error) {
      console.error("商品取得エラー:", error);
    }
  };


  const addToCart = () => {
    if (product && product.price > 0) {
      setCart((prevCart) => [...prevCart, { ...product, quantity: 1 }]);
      setProduct(null); // 商品情報をクリア
      setBarcode(""); // バーコード表示をクリア
    }
  };

  const calculateTotal = () => {
    const total = cart.reduce((total, item) => total + item.price * item.quantity, 0);
    setTotalAmount(total);
    setTotalAmountExclTax(total / 1.1); // 税抜金額を計算
  };

  const handlePurchase = async () => {
    try {
      const response = await fetch("https://tech0-gen-7-step4-studentwebapp-pos-34-dwgygndxcgeqb8b4.eastus-01.azurewebsites.net/post-histories");
      if (response.ok) {
        console.log("購入が完了しました");
      } else {
        console.error("購入エラー:", response.statusText);
      }
    } catch (error) {
      console.error("購入エラー:", error);
    } finally {
      // ポップアップを表示
      setShowPopup(true);
    }
  };

  const clearCart = () => {
    setCart([]);
    setShowPopup(false);
    setTotalAmount(0);
    setTotalAmountExclTax(0);
  };

  useEffect(() => {
    // カートが変更されたときに合計を計算
    calculateTotal();
  }, [cart]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-4">ぺーさん・にろ POSアプリ</h1>

        {/* スキャナーコントロール */}
        <div className="mb-4 text-center">
          {!isScanning ? (
            <button
              onClick={initScanner}
              className="bg-blue-500 text-white py-2 px-4 rounded shadow-lg hover:bg-blue-600 transition duration-300"
            >
              スキャン開始
            </button>
          ) : (
            <button
              onClick={stopScanner}
              className="bg-red-500 text-white py-2 px-4 rounded shadow-lg hover:bg-red-600 transition duration-300"
            >
              スキャン停止
            </button>
          )}
        </div>

        {/* QRコードスキャナーエリア */}
        <div className="mb-4 border border-gray-300 rounded-lg p-4">
          <div
            id="reader"
            style={{
              width: "100%",
              height: "auto",
              aspectRatio: "16 / 9",
            }}
          ></div>
        </div>

        {/* 商品詳細表示 */}
        <div className="mb-4 border border-gray-300 rounded-lg p-4">
          <p className="text-lg">コード : {barcode || "スキャン待機中です..."}</p>
          <p className="text-lg">商品名 : {product ? product.name : "商品情報読み取り中です…"}</p>
          <p className="text-lg">価格　 : {product ? product.price : "取得中です…"}</p>
        </div>

        {/* カートに追加ボタン */}
        <div className="text-center mb-4">
          <button
            onClick={addToCart}
            className={`bg-orange-500 text-white py-2 px-4 rounded shadow-lg hover:bg-orange-600 transition duration-300 ${product && product.price > 0 ? '' : 'opacity-50 cursor-not-allowed'}`}
            disabled={!product || product.price === 0}
          >
            商品を追加
          </button>
        </div>

        {/* カート表示 */}
        <h2 className="text-xl font-semibold mb-2 text-center mt-4">商品カート</h2>
        <div className="mt-4 border border-gray-300 rounded-lg p-4">
          <ul>
            {cart.length > 0 ? (
              cart.map((item, index) => (
                <li key={index} className="flex justify-between border-b py-2">
                  <span>
                    {item.name} x {item.quantity}
                  </span>
                  <span>¥{item.price * item.quantity}</span>
                </li>
              ))
            ) : (
              <li className="text-center">カートは空です</li>
            )}
          </ul>

          {/* 合計金額表示 */}
          <div className="mt-4 text-center">
            <p className="text-xl font-bold">合計金額: ¥{totalAmount}</p>
          </div>
        </div>

        {/* 購入ボタン */}
        {cart.length > 0 && (
          <div className="text-center mt-4">
            <button
              onClick={handlePurchase}
              className="bg-blue-500 text-white py-2 px-4 rounded shadow-lg hover:bg-blue-600 transition duration-300"
            >
              購入
            </button>
          </div>
        )}

        {/* 購入確認ポップアップ */}
        {showPopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-lg">
              <h2 className="text-xl font-bold">購入確認</h2>
              <p>この商品を購入しますか？</p>
              <div className="mt-4">
                <button
                  onClick={clearCart}
                  className="bg-red-500 text-white py-2 px-4 rounded shadow-lg hover:bg-red-600 transition duration-300"
                >
                  はい
                </button>
                <button
                  onClick={() => setShowPopup(false)}
                  className="bg-gray-300 text-black py-2 px-4 rounded shadow-lg hover:bg-gray-400 transition duration-300 ml-2"
                >
                  いいえ
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
