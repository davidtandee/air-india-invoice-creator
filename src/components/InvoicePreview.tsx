
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
      <div ref={ref} className="bg-white shadow-lg rounded-lg overflow-hidden print:shadow-none print:rounded-none w-[210mm] min-h-[297mm] mx-auto">
        <div className="p-6 space-y-4 print:p-4">
          {/* Header */}
          <div className="border-2 border-gray-300 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-4">
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
                  <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white font-bold">
                    AI
                  </div>
                )}
                <div>
                  <h1 className="text-xl font-bold text-gray-800">Air India Limited</h1>
                  <p className="text-sm text-gray-600">Excellence in Aviation</p>
                </div>
              </div>
              <div className="text-right text-sm">
                <p><strong>PAN No:</strong> AACCNC6194P</p>
                <p><strong>GST No:</strong> 07AACCN6194P2ZQ</p>
              </div>
            </div>
            
            <div className="text-sm">
              <p className="font-medium mb-2">Address:</p>
              <p className="text-gray-700 whitespace-pre-line leading-relaxed">{invoiceData.companyAddress}</p>
            </div>
          </div>

          {/* Invoice Info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="border border-gray-300 p-4 rounded-lg">
              <h2 className="text-lg font-semibold mb-3 text-gray-800 border-b pb-2">Invoice Information</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium">Invoice No:</span>
                  <span className="font-semibold">{invoiceData.invoiceNumber || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Invoice Date:</span>
                  <span>{format(invoiceData.invoiceDate, 'dd/MM/yyyy')}</span>
                </div>
                <div className="flex flex-col space-y-2">
                  <span className="font-medium">Details:</span>
                  <span className="bg-gray-50 p-2 rounded">{invoiceData.invoiceDetails || 'N/A'}</span>
                </div>
              </div>
            </div>

            <div className="border border-gray-300 p-4 rounded-lg">
              <h2 className="text-lg font-semibold mb-3 text-gray-800 border-b pb-2">Billing Information</h2>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Bill To:</span>
                  <p className="mt-1 font-medium bg-blue-50 p-2 rounded">
                    {invoiceData.recipientName || demoName}
                  </p>
                </div>
                <div>
                  <span className="font-medium">Address:</span>
                  <p className="mt-1 whitespace-pre-line leading-relaxed bg-gray-50 p-2 rounded text-sm">
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

          {/* Professional Table */}
          <div className="border border-gray-300 rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-100">
                  <TableHead className="w-16 text-center font-semibold">Sl. No</TableHead>
                  <TableHead className="font-semibold">Description</TableHead>
                  <TableHead className="w-24 text-right font-semibold">Unit Price (₹)</TableHead>
                  <TableHead className="w-16 text-center font-semibold">Qty</TableHead>
                  <TableHead className="w-20 text-center font-semibold">Tax Rate</TableHead>
                  <TableHead className="w-20 text-center font-semibold">Tax Type</TableHead>
                  <TableHead className="w-24 text-right font-semibold">Tax Amount (₹)</TableHead>
                  <TableHead className="w-28 text-right font-semibold">Total Amount (₹)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoiceData.items.map((item, index) => {
                  const itemTotal = item.unitPrice * item.quantity;
                  const taxAmount = (itemTotal * item.taxRate) / 100;
                  const totalWithTax = itemTotal + taxAmount;

                  return (
                    <TableRow key={item.id} className="hover:bg-gray-50">
                      <TableCell className="text-center font-medium">{index + 1}</TableCell>
                      <TableCell>
                        <div className="bg-yellow-50 p-2 rounded font-medium text-sm">
                          {item.description || 'Service'}
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-semibold">₹ {item.unitPrice.toFixed(2)}</TableCell>
                      <TableCell className="text-center font-medium">{item.quantity}</TableCell>
                      <TableCell className="text-center font-medium">{item.taxRate}%</TableCell>
                      <TableCell className="text-center">
                        <span className="bg-green-100 px-2 py-1 rounded text-sm font-medium">
                          {item.taxType}
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-semibold">₹ {taxAmount.toFixed(2)}</TableCell>
                      <TableCell className="text-right font-bold text-blue-600">₹ {totalWithTax.toFixed(2)}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {/* Summary */}
          <div className="flex justify-end">
            <div className="w-full max-w-sm border border-gray-300 rounded-lg overflow-hidden">
              <div className="bg-gray-100 p-3 border-b border-gray-300">
                <h3 className="font-semibold text-lg text-gray-800">Invoice Summary</h3>
              </div>
              <div className="p-3 space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Subtotal:</span>
                  <span className="font-semibold">₹ {totals.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Total Tax:</span>
                  <span className="font-semibold">₹ {totals.totalTax.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-300 pt-2 flex justify-between font-bold text-lg bg-blue-50 p-3 rounded">
                  <span>Grand Total:</span>
                  <span className="text-blue-600">₹ {totals.grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Amount in Words */}
          <div className="border border-gray-300 p-4 bg-yellow-50 rounded-lg">
            <div className="flex flex-col space-y-2">
              <span className="font-semibold text-lg">Amount in Words:</span>
              <span className="font-medium capitalize bg-white p-3 rounded border">
                {numberToWords(totals.grandTotal)} Rupees Only
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="border border-gray-300 p-4 rounded-lg">
              <h3 className="font-semibold text-lg text-gray-800 mb-3">Terms & Conditions</h3>
              <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                Refund your all Money After Training letter
              </p>
            </div>
            
            <div className="border border-gray-300 p-4 rounded-lg">
              <h3 className="font-semibold text-lg text-gray-800 mb-8">For Air India Limited</h3>
              <div className="border-t border-gray-300 pt-3">
                <p className="text-sm text-center font-medium">Authorized Signatory</p>
              </div>
            </div>
          </div>

          {/* Print Footer */}
          <div className="text-center text-sm text-gray-500 print:block hidden mt-4">
            <p>This is a computer generated invoice and does not require signature.</p>
          </div>
        </div>
      </div>
    );
  }
);

InvoicePreview.displayName = 'InvoicePreview';

export default InvoicePreview;
