# Self-Learn Academy 📚

> भारत का डिजिटल शिक्षा प्लेटफॉर्म — हिंदी में सीखें, आगे बढ़ें।

## ⚡ Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Cloudinary account (free tier works)

### 1 — Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# .env में अपने credentials भरें
npm run dev          # → http://localhost:5000
```

### 2 — Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env.local
# NEXT_PUBLIC_API_URL=http://localhost:5000/api
npm run dev          # → http://localhost:3000
```

### Docker Setup
```bash
cp backend/.env.example backend/.env
# .env में Cloudinary credentials भरें
docker-compose up --build
```

## 🔑 Environment Variables

### Backend `.env`
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/selflearn
JWT_SECRET=your_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
ADMIN_USERNAME=devesh
ADMIN_PASSWORD=devesh123
FRONTEND_URL=http://localhost:3000
```

### Frontend `.env.local`
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## 🔐 Admin Access
- URL: `http://localhost:3000/admin`
- Username: `devesh`
- Password: `devesh123`

## 📁 Project Structure
```
self-learn-academy/
├── backend/
│   ├── src/
│   │   ├── config/cloudinary.js
│   │   ├── middleware/auth.js
│   │   ├── models/Note.js, Video.js
│   │   ├── routes/admin.js, public.js
│   │   └── index.js
│   └── package.json
├── frontend/
│   ├── app/
│   │   ├── page.tsx          (होम)
│   │   ├── notes/page.tsx    (नोट्स)
│   │   └── admin/page.tsx    (एडमिन)
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── HeroSection.tsx
│   │   ├── FeaturesSection.tsx
│   │   ├── VideosSection.tsx
│   │   ├── NotesSectionPreview.tsx
│   │   └── Footer.tsx
│   └── lib/api.ts
└── docker-compose.yml
```

## 📡 API Routes

### Public
| Method | Route | Description |
|---|---|---|
| GET | `/api/notes` | सभी नोट्स |
| GET | `/api/notes/:id` | एक नोट |
| POST | `/api/notes/:id/download` | डाउनलोड काउंट |
| GET | `/api/subjects` | सभी विषय |
| GET | `/api/videos` | सभी वीडियो |

### Admin (JWT required)
| Method | Route | Description |
|---|---|---|
| POST | `/api/admin/login` | लॉगिन |
| POST | `/api/admin/notes/upload` | PDF अपलोड |
| DELETE | `/api/admin/notes/:id` | नोट हटाएं |
| POST | `/api/admin/videos` | वीडियो जोड़ें |
| DELETE | `/api/admin/videos/:id` | वीडियो हटाएं |

## 🚀 Deploy
- Frontend → Vercel
- Backend → Railway / Render
- DB → MongoDB Atlas
- Files → Cloudinary (auto)
