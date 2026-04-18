# AllocateIQ - AI Trading Platform

A modern, high-performance platform for automated and AI-driven trading. This monorepo includes a secure backend API configured to facilitate algorithmic trading strategies using AI advisory endpoints.

## Project Structure

This project adopts a monolithic repository (monorepo) structure, with applications divided into the frontend `client` and the backend `server`.

- **/client** - The frontend web application (React/Next.js).
- **/server** - The backend application serving the REST API structure powered by Express.js and MongoDB.

## Backend Technical Architecture (Server)

The backend has been refined into a secure MVC pattern prioritizing data validation and unified generic error handling.
- **Express + Mongoose**: Manages routing and dynamic NoSQL data schemas.
- **Security & Validation**: JWT-based User Authentication, bcrypt-encrypted passwords, and `express-validator` payload body parsing.
- **OpenRouter AI Integration**: Connects logic streams directly into LLMs for live `Trade` advice insights.
- **Global Error Handling**: Leveraging `express-async-handler` to prevent untethered async crashing.

### API Endpoints
- `POST /api/auth/register` & `/login` - Manage secure user sessions.
- `GET /api/market/quote/:symbol` - Retrieve dynamically ingested ticker quote values.
- `GET /api/portfolio` - Securely query a user's paper trading balances and tracked assets.
- `POST /api/trades` - Evaluated transaction endpoint for `BUY/SELL` logic. Supports automated balance/asset deduction.
- `POST /api/ai/advice` - Submit trade queries via OpenRouter API (utilizing free-tier models like Gemini Flash) to derive strategies.

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/en/) (v18 or higher)
- npm or yarn
- MongoDB (local or Atlas)

### Backend Setup (Server)
1. Navigate to the server folder:
   ```bash
   cd server
   ```
2. Install the necessary packages:
   ```bash
   npm install
   ```
3. Create your local environment file:
   Copy `.env.example` to `.env` and fill out your local config:
   ```env
   PORT=5000
   NODE_ENV=development
   DB_URI=mongodb://localhost:27017/ai-trading-platform
   JWT_SECRET=your_jwt_secret
   OPENROUTER_API_KEY=your_openrouter_api_key
   ```
4. Start the backend development server:
   ```bash
   npm run dev
   ```
   *The server will run with nodemon listening for changes on the specified port.*

### Frontend Setup (Client)
1. Navigate to the client folder:
   ```bash
   cd client
   ```
2. Install the application dependencies:
   ```bash
   npm install
   ```
3. Run the development server (varies based on the framework):
   ```bash
   npm run dev
   ```

## Development and Contribution

1. Create a descriptive conceptual branch: `git checkout -b feature/your-feature-name`
2. Keep commits concise and meaningful: `git commit -m "feat: implement logic for feature"`
3. Push changes to origin: `git push origin feature/your-feature-name`

## License

This project is licensed under the MIT License. Feel free to use, modify, and distribute.
