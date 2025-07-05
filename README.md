
# Policy Analyser UI

A modern React-based frontend for analyzing government policy documents. Built with Vite, Tailwind CSS, Ant Design, Zustand, and other powerful tools to provide an intuitive interface for document upload, summarization, evaluation, and reporting.

---

## 🚀 Features

- 📄 Upload and analyze policy documents
- ✅ Document validation and evaluation flow
- 💬 Summarization and prompt-based Q&A
- 📊 Score analysis with visual charts (Recharts)
- 📥 Downloadable report (PDF)
- 💡 Responsive, interactive UI with Ant Design + Tailwind CSS
- 🔧 Zustand for global state management
- ⚙️ Local mock API server using Express (in `/mock-server`)

---

## 🧪 Tech Stack

| Category         | Tools / Libraries                            |
|------------------|----------------------------------------------|
| Frontend         | React 19, React Router, Vite                 |
| Styling          | Tailwind CSS, Ant Design                     |
| State Management | Zustand                                      |
| Charts           | Recharts                                     |
| PDF Export       | jsPDF, html2canvas                           |
| Form Handling    | react-hook-form                              |
| Icons            | lucide-react, @ant-design/icons              |
| Mock Server      | Express.js in `/mock-server/document-mock-server.js` |
| Dev Tools        | TypeScript, ESLint, Vite                     |

---

## 📁 Project Structure
```
policy-analyser-ui/
│
├── src/                      # React application source code
│   ├── components/           # Reusable UI components
│   ├── pages/                # Route-based pages
│   ├── stores/               # Zustand state management
│   ├── services/             # API service modules
│   ├── constants/            # Step keys and status enums
│   └── ...                   # Other support files
│
├── mock-server/
│   └── document-mock-server.js   # Express-based mock server
│
├── public/                  # Static assets
├── tailwind.config.js       # Tailwind CSS configuration
├── tsconfig.json            # TypeScript config
└── vite.config.ts           # Vite configuration

```
---

## 🛠️ Getting Started

### 1. Clone the Repository
```
git clone https://github.com/civis-vote/draft-analyzer-fe
cd draft-analyzer-fe
```
### 2. Install Dependencies
```
npm install
```
or
```
yarn install
```
### 3. Start the Dev Server
```
npm run dev
```
# Vite will start at http://localhost:5173

---

## 🧪 Mock API Server

### Start Express Mock Server (for development/testing)
```
cd mock-server
npm install
node document-mock-server.js
```

# Server runs at http://localhost:9000

Make sure your `.env` or API base URL points to `http://localhost:9000` when testing with the mock server.

---

## 🧹 Available Scripts
```
npm run dev        # Start Vite dev server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint

```
---

## 📦 Environment Variables

`.env` file in the root with:
```
VITE_BASE_URL="http://localhost:9000" #local mock express server
#VITE_BASE_URL="http://localhost:8000/api" #Local python backend sevice
```
---

