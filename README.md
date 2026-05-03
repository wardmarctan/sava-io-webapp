# sava-io-webapp (Frontend + Backend MVC)

Proyek ini sudah dipisah menjadi 2 aplikasi:

- `frontend/` (React + TypeScript + Vite) dengan pola MVC sederhana
- `backend/` (Express) dengan pola MVC

## Struktur

```
frontend/
  src/
    controllers/
    models/
    services/
    views/
backend/
  src/
    controllers/
    models/
    routes/
    views/
```

## Menjalankan proyek

Dari root proyek:

```bash
npm install
```

Jalankan frontend:

```bash
npm run dev:frontend
```

Jalankan backend:

```bash
npm run dev:backend
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3000/api/health`

## Ringkas MVC

### Frontend

- Model: `frontend/src/models/counterModel.ts`
- Controller: `frontend/src/controllers/useHomeController.ts`
- View: `frontend/src/views/HomeView.tsx`
- Service API: `frontend/src/services/healthService.ts`

### Backend

- Model: `backend/src/models/healthModel.js`
- Controller: `backend/src/controllers/healthController.js`
- View: `backend/src/views/healthView.js`
- Route: `backend/src/routes/healthRoutes.js`
