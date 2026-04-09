import Link from 'next/link';
import { GraduationCap, Youtube, Mail, Phone, MapPin, Heart } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="contact" className="bg-gray-900 text-white">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center">
                <GraduationCap size={22} className="text-white" />
              </div>
              <div>
                <div className="font-bold text-lg text-white" style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}>
                  Self-Learn Academy
                </div>
              </div>
            </div>
            <p
              className="text-gray-400 text-sm leading-relaxed mb-5"
              style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}
            >
              यह एक डिजिटल शिक्षा प्लेटफॉर्म है जहाँ छात्रों को सरल, रोचक
              और उपयोगी अध्ययन सामग्री मिलती है।
            </p>
            <a
              href="https://youtube.com/@deveshworld"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
              style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}
            >
              <Youtube size={16} />
              YouTube Channel
            </a>
          </div>

          {/* Quick Links */}
          <div>
            <h4
              className="font-bold text-white mb-4 text-base"
              style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}
            >
              त्वरित लिंक
            </h4>
            <ul className="space-y-2">
              {[
                { href: '/#home',     label: 'होम' },
                { href: '/#features', label: 'विशेषताएं' },
                { href: '/#videos',   label: 'वीडियो' },
                { href: '/notes',     label: 'नोट्स' },
                { href: '/admin',     label: 'एडमिन' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white text-sm transition-colors"
                    style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}
                  >
                    → {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Subjects */}
          <div>
            <h4
              className="font-bold text-white mb-4 text-base"
              style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}
            >
              विषय
            </h4>
            <ul className="space-y-2">
              {['गणित', 'विज्ञान', 'हिंदी', 'इतिहास', 'भूगोल', 'अंग्रेजी', 'रसायन'].map((sub) => (
                <li key={sub}>
                  <Link
                    href={`/notes?subject=${encodeURIComponent(sub)}`}
                    className="text-gray-400 hover:text-white text-sm transition-colors"
                    style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}
                  >
                    → {sub}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4
              className="font-bold text-white mb-4 text-base"
              style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}
            >
              संपर्क
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <Youtube size={15} className="text-red-400 shrink-0" />
                <a href="https://youtube.com/@deveshworld" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                  @deveshworld
                </a>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <Mail size={15} className="text-blue-400 shrink-0" />
                <span>selflearn@academy.in</span>
              </li>
              <li className="flex items-start gap-3 text-gray-400 text-sm">
                <MapPin size={15} className="text-emerald-400 shrink-0 mt-0.5" />
                <span style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}>भारत</span>
              </li>
            </ul>

            <div className="mt-5 p-4 bg-gray-800 rounded-xl">
              <p
                className="text-gray-400 text-xs leading-relaxed"
                style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}
              >
                📚 सभी नोट्स और वीडियो पूर्णतः
                <span className="text-emerald-400 font-semibold"> निःशुल्क </span>
                हैं। कोई भी शुल्क नहीं लिया जाता।
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p
            className="text-gray-500 text-sm flex items-center gap-1"
            style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}
          >
            © {currentYear} Self-Learn Academy |{' '}
            <span className="flex items-center gap-1">
              बनाया गया <Heart size={12} className="text-red-400 fill-red-400" /> के साथ
            </span>
          </p>
          <p className="text-gray-600 text-xs" style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}>
            शिक्षा ही सबसे बड़ा धन है। 📖
          </p>
        </div>
      </div>
    </footer>
  );
}
