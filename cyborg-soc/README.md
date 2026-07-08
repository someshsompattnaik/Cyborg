# Cyborg — SOC Threat Intelligence Platform

**[![Preview](https://img.shields.io/badge/Cybersecurity-Dark%20Mode-blue?logo=hackthebox)](https://cyborg-soc.vercel.app)**

A dark-themed Security Operations Center (SOC) threat intelligence platform for cybersecurity teams. Cyborg provides Threat Intelligence, Indicator of Compromise (IOC) management, IOC lookups, and IP reputation scoring — all in a cyberpunk-inspired dark interface.

---

## Demo

https://cyborg-soc.vercel.app

---

## Features

| Feature | Description |
|---------|-------------|
| **Command Center** | Dashboard view with KPIs, severity charts, recent activity |
| **Threat Intelligence** | Track adversary campaigns with MITRE ATT&CK tactics, severity scoring, confidence levels |
| **Indicators Library** | Manage IOCs (IP, domain, URL, hash, email, filename) with tags and lifecycle status |
| **IOC Lookup** | Multi-source enrichment: auto-detect type, normalize defanged input, correlate indicators/threats |
| **IP Reputation** | Score source addresses with abuse volume, ASN/ISP, country, and risk categories |
| **Lookup History** | Audit trail of analyst queries with risk outcomes |
| **Seed Data** | Realistic SOC datasets pre-loaded for immediate use |

---

## Requirements

| Requirement | Minimum |
|-------------|---------|
| Node.js | 18+ |
| PostgreSQL | 14+ |
| npm / yarn / pnpm | any |

---

## Quick Start (Local Development)

### 1. Clone & Install

```bash
git clone https://github.com/yourusername/cyborg-soc.git
cd cyborg-soc
npm install
```

### 2. Environment Setup

Create `.env.local` at project root:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/cyborg"
```

### 3. Initialize Database

```bash
# Push schema (or use migrations)
npx drizzle-kit push

# Optional: seed with demo data
curl -X POST http://localhost:3000/api/seed
```

### 4. Run Development Server

```bash
npm run dev
# Open http://localhost:3000
```

---

## Production Build

```bash
npm run build
npm start
```

Or use Vercel, Netlify, or your preferred Node host.

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `NEXT_PUBLIC_*` | ❌ | Prefixed vars are exposed to browser |

---

## API Reference

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/stats` | GET | Dashboard metrics summary |
| `/api/threats` | GET, POST | List / create threats |
| `/api/threats/:id` | PATCH, DELETE | Update / delete specific threat |
| `/api/indicators` | GET, POST | List / create indicators |
| `/api/indicators/:id` | PATCH, DELETE | Update / delete indicator |
| `/api/ip-reputation` | GET, POST | List / upsert IP reputation |
| `/api/lookup?q=...` | GET | Enrich an observable |
| `/api/lookup?history=1` | GET | Recent lookup history |
| `/api/seed` | POST | Seed database with demo data |
| `/api/health` | GET | Health check |

### Example: IOC Lookup

```bash
curl "http://localhost:3000/api/lookup?q=185.220.101.45"
```

---

## Data Model

```
┌─────────────┐     ┌─────────────┐
│  threats    │────│  indicators │
└─────────────┘     └─────────────┘
      │
      ▼
   threat_id (FK, optional)

┌──────────────┐     ┌─────────────┐
│ lookupLogs   │─────│             │
└──────────────┘     └─────────────┘

┌──────────────────┐
│  ipReputations   │
└──────────────────┘
```

---

## Operator Manual

Access the full manual at **/manual** in the app — includes:

- Platform overview & navigation
- Threat Intelligence workflows
- IOC management best practices
- IOC Lookup guide
- IP Reputation scoring model
- SOC playbooks (Phishing, C2, Ransomware)
- API reference
- Troubleshooting

---

## Project Structure

```
src/
├─ app/
│  ├─ api/           # REST endpoints
│  │  ├─ threats/
│  │  ├─ indicators/
│  │  ├─ ip-reputation/
│  │  ├─ lookup/
│  │  ├─ stats/
│  │  └─ health/
│  ├─ threats/        # Threat list page
│  ├─ indicators/     # Indicators page
│  ├─ lookup/         # IOC lookup page
│  ├─ ip-reputation/ # IP reputation page
│  ├─ manual/         # Operator manual page
│  ├─ page.tsx        # Command Center
│  ├─ layout.tsx      # Root layout + sidebar
│  └─ globals.css     # Tailwind + dark theme
├─ db/
│  ├─ schema.ts       # Drizzle schema
│  └─ index.ts        # DB connection
├─ lib/
│  ├─ types.ts        # Type definitions
│  ├─ utils.ts        # Helper functions
│  └─ seed.ts         # Seed logic
└─ components/
   └─ ui.tsx          # UI components
```

---

## Development Scripts

```jsonc
{
  "dev": "next dev",       // Development server with HMR
  "build": "next build",   // Production build
  "start": "next start",   // Start production server
  "typecheck": "tsc --noEmit", // Type checking
  "lint": "eslint .",      // Linting
}
```

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router) |
| Database | PostgreSQL |
| ORM | Drizzle ORM |
| Styling | TailwindCSS 4 |
| CSS | PostCSS |
| Type Safety | TypeScript |
| Auth (future) | NextAuth.js |

---

## Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit changes: `git commit -m "feat: my feature"`
4. Push: `git push origin feature/my-feature`
5. Open a Pull Request

---

## License

MIT — see [LICENSE](LICENSE) for details.

---

## Acknowledgments

- Dark theme inspiration from [HackTheBox](https://www.hackthebox.com) and [TryHackMe](https://tryhackme.com)
- Icons from Unicode — ⚑ 🛡️ 🔍 🕵️

---

## Stay Connected

Report bugs, request features, or discuss SOC operations at the [Issues](https://github.com/yourusername/cyborg-soc/issues) page.

**Happy hunting!** 🕵️‍♂️