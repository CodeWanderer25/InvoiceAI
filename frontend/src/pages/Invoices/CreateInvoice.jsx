import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../utils/axios";
import { API_ROUTES } from "../../utils/ApiRoute";
import moment from "moment";
import toast from 'react-hot-toast';
import {
  DollarSign,
  FileText,
  Package,
  Percent,
  Plus,
  ShoppingCart,
  Trash2,
} from "lucide-react";

const CreateInvoice = ({ existingInvoice, onSave }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const dataAI = location.state?.dataAI;
  


  const [formData, setFormData] = useState({
    invoiceNumber: "",
    invoiceDate: new Date().toISOString().split("T")[0],
    dueDate: "",
    billFrom: {
      email: user?.email || "",
      address: user?.address || "",
      phone: user?.phone || "",
      businessName: user?.businessName || "",
    },
    billTo: {
      clientName: "",
      email: "",
      address: "",
      phone: "",
    },
    items: [{ name: "", quantity: 1, unitPrice: 0, taxPercent: 0 }],
    notes: "",
    paymentTerms: "",
  });

  const [isGeneratingNumber, setIsGeneratingNumber] = useState(
    !existingInvoice
  );
  const [isLoading, setIsLoading] = useState(false);

  // ---------------- USE EFFECT ----------------
  useEffect(() => {
    // AI extracted data
    if (dataAI) {
      console.log('AI Data:', dataAI);
      setFormData((prev) => ({
        ...prev,
billFrom: {
  ...prev.billFrom, // user data only
},
        billTo: {
          clientName: dataAI.clientName || "",
          email: dataAI.email || "",
          phone: dataAI.phone || "",
          address: dataAI.address || "",
        },
        items: dataAI.items?.length ? dataAI.items : prev.items,
        notes: dataAI.notes || "",
        paymentTerms: dataAI.paymentTerms || "Net 7",
      }));
    }

    // Edit invoice case
    if (existingInvoice) {
      setFormData({
        ...existingInvoice,
        invoiceDate: moment(existingInvoice.invoiceDate).format("YYYY-MM-DD"),
        dueDate: moment(existingInvoice.dueDate).format("YYYY-MM-DD"),
      });
      return;
    }

    // Generate invoice number
    const generateInvoiceNumber = async () => {
      setIsGeneratingNumber(true);
      try {
        const res = await axiosInstance.get(
          API_ROUTES.INVOICE.GET_ALL_INVOICES
        );

        const invoices = res.data || [];
        let maxNum = 0;

        invoices.forEach((inv) => {
          const num = parseInt(inv.invoiceNumber?.split("-")[1]);
          if (!isNaN(num) && num > maxNum) maxNum = num;
        });

        const newInvoiceNumber = `INV-${String(maxNum + 1).padStart(3, "0")}`;

        setFormData((prev) => ({
          ...prev,
          invoiceNumber: newInvoiceNumber,
        }));
      } catch (err) {
        console.error("Invoice number generation failed", err);
        setFormData((prev) => ({
          ...prev,
          invoiceNumber: `INV-${Date.now().toString().slice(-4)}`,
        }));
      } finally {
        setIsGeneratingNumber(false);
      }
    };

    generateInvoiceNumber();
  }, [existingInvoice, dataAI, user]);

  const handleInputChange = (e, section, index) => {
    const { name, value } = e.target;
    
    if (section) {
      setFormData((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [name]: value,
        },
      }));
    } else if (index !== undefined) {
      setFormData((prev) => {
        const newItems = [...prev.items];
        newItems[index] = {
          ...newItems[index],
          [name]: value,
        };
        return {
          ...prev,
          items: newItems,
        };
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleAddItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        { name: "", quantity: 1, unitPrice: 0, taxPercent: 0 },
      ],
    }));
  };

  const handleRemoveItem = (index) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const calculateItemTotal = (item) => {
    const itemTotal =
      (item.quantity || 0) * (item.unitPrice || 0) +
      (item.quantity || 0) *
        (item.unitPrice || 0) *
        ((item.taxPercent || 0) / 100);
    return itemTotal.toFixed(2);
  };

  const { subtotal, taxTotal, total } = (() => {
    let subtotal = 0,
      taxTotal = 0;
    formData.items.forEach((item) => {
      const itemTotal = (item.quantity || 0) * (item.unitPrice || 0);
      subtotal += itemTotal;
      taxTotal += itemTotal * ((item.taxPercent || 0) / 100);
    });
    return { subtotal, taxTotal, total: subtotal + taxTotal };
  })();

