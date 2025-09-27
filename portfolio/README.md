# Portfolio

A modern, responsive portfolio website built with React and Vite, featuring a clean design and admin dashboard for content management.

## Features

- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Admin Dashboard**: Full CRUD operations for managing portfolio content
- **Dynamic Content**: Skills, projects, certificates, and contact information
- **Modern UI**: Built with React 19 and Framer Motion animations
- **Backend Integration**: Connected to Node.js/Express backend API

## Tech Stack

### Frontend
- React 19
- Vite
- Tailwind CSS
- Framer Motion
- React Context API

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Narsimulu-G/portfolio.git
cd portfolio
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Update environment variables in `.env`:
```
VITE_API_BASE=https://your-backend-url.com
```

5. Start the development server:
```bash
npm run dev
```

## Deployment

### Vercel (Frontend)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Render (Backend)
1. Connect your backend repository to Render
2. Set environment variables
3. Deploy automatically on push to main branch

## Project Structure

```
portfolio/
├── src/
│   ├── components/          # React components
│   ├── contexts/           # React contexts
│   ├── lib/               # API utilities
│   └── pages/             # Page components
├── public/                # Static assets
├── dist/                 # Build output
└── vercel.json          # Vercel configuration
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Contact

Narsimulu G - [GitHub](https://github.com/Narsimulu-G)