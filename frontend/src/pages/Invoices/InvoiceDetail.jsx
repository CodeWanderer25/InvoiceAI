import React, { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../../utils/axios';
import { API_ROUTES } from '../../utils/ApiRoute';
import { Loader2, Printer, Edit, ArrowLeft, Download, AlertCircle } from 'lucide-react';
import CreateInvoice from '../Invoices/CreateInvoice';


const InvoiceDetail = () => {
  const { id } = useParams();
const navigate = useNavigate();
const [invoice, setInvoice] = useState(null);
const [loading, setLoading] = useState(true);
const [isEditing, setIsEditing] = useState(false);
const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
const invoiceRef = useRef();


    useEffect(() => {
    const fetchInvoice = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`${API_ROUTES.INVOICE.GET_INVOICE_BY_ID(id)}`);
        console.log('Fetched invoice:', response.data);
        setInvoice(response.data);
      } catch (error) {
        toast.error('Failed to fetch invoice.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchInvoice();
  }, [id]);

  const handleUpdate = async (formData) => {
    try {
      setLoading(true);
      const response =await axiosInstance.put(`${API_ROUTES.INVOICE.UPDATE_INVOICE(id)}`, formData);
      toast.success('Invoice updated successfully!');
      setIsEditing(false);
      setInvoice(response.data);
      // Refetch or update local state
    } catch (error) {
      toast.error('Failed to update invoice.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

if (!invoice) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200 flex items-center justify-center p-8">
      <div className="bg-white rounded-3xl shadow-xl p-12 max-w-md w-full text-center border border-gray-100">
        <div className="w-24 h-24 bg-red-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-12 h-12 text-red-500" />
        </div>
        <h3 className="text-3xl font-bold text-gray-900 mb-4">
          Invoice Not Found
        </h3>
        <p className="text-gray-600 mb-8 leading-relaxed max-w-sm mx-auto">
          The invoice you are looking for does not exist or could not be loaded.
        </p>
        <Button 
          onClick={() => navigate('/invoices')}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all"
        >
          Back to All Invoices
        </Button>
      </div>
    </div>
  );
}

if(isEditing){
  return <CreateInvoice existingInvoice={invoice} onSave={handleUpdate}/>;
}

  const handleBack = () => {
    alert('Navigate back to invoices list');
  };


  const handleDownload = () => {
    window.print();
  };

    const getStatusColor = (status) => {
    const colors = {
      paid: 'bg-green-100 text-green-700 border-green-200',
      pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      unPaid: 'bg-red-100 text-red-700 border-red-200',

    };
    return colors[status] || colors.draft;
  };

return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Action Bar - Hidden on print */}
      <div className="print:hidden bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Invoices</span>
            </button>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Edit className="w-4 h-4" />
                <span>Edit</span>
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Download</span>
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
              >
                <Printer className="w-4 h-4" />
                <span>Print</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Content */}
      <div id="invoice-content-wrapper" className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <div  id="invoice-preview" ref={invoiceRef} className="bg-white rounded-2xl shadow-xl print:shadow-none print:rounded-none overflow-hidden">
          {/* Invoice Header */}
          <div className="p-8 sm:p-12 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-6">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">INVOICE</h1>
                <p className="text-gray-600">Invoice #{invoice.invoiceNumber}</p>
              </div>
              <div className={`px-4 py-2 rounded-full border ${getStatusColor(invoice.status)} font-semibold text-sm uppercase tracking-wide`}>
                {invoice.status}
              </div>
            </div>
          </div>

          {/* Company and Client Info */}
          <div className="p-8 sm:p-12 grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">From</h3>
              <div className="space-y-1">
                <p className="font-bold text-lg text-gray-900">{invoice.billFrom.businessName}</p>
                <p className="text-gray-600">{invoice.billFrom.address}</p>
                <p className="text-gray-600">{invoice.billFrom.email}</p>
                <p className="text-gray-600">{invoice.billFrom.phone}</p>
              </div>
            </div>
            
            <div className='pl-[40%] sm:text-right'>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Bill To</h3>
              <div className="space-y-1">
                <p className="font-bold text-lg text-gray-900">{invoice.billTo.clientName}</p>
                <p className="text-gray-600">{invoice.billTo.address}</p>
                <p className="text-gray-600">{invoice.billTo.email}</p>
                <p className="text-gray-600">{invoice.billTo.phone}</p>
              </div>
            </div>
          </div>

          {/* Invoice Details */}
          <div className="px-8 sm:px-12 pb-8 grid grid-cols-2 sm:grid-cols-3 gap-[25%]">
            <div>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">Issue Date</p>
              <p className="text-gray-900 font-medium">{new Date(invoice.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
            <div className='sm: text-center'>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">Due Date</p>
              <p className="text-gray-900 font-medium">{new Date(invoice.dueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
            <div className='sm:text-right'>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">Amount Due</p>
              <p className="text-gray-900 font-bold text-lg">{invoice.paymentTerms}</p>
            </div>
          </div>

          {/* Items Table */}
          <div className="px-8 sm:px-12 pb-8">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-300">
                    <th className="text-left py-3 text-sm font-semibold text-gray-700 uppercase tracking-wide">Description</th>
                    <th className="text-right py-3 text-sm font-semibold text-gray-700 uppercase tracking-wide">Qty</th>
                    <th className="text-right py-3 text-sm font-semibold text-gray-700 uppercase tracking-wide">Rate</th>
                    <th className="text-right py-3 text-sm font-semibold text-gray-700 uppercase tracking-wide">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item, index) => (
                    <tr key={index} className="border-b border-gray-200">
                      <td className="py-4 text-gray-900">{item.name}</td>
                      <td className="py-4 text-right text-gray-700">{item.quantity}</td>
                      <td className="py-4 text-right text-gray-700">${item.taxPercent}</td>
                      <td className="py-4 text-right text-gray-900 font-medium">${item.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals */}
          <div className="px-8 sm:px-12 pb-8">
            <div className="flex justify-end">
              <div className="w-full sm:w-80 space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600 font-medium">Subtotal</span>
                  <span className="text-gray-900 font-medium">${invoice.subTotal}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600 font-medium">Tax (%)</span>
                  <span className="text-gray-900 font-medium">${invoice.taxTotal}</span>
                </div>
                <div className="flex justify-between py-3 bg-gray-50 px-4 rounded-lg">
                  <span className="text-gray-900 font-bold text-lg">Total</span>
                  <span className="text-gray-900 font-bold text-lg">${invoice.total}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
                    <div>
                                {invoice.notes && (
            <div className="px-8 sm:px-12 pb-12">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Notes</h3>
              <p className="text-gray-700 leading-relaxed">{invoice.notes}</p>
            </div>
          )}
                    </div>

          {/* Footer */}
          <div className="bg-gray-50 px-8 sm:px-12 py-6 border-t border-gray-200">
            <p className="text-center text-sm text-gray-600">
              Thank you for your business!
            </p>
          </div>
        </div>
      </div>

      {/* Print-specific styles */}
<style>{`
@page {
  size: A4;
  margin: 20mm;
}

@media print {
  body {
    background: white;
  }

  /* Hide everything */
  body * {
    visibility: hidden;
  }

  /* Show only invoice */
  #invoice-content-wrapper,
  #invoice-content-wrapper * {
    visibility: visible;
  }

  #invoice-content-wrapper {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    padding: 0;
    margin: 0;
  }

  #invoice-preview {
    box-shadow: none !important;
    border-radius: 0 !important;
    border: none !important;
  }

  /* Remove action bar */
  .print\\:hidden {
    display: none !important;
  }
}
`}</style>

    </div>
  );
}

export default InvoiceDetail