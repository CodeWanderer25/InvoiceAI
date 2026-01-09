import React, { useState } from "react";
import { Sparkles, X, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axiosInstance from "../../utils/axios";
import { API_ROUTES } from "../../utils/ApiRoute";

const InvoiceWithAI = ({ isOpen, onClose }) => {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleGenerate = async () => {
    if (!text.trim()){
      toast.error('Please enter invoice text to generate.');
      return;
    }
    setIsLoading(true);
  try {
    const response = await axiosInstance.post(API_ROUTES.AI.PARSE_INVOICE_TEXT, { text });
    const invoiceData = response.data;
    

    toast.success('Invoice data extracted successfully!');
    onClose();
    
    // Navigate to create invoice page with the parsed data
    navigate('/invoices/new', { state: { dataAI: invoiceData } });
    setText("");
  } catch (error) {
    toast.error('Failed to generate invoice from text.');
    console.error('AI parsing error:', error);
    
  } finally {
    setIsLoading(false);
  }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      {/* Modal Card */}
      <div
        className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-linear-to-br from-purple-500 to-indigo-500">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              Create Invoice with AI
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-5">
          <p className="text-gray-600 text-sm leading-relaxed">
            Paste any unstructured invoice details. AI will extract client
            information, items, quantities, pricing, and payment terms.
          </p>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Invoice Text
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Example: Invoice for ClientCorp — 2 hours UI design @ $150/hr, 5 hours development @ $200/hr. Due in 30 days."
              rows={7}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none text-sm"
            />
          </div>

        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-6 py-2.5 rounded-lg border bg-white text-gray-700 hover:bg-gray-100 transition disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            onClick={handleGenerate}
            disabled={isLoading || !text.trim()}
            className="px-6 py-2.5 rounded-lg bg-linear-to-r from-purple-600 to-indigo-600 text-white font-medium hover:from-purple-700 hover:to-indigo-700 transition disabled:opacity-50 flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating…
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Generate Invoice
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceWithAI;