const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    const itemsWithTotal = formData.items.map((item) => ({
      ...item,
      total: (item.quantity || 0) * (item.unitPrice || 0) * (1 + (item.taxPercent || 0) / 100),
    }));

    const finalFormData = {
      ...formData,
      items: itemsWithTotal,
      subtotal,
      taxTotal,
      total,
    };

    if (onSave) {
      await onSave(finalFormData);
    } else {
      await axiosInstance.post(API_ROUTES.INVOICE.CREATE, finalFormData);
      toast.success("Invoice created successfully!");
      navigate("/invoices");
    }
  } catch (error) {
    toast.error("Failed to create invoice.");
    console.error(error);
  } finally {
    setIsLoading(false);
  }
};



  
  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-purple-50 to-cyan-50 p-8">
      <div className="max-w-6xl mx-auto bg-white/90 backdrop-blur-sm rounded-xl shadow-2xl p-8 border border-indigo-100 ">
        <form onSubmit={handleSubmit}>
          {/* Top Section - Invoice Details */}
          <div className="grid grid-cols-3 gap-6 mb-8 pb-8 border-b">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Invoice Number
              </label>
              <input
                type="text"
                name="invoiceNumber"
                value={formData.invoiceNumber}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Invoice Date
              </label>
              <input
                type="date"
                name="invoiceDate"
                value={formData.invoiceDate}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Due Date
              </label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleInputChange}
                placeholder="dd-mm-yyyy"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Bill From and Bill To Section */}
          <div className="grid grid-cols-2 gap-12 mb-8">
            {/* Bill From */}
            <div>
              <h2 className="text-lg font-semibold text-indigo-600 mb-6">
                Bill From
              </h2>

                            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  BusinessName
                </label>
                <input
                  type="text"
                  name="businessName"
                  value={formData.billFrom.businessName}
                  onChange={(e) => handleInputChange(e, "billFrom")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.billFrom.email}
                  onChange={(e) => handleInputChange(e, "billFrom")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <textarea
                  value={formData.billFrom.address}
                  name="address"
                  onChange={(e) => handleInputChange(e, "billFrom")}
                  placeholder="Enter full address"
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.billFrom.phone}
                  onChange={(e) => handleInputChange(e, "billFrom")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>


            </div>

            {/* Bill To */}
            <div>
              <h2 className="text-lg font-semibold text-indigo-600 mb-6">
                Bill To
              </h2>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ClientName
                </label>
                <input
                  type="text"
                  name="clientName"
                  value={formData.billTo.clientName}
                  onChange={(e) => handleInputChange(e, "billTo")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.billTo.email}
                  onChange={(e) => handleInputChange(e, "billTo")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <textarea
                  value={formData.billTo.address}
                  name="address"
                  onChange={(e) => handleInputChange(e, "billTo")}
                  placeholder="Enter full address"
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.billTo.phone}
                  onChange={(e) => handleInputChange(e, "billTo")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Items Section */}

                {/* Invoice Items Section */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden mb-8">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <ShoppingCart className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-white">Invoice Items</h2>
          </div>
          <button
            type="button"
            onClick={handleAddItem}
            className="flex items-center gap-2 bg-white text-indigo-600 px-4 py-2 rounded-lg shadow-md hover:bg-indigo-50 transition-all duration-200 font-medium"
          >
            <Plus className="w-4 h-4" />
            Add Item
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    Item Description
                  </div>
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 w-28">
                  Quantity
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 w-36">
                  <div className="flex items-center justify-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Unit Price
                  </div>
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 w-28">
                  <div className="flex items-center justify-center gap-2">
                    <Percent className="w-4 h-4" />
                    Tax %
                  </div>
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700 w-36">
                  Total
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 w-20">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {formData.items.map((item, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-100 hover:bg-indigo-50/30 transition-colors"
                >
                  <td className="px-6 py-4">
                    <input
                      type="text"
                      name="name"
                      value={item.name}
                      onChange={(e) => handleInputChange(e, null, index)}
                      placeholder="Enter item name"
                      className="w-[75%] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <input
                      type="number"
                      name="quantity"
                      value={item.quantity}
                      onChange={(e) => handleInputChange(e, null, index)}
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                        $
                      </span>
                      <input
                        type="text"
                        name="unitPrice"
                        value={item.unitPrice}
                        onChange={(e) => handleInputChange(e, null, index)}
                        min="0"
                        step="0.01"
                        className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </td>
                  <td className="px-2 py-4">
                    <div className="relative">
                      <input
                        type="text"
                        name="taxPercent"
                        value={item.taxPercent}
                        onChange={(e) => handleInputChange(e, null, index)}
                        min="0"
                        max="100"
                        step="0.01"
                        className="w-full pr-7 pl-3 py-2 border border-gray-300 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                        %
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-lg font-semibold text-gray-800">
                      ${calculateItemTotal(item)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(index)}
                      disabled={formData.items.length === 1}
                      className={`p-2 rounded-lg transition-all ${
                        formData.items.length === 1
                          ? "text-gray-300 cursor-not-allowed"
                          : "text-red-600 hover:bg-red-50"
                      }`}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals Summary */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="flex justify-end">
            <div className="w-full max-w-sm space-y-2">
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-700 font-medium">Subtotal:</span>
                <span className="text-xl font-semibold text-gray-800">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-300">
                <span className="text-gray-700 font-medium">Tax:</span>
                <span className="text-xl font-semibold text-gray-800">
                  ${taxTotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-lg font-bold text-gray-800">
                  Total Amount:
                </span>
                <span className="text-2xl font-bold text-indigo-600">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Notes & Payment Terms */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div>
          <label className=" text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
            <FileText className="w-4 h-4" />
            Additional Notes
          </label>
          <textarea
            value={formData.notes}
            name="notes"
            onChange={handleInputChange}
            placeholder="Add any additional notes or terms..."
            rows="4"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Payment Terms
          </label>
          <select
            value={formData.paymentTerms}
            name="paymentTerms"
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="Net 7">Net 7 Days</option>
            <option value="Net 15">Net 15 Days</option>
            <option value="Net 30">Net 30 Days</option>
            <option value="Net 60">Net 60 Days</option>
            <option value="Due on Receipt">Due on Receipt</option>
          </select>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end gap-4">

        <button
          type="submit"
          isLoading={isLoading || isGeneratingNumber}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold px-8 py-3 rounded-lg shadow-lg transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Creating...
            </>
          ) : (
            <>
              <FileText className="w-5 h-5" />
              {existingInvoice ? "Update Invoice" : "Create Invoice"}
            </>
          )}
        </button>
      </div>
        </form>
        
      </div>


    </div>
  );
};

export default CreateInvoice;
