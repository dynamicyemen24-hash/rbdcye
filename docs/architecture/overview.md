# NexoraOS Architecture

## Overview

NexoraOS is a distributed offline-first system for humanitarian operations. It consists of three applications sharing a central PostgreSQL database.

```
                    ┌──────────────────────────┐
                    │      Central PostgreSQL   │
                    │     (Neon Serverless)     │
                    │                           │
                    │  ┌─────────────────────┐  │
                    │  │ organizations       │  │
                    │  │ users               │  │
                    │  │ donations           │  │
                    │  │ projects            │  │
                    │  │ beneficiaries       │  │
                    │  │ transactions        │  │
                    │  │ sync_queue          │  │
                    │  │ audit_logs          │  │
                    │  └─────────────────────┘  │
                    └────────────┬──────────────┘
                                 │
                    ┌────────────┴──────────────┐
                    │      NexoraOS API         │
                    │    (Express + JWT Auth)    │
                    │                            │
                    │  /api/auth/*               │
                    │  /api/v2/finance/*         │
                    │  /api/v2/projects/*        │
                    │  /api/nexora/sync/*        │
                    │  /api/nexora/tasks/*       │
                    └────────────┬──────────────┘
                                 │
           ┌─────────────────────┼─────────────────────┐
           │                     │                     │
           ▼                     ▼                     ▼
  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
  │    NexoraOS     │  │   NexWebSite    │  │  NexOSMobile    │
  │  (Web/Desktop)  │  │  (Public Site)  │  │  (Mobile App)   │
  │                  │  │                  │  │                  │
  │  React 19       │  │  React 19       │  │  React Native   │
  │  Vite 6         │  │  Vite 6         │  │  Expo 54        │
  │  Recharts       │  │  Tailwind CSS   │  │  NativeWind     │
  │  Leaflet        │  │  Radix UI       │  │  Expo Router    │
  │                  │  │                  │  │                  │
  │  Direct API     │  │  Serverless     │  │  tRPC +         │
  │  calls          │  │  Functions      │  │  REST API       │
  └─────────────────┘  └─────────────────┘  └─────────────────┘
                                │
                         ┌──────┴──────┐
                         │             │
                         ▼             ▼
                   ┌──────────┐  ┌──────────┐
                   │  SQLite  │  │  SQLite  │
                   │ (Offline)│  │ (Offline)│
                   └──────────┘  └──────────┘
```

## Components

### 1. Central PostgreSQL (Neon)
- **Purpose**: Single source of truth
- **Tables**: 39+ tables covering all business domains
- **Views**: 97+ analytical views
- **Extensions**: UUID generation, full-text search

### 2. NexoraOS API
- **Framework**: Express.js
- **Authentication**: JWT with refresh tokens
- **Authorization**: RBAC with organization isolation
- **Rate Limiting**: Sliding window per IP
- **Audit**: Every write operation logged

### 3. NexoraOS Web/Desktop
- **Framework**: React 19 + Vite 6
- **UI**: Tailwind CSS + Recharts
- **Maps**: Leaflet + React-Leaflet
- **Export**: jsPDF + html2canvas + xlsx
- **AI**: Google Gemini integration

### 4. NexWebSite
- **Framework**: React 19 + Vite 6
- **Deployment**: Cloudflare Pages
- **CMS**: Sanity.io
- **Payments**: Stripe
- **PWA**: Service worker + offline support

### 5. NexOSMobile
- **Framework**: React Native + Expo 54
- **Navigation**: Expo Router
- **Styling**: NativeWind
- **API**: tRPC + REST
- **Offline**: SQLite via expo-sqlite

## Data Flow

### Online Flow
```
User Action → Frontend → API Request → JWT Auth → 
Tenant Isolation → Business Logic → Database → 
Audit Log → Response → Frontend Update
```

### Offline Flow
```
User Action → Frontend → Local SQLite → Outbox Queue → 
Connection Check → If Online → Sync Push → 
Server Processing → Conflict Detection → 
Resolution → Sync Pull → Local Apply → UI Update
```

### Sync Flow
```
1. Client: Collect changes in outbox
2. Client: POST /api/nexora/sync/push
3. Server: Validate permissions
4. Server: Check version conflicts
5. Server: Apply or flag for review
6. Server: Return results + cursor
7. Client: POST /api/nexora/sync/pull
8. Client: Apply server changes
9. Client: POST /api/nexora/sync/ack
```

## Security Model

### Authentication
- JWT access tokens (8h expiry)
- Refresh token rotation (7d expiry)
- Device fingerprinting
- Brute-force protection

### Authorization
- Role-based access control
- Organization-level isolation
- Permission-based resource access
- Server-side validation always

### Data Protection
- TLS in transit
- Encryption at rest (planned)
- Sensitive field stripping
- Audit trail for all changes

## Deployment

### Production
- **Frontend**: Vercel (NexoraOS), Cloudflare Pages (NexWebSite)
- **Backend**: Render (NexoraOS API)
- **Database**: Neon PostgreSQL
- **CDN**: Vercel Edge Network

### Development
- **Frontend**: localhost:3001 (NexoraOS), localhost:5173 (NexWebSite)
- **Backend**: localhost:3000
- **Database**: Neon staging branch

## Related Documentation
- [Sync Protocol](./sync-protocol.md)
- [Security Model](./security.md)
- [Database Schema](./database.md)
- [API Reference](./api.md)
