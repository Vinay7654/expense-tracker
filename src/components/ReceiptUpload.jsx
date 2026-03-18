import React, { useState } from 'react';
import { Camera, Upload, FileText, X, Check, AlertCircle } from 'lucide-react';

const ReceiptUpload = ({ onReceiptProcessed }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState(null);
  const [error, setError] = useState('');

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleFileUpload = (file) => {
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      setError('Please upload an image (JPG, PNG) or PDF file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    setError('');
    setUploadedFile(file);
    processReceipt(file);
  };

  const processReceipt = async (file) => {
    setIsProcessing(true);
    setExtractedData(null);

    // Simulate OCR processing (in real app, this would call an OCR API)
    setTimeout(() => {
      const mockExtractedData = {
        merchant: 'Restaurant Name',
        date: new Date().toISOString().split('T')[0],
        amount: Math.floor(Math.random() * 2000) + 500,
        category: 'Food & Dining',
        items: [
          { name: 'Main Course', price: 800 },
          { name: 'Beverages', price: 200 },
          { name: 'Service Charge', price: 150 }
        ],
        confidence: 0.87
      };

      setExtractedData(mockExtractedData);
      setIsProcessing(false);
    }, 2000);
  };

  const acceptExtractedData = () => {
    if (extractedData && onReceiptProcessed) {
      onReceiptProcessed({
        amount: extractedData.amount,
        category: extractedData.category,
        note: `Receipt: ${extractedData.merchant}`,
        date: extractedData.date,
        source: 'receipt_upload'
      });
    }
    resetForm();
  };

  const resetForm = () => {
    setUploadedFile(null);
    setExtractedData(null);
    setError('');
    setIsProcessing(false);
  };

  return (
    <div className="card">
      <h2 className="card-title">
        <Camera size={20} />
        Receipt Upload
      </h2>

      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{
          border: `2px dashed ${isDragging ? '#007bff' : '#ddd'}`,
          borderRadius: '8px',
          padding: '32px',
          textAlign: 'center',
          backgroundColor: isDragging ? '#f0f8ff' : '#fafafa',
          cursor: 'pointer',
          transition: 'all 0.3s ease'
        }}
        onClick={() => document.getElementById('fileInput').click()}
      >
        <input
          id="fileInput"
          type="file"
          accept="image/*,.pdf"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
        
        {isProcessing ? (
          <div>
            <div style={{ animation: 'spin 1s linear infinite', marginBottom: '16px' }}>
              <Upload size={32} />
            </div>
            <p>Processing receipt...</p>
            <p style={{ fontSize: '12px', color: '#666' }}>Extracting data from receipt</p>
          </div>
        ) : (
          <div>
            <Upload size={32} style={{ marginBottom: '16px', color: '#666' }} />
            <p style={{ marginBottom: '8px' }}>
              {isDragging ? 'Drop receipt here' : 'Drag & drop receipt here'}
            </p>
            <p style={{ fontSize: '12px', color: '#666', marginBottom: '16px' }}>
              or click to browse files
            </p>
            <p style={{ fontSize: '12px', color: '#999' }}>
              Supports: JPG, PNG, PDF (max 5MB)
            </p>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '12px',
          backgroundColor: '#f8d7da',
          border: '1px solid #f5c6cb',
          borderRadius: '8px',
          color: '#721c24',
          marginTop: '16px'
        }}>
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {/* Uploaded File Info */}
      {uploadedFile && !isProcessing && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px',
          backgroundColor: '#e7f3ff',
          border: '1px solid #b3d9ff',
          borderRadius: '8px',
          marginTop: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={16} />
            <span>{uploadedFile.name}</span>
            <span style={{ fontSize: '12px', color: '#666' }}>
              ({(uploadedFile.size / 1024).toFixed(1)} KB)
            </span>
          </div>
          <button onClick={resetForm} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={16} />
          </button>
        </div>
      )}

      {/* Extracted Data */}
      {extractedData && (
        <div style={{
          border: '1px solid #ddd',
          borderRadius: '8px',
          padding: '16px',
          marginTop: '16px',
          backgroundColor: '#f9f9f9'
        }}>
          <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Check size={20} style={{ color: '#28a745' }} />
            Extracted Data (Confidence: {(extractedData.confidence * 100).toFixed(0)}%)
          </h3>
          
          <div style={{ display: 'grid', gap: '12px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: '500' }}>Merchant:</span>
              <span>{extractedData.merchant}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: '500' }}>Date:</span>
              <span>{extractedData.date}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: '500' }}>Amount:</span>
              <span style={{ fontWeight: 'bold', color: '#007bff' }}>
                ₹{extractedData.amount.toLocaleString('en-IN')}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: '500' }}>Category:</span>
              <span>{extractedData.category}</span>
            </div>
          </div>

          {extractedData.items && extractedData.items.length > 0 && (
            <div style={{ marginBottom: '16px' }}>
              <h4 style={{ marginBottom: '8px' }}>Items:</h4>
              <div style={{ display: 'grid', gap: '4px' }}>
                {extractedData.items.map((item, index) => (
                  <div key={index} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                    <span>{item.name}</span>
                    <span>₹{item.price.toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={acceptExtractedData} className="btn btn-primary">
              <Check size={16} />
              Accept & Add Expense
            </button>
            <button onClick={resetForm} className="btn btn-secondary">
              <X size={16} />
              Cancel
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ReceiptUpload;
