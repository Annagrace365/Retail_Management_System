import React, { useState } from 'react';
import { Printer, Download, Eye } from 'lucide-react';
import { Order } from '../types';

interface ReceiptPrinterProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
}

const ReceiptPrinter: React.FC<ReceiptPrinterProps> = ({ order, isOpen, onClose }) => {
  const [isPrinting, setIsPrinting] = useState(false);
  const [isPreview, setIsPreview] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const handlePrint = async () => {
    setIsPrinting(true);
    
    // Simulate printing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // In a real implementation, you would:
    // 1. Connect to a thermal printer
    // 2. Format the receipt for thermal printing
    // 3. Send print commands
    
    console.log('Printing receipt for order:', order.order_id);
    setIsPrinting(false);
    onClose();
  };

  const handleDownload = () => {
    // Generate PDF receipt
    const receiptContent = generateReceiptContent();
    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt-${order.order_id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generateReceiptContent = () => {
    const receipt = `
================================
    RETAIL MANAGEMENT SYSTEM
================================

Order #${order.order_id}
Date: ${new Date(order.order_date).toLocaleString()}
Customer: ${order.customer_name}

--------------------------------
ITEMS:
${order.order_items?.map(item => 
  `${item.product_name} x${item.quantity} = ${formatCurrency(item.total_price)}`
).join('\n') || 'No items'}

--------------------------------
TOTAL: ${formatCurrency(order.amount)}

================================
Thank you for your business!
================================
    `;
    return receipt;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Receipt Printer</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div className="text-center">
            <Printer className="w-12 h-12 text-primary-600 mx-auto mb-4" />
            <h4 className="font-medium text-gray-900">Order #{order.order_id}</h4>
            <p className="text-sm text-gray-600">
              Customer: {order.customer_name}
            </p>
            <p className="text-sm text-gray-600">
              Total: {formatCurrency(order.amount)}
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => setIsPreview(!isPreview)}
              className="w-full btn btn-secondary"
            >
              <Eye className="w-4 h-4 mr-2" />
              {isPreview ? 'Hide' : 'Show'} Preview
            </button>

            <button
              onClick={handleDownload}
              className="w-full btn btn-secondary"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Receipt
            </button>

            <button
              onClick={handlePrint}
              disabled={isPrinting}
              className="w-full btn btn-primary"
            >
              {isPrinting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Printing...
                </>
              ) : (
                <>
                  <Printer className="w-4 h-4 mr-2" />
                  Print Receipt
                </>
              )}
            </button>
          </div>

          {isPreview && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h5 className="font-medium text-gray-900 mb-2">Receipt Preview:</h5>
              <pre className="text-xs text-gray-700 whitespace-pre-wrap font-mono">
                {generateReceiptContent()}
              </pre>
            </div>
          )}

          <div className="text-xs text-gray-500 text-center">
            <p>Note: This is a placeholder component.</p>
            <p>In production, integrate with a thermal printer.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptPrinter;
