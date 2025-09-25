import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface PayOSCheckoutProps {
  checkoutUrl: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  onExit?: () => void;
}

export default function PayOSCheckout({ 
  checkoutUrl, 
  onSuccess, 
  onCancel, 
  onExit 
}: PayOSCheckoutProps) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!checkoutUrl) {
      setError('Thiếu URL thanh toán');
      setIsLoading(false);
      return;
    }

    // Simple iframe approach to avoid PayOS script issues
    setIsLoading(false);
  }, [checkoutUrl]);

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <div className="text-red-600 text-lg mb-2">⚠️</div>
        <h3 className="text-red-800 font-semibold mb-2">Lỗi thanh toán</h3>
        <p className="text-red-600">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="w-full">
      {isLoading && (
        <div className="bg-white rounded-lg p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải giao diện thanh toán...</p>
        </div>
      )}
      
      {!isLoading && !error && (
        <div className="w-full">
          <iframe
            src={checkoutUrl}
            className="w-full h-[600px] border border-gray-200 rounded-lg"
            title="PayOS Checkout"
            allow="payment"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-top-navigation"
          />
          
          <div className="mt-4 text-center space-y-2">
            <p className="text-sm text-gray-600">
              Nếu không thấy giao diện thanh toán, 
              <a 
                href={checkoutUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline ml-1"
              >
                click vào đây để mở trong tab mới
              </a>
            </p>
            
            <div className="flex gap-2 justify-center">
              <button
                onClick={() => onSuccess?.()}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
              >
                Đã thanh toán thành công
              </button>
              <button
                onClick={() => onCancel?.()}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
              >
                Hủy thanh toán
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
