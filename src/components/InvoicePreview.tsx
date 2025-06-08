
import React, { forwardRef } from 'react';
import { format } from 'date-fns';
import { InvoiceData, InvoiceTotals } from '@/types/invoice';
import { numberToWords } from '@/utils/numberToWords';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
      <div ref={ref} className="bg-white w-[794px] min-h-[1123px] mx-auto p-6 text-xs leading-tight print:p-4 print:shadow-none">
        {/* Header */}
        <div className="border border-gray-400 p-3 mb-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              {invoiceData.companyLogo ? (
                <div className="w-8 h-8 rounded-full overflow-hidden">
                  <img 
                    src={invoiceData.companyLogo} 
                    alt="Company Logo" 
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
                  AI
                </div>
              )}
              <div>
                <h1 className="text-sm font-bold text-gray-800">Air India Limited</h1>
                <p className="text-xs text-gray-600">Excellence in Aviation</p>
              </div>
            </div>
            <div className="text-right text-xs">
              <p><strong>PAN No:</strong> AACCNC6194P</p>
              <p><strong>GST No:</strong> 07AACCN6194P2ZQ</p>
            </div>
          </div>
          
          <div className="text-xs">
            <p className="font-medium mb-1">Address:</p>
            <p className="text-gray-700 whitespace-pre-line">{invoiceData.companyAddress}</p>
          </div>
        </div>

        {/* Invoice Info */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="border border-gray-400 p-3">
            <h2 className="text-sm font-semibold mb-2 text-gray-800 border-b pb-1">Invoice Information</h2>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="font-medium">Invoice No:</span>
                <span className="font-semibold">{invoiceData.invoiceNumber || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Invoice Date:</span>
                <span>{format(invoiceData.invoiceDate, 'dd/MM/yyyy')}</span>
              </div>
              <div className="flex flex-col space-y-1">
                <span className="font-medium">Details:</span>
                <span className="bg-gray-50 p-1 rounded text-xs">{invoiceData.invoiceDetails || 'N/A'}</span>
              </div>
            </div>
          </div>

          <div className="border border-gray-400 p-3">
            <h2 className="text-sm font-semibold mb-2 text-gray-800 border-b pb-1">Billing Information</h2>
            <div className="space-y-1 text-xs">
              <div>
                <span className="font-medium">Bill To:</span>
                <p className="mt-1 font-medium bg-blue-50 p-1 rounded text-xs">
                  {invoiceData.recipientName || demoName}
                </p>
              </div>
              <div>
                <span className="font-medium">Address:</span>
                <p className="mt-1 whitespace-pre-line bg-gray-50 p-1 rounded text-xs">
                  {invoiceData.recipientAddress || demoAddress}
                </p>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">State/Code:</span>
                <span>{invoiceData.stateCode || '18 - Assam'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Place of Delivery:</span>
                <span>{invoiceData.placeOfDelivery || 'Assam'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="border border-gray-400 mb-3">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100 border-b border-gray-400">
                <TableHead className="w-12 text-center font-bold text-xs p-1 border-r border-gray-300">Sl.No</TableHead>
                <TableHead className="font-bold text-xs p-1 border-r border-gray-300">Description</TableHead>
                <TableHead className="w-16 text-center font-bold text-xs p-1 border-r border-gray-300">Unit Price</TableHead>
                <TableHead className="w-12 text-center font-bold text-xs p-1 border-r border-gray-300">Qty</TableHead>
                <TableHead className="w-16 text-center font-bold text-xs p-1 border-r border-gray-300">Tax Rate</TableHead>
                <TableHead className="w-16 text-center font-bold text-xs p-1 border-r border-gray-300">Tax Type</TableHead>
                <TableHead className="w-16 text-center font-bold text-xs p-1 border-r border-gray-300">Tax Amt</TableHead>
                <TableHead className="w-20 text-center font-bold text-xs p-1">Total Amt</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoiceData.items.map((item, index) => {
                const itemTotal = item.unitPrice * item.quantity;
                const taxAmount = (itemTotal * item.taxRate) / 100;
                const totalWithTax = itemTotal + taxAmount;

                return (
                  <TableRow key={item.id} className="border-b border-gray-300">
                    <TableCell className="text-center font-medium text-xs p-1 border-r border-gray-300">{index + 1}</TableCell>
                    <TableCell className="p-1 border-r border-gray-300">
                      <div className="bg-yellow-50 p-1 rounded font-medium text-xs">
                        {item.description || 'Service'}
                      </div>
                    </TableCell>
                    <TableCell className="text-center font-semibold text-xs p-1 border-r border-gray-300">₹{item.unitPrice.toFixed(2)}</TableCell>
                    <TableCell className="text-center font-medium text-xs p-1 border-r border-gray-300">{item.quantity}</TableCell>
                    <TableCell className="text-center font-medium text-xs p-1 border-r border-gray-300">{item.taxRate}%</TableCell>
                    <TableCell className="text-center p-1 border-r border-gray-300">
                      <span className="bg-green-100 px-1 py-0.5 rounded text-xs font-medium">
                        {item.taxType}
                      </span>
                    </TableCell>
                    <TableCell className="text-center font-semibold text-xs p-1 border-r border-gray-300">₹{taxAmount.toFixed(2)}</TableCell>
                    <TableCell className="text-center font-bold text-blue-600 text-xs p-1">₹{totalWithTax.toFixed(2)}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {/* Summary */}
        <div className="flex justify-end mb-3">
          <div className="w-64 border border-gray-400">
            <div className="bg-gray-100 p-2 border-b border-gray-400">
              <h3 className="font-semibold text-sm text-gray-800">Invoice Summary</h3>
            </div>
            <div className="p-2 space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="font-medium">Subtotal:</span>
                <span className="font-semibold">₹ {totals.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Total Tax:</span>
                <span className="font-semibold">₹ {totals.totalTax.toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-300 pt-1 flex justify-between font-bold text-sm bg-blue-50 p-2 rounded">
                <span>Grand Total:</span>
                <span className="text-blue-600">₹ {totals.grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Amount in Words */}
        <div className="border border-gray-400 p-2 bg-yellow-50 mb-3">
          <div className="flex flex-col space-y-1">
            <span className="font-semibold text-sm">Amount in Words:</span>
            <span className="font-medium capitalize bg-white p-2 rounded border text-xs">
              {numberToWords(totals.grandTotal)} Rupees Only
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="grid grid-cols-2 gap-3">
          <div className="border border-gray-400 p-2">
            <h3 className="font-semibold text-sm text-gray-800 mb-2">Terms & Conditions</h3>
            <p className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
              Refund your all Money After Training letter
            </p>
          </div>
          
          <div className="border border-gray-400 p-2">
            <h3 className="font-semibold text-sm text-gray-800 mb-6">For Air India Limited</h3>
            <div className="border-t border-gray-300 pt-2">
              <p className="text-xs text-center font-medium">Authorized Signatory</p>
            </div>
          </div>
        </div>

        {/* Print Footer */}
        <div className="text-center text-xs text-gray-500 print:block hidden mt-2">
          <p>This is a computer generated invoice and does not require signature.</p>
        </div>
      </div>
    );
  }
);

InvoicePreview.displayName = 'InvoicePreview';

export default InvoicePreview;
