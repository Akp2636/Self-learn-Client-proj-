'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { publicApi } from '../../lib/api';
import toast from 'react-hot-toast';
import {
  FileText, Download, Eye, Search, Filter, X,
  Loader2, BookOpen, ChevronDown, ExternalLink,
} from 'lucide-react';

interface Note {
  _id: string;
  title: string;
  subject: string;
  description: string;
  downloadUrl: string;
  viewUrl: string;
  fileSize: string;
  downloads: number;
  createdAt: string;
}

const SUBJECT_COLORS: Record<string, { bg: string; text: string; border: string; icon: string }> = {
  गणित:          { bg: 'bg-blue-50',    text: 'text-blue-700',    border: 'border-blue-200',    icon: 'bg-blue-100' },
  विज्ञान:       { bg: 'bg-green-50',   text: 'text-green-700',   border: 'border-green-200',   icon: 'bg-green-100' },
  हिंदी:         { bg: 'bg-orange-50',  text: 'text-orange-700',  border: 'border-orange-200',  icon: 'bg-orange-100' },
  अंग्रेजी:     { bg: 'bg-purple-50',  text: 'text-purple-700',  border: 'border-purple-200',  icon: 'bg-purple-100' },
  इतिहास:       { bg: 'bg-amber-50',   text: 'text-amber-700',   border: 'border-amber-200',   icon: 'bg-amber-100' },
  भूगोल:        { bg: 'bg-cyan-50',    text: 'text-cyan-700',    border: 'border-cyan-200',    icon: 'bg-cyan-100' },
  रसायन:        { bg: 'bg-pink-50',    text: 'text-pink-700',    border: 'border-pink-200',    icon: 'bg-pink-100' },
  'जीव विज्ञान': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', icon: 'bg-emerald-100' },
  राजनीति:      { bg: 'bg-indigo-50',  text: 'text-indigo-700',  border: 'border-indigo-200',  icon: 'bg-indigo-100' },
};
const defaultColor = { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200', icon: 'bg-gray-100' };

function NotesContent() {
  const searchParams = useSearchParams();
  const [notes, setNotes] = useState<Note[]>([]);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedSubject, setSelectedSubject] = useState(searchParams.get('subject') || 'सभी');
  const [viewNote, setViewNote] = useState<Note | null>(null);
  const [downloading, setDownloading] = useState<string | null>(null);

  const fetchNotes = async (subject = selectedSubject, q = search) => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (subject !== 'सभी') params.subject = subject;
      if (q.trim()) params.search = q.trim();
      const res = await publicApi.getNotes(params);
      setNotes(res.data.notes);
    } catch {
      toast.error('नोट्स लोड करने में समस्या हुई');
    } finally {
      setLoading(false);
    }
  };

  const fetchSubjects = async () => {
    try {
      const res = await publicApi.getSubjects();
      setSubjects(['सभी', ...res.data.subjects]);
    } catch {
      setSubjects(['सभी']);
    }
  };

  useEffect(() => {
    fetchSubjects();
    fetchNotes();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchNotes(selectedSubject, search);
  };

  const handleSubjectChange = (subject: string) => {
    setSelectedSubject(subject);
    fetchNotes(subject, search);
  };

  const handleDownload = async (note: Note) => {
    setDownloading(note._id);
    try {
      await publicApi.trackDownload(note._id);
      const link = document.createElement('a');
      link.href = note.downloadUrl;
      link.target = '_blank';
      link.download = `${note.title}.pdf`;
      link.click();
      toast.success(`"${note.title}" डाउनलोड शुरू हो गया!`);
    } catch {
      window.open(note.downloadUrl, '_blank');
    } finally {
      setDownloading(null);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #eff6ff 0%, #f0fdf4 100%)' }}>

        {/* Page Header */}
        <div className="bg-gradient-to-r from-blue-800 to-emerald-700 pt-28 pb-16 px-4">
          <div className="max-w-7xl mx-auto text-center text-white">
            <div className="badge bg-white/20 text-white border border-white/30 mx-auto mb-4">
              <BookOpen size={14} />
              <span style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}>PDF नोट्स लाइब्रेरी</span>
            </div>
            <h1
              className="text-4xl md:text-5xl font-bold mb-4"
              style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}
            >
              सभी नोट्स
            </h1>
            <p
              className="text-blue-100 text-lg max-w-xl mx-auto"
              style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}
            >
              अपने विषय के नोट्स खोजें, देखें और डाउनलोड करें — बिल्कुल मुफ्त!
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

          {/* Search + Filter Bar */}
          <div className="bg-white rounded-2xl shadow-card p-5 mb-8">
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="नोट्स खोजें..."
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none text-gray-700 text-sm"
                  style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}
                />
                {search && (
                  <button type="button" onClick={() => { setSearch(''); fetchNotes(selectedSubject, ''); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    <X size={16} />
                  </button>
                )}
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm transition-colors flex items-center gap-2 whitespace-nowrap"
                style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}
              >
                <Search size={16} />
                खोजें
              </button>
            </form>

            {/* Subject filters */}
            <div className="flex flex-wrap gap-2 mt-4">
              {subjects.map((sub) => (
                <button
                  key={sub}
                  onClick={() => handleSubjectChange(sub)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                    selectedSubject === sub
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-700'
                  }`}
                  style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}
                >
                  {sub}
                </button>
              ))}
            </div>
          </div>

          {/* Results count */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-gray-600 text-sm" style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}>
              {loading ? 'लोड हो रहा है...' : `${notes.length} नोट्स मिले`}
              {selectedSubject !== 'सभी' && ` — ${selectedSubject}`}
            </p>
          </div>

          {/* Notes Grid */}
          {loading ? (
            <div className="flex justify-center py-20 gap-3">
              <Loader2 size={32} className="animate-spin text-blue-600" />
              <span className="text-gray-500" style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}>
                नोट्स लोड हो रहे हैं...
              </span>
            </div>
          ) : notes.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl shadow-card">
              <FileText size={70} className="mx-auto mb-5 text-gray-200" />
              <h3 className="text-xl font-semibold text-gray-500 mb-2" style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}>
                कोई नोट्स नहीं मिले
              </h3>
              <p className="text-gray-400" style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}>
                अलग विषय या खोज शब्द आजमाएं
              </p>
              <button
                onClick={() => { setSearch(''); setSelectedSubject('सभी'); fetchNotes('सभी', ''); }}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-xl font-medium text-sm"
                style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}
              >
                सभी नोट्स दिखाएं
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {notes.map((note) => {
                const color = SUBJECT_COLORS[note.subject] || defaultColor;
                return (
                  <div key={note._id} className="note-card bg-white rounded-2xl p-5 shadow-card flex flex-col">
                    <div className="flex items-start justify-between mb-3">
                      <div className={`w-11 h-11 ${color.icon} rounded-xl flex items-center justify-center border ${color.border}`}>
                        <FileText size={22} className={color.text} />
                      </div>
                      {note.fileSize && (
                        <span className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-lg border border-gray-100">
                          {note.fileSize}
                        </span>
                      )}
                    </div>

                    <span
                      className={`self-start text-xs px-2.5 py-0.5 rounded-full font-medium ${color.bg} ${color.text} border ${color.border} mb-2`}
                      style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}
                    >
                      {note.subject}
                    </span>

                    <h3
                      className="font-bold text-gray-800 text-sm leading-snug line-clamp-2 flex-1 mb-2"
                      style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}
                    >
                      {note.title}
                    </h3>

                    {note.description && (
                      <p
                        className="text-gray-400 text-xs mb-3 line-clamp-2 leading-relaxed"
                        style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}
                      >
                        {note.description}
                      </p>
                    )}

                    <div className="flex gap-2 mt-auto">
                      <button
                        onClick={() => setViewNote(note)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border-2 border-blue-200 text-blue-700 hover:bg-blue-50 font-semibold text-xs transition-all"
                        style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}
                      >
                        <Eye size={14} />
                        देखें
                      </button>
                      <button
                        onClick={() => handleDownload(note)}
                        disabled={downloading === note._id}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-emerald-600 text-white hover:from-blue-700 hover:to-emerald-700 font-semibold text-xs transition-all shadow-sm disabled:opacity-60"
                        style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}
                      >
                        {downloading === note._id ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <Download size={14} />
                        )}
                        {downloading === note._id ? '...' : 'डाउनलोड'}
                      </button>
                    </div>

                    {note.downloads > 0 && (
                      <p className="text-[11px] text-gray-400 mt-2 text-center" style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}>
                        📥 {note.downloads} डाउनलोड
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* PDF Viewer Modal */}
      {viewNote && (
        <div className="pdf-modal-overlay" onClick={() => setViewNote(null)}>
          <div
            className="bg-white rounded-2xl overflow-hidden shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b bg-white">
              <div className="min-w-0 flex-1 mr-4">
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    (SUBJECT_COLORS[viewNote.subject] || defaultColor).bg
                  } ${(SUBJECT_COLORS[viewNote.subject] || defaultColor).text} border ${
                    (SUBJECT_COLORS[viewNote.subject] || defaultColor).border
                  }`}
                  style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}
                >
                  {viewNote.subject}
                </span>
                <h3
                  className="font-bold text-gray-800 mt-1 text-sm leading-snug line-clamp-1"
                  style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}
                >
                  {viewNote.title}
                </h3>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={viewNote.downloadUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 transition-colors"
                  style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}
                >
                  <Download size={13} />
                  डाउनलोड
                </a>
                <a
                  href={viewNote.viewUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors"
                  title="नए टैब में खोलें"
                >
                  <ExternalLink size={14} />
                </a>
                <button
                  onClick={() => setViewNote(null)}
                  className="w-8 h-8 bg-gray-100 hover:bg-red-100 hover:text-red-600 rounded-full flex items-center justify-center text-gray-500 font-bold text-lg transition-colors"
                >
                  ×
                </button>
              </div>
            </div>

            {/* PDF iframe using Google Docs viewer */}
            <div className="flex-1 overflow-hidden" style={{ minHeight: '500px' }}>
              <iframe
                src={`https://docs.google.com/viewer?url=${encodeURIComponent(viewNote.viewUrl)}&embedded=true`}
                className="w-full h-full border-0"
                style={{ minHeight: '500px' }}
                title={viewNote.title}
              />
            </div>

            <div className="p-3 bg-gray-50 border-t text-center">
              <p className="text-xs text-gray-400" style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}>
                PDF सही न दिखे तो{' '}
                <a href={viewNote.viewUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                  यहाँ क्लिक करें
                </a>
              </p>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}

export default function NotesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 size={32} className="animate-spin text-blue-600" /></div>}>
      <NotesContent />
    </Suspense>
  );
}
