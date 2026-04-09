'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FileText, Download, Eye, ArrowRight, Loader2 } from 'lucide-react';
import { publicApi } from '../lib/api';
import toast from 'react-hot-toast';

interface Note {
  _id: string;
  title: string;
  subject: string;
  description: string;
  downloadUrl: string;
  viewUrl: string;
  fileSize: string;
  downloads: number;
}

const SUBJECT_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  गणित:        { bg: 'bg-blue-50',   text: 'text-blue-700',   border: 'border-blue-200' },
  विज्ञान:     { bg: 'bg-green-50',  text: 'text-green-700',  border: 'border-green-200' },
  हिंदी:       { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
  अंग्रेजी:   { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  इतिहास:     { bg: 'bg-amber-50',  text: 'text-amber-700',  border: 'border-amber-200' },
  भूगोल:      { bg: 'bg-cyan-50',   text: 'text-cyan-700',   border: 'border-cyan-200' },
  रसायन:      { bg: 'bg-pink-50',   text: 'text-pink-700',   border: 'border-pink-200' },
  'जीव विज्ञान': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
};

const defaultColor = { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' };

export default function NotesSectionPreview() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    publicApi.getNotes()
      .then(res => setNotes(res.data.notes.slice(0, 6)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleDownload = async (note: Note) => {
    try {
      await publicApi.trackDownload(note._id);
      window.open(note.downloadUrl, '_blank');
      toast.success(`"${note.title}" डाउनलोड शुरू हो गया!`);
    } catch {
      window.open(note.downloadUrl, '_blank');
    }
  };

  return (
    <section id="notes-section" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="badge bg-emerald-50 text-emerald-700 border border-emerald-100 mx-auto mb-4">
            <FileText size={14} />
            PDF नोट्स
          </div>
          <h2
            className="section-title gradient-text mb-4"
            style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}
          >
            अध्ययन सामग्री
          </h2>
          <p
            className="text-gray-500 max-w-2xl mx-auto text-lg"
            style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}
          >
            सभी विषयों के लिए विस्तृत नोट्स PDF में उपलब्ध हैं।
            देखें, पढ़ें और मुफ्त में डाउनलोड करें।
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-16 gap-3">
            <Loader2 size={28} className="animate-spin text-blue-600" />
            <span className="text-gray-500" style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}>
              नोट्स लोड हो रहे हैं...
            </span>
          </div>
        ) : notes.length === 0 ? (
          <div className="text-center py-16">
            <FileText size={60} className="mx-auto mb-4 text-gray-200" />
            <p className="text-gray-400 text-lg" style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}>
              जल्द ही नोट्स जोड़े जाएंगे।
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {notes.map((note) => {
                const color = SUBJECT_COLORS[note.subject] || defaultColor;
                return (
                  <div key={note._id} className="note-card bg-white rounded-2xl p-6 shadow-card">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 ${color.bg} rounded-2xl flex items-center justify-center border ${color.border}`}>
                        <FileText size={24} className={color.text} />
                      </div>
                      {note.fileSize && (
                        <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-lg">
                          {note.fileSize}
                        </span>
                      )}
                    </div>

                    <span
                      className={`text-xs px-3 py-1 rounded-full font-medium ${color.bg} ${color.text} border ${color.border}`}
                      style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}
                    >
                      {note.subject}
                    </span>

                    <h3
                      className="font-bold text-gray-800 mt-3 mb-2 text-base leading-snug line-clamp-2"
                      style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}
                    >
                      {note.title}
                    </h3>

                    {note.description && (
                      <p
                        className="text-gray-400 text-sm mb-4 line-clamp-2"
                        style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}
                      >
                        {note.description}
                      </p>
                    )}

                    <div className="flex gap-2 mt-4">
                      <a
                        href={`https://docs.google.com/viewer?url=${encodeURIComponent(note.viewUrl)}&embedded=true`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-blue-200 text-blue-700 hover:bg-blue-50 font-semibold text-sm transition-all"
                        style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}
                      >
                        <Eye size={15} />
                        देखें
                      </a>
                      <button
                        onClick={() => handleDownload(note)}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 font-semibold text-sm transition-all shadow-sm"
                        style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}
                      >
                        <Download size={15} />
                        डाउनलोड
                      </button>
                    </div>

                    {note.downloads > 0 && (
                      <p className="text-xs text-gray-400 mt-2 text-center" style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}>
                        {note.downloads} बार डाउनलोड हुआ
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="text-center">
              <Link
                href="/notes"
                className="inline-flex items-center gap-2 btn-emerald text-base"
                style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}
              >
                सभी नोट्स देखें
                <ArrowRight size={18} />
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
