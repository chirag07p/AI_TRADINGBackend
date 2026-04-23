# AllocateIQ - Advanced AI Trading Ecosystem

A modern, full-stack, enterprise-grade platform for intelligent trading allocation. AllocateIQ features a secure Express/MongoDB backend mapped to a deeply interactive and responsive React frontend. It unites retail investors, professional traders, and system administrators into one cohesive ecosystem powered by simulated markets and AI-driven logic.

## 🚀 Key Ecosystem Features

### 🖥️ 1. Customer Environment (Retail Investors)
- **AI Strategy Advisor**: Powered by **NVIDIA Nemotron-3**, receive context-aware market recommendations and entry strategies directly in your dashboard.
- **Paper Trading Wallet**: A virtual hub to manually execute `BUY` and `SELL` orders, instantly tracking profits/losses via dynamic balances.
- **Premium Profile & Feedback**: Manage your investment DNA (risk profile/specialization) and provide instant service feedback via a responsive star-rating system.

### 🧑‍💼 2. Trader Interface (Employees)
- **Market Intelligence**: Real-time simulated price ticks and fluctuations across major equities/crypto with integrated AI signals.
- **Performance Insights**: Dedicated tracking for success rates, platform rankings, and growth trajectory charts.
- **Execution History**: A comprehensive, searchable log of all trade orders executed across your assigned client base.

### 🏛️ 3. Admin Control Panel (Administrators)
- **System Health & Logs**: Real-time infrastructure monitoring with a live terminal-style console for Auth, DB, and AI engine events.
- **Security Audit Trail**: Immutable logging of all administrative actions, ensuring total oversight of system overrides and logic changes.
- **Platform Settings**: A control tower to adjust AI allocation intervals, minimum match scores, and global security configurations.
- **AI Assignment Engine**: Monitor and rerun the logic engine that connects clients to traders based on neural scoring.

## 🎨 Design & Navigation
The platform utilizes a **Premium Collapsible Sidebar** for a unified "App-First" experience.
- **Role-Based Navigation**: The sidebar automatically adapts to show tools specific to your role.
- **Unified Guest Experience**: Public links and Authentication (Sign In/Register) are integrated into the sidebar for a clean, consistent UI.
- **Modern Aesthetics**: Built with glassmorphism, smooth transitions, and high-density typography to feel like a professional trading terminal.

## 🏃 Getting Started (Unified Workflow)

### Prerequisites
- [Node.js](https://nodejs.org/en/) (v18+)
- MongoDB instance (Local or Atlas)
- OpenRouter API Key (Configured in `server/.env`)

### Installation & Launch
1. **Clone & Install**:
   ```bash
   # From the project root
   npm install
   ```
2. **Setup Environment**:
   Ensure `server/.env` contains your `DB_URI` and `OPENROUTER_API_KEY`.
3. **One-Command Start**:
   ```bash
   npm run dev
   ```
   This will concurrently launch the **Express Backend** (Port 5000) and the **Vite Frontend** (Port 5173).

## 🛠️ Core API Surface
| Route Prefix | Primary Purpose |
|---|---|
| `/api/auth/*` | Secure login, role validation, and JWT token management |
| `/api/ai/advice` | NVIDIA Nemotron-3 powered market analysis gateway |
| `/api/allocate` | Neural matching engine for customer-trader pairing |
| `/api/trades/*` | Execution of virtual buy/sell orders and history logging |

## 📄 License
This ecosystem is freely accessible under the MIT License framework.
