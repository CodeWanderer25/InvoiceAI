// src/components/Layout/Footer.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Twitter, Mail, Github, Linkedin, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      toast.error("Please enter a valid email");
      return;
    }
    setLoading(true);
    // Simulate subscribe request (replace with real API)
    setTimeout(() => {
      setLoading(false);
      setEmail("");
      toast.success("Subscribed — check your inbox!");
    }, 900);
  };

  return (
    <footer className="bg-white dark:bg-slate-900 border-t dark:border-slate-800 text-slate-800 dark:text-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Brand */}
          <div className="md:col-span-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-md bg-gradient-to-br from-indigo-600 to-violet-500 flex items-center justify-center text-white font-semibold shadow">
                AI
              </div>
              <div>
                <div className="text-lg font-semibold">Al Invoice</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Smart invoicing for your business</div>
              </div>
            </Link>

            <p className="mt-4 text-sm text-slate-600 dark:text-slate-300 max-w-sm">
              Create, send and manage invoices quickly. Auto-calculations, PDF exports and recurring billing — built for busy teams & freelancers.
            </p>

            {/* Social */}
            <div className="mt-6 flex items-center gap-3">
              <a href="#" aria-label="Twitter" className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                <Twitter size={18} />
              </a>
              <a href="#" aria-label="LinkedIn" className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                <Linkedin size={18} />
              </a>
              <a href="#" aria-label="GitHub" className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                <Github size={18} />
              </a>
              <a href="mailto:help@alinvoice.app" aria-label="Email" className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                <Mail size={18} />
              </a>
            </div>
          </div>

          {/* Links */}
          <div className="md:col-span-5 grid grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">Product</h4>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                <li><Link to="/features" className="hover:text-indigo-600">Features</Link></li>
                <li><Link to="/invoices" className="hover:text-indigo-600">All invoices</Link></li>
                <li><Link to="/invoices/new" className="hover:text-indigo-600">Create invoice</Link></li>
                <li><Link to="/pricing" className="hover:text-indigo-600">Pricing</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">Company</h4>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                <li><Link to="/about" className="hover:text-indigo-600">About</Link></li>
                <li><Link to="/testimonials" className="hover:text-indigo-600">Testimonials</Link></li>
                <li><Link to="/faq" className="hover:text-indigo-600">FAQ</Link></li>
                <li><Link to="/contact" className="hover:text-indigo-600">Contact</Link></li>
              </ul>
            </div>
          </div>

          {/* Newsletter */}
          <div className="md:col-span-3">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">Newsletter</h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
              Get product updates, tips & billing best-practices — delivered monthly.
            </p>

            <form onSubmit={handleSubscribe} className="flex items-center gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                className="flex-1 px-3 py-2 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm placeholder:text-slate-400"
                aria-label="Email"
              />
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition"
                disabled={loading}
              >
                {loading ? "Subscribing..." : "Subscribe"}
                <ArrowRight size={14} />
              </button>
            </form>

            <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
              We care about your privacy. No spam. Unsubscribe anytime.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 border-t border-slate-100 dark:border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            © {new Date().getFullYear()} Al Invoice — Built with ❤️. All rights reserved.
          </p>

          <div className="flex items-center gap-4 text-sm">
            <Link to="/terms" className="text-slate-600 dark:text-slate-300 hover:text-indigo-600">Terms</Link>
            <Link to="/privacy" className="text-slate-600 dark:text-slate-300 hover:text-indigo-600">Privacy</Link>
            <Link to="/status" className="text-slate-600 dark:text-slate-300 hover:text-indigo-600">Status</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
