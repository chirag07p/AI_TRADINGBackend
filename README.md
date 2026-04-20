# AllocateIQ - Advanced AI Trading Ecosystem

A modern, full-stack, enterprise-grade platform for intelligent trading allocation. AllocateIQ features a secure Express/MongoDB backend mapped to a deeply interactive and responsive React frontend. It unites retail investors, professional traders, and system administrators into one cohesive ecosystem powered by simulated markets and AI-driven logic.

## 🚀 Key Ecosystem Features

### 🖥️ 1. Customer Environment (Retail Investors)
- **Paper Trading Wallet**: A stunning virtual hub to manually execute `BUY` and `SELL` orders, instantly tracking profits/losses via dynamic balances.
- **Deposit & Draw Management**: Fund your paper trading account seamlessly by selecting simulated payment methods (Bank Transfer, Credit Card, Crypto Wallet, etc.) via modern glassmorphic UI modals.
- **AI Trading Advisor**: Chat directly with integrated OpenRouter LLM APIs (e.g., `nvidia/nemotron`) to receive live, context-aware market recommendations (Hold, Buy, Sell) backed by algorithmic reasoning.
- **Holdings & Net Worth Dashboard**: A consolidated, real-time snapshot tracking asset quantities, execution prices, and overall performance.

### 🧑‍💼 2. Trader Interface (Employees)
- **Live Market Dashboard**: Visualize real-time simulated price ticks and fluctuations across major equities/crypto (AAPL, TSLA, BTC).
- **Assigned Client Management**: A dedicated CRM layout to monitor clients dynamically matched to you by the system's neural logic based on risk-tolerance levels.
- **Dynamic Allocations & Reporting**: Adjust and assign trading "coins"/capital to clients, track personal success rates, and register private trading notes inside a robust client-detail modal.

### 🏛️ 3. Admin Control Panel (Administrators)
- **AI Assignment Engine**: An interactive command center to monitor live allocations connecting "High Risk" clients to "Expert" traders automatically. Rerun the logic engine manually with real-time progress indicators.
- **Comprehensive User Management**: A complete bird's-eye directory of all Registered Customers and Traders. Filter, sort, instantly upgrade roles, and override risk, success rates, or specialization parameters.
- **System Analytics**: Top-level macro view featuring interactive historical performance charts, current risk distributions, and trader leaderboard standings.

## 🔒 Tech Stack & Architecture

This project is deployed across a clean monorepo dividing the client footprint from the core backend logic:

- **Frontend (Client)**: React.js via Vite, unified state context logic (`AuthContext`, `AppDataContext`), modern Lucide icons, highly polished TailwindCSS interfaces (smooth transitions, pulse states, gradients).
- **Backend (Server)**: Node.js & Express RESTful API mapped against MongoDB schemas via Mongoose.
- **Security & Reliability**: `bcrypt` encryption, JWT token authorization bridging roles, `express-validator` security nets, and total wrapper logic using `express-async-handler`.

## 🛠️ Core API Endpoints

| Route Prefix | Primary Purpose |
|---|---|
| `/api/auth/*` | Secure login workflows, role validations, password resets, token minting |
| `/api/portfolio/*` | Transaction generation, virtual deposits, and withdraw handlers logging payment methods |
| `/api/trades/*` | Instant internal execution of `BUY`/`SELL` payloads and asset-value averaging |
| `/api/watchlist/*` | Persistent tracking for specialized user financial bookmarks and notes |
| `/api/ai/advice` | Intermediary gateway translating OpenRouter streams directly to the frontend clients |

---

## 🏃 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/en/) (v18+)
- npm or yarn
- Local MongoDB instance or Atlas connection string
- OpenRouter API Key (for external LLM advice)

### Phase 1: Backend Initialization (Server)
1. Navigate to the server folder:
   ```bash
   cd server
   ```
2. Install necessary dependencies:
   ```bash
   npm install
   ```
3. Set up the `.env` variables (use `.env.example` as a template):
   ```env
   PORT=5000
   NODE_ENV=development
   DB_URI=mongodb+srv://<auth>@cluster/allocateiq
   JWT_SECRET=super_secret_key_development
   OPENROUTER_API_KEY=your_openrouter_api_key
   ```
4. Boot the server:
   ```bash
   npm run dev
   ```

### Phase 2: Frontend Initialization (Client)
1. In a new console, navigate to the UI module:
   ```bash
   cd client
   ```
2. Install vital UI packages:
   ```bash
   npm install
   ```
3. Boot the Vite compiler:
   ```bash
   npm run dev
   ```
4. **Access the App**: Click the `http://localhost:5173` link generated in your terminal to begin! Try logging in as an `Admin`, `Employee`, or registering a new `Customer`.

## 🤝 Contribution Guidelines
1. Check out a descriptive branch: `git checkout -b feature/trading-modal`
2. Commit your functional changes: `git commit -m "feat: updated wallet modals"`
3. Push to upstream: `git push origin feature/trading-modal`
4. Formally trigger a pull request against main.

## 📄 License
This ecosystem is freely accessible under the MIT License framework.
