import  { useEffect, useState, useRef } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, ChevronDown, User, LogIn, UserPlus, LogOut } from 'lucide-react';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Replace these with real auth state later
  const isAuthenticated = false;
  const user = { name: 'Alex', email: 'alex@timetoprogram.com' };
  const logout = () => {
    // implement logout logic
    console.log('logout');
  };

  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // close dropdown when clicking outside
  useEffect(() => {
    function handleOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileDropdownOpen(false);
      }
    }
    document.addEventListener('click', handleOutside);
    return () => document.removeEventListener('click', handleOutside);
  }, []);

  // small helper for NavLink class
  const navClass = ({ isActive }) =>
    `text-sm font-medium ${isActive ? 'text-indigo-600' : 'text-slate-700 hover:text-indigo-600'}`;

  return (
    <header
      className={`w-full bg-white z-40 top-0 sticky transition-shadow ${
        isScrolled ? 'shadow-md' : 'shadow-none'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo + Title */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-md bg-gradient-to-br from-indigo-600 to-violet-500 flex items-center justify-center text-white font-semibold shadow">
                AI
              </div>
              <div className="hidden sm:block">
                <div className="text-lg font-semibold text-slate-800">Al Invoice</div>
                <div className="text-xs text-slate-500">Smart invoicing for your business</div>
              </div>
            </Link>
          </div>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-6">
<a href="#features" className="text-sm font-medium hover:text-indigo-600">
  Features
</a>

<a href="#testimonials" className="text-sm font-medium hover:text-indigo-600">
  Testimonials
</a>

<a href="#faq" className="text-sm font-medium hover:text-indigo-600">
  FAQ
</a>

          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            {/* auth actions (hidden on small screens) */}
            <div className="hidden md:flex items-center gap-3">
              {!isAuthenticated ? (
                <>
                  <Link
                    to="/login"
                    className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    <LogIn size={16} />
                    <span className="hidden sm:inline">Login</span>
                  </Link>
                  <Link
                    to="/signup"
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700"
                  >
                    <UserPlus size={16} />
                    <span className="hidden sm:inline">Sign Up</span>
                  </Link>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setProfileDropdownOpen((p) => !p)}
                    ref={dropdownRef}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-slate-200 hover:bg-slate-50"
                    aria-expanded={profileDropdownOpen}
                  >
                    <User size={16} />
                    <span className="hidden sm:inline text-sm text-slate-700">{user.name}</span>
                    <ChevronDown
                      size={14}
                      className={`transition-transform ${profileDropdownOpen ? 'rotate-180' : 'rotate-0'}`}
                    />
                  </button>

                  {profileDropdownOpen && (
                    <div className="absolute right-6 mt-14 md:mt-12 w-48 bg-white border rounded-md shadow-md py-1">
                      <Link to="/profile" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                        Profile
                      </Link>
                      <Link to="/dashboard" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                        Dashboard
                      </Link>
                      <div className="border-t mt-1" />
                      <button
                        onClick={logout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-slate-50"
                      >
                        <div className="flex items-center gap-2">
                          <LogOut size={16} />
                          <span>Logout</span>
                        </div>
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Account dropdown for small screens & fallback */}
            {!isAuthenticated && (
              <div className="relative md:hidden" ref={dropdownRef}>
                <button
                  onClick={() => setProfileDropdownOpen((p) => !p)}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-slate-200 hover:bg-slate-50"
                >
                  <User size={16} />
                  <ChevronDown size={14} className={`${profileDropdownOpen ? 'rotate-180' : 'rotate-0'}`} />
                </button>
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-md py-1">
                    <Link to="/login" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                      Login
                    </Link>
                    <Link to="/signup" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen((p) => !p)}
              className="lg:hidden p-2 rounded-md hover:bg-slate-100"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile panel */}
      {isMenuOpen && (
        <div className="lg:hidden border-t bg-white">
          <div className="px-4 pt-3 pb-4 space-y-2">
            <a
              href="#features"
              onClick={() => setIsMenuOpen(false)}
              className="block text-slate-700 font-medium"
            >
              Features
            </a>
            <a
              href="#testimonials"
              onClick={() => setIsMenuOpen(false)}
              className="block text-slate-700 font-medium"
            >
              Testimonials
            </a>
            <a href="#faq" onClick={() => setIsMenuOpen(false)} className="block text-slate-700 font-medium">
              FAQ
            </a>

            <div className="pt-2 border-t">
              {!isAuthenticated ? (
                <>
                  <Link to="/login" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-sm font-medium text-slate-700">
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setIsMenuOpen(false)}
                    className="mt-1 block px-3 py-2 rounded-md text-sm font-medium bg-indigo-600 text-white"
                  >
                    Sign Up
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-sm font-medium text-slate-700">
                    Profile
                  </Link>
                  <Link to="/dashboard" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-sm font-medium text-slate-700">
                    Dashboard
                  </Link>
                  <button onClick={() => { logout(); setIsMenuOpen(false); }} className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-red-600">
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
