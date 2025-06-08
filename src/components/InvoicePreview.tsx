
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
    // Demo data if fields are empty
    const demoName = "Hafiz Ahmed Choudhury";
    const demoAddress = `C/O: Rukiya Bibi Choudhury,
Sultanicherra,
VTC: palaicherra pt ll,
PO: Jamira Bazar,
Sub Dist: katlichara
Dist: Hailakandi,
State: Assam.
PIN CODE: 788162`;

    return (
      <div ref={ref} className="bg-white shadow-lg rounded-lg overflow-hidden print:shadow-none print:rounded-none w-[210mm] min-h-[297mm] mx-auto">
        <div className="p-4 space-y-4 print:p-3">
          {/* Header */}
          <div className="border-2 border-gray-300 p-3">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                {invoiceData.companyLogo ? (
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <img 
                      src={invoiceData.companyLogo} 
                      alt="Company Logo" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    AI
                  </div>
                )}
                <div>
                  <h1 className="text-xl font-bold text-gray-800">Air India Limited</h1>
                  <p className="text-xs text-gray-600">Excellence in Aviation</p>
                </div>
              </div>
              <div className="text-right text-xs">
                <p><strong>PAN No:</strong> AACCNC6194P</p>
                <p><strong>GST No:</strong> 07AACCN6194P2ZQ</p>
              </div>
            </div>
            
            <div className="text-xs">
              <p className="font-medium text-sm mb-1">Address:</p>
              <p className="text-gray-700 whitespace-pre-line leading-relaxed">{invoiceData.companyAddress}</p>
            </div>
          </div>

          {/* Invoice Info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="border border-gray-300 p-3">
              <h2 className="text-sm font-semibold mb-2 text-gray-800 border-b pb-2">Invoice Information</h2>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="font-medium">Invoice No:</span>
                  <span className="text-sm font-semibold">{invoiceData.invoiceNumber || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Invoice Date:</span>
                  <span className="text-sm">{format(invoiceData.invoiceDate, 'dd/MM/yyyy')}</span>
                </div>
                <div className="flex flex-col space-y-1">
                  <span className="font-medium">Details:</span>
                  <span className="text-sm bg-gray-50 p-2 rounded">{invoiceData.invoiceDetails || 'N/A'}</span>
                </div>
              </div>
            </div>

            <div className="border border-gray-300 p-3">
              <h2 className="text-sm font-semibold mb-2 text-gray-800 border-b pb-2">Billing Information</h2>
              <div className="space-y-2 text-xs">
                <div>
                  <span className="font-medium text-sm">Bill To:</span>
                  <p className="mt-1 text-sm font-medium bg-blue-50 p-2 rounded">
                    {invoiceData.recipientName || demoName}
                  </p>
                </div>
                <div>
                  <span className="font-medium">Address:</span>
                  <p className="mt-1 whitespace-pre-line leading-relaxed bg-gray-50 p-2 rounded text-xs">
                    {invoiceData.recipientAddress || demoAddress}
                  </p>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">State/Code:</span>
                  <span className="text-sm">{invoiceData.stateCode || '18 - Assam'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Place of Delivery:</span>
                  <span className="text-sm">{invoiceData.placeOfDelivery || 'Assam'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Invoice Table */}
          <div className="border border-gray-300 overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-300">
                  <th className="p-2 text-left border-r border-gray-300 w-12">Sl. No</th>
                  <th className="p-2 text-left border-r border-gray-300">Description</th>
                  <th className="p-2 text-right border-r border-gray-300 w-24">Unit Price (₹)</th>
                  <th className="p-2 text-center border-r border-gray-300 w-16">Qty</th>
                  <th className="p-2 text-center border-r border-gray-300 w-20">Tax Rate</th>
                  <th className="p-2 text-center border-r border-gray-300 w-20">Tax Type</th>
                  <th className="p-2 text-right border-r border-gray-300 w-24">Tax Amount (₹)</th>
                  <th className="p-2 text-right w-24">Total Amount (₹)</th>
                </tr>
              </thead>
              <tbody>
                {invoiceData.items.map((item, index) => {
                  const itemTotal = item.unitPrice * item.quantity;
                  const taxAmount = (itemTotal * item.taxRate) / 100;
                  const totalWithTax = itemTotal + taxAmount;

                  return (
                    <tr key={item.id} className="border-b border-gray-200">
                      <td className="p-2 border-r border-gray-200 text-center font-medium">{index + 1}</td>
                      <td className="p-2 border-r border-gray-200">
                        <div className="bg-yellow-50 p-1 rounded font-medium text-xs">
                          {item.description || 'Service'}
                        </div>
                      </td>
                      <td className="p-2 border-r border-gray-200 text-right font-semibold">₹ {item.unitPrice.toFixed(2)}</td>
                      <td className="p-2 border-r border-gray-200 text-center font-medium">{item.quantity}</td>
                      <td className="p-2 border-r border-gray-200 text-center font-medium">{item.taxRate}%</td>
                      <td className="p-2 border-r border-gray-200 text-center font-medium bg-green-50">{item.taxType}</td>
                      <td className="p-2 border-r border-gray-200 text-right font-semibold">₹ {taxAmount.toFixed(2)}</td>
                      <td className="p-2 text-right font-bold text-blue-600">₹ {totalWithTax.toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Summary */}
          <div className="flex justify-end">
            <div className="w-full max-w-xs border border-gray-300">
              <div className="bg-gray-100 p-2 border-b border-gray-300">
                <h3 className="font-semibold text-sm text-gray-800">Invoice Summary</h3>
              </div>
              <div className="p-2 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="font-medium">Subtotal:</span>
                  <span className="text-sm font-semibold">₹ {totals.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Total Tax:</span>
                  <span className="text-sm font-semibold">₹ {totals.totalTax.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-300 pt-2 flex justify-between font-bold text-sm bg-blue-50 p-2 rounded">
                  <span>Grand Total:</span>
                  <span className="text-blue-600">₹ {totals.grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Amount in Words */}
          <div className="border border-gray-300 p-3 bg-yellow-50">
            <div className="flex flex-col space-y-1">
              <span className="font-semibold text-sm">Amount in Words:</span>
              <span className="text-sm font-medium capitalize bg-white p-2 rounded border">
                {numberToWords(totals.grandTotal)} Rupees Only
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="border border-gray-300 p-3">
              <h3 className="font-semibold text-sm text-gray-800 mb-2">Terms & Conditions</h3>
              <p className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                Refund your all Money After Training letter
              </p>
            </div>
            
            <div className="border border-gray-300 p-3">
              <h3 className="font-semibold text-sm text-gray-800 mb-8">For Air India Limited</h3>
              <div className="border-t border-gray-300 pt-2">
                <p className="text-xs text-center font-medium">Authorized Signatory</p>
              </div>
            </div>
          </div>

          {/* Print Footer */}
          <div className="text-center text-xs text-gray-500 print:block hidden mt-4">
            <p>This is a computer generated invoice and does not require signature.</p>
          </div>
        </div>
      </div>
    );
  }
);

InvoicePreview.displayName = 'InvoicePreview';

export default InvoicePreview;
