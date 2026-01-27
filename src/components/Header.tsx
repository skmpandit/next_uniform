import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ShoppingCart,
  FolderHeart,
  Menu,
  X,
  Search,
  User,
  UserPlus,
  LogIn,
  LogOut,
  Settings,
  ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Logo from '@/assets/Logo.png';
import { useAuth } from '@/auth/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import { Helmet } from 'react-helmet-async';

/**
 * Small helper button used in header — keep lightweight and responsive.
 * Accepts same props as <button>.
 */
const Btn = ({ children, variant = 'ghost', size = 'sm', className = '', ...props }: any) => {
  const base = 'inline-flex items-center justify-center rounded-2xl font-medium transition-all';
  const sizes: any = { sm: 'text-sm px-2 py-1.5', md: 'text-base px-4 py-2.5' };
  const variants: any = {
    ghost: 'hover:bg-gray-100 dark:hover:bg-gray-800',
    outline: 'border border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800',
    primary: 'bg-black text-white hover:opacity-90 dark:bg-white dark:text-black',
  };
  return (
    // eslint-disable-next-line react/button-has-type
    <button className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

const Header = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [mobileOpen, setMobileOpen] = useState<number | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // controls mobile menu panel
  const [bannerIndex, setBannerIndex] = useState(0);
  const [acctHover, setAcctHover] = useState(false);
  const [acctPinned, setAcctPinned] = useState(false);
  const navRef = useRef<HTMLDivElement | null>(null);
  const mobilePanelRef = useRef<HTMLDivElement | null>(null);

  const { user, signOutUser } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  type navItem = { label: string; href: string; sub?: string[] };

  const navItems: navItem[] = [
    {
      label: 'Industrial',
      href: '/products?category=Industrial',
      sub: ['Boiler Suit', 'Safety Jacket', 'Safety Vest', 'Safety Shirt', 'Safety Pant'],
    },
    {
      label: 'Hospital',
      href: '/products?category=Hospital',
      sub: ['Scrub', 'Nurse Uniform', 'Lab Coat', 'Doctor Uniform', 'Housekeeping Uniform'],
    },
    {
      label: 'Hotel',
      href: '/products?category=Hotel',
      sub: ['Housekeeping Uniform', 'Front Office Uniform', 'Cheff Coat', 'Waiter Uniform', 'Hospitality uniforms'],
    },
    {
      label: 'Corporate',
      href: '/products?category=Corporate',
      sub: ['Corporate Shirt', 'Corporate Pant', 'Corporate Suit', 'Corporate Blazer', 'Corporate Skirt', 'Corporate T-Shirt'],
    },
  ];

  const banners = [
    <>
      <span className="text-red-500">Customized</span> Uniforms for Your Group
    </>,
    <>Quality Workwear for Every Industry</>,
    <>Comfort and Style in Every Stitch</>,
    <>Durable Uniforms for Tough Jobs</>,
    <>Professional Attire for Your Team</>,
  ];

  // Close desktop dropdowns & mobile panel on route change
  useEffect(() => {
    setOpenIndex(null);
    setIsMenuOpen(false);
    setMobileOpen(null);
  }, [location.pathname, location.search]);

  // click outside handler for desktop dropdowns
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!navRef.current?.contains(e.target as Node)) setOpenIndex(null);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenIndex(null);
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  // banner rotation
  useEffect(() => {
    const id = setInterval(() => setBannerIndex((i) => (i + 1) % banners.length), 4800);
    return () => clearInterval(id);
  }, [banners.length]);

  const firstName = (user?.displayName?.split(' ')[0]) || (user?.email?.split('@')[0] ?? '');
  const accountMenuOpen = acctHover || acctPinned;

  const handleSignOut = async () => {
    try {
      await signOutUser();
      toast({ title: 'Signed out successfully' });
      navigate('/login', { replace: true });
    } catch {
      toast({ title: 'Failed to sign out', variant: 'destructive' });
    }
  };

  const siteNavJsonLd = {
    "@context": "https://schema.org",
    "@type": "SiteNavigationElement",
    "name": "Primary navigation",
    "url": "https://www.nextuniform.com",
    "potentialAction": navItems.map((i) => ({ "@type": "NavigateAction", "target": `https://www.nextuniform.com${i.href.startsWith('/') ? i.href : i.href}` }))
  };

  return (
    <>

      {/* Inject site navigation JSON-LD for crawlers */}
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(siteNavJsonLd)}</script>
      </Helmet>
      
      {/* Promotional Banner */}
      <div className="bg-primary text-primary-foreground text-center py-2 text-sm">
        <p className="transition-opacity duration-500">{banners[bannerIndex]}</p>
      </div>

      {/* Header */}
      <header className="bg-background border-b border-border sticky top-0 z-50">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Left: mobile hamburger + logo */}
            <div className="flex items-center gap-3">
              {/* mobile menu button */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setIsMenuOpen((s) => !s)}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>

              {/* Logo: small on mobile, larger on md+ */}
              <Link to="/" className="flex items-center">
                <img src={Logo} alt="NextUniform" className="h-10 sm:h-12 md:h-16 w-auto" />
              </Link>
            </div>

            {/* Center: Desktop nav */}
            <nav
              ref={navRef}
              className="hidden md:flex items-center gap-6 flex-1 justify-center"
              aria-label="Primary navigation"
            >
              {navItems.map((item, i) => {
                const hasSub = Array.isArray(item.sub) && item.sub.length > 0;
                const open = openIndex === i;
                return (
                  <div key={item.label} className="relative">
                    {hasSub ? (
                      <button
                        type="button"
                        className="inline-flex items-center gap-2 text-sm font-medium px-2 py-1 hover:text-gray-800 focus:outline-none"
                        aria-haspopup="menu"
                        aria-expanded={open}
                        onClick={() => setOpenIndex(open ? null : i)}
                        onKeyDown={(e) => {
                          if (e.key === 'ArrowDown') {
                            setOpenIndex(i);
                            requestAnimationFrame(() => {
                              const first = (e.currentTarget.nextElementSibling as HTMLElement | null)
                                ?.querySelector('a') as HTMLElement | null;
                              first?.focus();
                            });
                            e.preventDefault();
                          }
                        }}
                      >
                        {item.label}
                        <ChevronDown className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : 'rotate-0'}`} />
                      </button>
                    ) : (
                      <Link to={item.href} className="text-sm font-medium px-2 py-1 hover:text-gray-800">
                        {item.label}
                      </Link>
                    )}

                    {/* desktop submenu */}
                    {hasSub && (
                      <div
                        className={`absolute left-0 mt-2 w-56 rounded-xl border border-gray-200 bg-white shadow-lg z-50 transform transition-all duration-150 ${
                          open ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-1 pointer-events-none'
                        }`}
                        role="menu"
                        aria-label={`${item.label} submenu`}
                      >
                        <div className="p-2">
                          {(item.sub ?? []).map((subItem) => (
                            <Link
                              key={subItem}
                              to={`/products?category=${encodeURIComponent(item.label)}&subcategory=${encodeURIComponent(subItem)}`}
                              className="block px-3 py-2 text-sm rounded-md hover:bg-gray-50 focus:bg-gray-50"
                              role="menuitem"
                              onClick={() => setOpenIndex(null)}
                            >
                              {subItem}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>

            {/* Right: icons / account */}
            <div className="flex items-center gap-2">
              {/* language text small */}
              <span className="hidden sm:inline text-sm text-muted-foreground mr-2">English</span>

              {/* search */}
              <Button variant="ghost" size="sm" asChild>
                <Link to="/search" aria-label="Search">
                  <Search className="h-5 w-5" />
                </Link>
              </Button>

              {/* cart & wishlist (icons) */}
              <Link to="/wishlist" className="hidden sm:inline-flex items-center justify-center p-2 rounded-md hover:bg-gray-100">
                <FolderHeart className="h-5 w-5" />
              </Link>

              {/* account dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setAcctHover(true)}
                onMouseLeave={() => setAcctHover(false)}
              >
                {user ? (
                  <>
                    <Btn className="flex items-center gap-2 md:px-3" onClick={() => setAcctPinned((v) => !v)} aria-expanded={accountMenuOpen}>
                      <User className="h-5 w-5" />
                      <span className="hidden md:inline-block text-sm max-w-[120px] truncate">Hi {firstName || 'user'}</span>
                    </Btn>

                    {accountMenuOpen && (
                      <div
                        className="absolute right-0 mt-2 w-56 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-xl z-50"
                        onMouseEnter={() => setAcctHover(true)}
                        onMouseLeave={() => setAcctHover(false)}
                      >
                        <div className="p-3 border-b border-gray-100 dark:border-gray-800">
                          <p className="text-xs text-gray-500">Signed in as</p>
                          <p className="text-sm font-medium truncate">{user?.email}</p>
                        </div>
                        <div className="py-1">
                          <Link to="/account" className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800">
                            <Settings className="h-4 w-4" /> Account
                          </Link>
                          <Link to="/wishlist" className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800">
                            <FolderHeart className="h-4 w-4" /> Wishlist
                          </Link>
                        </div>
                        <div className="border-t border-gray-100 dark:border-gray-800">
                          <button onClick={handleSignOut} className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50">
                            <LogOut className="h-4 w-4" /> Logout
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <Btn className="flex items-center gap-2 md:px-3" onClick={() => setAcctPinned((v) => !v)} aria-expanded={accountMenuOpen}>
                      <User className="h-5 w-5" />
                      <span className="hidden md:inline-block text-sm">Account</span>
                    </Btn>

                    {accountMenuOpen && (
                      <div
                        className="absolute right-0 mt-2 w-56 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-xl z-50"
                        onMouseEnter={() => setAcctHover(true)}
                        onMouseLeave={() => setAcctHover(false)}
                      >
                        <div className="py-1">
                          <Link to="/login" className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50">
                            <LogIn className="h-4 w-4" /> Login
                          </Link>
                          <Link to="/signup" className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50">
                            <UserPlus className="h-4 w-4" /> Sign up
                          </Link>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* MOBILE PANEL: full-width slide-down menu */}
        <div
          ref={mobilePanelRef}
          className={`md:hidden transition-all duration-250 ease-in-out overflow-hidden border-t border-border bg-background ${
            isMenuOpen ? 'max-h-[100vh] py-4' : 'max-h-0'
          }`}
        >
          <div className="px-4">
            <div className="space-y-3">
              {navItems.map((item, i) => {
                const hasSub = Array.isArray(item.sub) && item.sub.length > 0;
                const open = mobileOpen === i;
                return (
                  <div key={item.label}>
                    <div className="flex items-center justify-between">
                      <Link
                        to={item.href}
                        onClick={() => setIsMenuOpen(false)}
                        className="py-2 text-base font-medium"
                      >
                        {item.label}
                      </Link>
                      {hasSub && (
                        <button
                          onClick={() => setMobileOpen(open ? null : i)}
                          aria-expanded={open}
                          aria-controls={`m-sub-${i}`}
                          className="p-2 rounded-md hover:bg-gray-100"
                        >
                          <ChevronDown className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} />
                        </button>
                      )}
                    </div>

                    {hasSub && open && (
                      <div id={`m-sub-${i}`} className="mt-2 pl-4 space-y-1">
                        {(item.sub ?? []).map((sub) => (
                          <Link
                            key={sub}
                            to={`/products?category=${encodeURIComponent(item.label)}&subcategory=${encodeURIComponent(sub)}`}
                            className="block rounded-md px-2 py-1.5 text-sm hover:bg-gray-50"
                            onClick={() => {
                              setIsMenuOpen(false);
                              setMobileOpen(null);
                            }}
                          >
                            {sub}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-4 border-t border-border pt-4">
              <div className="flex items-center gap-3">
                <Link to="/search" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-50">
                  <Search className="w-5 h-5" /> Search
                </Link>
                <Link to="/wishlist" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-50">
                  <FolderHeart className="w-5 h-5" /> Wishlist
                </Link>
              </div>

              <div className="mt-3">
                {user ? (
                  <>
                    <div className="text-sm mb-2">Signed in as <span className="font-medium">{user.email}</span></div>
                    <Link to="/account" className="block px-3 py-2 rounded-md hover:bg-gray-50">Account</Link>
                    <button onClick={handleSignOut} className="mt-2 w-full text-left px-3 py-2 rounded-md text-red-600 hover:bg-red-50">Logout</button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="block px-3 py-2 rounded-md hover:bg-gray-50">Login</Link>
                    <Link to="/signup" className="mt-2 block px-3 py-2 rounded-md hover:bg-gray-50">Sign up</Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;