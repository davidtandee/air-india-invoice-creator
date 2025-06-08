
import React, { forwardRef } from 'react';
import { format } from 'date-fns';
import { InvoiceData, InvoiceTotals } from '@/types/invoice';
import { numberToWords } from '@/utils/numberToWords';

interface InvoicePreviewProps {
  invoiceData: InvoiceData;
  totals: InvoiceTotals;
}

const InvoicePreview = forwardRef<HTMLDivElement, InvoicePreviewProps>(
  ({ invoiceData, totals }, ref) => {
    return (
      <div ref={ref} className="bg-white shadow-lg rounded-lg overflow-hidden print:shadow-none print:rounded-none min-h-screen">
        <div className="p-8 space-y-8 print:p-6">
          {/* Header */}
          <div className="border-2 border-gray-300 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                {invoiceData.companyLogo ? (
                  <div className="w-16 h-16 rounded-full overflow-hidden">
                    <img 
                      src={invoiceData.companyLogo} 
                      alt="Company Logo" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    AI
                  </div>
                )}
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">Air India Limited</h1>
                  <p className="text-base text-gray-600">Excellence in Aviation</p>
                </div>
              </div>
              <div className="text-right text-base">
                <p><strong>PAN No:</strong> AACCNC6194P</p>
                <p><strong>GST No:</strong> 07AACCN6194P2ZQ</p>
              </div>
            </div>
            
            <div className="text-base">
              <p className="font-medium text-lg mb-2">Address:</p>
              <p className="text-gray-700 whitespace-pre-line leading-relaxed">{invoiceData.companyAddress}</p>
            </div>
          </div>

          {/* Invoice Info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="border border-gray-300 p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-3">Invoice Information</h2>
              <div className="space-y-3 text-base">
                <div className="flex justify-between">
                  <span className="font-medium">Invoice No:</span>
                  <span className="text-lg font-semibold">{invoiceData.invoiceNumber || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Invoice Date:</span>
                  <span className="text-lg">{format(invoiceData.invoiceDate, 'dd/MM/yyyy')}</span>
                </div>
                <div className="flex flex-col space-y-2">
                  <span className="font-medium">Details:</span>
                  <span className="text-lg bg-gray-50 p-2 rounded">{invoiceData.invoiceDetails || 'N/A'}</span>
                </div>
              </div>
            </div>

            <div className="border border-gray-300 p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-3">Billing Information</h2>
              <div className="space-y-3 text-base">
                <div>
                  <span className="font-medium text-lg">Bill To:</span>
                  <p className="mt-2 text-lg font-medium bg-blue-50 p-2 rounded">{invoiceData.recipientName || 'Customer Name'}</p>
                </div>
                <div>
                  <span className="font-medium">Address:</span>
                  <p className="mt-2 whitespace-pre-line leading-relaxed bg-gray-50 p-3 rounded">{invoiceData.recipientAddress || 'Customer Address'}</p>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">State/Code:</span>
                  <span className="text-lg">{invoiceData.stateCode || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Place of Delivery:</span>
                  <span className="text-lg">{invoiceData.placeOfDelivery || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Invoice Table */}
          <div className="border border-gray-300 overflow-x-auto">
            <table className="w-full text-base">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-300">
                  <th className="p-4 text-left border-r border-gray-300 w-16">Sl. No</th>
                  <th className="p-4 text-left border-r border-gray-300">Description</th>
                  <th className="p-4 text-right border-r border-gray-300 w-32">Unit Price (₹)</th>
                  <th className="p-4 text-center border-r border-gray-300 w-20">Qty</th>
                  <th className="p-4 text-center border-r border-gray-300 w-24">Tax Rate</th>
                  <th className="p-4 text-center border-r border-gray-300 w-24">Tax Type</th>
                  <th className="p-4 text-right border-r border-gray-300 w-32">Tax Amount (₹)</th>
                  <th className="p-4 text-right w-32">Total Amount (₹)</th>
                </tr>
              </thead>
              <tbody>
                {invoiceData.items.map((item, index) => {
                  const itemTotal = item.unitPrice * item.quantity;
                  const taxAmount = (itemTotal * item.taxRate) / 100;
                  const totalWithTax = itemTotal + taxAmount;

                  return (
                    <tr key={item.id} className="border-b border-gray-200">
                      <td className="p-4 border-r border-gray-200 text-center font-medium">{index + 1}</td>
                      <td className="p-4 border-r border-gray-200">
                        <div className="bg-yellow-50 p-2 rounded font-medium">
                          {item.description || 'Service'}
                        </div>
                      </td>
                      <td className="p-4 border-r border-gray-200 text-right font-semibold text-lg">₹ {item.unitPrice.toFixed(2)}</td>
                      <td className="p-4 border-r border-gray-200 text-center font-medium text-lg">{item.quantity}</td>
                      <td className="p-4 border-r border-gray-200 text-center font-medium">{item.taxRate}%</td>
                      <td className="p-4 border-r border-gray-200 text-center font-medium bg-green-50">{item.taxType}</td>
                      <td className="p-4 border-r border-gray-200 text-right font-semibold">₹ {taxAmount.toFixed(2)}</td>
                      <td className="p-4 text-right font-bold text-lg text-blue-600">₹ {totalWithTax.toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Summary */}
          <div className="flex justify-end">
            <div className="w-full max-w-md border border-gray-300">
              <div className="bg-gray-100 p-4 border-b border-gray-300">
                <h3 className="font-semibold text-xl text-gray-800">Invoice Summary</h3>
              </div>
              <div className="p-4 space-y-3 text-base">
                <div className="flex justify-between">
                  <span className="font-medium">Subtotal:</span>
                  <span className="text-lg font-semibold">₹ {totals.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Total Tax:</span>
                  <span className="text-lg font-semibold">₹ {totals.totalTax.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-300 pt-3 flex justify-between font-bold text-xl bg-blue-50 p-3 rounded">
                  <span>Grand Total:</span>
                  <span className="text-blue-600">₹ {totals.grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Amount in Words */}
          <div className="border border-gray-300 p-6 bg-yellow-50">
            <div className="flex flex-col space-y-2">
              <span className="font-semibold text-lg">Amount in Words:</span>
              <span className="text-lg font-medium capitalize bg-white p-3 rounded border">
                {numberToWords(totals.grandTotal)} Rupees Only
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="border border-gray-300 p-6">
              <h3 className="font-semibold text-xl text-gray-800 mb-4">Terms & Conditions</h3>
              <p className="text-base text-gray-600 bg-gray-50 p-3 rounded">
                Refund your all Money After Training letter
              </p>
            </div>
            
            <div className="border border-gray-300 p-6">
              <h3 className="font-semibold text-xl text-gray-800 mb-12">For Air India Limited</h3>
              <div className="border-t border-gray-300 pt-4">
                <p className="text-base text-center font-medium">Authorized Signatory</p>
              </div>
            </div>
          </div>

          {/* Print Footer */}
          <div className="text-center text-sm text-gray-500 print:block hidden mt-8">
            <p>This is a computer generated invoice and does not require signature.</p>
          </div>
        </div>
      </div>
    );
  }
);

InvoicePreview.displayName = 'InvoicePreview';

export default InvoicePreview;
