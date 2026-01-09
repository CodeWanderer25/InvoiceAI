import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { FAQS } from "../../utils/data";

const FAQs = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (i) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <section id='faq' className="relative py-20 bg-gradient-to-b from-indigo-50/40 to-white dark:from-slate-900 dark:to-slate-950 transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, i) => (
            <div
              key={i}
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 
                         rounded-xl p-4 sm:p-5 shadow-sm hover:shadow-md transition cursor-pointer"
              onClick={() => toggleFAQ(i)}
            >
              {/* Question Row */}
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-slate-900 dark:text-white text-base sm:text-lg">
                  {faq.question}
                </h3>

                <ChevronDown
                  size={20}
                  className={`text-slate-600 dark:text-slate-300 transform transition-transform ${
                    openIndex === i ? "rotate-180" : ""
                  }`}
                />
              </div>

              {/* Animated Answer */}
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === i ? "max-h-40 mt-3" : "max-h-0"
                }`}
              >
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <a
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-indigo-600 
                       hover:bg-indigo-700 text-white font-medium shadow-sm transition"
          >
            Still have questions? Contact support
          </a>
        </div>
      </div>
    </section>
  );
};

export default FAQs;
