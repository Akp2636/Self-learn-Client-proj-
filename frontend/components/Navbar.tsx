'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, Menu, X, GraduationCap } from 'lucide-react';

const NAV_LINKS = [
  { href: '/#home',     label: 'होम' },
  { href: '/#features', label: 'विशेषताएं' },
  { href: '/#videos',   label: 'वीडियो' },
  { href: '/notes',     label: 'नोट्स' },
  { href: '/#contact',  label: 'संपर्क' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [pathname]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'navbar-blur shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-emerald-500 flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
              <GraduationCap size={20} className="text-white" />
            </div>
            <div className="flex flex-col leading-tight">
              <span
                className={`font-bold text-base tracking-tight transition-colors ${
                  scrolled ? 'text-blue-800' : 'text-white'
                }`}
                style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}
              >
                Self-Learn
              </span>
              <span
                className={`text-[10px] font-medium transition-colors ${
                  scrolled ? 'text-emerald-600' : 'text-emerald-300'
                }`}
                style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}
              >
                Academy
              </span>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const isActive = link.href === '/notes' && pathname === '/notes';
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm'
                      : scrolled
                      ? 'text-gray-700 hover:bg-blue-50 hover:text-blue-700'
                      : 'text-white/90 hover:bg-white/10 hover:text-white'
                  }`}
                  style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/notes"
              className="btn-primary text-sm py-2 px-5"
              style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}
            >
              नोट्स देखें
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={`md:hidden p-2 rounded-lg transition-colors ${
              scrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10'
            }`}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-xl">
          <div className="px-4 py-3 space-y-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-4 py-3 rounded-xl text-gray-700 hover:bg-blue-50 hover:text-blue-700 font-medium transition-colors"
                style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/notes"
              className="block w-full text-center btn-primary mt-2"
              style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}
            >
              नोट्स देखें
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
