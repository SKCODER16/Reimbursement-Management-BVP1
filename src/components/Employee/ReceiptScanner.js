import React, { useState } from 'react';
import Tesseract from 'tesseract.js';

const ReceiptScanner = ({ onScanComplete }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsScanning(true);
    setProgress(0);

    Tesseract.recognize(
      file,
      'eng',
      {
        logger: m => {
          if (m.status === 'recognizing text') {
            setProgress(parseInt(m.progress * 100));
          }
        }
      }
    ).then(({ data: { text } }) => {
      setIsScanning(false);
      extractDataAndNotify(text, file);
    }).catch(err => {
      console.error(err);
      setIsScanning(false);
      alert("Failed to read receipt.");
    });
  };

    const extractDataAndNotify = (text, file) => {
    const amountMatch = text.match(/\$?\s?(\d+\.\d{2})/);
    // basic date match DD/MM/YYYY or YYYY-MM-DD
    const dateMatch = text.match(/\b(\d{1,4}[/-]\d{1,2}[/-]\d{1,4})\b/);
    
    let category = '';
    const textLower = text.toLowerCase();
    if (textLower.includes('restaurant') || textLower.includes('food') || textLower.includes('cafe')) category = 'Food';
    else if (textLower.includes('uber') || textLower.includes('taxi') || textLower.includes('train')) category = 'Travel';
    else if (textLower.includes('hotel') || textLower.includes('inn')) category = 'Hotel';

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64data = reader.result;                
      
      onScanComplete({
        amount: amountMatch ? amountMatch[1] : '',
        date: dateMatch ? dateMatch[1].replace(/\//g, '-') : '', // Ensure formatting if needed, but simple for now
        description: `Auto-scanned receipt`,
        category: category,
        receiptImage: base64data
      });
    }
    reader.readAsDataURL(file);
  };

  return (
    <div style={{ marginBottom: '20px', padding: '15px', background: '#334155', borderRadius: '8px', border: '1px dashed #6366f1' }}>
      <h3 style={{ margin: '0 0 10px 0', color: '#e2e8f0', fontSize: '15px' }}>📷 Auto-fill with Receipt (OCR)</h3>
      <p style={{ margin: '0 0 15px 0', color: '#94a3b8', fontSize: '12px' }}>Upload an image of your receipt and we'll extract the details.</p>
      
      <input 
        type="file" 
        accept="image/*" 
        onChange={handleFileUpload} 
        disabled={isScanning}
        style={{ color: '#fff', fontSize: '13px' }}
      />
      
      {isScanning && (
        <div style={{ marginTop: '15px' }}>
          <div style={{ fontSize: '12px', color: '#10b981', marginBottom: '5px' }}>Scanning... {progress}%</div>
          <div style={{ width: '100%', height: '6px', background: '#1e293b', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ width: `${progress}%`, height: '100%', background: '#10b981', transition: 'width 0.2s' }}></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReceiptScanner;
