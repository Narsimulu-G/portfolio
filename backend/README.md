Portfolio Backend (Node.js + Express + MongoDB)

Scripts
- npm run dev: Start in watch mode
- npm start: Start in production mode

Setup
1) cd backend
2) Copy .env.example to .env and set MONGODB_URI
3) npm install
4) npm run dev

API
- GET /api/health → status
- GET /api/projects → list projects
- POST /api/contact { name, email, subject?, message } → save message
- GET /api/profile → basic profile info
- GET /api/skills → skills/core/tools/categories
- GET /api/certificates → certificate list

Models
- Project: title, description, image, tags[], demoUrl, githubUrl, icon, category
- Message: name, email, subject?, message

