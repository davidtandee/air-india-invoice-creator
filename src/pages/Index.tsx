
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Plus, Trash2, Download, Printer, Upload, X } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import InvoicePreview from '@/components/InvoicePreview';
import { InvoiceData, InvoiceItem } from '@/types/invoice';
import { indianStates, descriptionOptions } from '@/utils/indianStates';

const Index = () => {
  const { toast } = useToast();
  const invoiceRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [invoiceData, setInvoiceData] = useState<InvoiceData>({
    invoiceNumber: '',
    invoiceDetails: '',
    invoiceDate: new Date(),
    recipientName: '',
    recipientAddress: '',
    stateCode: '',
    placeOfDelivery: '',
    companyAddress: 'Airlines House, 113, Gurudwara Rakabganj Road, New Delhi - 110001',
    companyLogo: '',
    items: [
      {
        id: 1,
        description: '',
        unitPrice: 0,
        quantity: 1,
        taxRate: 9,
        taxType: 'CGST'
      }
    ]
  });

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "Error",
          description: "Logo file size should be less than 5MB",
          variant: "destructive"
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setInvoiceData(prev => ({ ...prev, companyLogo: result }));
        toast({
          title: "Success",
          description: "Logo uploaded successfully!"
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setInvoiceData(prev => ({ ...prev, companyLogo: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now(),
      description: '',
      unitPrice: 0,
      quantity: 1,
      taxRate: 9,
      taxType: 'CGST'
    };
    setInvoiceData(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));
  };

  const removeItem = (id: number) => {
    if (invoiceData.items.length > 1) {
      setInvoiceData(prev => ({
        ...prev,
        items: prev.items.filter(item => item.id !== id)
      }));
    }
  };

  const updateItem = (id: number, field: keyof InvoiceItem, value: any) => {
    setInvoiceData(prev => ({
      ...prev,
      items: prev.items.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    }));
  };

  const calculateTotals = () => {
    let subtotal = 0;
    let totalTax = 0;

    invoiceData.items.forEach(item => {
      const itemTotal = item.unitPrice * item.quantity;
      subtotal += itemTotal;
      totalTax += (itemTotal * item.taxRate) / 100;
    });

    const grandTotal = subtotal + totalTax;
    return { subtotal, totalTax, grandTotal };
  };

  const downloadPDF = async () => {
    try {
      const html2pdf = (await import('html2pdf.js')).default;
      const element = invoiceRef.current;
      
      if (!element) return;

      const opt = {
        margin: 0.5,
        filename: `invoice-${invoiceData.invoiceNumber || 'draft'}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
      };

      await html2pdf().set(opt).from(element).save();
      toast({
        title: "Success",
        description: "Invoice PDF downloaded successfully!"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download PDF. Please try again.",
        variant: "destructive"
      });
    }
  };

  const printInvoice = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Form Section */}
          <div className="lg:w-1/3 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    AI
                  </div>
                  Invoice Maker
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Logo Upload */}
                <div className="space-y-2">
                  <Label>Company Logo</Label>
                  <div className="flex items-center gap-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-2"
                    >
                      <Upload className="h-4 w-4" />
                      Upload Logo
                    </Button>
                    {invoiceData.companyLogo && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={removeLogo}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  {invoiceData.companyLogo && (
                    <div className="w-16 h-16 border rounded-lg overflow-hidden">
                      <img 
                        src={invoiceData.companyLogo} 
                        alt="Logo preview" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>

                {/* Company Info */}
                <div className="space-y-2">
                  <Label htmlFor="companyAddress">Company Address</Label>
                  <Textarea
                    id="companyAddress"
                    value={invoiceData.companyAddress}
                    onChange={(e) => setInvoiceData(prev => ({ ...prev, companyAddress: e.target.value }))}
                    className="min-h-[80px]"
                  />
                </div>

                {/* Invoice Info */}
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="invoiceNumber">Invoice Number</Label>
                    <Input
                      id="invoiceNumber"
                      value={invoiceData.invoiceNumber}
                      onChange={(e) => setInvoiceData(prev => ({ ...prev, invoiceNumber: e.target.value }))}
                      placeholder="INV-001"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="invoiceDetails">Invoice Details</Label>
                    <Input
                      id="invoiceDetails"
                      value={invoiceData.invoiceDetails}
                      onChange={(e) => setInvoiceData(prev => ({ ...prev, invoiceDetails: e.target.value }))}
                      placeholder="Service charges"
                    />
                  </div>

                  <div>
                    <Label>Invoice Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !invoiceData.invoiceDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {invoiceData.invoiceDate ? format(invoiceData.invoiceDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={invoiceData.invoiceDate}
                          onSelect={(date) => date && setInvoiceData(prev => ({ ...prev, invoiceDate: date }))}
                          initialFocus
                          className={cn("p-3 pointer-events-auto")}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                {/* Billing Info */}
                <div className="space-y-4 pt-4 border-t">
                  <h3 className="font-semibold">Billing Information</h3>
                  
                  <div>
                    <Label htmlFor="recipientName">Recipient Name</Label>
                    <Input
                      id="recipientName"
                      value={invoiceData.recipientName}
                      onChange={(e) => setInvoiceData(prev => ({ ...prev, recipientName: e.target.value }))}
                      placeholder="Customer name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="recipientAddress">Address</Label>
                    <Textarea
                      id="recipientAddress"
                      value={invoiceData.recipientAddress}
                      onChange={(e) => setInvoiceData(prev => ({ ...prev, recipientAddress: e.target.value }))}
                      placeholder="Customer address"
                      className="min-h-[60px]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="stateCode">State/Code</Label>
                      <Select
                        value={invoiceData.stateCode}
                        onValueChange={(value) => setInvoiceData(prev => ({ ...prev, stateCode: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                        <SelectContent className="max-h-48">
                          {indianStates.map((state) => (
                            <SelectItem key={state.code} value={`${state.code} - ${state.name}`}>
                              {state.code} - {state.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="placeOfDelivery">Place of Delivery</Label>
                      <Input
                        id="placeOfDelivery"
                        value={invoiceData.placeOfDelivery}
                        onChange={(e) => setInvoiceData(prev => ({ ...prev, placeOfDelivery: e.target.value }))}
                        placeholder="Delhi"
                      />
                    </div>
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-4 pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold">Invoice Items</h3>
                    <Button onClick={addItem} size="sm" className="h-8">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  {invoiceData.items.map((item, index) => (
                    <Card key={item.id} className="p-3">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Item {index + 1}</span>
                          {invoiceData.items.length > 1 && (
                            <Button
                              onClick={() => removeItem(item.id)}
                              size="sm"
                              variant="outline"
                              className="h-6 w-6 p-0"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          )}
                        </div>

                        <div>
                          <Label>Description</Label>
                          <div className="flex gap-2">
                            <Select
                              value={item.description}
                              onValueChange={(value) => updateItem(item.id, 'description', value)}
                            >
                              <SelectTrigger className="text-sm">
                                <SelectValue placeholder="Select or type description" />
                              </SelectTrigger>
                              <SelectContent>
                                {descriptionOptions.map((option) => (
                                  <SelectItem key={option} value={option}>
                                    {option}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <Input
                            value={item.description}
                            onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                            placeholder="Or type custom description"
                            className="text-sm mt-2"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label>Unit Price (₹)</Label>
                            <Input
                              type="number"
                              value={item.unitPrice}
                              onChange={(e) => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                              className="text-sm"
                            />
                          </div>
                          <div>
                            <Label>Quantity</Label>
                            <Input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                              min="1"
                              className="text-sm"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label>Tax Rate (%)</Label>
                            <Input
                              type="number"
                              value={item.taxRate}
                              onChange={(e) => updateItem(item.id, 'taxRate', parseFloat(e.target.value) || 0)}
                              className="text-sm"
                            />
                          </div>
                          <div>
                            <Label>Tax Type</Label>
                            <Select
                              value={item.taxType}
                              onValueChange={(value) => updateItem(item.id, 'taxType', value)}
                            >
                              <SelectTrigger className="text-sm">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="CGST">CGST</SelectItem>
                                <SelectItem value="SGST">SGST</SelectItem>
                                <SelectItem value="IGST">IGST</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t">
                  <Button onClick={downloadPDF} className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                  <Button onClick={printInvoice} variant="outline" className="flex-1">
                    <Printer className="h-4 w-4 mr-2" />
                    Print
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Preview Section */}
          <div className="lg:w-2/3">
            <InvoicePreview 
              ref={invoiceRef}
              invoiceData={invoiceData}
              totals={calculateTotals()}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
