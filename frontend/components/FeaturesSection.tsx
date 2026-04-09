'use client';
import { Eye, Zap, Target, Clock, Award, Download, Brain, Shield } from 'lucide-react';

const FEATURES = [
  {
    icon: Eye,
    title: 'विजुअल नोट्स',
    desc: 'चित्र, रेखाचित्र और रंगीन हाइलाइट के साथ समझने में आसान नोट्स।',
    color: 'from-blue-500 to-blue-600',
    bg: 'bg-blue-50',
    textColor: 'text-blue-600',
  },
  {
    icon: Zap,
    title: 'इंटरैक्टिव लेक्चर्स',
    desc: 'YouTube पर उपलब्ध जीवंत और रोचक वीडियो लेक्चर्स।',
    color: 'from-purple-500 to-purple-600',
    bg: 'bg-purple-50',
    textColor: 'text-purple-600',
  },
  {
    icon: Target,
    title: 'परीक्षा फोकस',
    desc: 'परीक्षा की दृष्टि से तैयार किया गया सटीक और महत्वपूर्ण कंटेंट।',
    color: 'from-red-500 to-rose-600',
    bg: 'bg-red-50',
    textColor: 'text-red-600',
  },
  {
    icon: Clock,
    title: 'समय की बचत',
    desc: 'कम समय में ज़्यादा सीखें। संक्षिप्त और प्रभावी अध्ययन सामग्री।',
    color: 'from-amber-500 to-orange-500',
    bg: 'bg-amber-50',
    textColor: 'text-amber-600',
  },
  {
    icon: Award,
    title: 'प्रमाणित कोर्स',
    desc: 'विशेषज्ञ शिक्षकों द्वारा तैयार और समीक्षित प्रमाणिक सामग्री।',
    color: 'from-emerald-500 to-green-600',
    bg: 'bg-emerald-50',
    textColor: 'text-emerald-600',
  },
  {
    icon: Download,
    title: 'डाउनलोड योग्य',
    desc: 'PDF नोट्स डाउनलोड करें और ऑफलाइन कहीं भी पढ़ें।',
    color: 'from-cyan-500 to-sky-600',
    bg: 'bg-cyan-50',
    textColor: 'text-cyan-600',
  },
  {
    icon: Brain,
    title: 'आसान भाषा',
    desc: 'सरल हिंदी में लिखे गए नोट्स जो हर छात्र आसानी से समझ सके।',
    color: 'from-pink-500 to-rose-500',
    bg: 'bg-pink-50',
    textColor: 'text-pink-600',
  },
  {
    icon: Shield,
    title: 'पूर्णतः मुफ्त',
    desc: 'सभी नोट्स और वीडियो बिल्कुल मुफ्त — कोई छुपा शुल्क नहीं।',
    color: 'from-indigo-500 to-blue-600',
    bg: 'bg-indigo-50',
    textColor: 'text-indigo-600',
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="badge bg-blue-50 text-blue-700 border border-blue-100 mx-auto mb-4">
            ✨ हमारी विशेषताएं
          </div>
          <h2
            className="section-title gradient-text mb-4"
            style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}
          >
            हमें क्यों चुनें?
          </h2>
          <p
            className="text-gray-500 max-w-2xl mx-auto text-lg leading-relaxed"
            style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}
          >
            Self-Learn Academy आपको देता है वो सब कुछ जो आपकी पढ़ाई को
            बेहतर और आसान बना सके।
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              className="feature-card bg-white rounded-2xl p-6 shadow-card border border-gray-100 cursor-default"
              style={{ animationDelay: `${i * 0.07}s` }}
            >
              <div className={`w-12 h-12 ${f.bg} rounded-2xl flex items-center justify-center mb-4`}>
                <f.icon size={24} className={f.textColor} />
              </div>
              <h3
                className="font-bold text-gray-800 text-base mb-2"
                style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}
              >
                {f.title}
              </h3>
              <p
                className="text-gray-500 text-sm leading-relaxed"
                style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}
              >
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
