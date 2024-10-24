// QR コードリーダーのためのコンポーネント

'use client';
import { Html5Qrcode } from 'html5-qrcode';
import { useEffect, useState } from 'react';
import Select from 'react-select';
 
// QRコードリーダーの表示領域のhtmlのID
const qrcodeRegionId = 'html5qr-code-full-region';
 
export default function QrcodeReader({
  onScanSuccess,
  onScanFailure
}) {
  // QRコードリーダーの設定
  const config = { fps: 1, qrbox: { width: 250, height: 250 } };
 
  // カメラの許可
  const [cameraPermission, setCameraPermission] = useState(false);
 
  // 選択したカメラID保存用
  const [selectedCameraId, setSelectedCameraId] = useState('');
 
  // 使用できるカメラ一覧
  const [cameras, setCameras] = useState([]);
 
  // QRコードリーダーインスタンス
  const [html5QrcodeScanner, setHtml5QrcodeScanner] = useState(null);
 
  // カメラ情報を取得するための関数
  const getCameras = async () => {
    await Html5Qrcode.getCameras()
      .then((cameras) => {
        if (cameras && cameras.length) {
          const formattedCameras = cameras.map((camera) => ({
            value: camera.id,
            label: camera.label || `Camera ${camera.id}`,
          }));
          setCameras(formattedCameras);
          setSelectedCameraId(formattedCameras[0].value);
          setCameraPermission(true);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };
 
  // スキャン開始
  const startScan = async () => {
    if (!html5QrcodeScanner) {
      console.error('Scanner is not initialized');
      return;
    }
    try {
      await html5QrcodeScanner.start(
        selectedCameraId,
        config,
        onScanSuccess,
        onScanFailure
      );
    } catch (error) {
      console.error('Error starting the scanner: ', error);
    }
  };
 
  // スキャン停止
  const stopScan = async () => {
    if (!html5QrcodeScanner) {
      console.error('Scanner is not initialized');
      return;
    }
    console.log('stop scan');
    try {
      await html5QrcodeScanner.stop();
    } catch (error) {
      console.error('Error stopping the scanner: ', error);
    }
  };
 
  // カメラ切り替え
  const switchCamera = (targetId) => {
    console.log(targetId);
    setSelectedCameraId(targetId);
  };
 
  useEffect(() => {
    if (!onScanSuccess && !onScanFailure) {
      throw new Error('required callback.');
    }
 
    const scanner = new Html5Qrcode(qrcodeRegionId);
    setHtml5QrcodeScanner(scanner);
 
    return () => {
      scanner.clear();
    };
  }, [onScanSuccess, onScanFailure]);
 
  return (
    <div className='container mx-auto'>
      <div className='max-w-screen-lg' id={qrcodeRegionId} />
      <div>
        {cameras.length > 0 ? (
          <Select
            name='camera'
            options={cameras}
            value={cameras.find(
              (camera) => camera.value === selectedCameraId
            )}
            placeholder='カメラを選択'
            onChange={(camera) => switchCamera(camera.value)}
          />
        ) : (
          <p>カメラがありません</p>
        )}
      </div>
      <div>
        <button
          className='bg-blue-500 hover:bg-blue-700 text-white text-sm font-bold py-1 px-2 rounded mr-2'
          onClick={() => getCameras()}
        >
          カメラ取得
        </button>
        <button
          className='bg-blue-500 hover:bg-blue-700 text-white text-sm font-bold py-1 px-2 rounded mr-2'
          onClick={async () => await startScan()}
          disabled={!cameraPermission && selectedCameraId === ''}
        >
          スキャン開始
        </button>
        <button
          className='bg-red-500 hover:bg-red-700 text-white text-sm font-bold py-1 px-2 rounded'
          onClick={async () => await stopScan()}
        >
          スキャン停止
        </button>
      </div>
    </div>
  );
}
