import React from "react";
import { Star } from "lucide-react";
import {TESTIMONIALS} from '../../utils/data'



const Testimonial = () => {
  return (
    <section id='testimonials' className="relative py-20 bg-linear-to-b from-white to-indigo-50 dark:from-slate-900 dark:to-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Loved by Businesses & Creators
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-300 text-sm sm:text-base">
            Here’s what our users say about how Al Invoice helps them save time and get paid faster.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t, index) => (
            <div
              key={index}
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700
                         rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow"
            >
              {/* User Info */}
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={t.img}
                  alt={t.name}
                  className="w-12 h-12 rounded-full border border-slate-300 dark:border-slate-600"
                />
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">{t.name}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">{t.role}</p>
                </div>
              </div>

              {/* Message */}
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {t.message}
              </p>

              {/* Rating */}
              <div className="flex mt-4">
                {Array(t.rating)
                  .fill()
                  .map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className="text-yellow-400 fill-yellow-400"
                    />
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonial;
