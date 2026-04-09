'use client';
import Link from 'next/link';
import { ArrowRight, BookOpen, Play, Star, Users, Award } from 'lucide-react';

const STATS = [
  { icon: Users,   value: '५०,०००+', label: 'छात्र' },
  { icon: BookOpen,value: '२००+',    label: 'नोट्स' },
  { icon: Play,    value: '१००+',    label: 'वीडियो' },
  { icon: Star,    value: '४.९',     label: 'रेटिंग' },
];

export default function HeroSection() {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="hero-bg min-h-screen flex items-center relative overflow-hidden">
      {/* Floating circles decoration */}
      <div className="absolute top-20 right-20 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-20 left-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl animate-pulse-slow" style={{ animationDelay: '1.5s' }} />
      <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-blue-400/10 rounded-full blur-xl" />

      {/* Floating badge */}
      <div className="absolute top-24 right-8 md:right-24 hidden md:flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-4 py-3 animate-float">
        <Award size={18} className="text-yellow-400" />
        <span className="text-white text-sm font-medium" style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}>भारत का #१ हिंदी EdTech</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-white">
            <div className="badge bg-white/10 text-white border border-white/20 mb-6 animate-fade-up">
              <Star size={14} className="text-yellow-400" />
              <span style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}>✨ डिजिटल शिक्षा की नई दुनिया</span>
            </div>

            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 animate-fade-up delay-100"
              style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}
            >
              स्वागत है{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-emerald-300">
                Self-Learn
              </span>
              <br />
              Academy में
            </h1>

            <p
              className="text-lg md:text-xl text-blue-100 leading-relaxed mb-8 max-w-xl animate-fade-up delay-200"
              style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}
            >
              यह एक डिजिटल शिक्षा प्लेटफॉर्म है जहाँ छात्रों को सरल, रोचक और उपयोगी
              अध्ययन सामग्री मिलती है। हमारा उद्देश्य आपकी शिक्षा यात्रा को
              <strong className="text-yellow-300"> आसान और सफल</strong> बनाना है।
            </p>

            <div className="flex flex-wrap gap-4 mb-10 animate-fade-up delay-300">
              <button
                onClick={() => scrollToSection('notes-section')}
                className="btn-primary flex items-center gap-2 text-base"
                style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}
              >
                अभी शुरू करें
                <ArrowRight size={18} />
              </button>
              <button
                onClick={() => scrollToSection('videos')}
                className="btn-outline flex items-center gap-2 text-base"
                style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}
              >
                <Play size={18} className="fill-white" />
                वीडियो देखें
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4 animate-fade-up delay-400">
              {STATS.map((stat) => (
                <div key={stat.label} className="text-center">
                  <stat.icon size={20} className="mx-auto mb-1 text-emerald-300" />
                  <div className="text-xl font-bold text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    {stat.value}
                  </div>
                  <div
                    className="text-xs text-blue-200"
                    style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Visual illustration */}
          <div className="hidden lg:flex justify-center items-center animate-fade-up delay-300">
            <div className="relative">
              {/* Main card */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 w-80 shadow-2xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-400 flex items-center justify-center">
                    <BookOpen size={24} className="text-white" />
                  </div>
                  <div>
                    <div className="text-white font-bold" style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}>आज का पाठ</div>
                    <div className="text-blue-200 text-sm" style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}>गणित - अध्याय ५</div>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  {['त्रिकोणमिति के सूत्र', 'बीजगणित की विधियाँ', 'ज्यामिति के नियम'].map((item, i) => (
                    <div key={item} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-emerald-400/30 border border-emerald-400/50 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-emerald-400" />
                      </div>
                      <span className="text-white/80 text-sm" style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}>{item}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-white/10 rounded-xl p-3">
                  <div className="flex justify-between text-white/60 text-xs mb-2" style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}>
                    <span>प्रगति</span><span>७५%</span>
                  </div>
                  <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full w-3/4 bg-gradient-to-r from-emerald-400 to-blue-400 rounded-full" />
                  </div>
                </div>
              </div>

              {/* Floating mini cards */}
              <div className="absolute -top-6 -right-6 bg-white rounded-2xl p-3 shadow-xl animate-float">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center">
                    <Award size={16} className="text-blue-600" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-800" style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}>१०० अंक</div>
                    <div className="text-[10px] text-gray-400" style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}>मिले!</div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-6 bg-white rounded-2xl p-3 shadow-xl animate-float" style={{ animationDelay: '1s' }}>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center">
                    <Star size={16} className="text-emerald-600 fill-emerald-600" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-800">4.9 ★</div>
                    <div className="text-[10px] text-gray-400" style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}>रेटिंग</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wave bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="w-full h-12 fill-white">
          <path d="M0,60 C360,0 1080,60 1440,0 L1440,60 Z" />
        </svg>
      </div>
    </section>
  );
}
