'use client';
import { useState, useEffect } from 'react';
import { Play, ExternalLink, Loader2, Youtube, RefreshCw } from 'lucide-react';
import { publicApi } from '../lib/api';

// Default videos from the channel (shown when DB is empty)
const DEFAULT_VIDEOS = [
  {
    _id: 'd1',
    title: 'गणित - त्रिकोणमिति परिचय',
    subject: 'गणित',
    youtubeId: 'rAy0e_gCOoE',
    description: 'त्रिकोणमिति के मूल सूत्र और उनके अनुप्रयोग',
  },
  {
    _id: 'd2',
    title: 'भौतिक विज्ञान - गति के नियम',
    subject: 'विज्ञान',
    youtubeId: 'kKKM8Y-u7ds',
    description: 'न्यूटन के गति के नियम और उनके उदाहरण',
  },
  {
    _id: 'd3',
    title: 'रसायन विज्ञान - परमाणु संरचना',
    subject: 'रसायन',
    youtubeId: 'cXKoS4xmOv0',
    description: 'परमाणु की संरचना और इलेक्ट्रॉन विन्यास',
  },
  {
    _id: 'd4',
    title: 'जीव विज्ञान - कोशिका',
    subject: 'जीव विज्ञान',
    youtubeId: 'sTZ0oXRLCNs',
    description: 'कोशिका की संरचना और उसके कार्य',
  },
  {
    _id: 'd5',
    title: 'हिंदी व्याकरण - संधि',
    subject: 'हिंदी',
    youtubeId: 'zL9DkLnPCE8',
    description: 'संधि के प्रकार और उदाहरण',
  },
  {
    _id: 'd6',
    title: 'इतिहास - स्वतंत्रता संग्राम',
    subject: 'इतिहास',
    youtubeId: 'OO8xaHnBIKg',
    description: 'भारतीय स्वतंत्रता संग्राम की प्रमुख घटनाएं',
  },
];

interface Video {
  _id: string;
  title: string;
  subject: string;
  youtubeId: string;
  description?: string;
}

export default function VideosSection() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Video | null>(null);
  const [error, setError] = useState('');

  const fetchVideos = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await publicApi.getVideos();
      const data: Video[] = res.data.videos;
      setVideos(data.length > 0 ? data : DEFAULT_VIDEOS);
    } catch {
      setVideos(DEFAULT_VIDEOS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchVideos(); }, []);

  const SUBJECT_COLORS: Record<string, string> = {
    गणित: 'bg-blue-100 text-blue-700',
    विज्ञान: 'bg-green-100 text-green-700',
    रसायन: 'bg-purple-100 text-purple-700',
    हिंदी: 'bg-orange-100 text-orange-700',
    'जीव विज्ञान': 'bg-emerald-100 text-emerald-700',
    इतिहास: 'bg-amber-100 text-amber-700',
    भूगोल: 'bg-cyan-100 text-cyan-700',
  };

  const subjectColor = (subj: string) =>
    SUBJECT_COLORS[subj] || 'bg-gray-100 text-gray-700';

  return (
    <section id="videos" className="py-24" style={{ background: 'linear-gradient(180deg, #f0fdf4 0%, #eff6ff 100%)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="badge bg-red-50 text-red-600 border border-red-100 mx-auto mb-4">
            <Youtube size={16} className="text-red-600" />
            YouTube लेक्चर्स
          </div>
          <h2
            className="section-title gradient-text mb-4"
            style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}
          >
            वीडियो लेक्चर्स
          </h2>
          <p
            className="text-gray-500 max-w-2xl mx-auto text-lg"
            style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}
          >
            Devesh World YouTube चैनल पर उपलब्ध सर्वश्रेष्ठ शिक्षण वीडियो देखें।
            प्रत्येक विषय को सरल और समझने योग्य तरीके से समझाया गया है।
          </p>
        </div>

        {/* Channel Banner */}
        <div className="mb-10 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
              <Youtube size={30} className="text-white" />
            </div>
            <div className="text-white">
              <div className="font-bold text-lg" style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}>
                Devesh World
              </div>
              <div className="text-red-100 text-sm" style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}>
                Subscribe करें और पाएं नए वीडियो की जानकारी
              </div>
            </div>
          </div>
          <a
            href="https://youtube.com/@deveshworld"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 bg-white text-red-600 font-bold px-6 py-3 rounded-xl hover:bg-red-50 transition-colors shadow-lg whitespace-nowrap"
            style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}
          >
            <Youtube size={18} />
            चैनल देखें
            <ExternalLink size={14} />
          </a>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex items-center justify-center py-20 gap-3">
            <Loader2 size={28} className="animate-spin text-blue-600" />
            <span className="text-gray-500" style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}>
              वीडियो लोड हो रहे हैं...
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <div
                key={video._id}
                className="video-card bg-white rounded-2xl overflow-hidden shadow-card cursor-pointer group"
                onClick={() => setSelected(video)}
              >
                {/* Thumbnail */}
                <div className="relative">
                  <img
                    src={`https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`}
                    alt={video.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`;
                    }}
                  />
                  {/* Play overlay */}
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-xl transform scale-90 group-hover:scale-100 transition-transform">
                      <Play size={28} className="text-white fill-white ml-1" />
                    </div>
                  </div>
                  {/* Duration badge */}
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-md font-mono">
                    ▶ YouTube
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${subjectColor(video.subject)}`}
                    style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}
                  >
                    {video.subject}
                  </span>
                  <h3
                    className="font-bold text-gray-800 mt-2 mb-1 line-clamp-2 text-sm leading-snug group-hover:text-blue-700 transition-colors"
                    style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}
                  >
                    {video.title}
                  </h3>
                  {video.description && (
                    <p
                      className="text-gray-400 text-xs line-clamp-2"
                      style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}
                    >
                      {video.description}
                    </p>
                  )}
                  <div className="mt-3 flex items-center gap-1 text-red-500 text-xs font-medium">
                    <Play size={12} className="fill-red-500" />
                    <span style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}>अभी देखें</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* View more CTA */}
        <div className="text-center mt-10">
          <a
            href="https://youtube.com/@deveshworld"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 bg-red-600 text-white font-bold px-8 py-3 rounded-full hover:bg-red-700 transition-all hover:-translate-y-1 shadow-lg"
            style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}
          >
            <Youtube size={20} />
            और वीडियो देखें
            <ExternalLink size={16} />
          </a>
        </div>
      </div>

      {/* Video Modal */}
      {selected && (
        <div
          className="pdf-modal-overlay"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white rounded-2xl overflow-hidden shadow-2xl w-full max-w-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b">
              <div>
                <h3
                  className="font-bold text-gray-800 text-base"
                  style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}
                >
                  {selected.title}
                </h3>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${subjectColor(selected.subject)}`}
                  style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}
                >
                  {selected.subject}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={`https://www.youtube.com/watch?v=${selected.youtubeId}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-red-600 hover:text-red-700 text-sm font-medium"
                  style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}
                >
                  <ExternalLink size={14} />
                  YouTube पर खोलें
                </a>
                <button
                  onClick={() => setSelected(null)}
                  className="w-8 h-8 bg-gray-100 hover:bg-red-100 hover:text-red-600 rounded-full flex items-center justify-center text-gray-500 transition-colors text-lg font-bold"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="video-responsive bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${selected.youtubeId}?autoplay=1&rel=0`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={selected.title}
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
