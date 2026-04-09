'use client';
import { useState, useEffect, useRef } from 'react';
import { adminApi } from '../../lib/api';
import toast from 'react-hot-toast';
import {
  Lock, LogOut, Upload, Trash2, FileText, Video,
  Plus, Eye, Loader2, CheckCircle, AlertCircle,
  GraduationCap, Youtube, X, RefreshCw,
} from 'lucide-react';

interface Note {
  _id: string;
  title: string;
  subject: string;
  description: string;
  downloadUrl: string;
  fileSize: string;
  downloads: number;
  createdAt: string;
}

interface VideoItem {
  _id: string;
  title: string;
  subject: string;
  youtubeId: string;
  description: string;
}

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  const [tab, setTab] = useState<'notes' | 'videos'>('notes');
  const [notes, setNotes] = useState<Note[]>([]);
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [dataLoading, setDataLoading] = useState(false);

  // Note upload form
  const [noteForm, setNoteForm] = useState({ title: '', subject: '', description: '' });
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);

  // Video form
  const [videoForm, setVideoForm] = useState({ title: '', subject: '', youtubeId: '', description: '' });
  const [addingVideo, setAddingVideo] = useState(false);

  const [deleting, setDeleting] = useState<string | null>(null);

  // Check if token exists on load
  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (token) setIsLoggedIn(true);
  }, []);

  useEffect(() => {
    if (isLoggedIn) fetchData();
  }, [isLoggedIn, tab]);

  const fetchData = async () => {
    setDataLoading(true);
    try {
      if (tab === 'notes') {
        const res = await adminApi.getNotes();
        setNotes(res.data.notes);
      } else {
        const res = await adminApi.getVideos();
        setVideos(res.data.videos);
      }
    } catch (err: any) {
      if (err.response?.status === 401) {
        localStorage.removeItem('admin_token');
        setIsLoggedIn(false);
        toast.error('सत्र समाप्त। कृपया फिर लॉगिन करें।');
      }
    } finally {
      setDataLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');
    try {
      const res = await adminApi.login(loginForm.username, loginForm.password);
      localStorage.setItem('admin_token', res.data.token);
      setIsLoggedIn(true);
      toast.success('लॉगिन सफल! स्वागत है एडमिन।');
    } catch (err: any) {
      setLoginError(err.response?.data?.message || 'लॉगिन विफल');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setIsLoggedIn(false);
    setNotes([]);
    setVideos([]);
    toast.success('लॉगआउट सफल!');
  };

  const handleUploadNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pdfFile) { toast.error('कृपया PDF फ़ाइल चुनें।'); return; }
    if (!noteForm.title.trim() || !noteForm.subject.trim()) {
      toast.error('शीर्षक और विषय अनिवार्य हैं।'); return;
    }

    setUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('pdf', pdfFile);
    formData.append('title', noteForm.title);
    formData.append('subject', noteForm.subject);
    formData.append('description', noteForm.description);

    try {
      // Simulate progress
      const interval = setInterval(() => {
        setUploadProgress(p => p < 85 ? p + 10 : p);
      }, 400);

      await adminApi.uploadNote(formData);
      clearInterval(interval);
      setUploadProgress(100);

      toast.success('नोट्स सफलतापूर्वक अपलोड हो गए!');
      setNoteForm({ title: '', subject: '', description: '' });
      setPdfFile(null);
      if (fileRef.current) fileRef.current.value = '';
      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'अपलोड विफल हुआ');
    } finally {
      setUploading(false);
      setTimeout(() => setUploadProgress(0), 1500);
    }
  };

  const handleDeleteNote = async (id: string, title: string) => {
    if (!confirm(`"${title}" को हटाना चाहते हैं?`)) return;
    setDeleting(id);
    try {
      await adminApi.deleteNote(id);
      setNotes(prev => prev.filter(n => n._id !== id));
      toast.success('नोट्स हटाए गए।');
    } catch {
      toast.error('हटाने में समस्या हुई।');
    } finally {
      setDeleting(null);
    }
  };

  const handleAddVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoForm.title || !videoForm.subject || !videoForm.youtubeId) {
      toast.error('सभी आवश्यक फ़ील्ड भरें।'); return;
    }
    setAddingVideo(true);
    try {
      await adminApi.addVideo(videoForm);
      toast.success('वीडियो सफलतापूर्वक जोड़ा गया!');
      setVideoForm({ title: '', subject: '', youtubeId: '', description: '' });
      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'वीडियो जोड़ने में समस्या');
    } finally {
      setAddingVideo(false);
    }
  };

  const handleDeleteVideo = async (id: string, title: string) => {
    if (!confirm(`"${title}" वीडियो हटाना चाहते हैं?`)) return;
    setDeleting(id);
    try {
      await adminApi.deleteVideo(id);
      setVideos(prev => prev.filter(v => v._id !== id));
      toast.success('वीडियो हटाया गया।');
    } catch {
      toast.error('हटाने में समस्या हुई।');
    } finally {
      setDeleting(null);
    }
  };

  // ─── LOGIN SCREEN ──────────────────────────────────────────────────────────
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-emerald-800 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <GraduationCap size={32} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800" style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}>
              एडमिन लॉगिन
            </h1>
            <p className="text-gray-500 text-sm mt-1" style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}>
              Self-Learn Academy प्रबंधन
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5" style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}>
                यूजरनेम
              </label>
              <input
                type="text"
                value={loginForm.username}
                onChange={e => setLoginForm({ ...loginForm, username: e.target.value })}
                placeholder="devesh"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none text-gray-800"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5" style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}>
                पासवर्ड
              </label>
              <input
                type="password"
                value={loginForm.password}
                onChange={e => setLoginForm({ ...loginForm, password: e.target.value })}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none text-gray-800"
              />
            </div>

            {loginError && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                <AlertCircle size={16} />
                <span style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-60"
              style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}
            >
              {loginLoading ? <Loader2 size={18} className="animate-spin" /> : <Lock size={18} />}
              {loginLoading ? 'लॉगिन हो रहा है...' : 'लॉगिन करें'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ─── ADMIN DASHBOARD ───────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Navbar */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-emerald-500 rounded-xl flex items-center justify-center">
            <GraduationCap size={20} className="text-white" />
          </div>
          <div>
            <span className="font-bold text-gray-800" style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}>
              Self-Learn Academy
            </span>
            <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
              Admin
            </span>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl font-medium text-sm transition-colors"
          style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}
        >
          <LogOut size={16} />
          लॉगआउट
        </button>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'कुल नोट्स', value: notes.length, icon: FileText, color: 'blue' },
            { label: 'कुल वीडियो', value: videos.length, icon: Youtube, color: 'red' },
            { label: 'कुल डाउनलोड', value: notes.reduce((s, n) => s + n.downloads, 0), icon: Upload, color: 'emerald' },
            { label: 'विषय', value: [...new Set(notes.map(n => n.subject))].length, icon: GraduationCap, color: 'purple' },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl p-5 shadow-card">
              <div className={`w-10 h-10 bg-${s.color}-100 rounded-xl flex items-center justify-center mb-3`}>
                <s.icon size={20} className={`text-${s.color}-600`} />
              </div>
              <div className="text-2xl font-bold text-gray-800">{s.value}</div>
              <div className="text-gray-500 text-xs mt-0.5" style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setTab('notes')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
              tab === 'notes' ? 'bg-blue-600 text-white shadow-sm' : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
            style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}
          >
            <FileText size={16} />
            नोट्स प्रबंधन
          </button>
          <button
            onClick={() => setTab('videos')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
              tab === 'videos' ? 'bg-red-600 text-white shadow-sm' : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
            style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}
          >
            <Youtube size={16} />
            वीडियो प्रबंधन
          </button>
          <button
            onClick={fetchData}
            className="ml-auto flex items-center gap-1.5 px-4 py-2.5 bg-white text-gray-600 hover:bg-gray-50 rounded-xl text-sm font-medium shadow-sm"
          >
            <RefreshCw size={14} />
          </button>
        </div>

        {/* ── NOTES TAB ── */}
        {tab === 'notes' && (
          <div className="grid lg:grid-cols-5 gap-6">
            {/* Upload Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-card p-6 sticky top-24">
                <h2 className="font-bold text-gray-800 mb-5 flex items-center gap-2" style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}>
                  <Upload size={18} className="text-blue-600" />
                  नया नोट अपलोड करें
                </h2>
                <form onSubmit={handleUploadNote} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5" style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}>
                      शीर्षक *
                    </label>
                    <input
                      value={noteForm.title}
                      onChange={e => setNoteForm({ ...noteForm, title: e.target.value })}
                      placeholder="जैसे: गणित अध्याय 5 - त्रिकोणमिति"
                      required
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none text-sm text-gray-800"
                      style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5" style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}>
                      विषय *
                    </label>
                    <select
                      value={noteForm.subject}
                      onChange={e => setNoteForm({ ...noteForm, subject: e.target.value })}
                      required
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none text-sm text-gray-800 bg-white"
                      style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}
                    >
                      <option value="">विषय चुनें</option>
                      {['गणित','विज्ञान','हिंदी','अंग्रेजी','इतिहास','भूगोल','रसायन','जीव विज्ञान','राजनीति','अन्य'].map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5" style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}>
                      विवरण (वैकल्पिक)
                    </label>
                    <textarea
                      value={noteForm.description}
                      onChange={e => setNoteForm({ ...noteForm, description: e.target.value })}
                      placeholder="इस नोट के बारे में संक्षिप्त जानकारी..."
                      rows={2}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none text-sm text-gray-800 resize-none"
                      style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5" style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}>
                      PDF फ़ाइल * (अधिकतम 20MB)
                    </label>
                    <div
                      className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-colors ${
                        pdfFile ? 'border-emerald-400 bg-emerald-50' : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                      }`}
                      onClick={() => fileRef.current?.click()}
                    >
                      {pdfFile ? (
                        <div className="flex items-center gap-3 justify-center">
                          <CheckCircle size={20} className="text-emerald-600" />
                          <div className="text-left">
                            <p className="text-sm font-medium text-gray-800 truncate max-w-[180px]">{pdfFile.name}</p>
                            <p className="text-xs text-gray-400">{(pdfFile.size / 1024 / 1024).toFixed(2)} MB</p>
                          </div>
                          <button type="button" onClick={e => { e.stopPropagation(); setPdfFile(null); if (fileRef.current) fileRef.current.value = ''; }}>
                            <X size={16} className="text-gray-400 hover:text-red-500" />
                          </button>
                        </div>
                      ) : (
                        <div>
                          <Upload size={28} className="mx-auto mb-2 text-gray-400" />
                          <p className="text-sm text-gray-500" style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}>
                            PDF चुनने के लिए क्लिक करें
                          </p>
                          <p className="text-xs text-gray-400 mt-1">केवल .pdf फ़ाइलें</p>
                        </div>
                      )}
                    </div>
                    <input
                      ref={fileRef}
                      type="file"
                      accept=".pdf,application/pdf"
                      className="hidden"
                      onChange={e => e.target.files?.[0] && setPdfFile(e.target.files[0])}
                    />
                  </div>

                  {/* Progress bar */}
                  {uploading && uploadProgress > 0 && (
                    <div>
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}>अपलोड हो रहा है...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={uploading}
                    className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-60"
                    style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}
                  >
                    {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                    {uploading ? 'अपलोड हो रहा है...' : 'अपलोड करें'}
                  </button>
                </form>
              </div>
            </div>

            {/* Notes List */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl shadow-card">
                <div className="p-5 border-b flex items-center justify-between">
                  <h2 className="font-bold text-gray-800 flex items-center gap-2" style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}>
                    <FileText size={18} className="text-blue-600" />
                    अपलोड किए गए नोट्स ({notes.length})
                  </h2>
                </div>

                {dataLoading ? (
                  <div className="flex justify-center py-12 gap-2">
                    <Loader2 size={24} className="animate-spin text-blue-600" />
                    <span className="text-gray-500 text-sm" style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}>लोड हो रहा है...</span>
                  </div>
                ) : notes.length === 0 ? (
                  <div className="text-center py-16">
                    <FileText size={50} className="mx-auto mb-3 text-gray-200" />
                    <p className="text-gray-400" style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}>
                      अभी तक कोई नोट अपलोड नहीं हुआ।
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-50">
                    {notes.map((note) => (
                      <div key={note._id} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors group">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                            <FileText size={18} className="text-blue-600" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-gray-800 text-sm truncate" style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}>
                              {note.title}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full" style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}>
                                {note.subject}
                              </span>
                              {note.fileSize && <span className="text-xs text-gray-400">{note.fileSize}</span>}
                              <span className="text-xs text-gray-400">📥 {note.downloads}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0 ml-3">
                          <a
                            href={note.downloadUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                            title="देखें"
                          >
                            <Eye size={16} />
                          </a>
                          <button
                            onClick={() => handleDeleteNote(note._id, note.title)}
                            disabled={deleting === note._id}
                            className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                            title="हटाएं"
                          >
                            {deleting === note._id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── VIDEOS TAB ── */}
        {tab === 'videos' && (
          <div className="grid lg:grid-cols-5 gap-6">
            {/* Add Video Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-card p-6 sticky top-24">
                <h2 className="font-bold text-gray-800 mb-5 flex items-center gap-2" style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}>
                  <Plus size={18} className="text-red-600" />
                  नया वीडियो जोड़ें
                </h2>
                <form onSubmit={handleAddVideo} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5" style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}>
                      शीर्षक *
                    </label>
                    <input
                      value={videoForm.title}
                      onChange={e => setVideoForm({ ...videoForm, title: e.target.value })}
                      placeholder="वीडियो का शीर्षक"
                      required
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-red-400 focus:ring-2 focus:ring-red-100 outline-none text-sm text-gray-800"
                      style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5" style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}>
                      विषय *
                    </label>
                    <select
                      value={videoForm.subject}
                      onChange={e => setVideoForm({ ...videoForm, subject: e.target.value })}
                      required
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-red-400 focus:ring-2 focus:ring-red-100 outline-none text-sm text-gray-800 bg-white"
                      style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}
                    >
                      <option value="">विषय चुनें</option>
                      {['गणित','विज्ञान','हिंदी','अंग्रेजी','इतिहास','भूगोल','रसायन','जीव विज्ञान','राजनीति','अन्य'].map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                      YouTube Video ID या URL *
                    </label>
                    <input
                      value={videoForm.youtubeId}
                      onChange={e => setVideoForm({ ...videoForm, youtubeId: e.target.value })}
                      placeholder="जैसे: dQw4w9WgXcQ या पूरा URL"
                      required
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-red-400 focus:ring-2 focus:ring-red-100 outline-none text-sm text-gray-800 font-mono"
                    />
                    <p className="text-xs text-gray-400 mt-1" style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}>
                      YouTube URL से Video ID अपने आप निकाली जाएगी
                    </p>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5" style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}>
                      विवरण (वैकल्पिक)
                    </label>
                    <textarea
                      value={videoForm.description}
                      onChange={e => setVideoForm({ ...videoForm, description: e.target.value })}
                      placeholder="वीडियो के बारे में जानकारी..."
                      rows={2}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-red-400 focus:ring-2 focus:ring-red-100 outline-none text-sm text-gray-800 resize-none"
                      style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={addingVideo}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold text-sm transition-colors disabled:opacity-60"
                    style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}
                  >
                    {addingVideo ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                    {addingVideo ? 'जोड़ा जा रहा है...' : 'वीडियो जोड़ें'}
                  </button>
                </form>
              </div>
            </div>

            {/* Video List */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl shadow-card">
                <div className="p-5 border-b">
                  <h2 className="font-bold text-gray-800 flex items-center gap-2" style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}>
                    <Youtube size={18} className="text-red-600" />
                    वीडियो सूची ({videos.length})
                  </h2>
                </div>

                {dataLoading ? (
                  <div className="flex justify-center py-12 gap-2">
                    <Loader2 size={24} className="animate-spin text-red-600" />
                  </div>
                ) : videos.length === 0 ? (
                  <div className="text-center py-16">
                    <Youtube size={50} className="mx-auto mb-3 text-gray-200" />
                    <p className="text-gray-400" style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}>
                      कोई वीडियो नहीं जोड़ा गया।
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-50">
                    {videos.map((video) => (
                      <div key={video._id} className="flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors">
                        <img
                          src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
                          alt={video.title}
                          className="w-20 h-14 object-cover rounded-xl shrink-0"
                          onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.png'; }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-800 text-sm truncate" style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}>
                            {video.title}
                          </p>
                          <span className="text-xs text-red-600 bg-red-50 px-2 py-0.5 rounded-full mt-0.5 inline-block" style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}>
                            {video.subject}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <a
                            href={`https://youtube.com/watch?v=${video.youtubeId}`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Eye size={15} />
                          </a>
                          <button
                            onClick={() => handleDeleteVideo(video._id, video.title)}
                            disabled={deleting === video._id}
                            className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                          >
                            {deleting === video._id ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
