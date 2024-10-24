// 読み取った QR コードの内容を表示するコンポーネント

'use client';
import { useEffect, useState } from 'react';
import QrcodeReader from './QrcodeReader';

export default function QrcodeReaderComponent({ onScan }) {
  const [scannedTime, setScannedTime] = useState(new Date());
  const [scannedResult, setScannedResult] = useState('');

  useEffect(() => {
    onScan(scannedResult);
  }, [scannedResult, onScan]);

  // QRコードを読み取った時の実行する関数
  const onNewScanResult = (result) => {
    console.log('QRコードスキャン結果');
    console.log(result);
    setScannedTime(new Date());
    setScannedResult(result);
  };

  return (
    <>
      <QrcodeReader
        onScanSuccess={onNewScanResult}
        onScanFailure={(error) => {
          console.error('QR scan error', error);
        }}
      />
      <div>
        <h2 className='mt-6'>スキャン日時：{scannedTime.toLocaleDateString()}</h2>
        <h2>スキャン結果：{scannedResult}</h2>
      </div>
    </>
  );
}
