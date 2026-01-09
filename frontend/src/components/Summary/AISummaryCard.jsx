import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axios";
import { API_ROUTES } from "../../utils/ApiRoute";

const AISummaryCard = () => {
  const [insights, setInsights] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get(
          API_ROUTES.AI.GET_DASHBOARD_SUMMARY
        );
        setInsights(response.data.insights || []);
      } catch (error) {
        console.error("Failed to fetch AI insights", error);
        setInsights([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInsights();
  }, []);

  return (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
    {/* Header */}
    <div className="flex items-center justify-between mb-4">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">
          AI Insights
        </h2>
        <p className="text-sm text-gray-500">
          Smart suggestions based on your invoices
        </p>
      </div>

    </div>

    {/* Loading State */}
    {isLoading && (
      <div className="space-y-3 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      </div>
    )}

    {/* Empty State */}
    {!isLoading && insights.length === 0 && (
      <div className="text-sm text-gray-500 text-center py-6">
        No insights available right now.
        <br />
        Add more invoices to generate insights.
      </div>
    )}

    {/* Insights List */}
    {!isLoading && insights.length > 0 && (
      <ul className="space-y-4">
        {insights.map((insight, index) => (
          <li
            key={index}
            className="flex items-start gap-3 p-4 rounded-lg bg-indigo-50 border border-indigo-100"
          >
            <div className="shrink-0 w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-semibold">
              {index + 1}
            </div>
            <p className="text-sm text-gray-800 leading-relaxed">
              {insight}
            </p>
          </li>
        ))}
      </ul>
    )}
  </div>
);

};

export default AISummaryCard;
