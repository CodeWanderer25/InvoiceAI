// src/components/Hero.jsx
import React from "react";
import { Link } from "react-router-dom";


const Hero = () => {
  // replace with your real auth state (context / redux / localStorage)
  const isAuthenticated = false;

  // make UI reactive to current theme (not strictly required, but handy if you want to show theme-based accents)
  //const { theme } = useTheme?.() || { theme: "light" };

  return (
    <section className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 transition-colors">
      <div className="max-w-7xl mx-auto px-8 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text */}
          <div className="space-y-6 ">
            {/* small badge / logo */}
            <div className="inline-flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-md flex items-center justify-center font-semibold text-white shadow `}
                aria-hidden
              >
                AI
              </div>
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  Al Invoice
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Smart invoicing for your business</p>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight">
              AI-powered invoices — faster, smarter, cleaner
            </h1>

            <p className="max-w-xl text-sm sm:text-base text-slate-600 dark:text-slate-300">
              Create professional invoices in seconds. Auto-calculate taxes, generate PDFs, and manage clients — all with
              AI-suggested descriptions and smart defaults so you can spend less time on paperwork and more on business.
            </p>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mt-4">
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="inline-flex items-center justify-center px-5 py-3 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-sm transition"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/signup"
                    className="inline-flex items-center justify-center px-5 py-3 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-sm transition"
                  >
                    Get Started
                  </Link>

                  <Link
                    to="/features"
                    className="inline-flex items-center justify-center px-5 py-3 rounded-md border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 bg-white dark:bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                  >
                    See Features
                  </Link>
                </>
              )}
            </div>

            {/* small feature list */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-600 dark:text-slate-300">
              <div className="flex items-start gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-indigo-600 mt-2 shadow-sm" />
                <div>
                  <div className="font-medium text-slate-800 dark:text-slate-100">Auto calculations</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Taxes, totals & discounts done for you.</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-indigo-600 mt-2 shadow-sm" />
                <div>
                  <div className="font-medium text-slate-800 dark:text-slate-100">PDF & export</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Download or email client-ready PDFs.</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
