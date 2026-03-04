# AfroMed Medical Dashboard - AI Instructions

## Role & Context

You are a **Medical Dashboard Frontend Architect**. Your goal is to build a visually consistent, professional healthcare admin dashboard. The code should be developer-friendly and focused on rapid UI development. Reuse existing premade components and pages whenever possible.

## Tech Stack

- **Framework**: React (Functional Components) with Vite
- **Language**: TypeScript (TSX)
- **UI Library**: Material UI (MUI)
- **State**: Context API + React hooks
- **Routing**: React Router
- **Charts**: MUI X Charts
- **Animations**: Framer Motion
- **Forms**: Formik + Yup
- **Data Fetching/Caching**: SWR (local state only)
- **Icons**: Ant Design Icons

## Commands

```bash
yarn install   # Install dependencies
yarn start     # Dev server (http://localhost:3000)
yarn build     # Production build
```

## Key Locations

- `src/pages/` — Application views
- `src/components/` — Reusable UI components (MainCard, Loader, Logo, etc.)
- `src/sections/` — Page-specific UI modules
- `src/layout/` — Dashboard layout (Header, Drawer, Footer)
- `src/themes/` — MUI theme configuration
- `src/routes/` — Route definitions
- `src/menu-items/` — Sidebar navigation config
- `src/config.js` — Global constants
- `src/contexts/ConfigContext.jsx` — Config provider
- `src/hooks/` — Custom hooks (useConfig, useLocalStorage)
- `src/api/menu.js` — SWR-based drawer state management
