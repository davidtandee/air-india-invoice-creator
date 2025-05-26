
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
      <div ref={ref} className="bg-white shadow-lg rounded-lg overflow-hidden print:shadow-none print:rounded-none">
        <div className="p-8 space-y-6 print:p-6">
          {/* Header */}
          <div className="border-2 border-gray-300 p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  AI
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">Air India Limited</h1>
                  <p className="text-sm text-gray-600">Excellence in Aviation</p>
                </div>
              </div>
              <div className="text-right text-sm">
                <p><strong>PAN No:</strong> AACCNC6194P</p>
                <p><strong>GST No:</strong> 07AACCN6194P2ZQ</p>
              </div>
            </div>
            
            <div className="text-sm">
              <p className="font-medium">Address:</p>
              <p className="text-gray-700 whitespace-pre-line">{invoiceData.companyAddress}</p>
            </div>
          </div>

          {/* Invoice Info */}
          <div className="grid grid-cols-2 gap-6">
            <div className="border border-gray-300 p-4">
              <h2 className="text-lg font-semibold mb-3 text-gray-800 border-b pb-2">Invoice Information</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium">Invoice No:</span>
                  <span>{invoiceData.invoiceNumber || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Invoice Date:</span>
                  <span>{format(invoiceData.invoiceDate, 'dd/MM/yyyy')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Details:</span>
                  <span>{invoiceData.invoiceDetails || 'N/A'}</span>
                </div>
              </div>
            </div>

            <div className="border border-gray-300 p-4">
              <h2 className="text-lg font-semibold mb-3 text-gray-800 border-b pb-2">Billing Information</h2>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Bill To:</span>
                  <p className="mt-1">{invoiceData.recipientName || 'Customer Name'}</p>
                </div>
                <div>
                  <span className="font-medium">Address:</span>
                  <p className="mt-1 whitespace-pre-line">{invoiceData.recipientAddress || 'Customer Address'}</p>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">State/Code:</span>
                  <span>{invoiceData.stateCode || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Place of Delivery:</span>
                  <span>{invoiceData.placeOfDelivery || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Invoice Table */}
          <div className="border border-gray-300">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-300">
                  <th className="p-3 text-left border-r border-gray-300 w-12">Sl. No</th>
                  <th className="p-3 text-left border-r border-gray-300">Description</th>
                  <th className="p-3 text-right border-r border-gray-300 w-24">Unit Price (₹)</th>
                  <th className="p-3 text-center border-r border-gray-300 w-16">Qty</th>
                  <th className="p-3 text-center border-r border-gray-300 w-16">Tax Rate</th>
                  <th className="p-3 text-center border-r border-gray-300 w-16">Tax Type</th>
                  <th className="p-3 text-right border-r border-gray-300 w-24">Tax Amount (₹)</th>
                  <th className="p-3 text-right w-24">Total Amount (₹)</th>
                </tr>
              </thead>
              <tbody>
                {invoiceData.items.map((item, index) => {
                  const itemTotal = item.unitPrice * item.quantity;
                  const taxAmount = (itemTotal * item.taxRate) / 100;
                  const totalWithTax = itemTotal + taxAmount;

                  return (
                    <tr key={item.id} className="border-b border-gray-200">
                      <td className="p-3 border-r border-gray-200 text-center">{index + 1}</td>
                      <td className="p-3 border-r border-gray-200">{item.description || 'Service'}</td>
                      <td className="p-3 border-r border-gray-200 text-right">{item.unitPrice.toFixed(2)}</td>
                      <td className="p-3 border-r border-gray-200 text-center">{item.quantity}</td>
                      <td className="p-3 border-r border-gray-200 text-center">{item.taxRate}%</td>
                      <td className="p-3 border-r border-gray-200 text-center">{item.taxType}</td>
                      <td className="p-3 border-r border-gray-200 text-right">{taxAmount.toFixed(2)}</td>
                      <td className="p-3 text-right">{totalWithTax.toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Summary */}
          <div className="flex justify-end">
            <div className="w-96 border border-gray-300">
              <div className="bg-gray-100 p-3 border-b border-gray-300">
                <h3 className="font-semibold text-gray-800">Invoice Summary</h3>
              </div>
              <div className="p-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>₹ {totals.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Tax:</span>
                  <span>₹ {totals.totalTax.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-300 pt-2 flex justify-between font-semibold text-base">
                  <span>Grand Total:</span>
                  <span>₹ {totals.grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Amount in Words */}
          <div className="border border-gray-300 p-4">
            <div className="flex">
              <span className="font-medium text-sm">Amount in Words: </span>
              <span className="text-sm ml-2 capitalize">
                {numberToWords(totals.grandTotal)} Rupees Only
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className="grid grid-cols-2 gap-6">
            <div className="border border-gray-300 p-4">
              <h3 className="font-semibold text-gray-800 mb-2">Terms & Conditions</h3>
              <p className="text-xs text-gray-600">
                Refund your all Money After Training letter
              </p>
            </div>
            
            <div className="border border-gray-300 p-4">
              <h3 className="font-semibold text-gray-800 mb-8">For Air India Limited</h3>
              <div className="border-t border-gray-300 pt-2">
                <p className="text-sm text-center">Authorized Signatory</p>
              </div>
            </div>
          </div>

          {/* Print Footer */}
          <div className="text-center text-xs text-gray-500 print:block hidden">
            <p>This is a computer generated invoice and does not require signature.</p>
          </div>
        </div>
      </div>
    );
  }
);

InvoicePreview.displayName = 'InvoicePreview';

export default InvoicePreview;
