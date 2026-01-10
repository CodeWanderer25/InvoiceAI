export const BASE_URL = "https://invoiceai-lzko.onrender.com";

export const API_ROUTES = {
  AUTH: {
    REGISTER: "/api/auth/register", // Signup
    LOGIN: "/api/auth/login", // Authenticate user & return JWT token
    GET_PROFILE: "/api/auth/me", // Get logged-in user details
    UPDATE_PROFILE: "/api/auth/me", // update profile details (PUT)
  },

  INVOICE: {
    CREATE: "/api/invoice/create",
    GET_ALL_INVOICES: "/api/invoice/get-invoices",
    GET_INVOICE_BY_ID: (id) => `/api/invoice/get-invoice/${id}`,
    UPDATE_INVOICE: (id) => `/api/invoice/update/${id}`,
    DELETE_INVOICE: (id) => `/api/invoice/${id}`,
  },

  AI: {
    PARSE_INVOICE_TEXT: "/api/genai/text",
    GENERATE_REMINDER: "/api/genai/generate-reminder",
    GET_DASHBOARD_SUMMARY: "/api/genai/dashboard-summary",
  },
};
