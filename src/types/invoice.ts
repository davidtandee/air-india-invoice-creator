
export interface InvoiceItem {
  id: number;
  description: string;
  unitPrice: number;
  quantity: number;
  taxRate: number;
  taxType: 'CGST' | 'SGST' | 'IGST';
}

export interface InvoiceData {
  invoiceNumber: string;
  invoiceDetails: string;
  invoiceDate: Date;
  recipientName: string;
  recipientAddress: string;
  stateCode: string;
  placeOfDelivery: string;
  companyAddress: string;
  items: InvoiceItem[];
}

export interface InvoiceTotals {
  subtotal: number;
  totalTax: number;
  grandTotal: number;
}
