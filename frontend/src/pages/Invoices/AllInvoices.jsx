import React, { useEffect, useMemo, useState } from 'react'
import axiosInstance from '../../utils/axios';
import { API_ROUTES } from '../../utils/ApiRoute';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Edit, FileText, Loader2, Search, Trash2, Plus, DollarSign, Calendar, CheckCircle, Clock, AlertTriangle, Eye } from 'lucide-react';
import InvoiceWithAI from '../../components/invoices/InvoiceWithAI';

const AllInvoices = () => {

const [invoices, setInvoices] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
const [statusChange, setStatusChange] = useState(null);
const [search, setSearch] = useState('');
const [statusFilter, setStatusFilter] = useState('All');
const [isAiModal, setIsAiModal] = useState(false);
const [isReminder, setIsReminder] = useState(false);
const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);
const [deleteConfirm, setDeleteConfirm] = useState(null);
const navigate = useNavigate();

useEffect(() => {

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(API_ROUTES.INVOICE.GET_ALL_INVOICES);
      setInvoices(response.data.sort((a, b) => 
        new Date(b.invoiceDate) - new Date(a.invoiceDate)
      ));
    } catch (err) {
      setError('Failed to fetch invoices.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  fetchInvoices();
}, []);

  const handleDelete = async (id) => {
    try {
      setDeleteConfirm(true);
      setError(null);
      await axiosInstance.delete(`${API_ROUTES.INVOICE.DELETE_INVOICE(id)}`);
      setInvoices(prev => prev.filter(inv => inv._id !== id));
      setDeleteConfirm(null);
    } catch (err) {
      setError('Failed to delete invoice.');
      console.error(err);
    }
  }

  const handleStatusChange = async (invoice) => {
    try {
      setStatusChange(invoice._id);
      const newStatus = invoice.status === 'Paid' ? 'UnPaid' : 'Paid';
      const updatedInvoice = {...invoice, status: newStatus };
      await axiosInstance.put(`${API_ROUTES.INVOICE.UPDATE_INVOICE(invoice._id)}`, updatedInvoice);
      setInvoices(prev => prev.map(inv => 
        inv._id === invoice._id ? { ...inv, status: newStatus } : inv
      ));
    } catch (err) {
      setError('Failed to update status.');
      console.error(err);
    } finally {
      setStatusChange(null);
    }
  }

  const handleRemainder = async (invoiceId) => {
    setSelectedInvoiceId(invoiceId);
    setIsReminder(true);
  }

  const filteredInvoices = useMemo(() => {
  return invoices.filter(invoice => 
    (statusFilter === 'All' || invoice.status === statusFilter) &&
    (
      invoice.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      invoice.billTo.clientName.toLowerCase().includes(search.toLowerCase())
    )
  );
}, [invoices, search, statusFilter]);

  const getStatusBadge = (status) => {
    const styles = {
      Paid: 'bg-green-100 text-green-800 border-green-200',
      Pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      UnPaid: 'bg-red-100 text-red-800 border-red-200'
    };

    const icons = {
      Paid: <CheckCircle className="w-3 h-3" />,
      Pending: <Clock className="w-3 h-3" />,
      UnPaid: <AlertTriangle className="w-3 h-3" />
    };

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${styles[status]}`}>
        {icons[status]}
        {status}
      </span>
    );
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const stats = useMemo(() => {
    const total = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
    const paid = invoices.filter(inv => inv.status === 'Paid').reduce((sum, inv) => sum + inv.totalAmount, 0);
    const pending = invoices.filter(inv => inv.status === 'Pending').reduce((sum, inv) => sum + inv.totalAmount, 0);
    const UnPaid = invoices.filter(inv => inv.status === 'UnPaid').reduce((sum, inv) => sum + inv.totalAmount, 0);
    return { total, paid, pending, UnPaid };
  }, [invoices]);

  if(loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading invoices...</p>
        </div>
      </div>
    );
  }

  return (
  <>
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <InvoiceWithAI isOpen={isAiModal} onClose={() => setIsAiModal(false)} />
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">All Invoices</h1>
            <p className="text-gray-600 mt-1">Manage all your invoices here.</p>
          </div>

          <div className="flex gap-3">
            <button onClick={() => setIsAiModal(true)} className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Create with AI
            </button>
            <button onClick={() => navigate('/invoices/create')} className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 shadow-md hover:shadow-lg flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Create Invoice
            </button>
          </div>
        </div>

        {
          error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <h1 className="text-sm font-semibold text-red-900">Error</h1>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              </div>
            </div>
          )
        }

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by Invoice Number or Client Name"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white cursor-pointer transition-all"
              >
                <option value="All">All Statuses</option>
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
                <option value="UnPaid">UnPaid</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {
            filteredInvoices.length === 0 ? (
              <div className="text-center py-16 px-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No invoices found.</h3>
                <p className="text-gray-600 mb-6">Try adjusting your search or filter to find what you're looking for.</p>
                {
                  invoices.length === 0 && (
                    <button onClick={() => navigate('/invoices/create')} className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 inline-flex items-center gap-2">
                      <Plus className="w-4 h-4" />
                      Create your first invoice
                    </button>
                  )
                }
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Invoices</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Client</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Due Date</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-200">
                    {filteredInvoices.map((invoice) => (
                      <tr key={invoice._id} className="hover:bg-gray-50 transition-colors duration-150">
                        <td onClick={()=> navigate(`/invoices/${invoice._id}`)} className="px-6 py-4 cursor-pointer">
                          <div className="font-medium text-gray-900">{invoice.invoiceNumber}</div>
                          <div className="text-sm text-gray-500">{formatDate(invoice.invoiceDate)}</div>
                        </td>
                        <td onClick={()=> navigate(`/invoices/${invoice._id}`)} className="px-6 py-4 cursor-pointer">
                          <div className="font-medium text-gray-900">{invoice.billTo.clientName}</div>
                        </td>
                        <td onClick={()=> navigate(`invoices/${invoice._id}`)} className="px-6 py-4 cursor-pointer">
                          <div className="font-semibold text-gray-900">{formatCurrency(invoice.total)}</div>
                        </td>
                        <td onClick={()=> navigate(`/invoices/${invoice._id}`)} className="px-6 py-4 cursor-pointer">
                          <div className="flex items-center gap-2 text-gray-700">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            {formatDate(invoice.dueDate)}
                          </div>
                        </td>
                        <td onClick={()=> navigate(`/invoices/${invoice._id}`)} className="px-6 py-4 cursor-pointer">
                          {getStatusBadge(invoice.status)}
                        </td>
                        <td className="px-6 py-4">
                          <div onClick={(e) => e.stopPropagation()} className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => handleStatusChange(invoice)} 
                              disabled={statusChange === invoice._id}
                              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200 disabled:opacity-50"
                              title={invoice.status === 'Paid' ? 'Mark as Unpaid' : 'Mark as Paid'}
                            >
                              {statusChange === invoice._id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <CheckCircle className="w-4 h-4" />
                              )}
                            </button>
                            <button 
                              onClick={()=> navigate(`/invoices/${invoice._id}`)}
                              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                              title="View Invoice"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={()=> navigate(`/invoices/${invoice._id}`)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                              title="Edit Invoice"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => setDeleteConfirm(invoice._id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                              title="Delete Invoice"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) 
          }
        </div>

        {deleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Invoice</h3>
                  <p className="text-gray-600 mb-6">
                    Are you sure you want to delete this invoice? This action cannot be undone.
                  </p>
                  <div className="flex gap-3 justify-end">
                    <button
                      onClick={() => setDeleteConfirm(null)}
                      className="px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleDelete(deleteConfirm)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors duration-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  </>
  )
}

export default AllInvoices