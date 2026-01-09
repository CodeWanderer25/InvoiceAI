// src/components/Features/Features.jsx
import React from "react";
import { ArrowRight } from "lucide-react";
import { FEATURES } from "../../utils/data"; // keep your data here

const Features = () => {
  return (
    <section id='features'  className="bg-white dark:bg-black text-slate-800 dark:text-slate-200 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Features to run your business
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-600 dark:text-slate-300">
            Everything you need to create, send and track invoices — from simple one-off bills to
            recurring subscriptions and automated reminders.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURES.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <article
                key={feature.title ?? idx}
                className="group bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl p-6 hover:shadow-lg transition-shadow duration-200"
                aria-labelledby={`feature-${idx}`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="shrink-0 w-12 h-12 rounded-lg flex items-center justify-center shadow-sm"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(79,70,229,1) 0%, rgba(139,92,246,1) 100%)",
                    }}
                  >
                    {/* icon with nice size */}
                    <Icon size={20} className="text-white" />
                  </div>

                  <div className="flex-1">
                    <h3
                      id={`feature-${idx}`}
                      className="text-lg font-semibold text-slate-900 dark:text-slate-50"
                    >
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                      {feature.description}
                    </p>

                    <div className="mt-4">
                      <a
                        href={feature.href || "#"}
                        className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700"
                      >
                        Learn more
                        <ArrowRight size={16} className="transform transition-transform group-hover:translate-x-1" />
                      </a>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <a
            href="/signup"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-sm transition"
          >
            Start free — create your first invoice
            <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Features;
