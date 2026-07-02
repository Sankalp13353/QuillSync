# QuillSync - Collaborative Knowledge & Documentation Platform (Frontend)

Welcome to the frontend repository for QuillSync. This project is built using a modern React development stack, featuring single-page routing, a dark-themed premium design system, and clean components.

---

## 🛠 Tech Stack

- **Framework**: React.js (via Vite)
- **Styling**: Tailwind CSS (v4 with `@tailwindcss/vite` integration)
- **Routing**: React Router DOM (v7)
- **HTTP Client**: Axios (ready for backend integration)
- **Icons**: React Icons (lucide/feather set)

---

## 🚀 Getting Started

Follow these steps to run the project locally on your device:

### 1. Install Dependencies
Navigate to the root directory of the project in your terminal and run:
```bash
npm install
```

### 2. Start the Development Server
Run the local dev server with hot-reloading:
```bash
npm run dev
```
Once started, open your web browser and navigate to the address shown in your terminal (usually **`http://localhost:5173/`**).

### 3. Build for Production
To generate optimized production bundle assets (HTML, CSS, and JS), run:
```bash
npm run build
```

### 4. Preview the Production Build
To spin up a local server to test the generated production files, run:
```bash
npm run preview
```

---

## 📁 Directory Structure

```
QuillSync/
├── public/
├── src/
│   ├── assets/        # Media and static graphic assets
│   ├── pages/         # Page layout components
│   │   ├── LandingPage.jsx   # Landing page with dark glassmorphic header & previews
│   │   ├── LoginPage.jsx     # Split layout login screen with validation
│   │   └── RegisterPage.jsx  # Split layout user signup screen with checklist
│   ├── App.css
│   ├── App.jsx        # Routing configuration
│   ├── index.css      # Custom Tailwind styling & global directives
│   └── main.jsx       # React application entry point
├── package.json       # Project dependencies & run scripts
└── vite.config.js     # Vite bundler & Tailwind configuration
```

---

## 🌐 Routes Available

- **Landing Page**: `/`
- **Login Page**: `/login`
- **Register Page**: `/register`
