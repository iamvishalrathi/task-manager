# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

# Task Manager - Production-Ready React TypeScript Application

A comprehensive, production-ready task management application built with React, TypeScript, and modern web technologies. Features a beautiful UI with dark mode support, advanced animations, and enterprise-level functionality.

## 🚀 Live Demo

[Deploy on Vercel](https://vercel.com) | [Deploy on Netlify](https://netlify.com)

## ✨ Features

### 🎨 **Modern UI/UX**
- **Dark/Light Mode**: Seamless theme switching with system preference detection
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Smooth Animations**: Framer Motion animations throughout the app
- **Accessible Components**: Built with Headless UI for full accessibility
- **Design System**: Consistent color palette and typography

### 🔐 **Authentication**
- Secure login system with form validation
- Demo credentials for easy testing
- Protected routes with automatic redirects
- Session persistence with Redux Toolkit

### 📋 **Task Management**
- **CRUD Operations**: Create, read, update, and delete tasks
- **Smart Filtering**: Filter by status, priority, and custom search
- **Multiple Views**: Grid and list view options
- **Status Management**: Todo, In Progress, and Completed states
- **Priority Levels**: Low, Medium, High, and Critical
- **Due Date Tracking**: Visual indicators for overdue tasks

### 📊 **Analytics & Export**
- **Dashboard Statistics**: Visual task overview with progress charts
- **Export Functionality**: Download tasks as CSV or JSON
- **Search & Filter**: Advanced filtering with real-time results
- **Loading States**: Skeleton screens and loading indicators

### 🛡️ **Production Features**
- **Error Boundaries**: Graceful error handling with fallback UI
- **TypeScript**: Full type safety and IntelliSense support
- **Performance Optimized**: Lazy loading and code splitting
- **Docker Support**: Containerized deployment ready
- **MSW Integration**: Mock API for development and testing

## 🛠️ Technology Stack

### **Frontend**
- **React 18** - Latest React with Hooks and Concurrent Features
- **TypeScript 5** - Type-safe development
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework

### **State Management**
- **Redux Toolkit** - Modern Redux with less boilerplate
- **Redux Persist** - State persistence across sessions

### **UI/UX Libraries**
- **Headless UI** - Accessible, unstyled UI components
- **Heroicons** - Beautiful hand-crafted SVG icons
- **Framer Motion** - Production-ready motion library
- **React Hot Toast** - Smooth toast notifications

### **Development Tools**
- **Mock Service Worker (MSW)** - API mocking for development
- **ESLint** - Code linting and quality checks
- **PostCSS** - CSS processing and optimization

### **Utilities**
- **date-fns** - Modern JavaScript date utility library
- **clsx** - Utility for constructing className strings

## 🏃‍♂️ Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd task-manager
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   ```
   http://localhost:5173
   ```

### Demo Credentials
- **Username**: `demo@example.com`
- **Password**: `password`

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # Base UI components (Button, Input, etc.)
│   ├── ErrorBoundary.tsx
│   ├── Login.tsx
│   ├── ProtectedRoute.tsx
│   ├── TaskCard.tsx
│   └── TaskForm.tsx
├── contexts/            # React contexts
│   └── ThemeContext.tsx
├── hooks/               # Custom React hooks
│   └── redux.ts
├── mocks/               # MSW mock handlers
│   ├── browser.ts
│   └── handlers.ts
├── pages/               # Page components
│   └── Dashboard.tsx
├── services/            # API services
│   └── api.ts
├── store/               # Redux store configuration
│   ├── authSlice.ts
│   ├── taskSlice.ts
│   ├── themeSlice.ts
│   └── index.ts
├── types/               # TypeScript type definitions
│   └── index.ts
├── utils/               # Utility functions
│   ├── date.ts
│   ├── export.ts
│   ├── text.ts
│   └── cn.ts
└── App.tsx              # Main application component
```

## 🎯 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint

# Docker
docker build -t task-manager .
docker run -p 3000:80 task-manager
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
# API Configuration
VITE_API_URL=http://localhost:3001/api

# App Configuration
VITE_APP_NAME=Task Manager
VITE_APP_VERSION=2.0.0
```

### Tailwind Configuration
The project uses a custom Tailwind configuration with:
- Custom color palette for consistent theming
- Extended animations and transitions
- Custom shadows and effects
- Dark mode support

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Configure build settings:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Deploy automatically on push

### Netlify
1. Connect your repository to Netlify
2. Configure build settings:
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
3. Deploy automatically on push

### Docker
```bash
# Build image
docker build -t task-manager .

# Run container
docker run -p 3000:80 task-manager
```

## 🎨 Design System

### Colors
- **Primary**: Blue color palette for main actions
- **Surface**: Gray color palette for backgrounds
- **Success**: Green for positive actions
- **Warning**: Yellow for cautionary states
- **Error**: Red for error states

### Typography
- **Headings**: Inter font family with proper weight hierarchy
- **Body**: Optimized for readability with proper line heights
- **Code**: Monospace font for technical content

### Components
All components follow consistent design patterns:
- Proper focus states for accessibility
- Hover and active states for better UX
- Loading and disabled states
- Dark mode support

## 🧪 Testing

The application includes:
- **Type Safety**: Full TypeScript coverage
- **Mock API**: MSW for realistic data simulation
- **Error Boundaries**: Production-ready error handling
- **Form Validation**: Client-side validation with error messages

## 📈 Performance

- **Bundle Size**: Optimized with Vite and tree-shaking
- **Loading States**: Skeleton screens for better perceived performance
- **Code Splitting**: Lazy loading of components
- **Asset Optimization**: Optimized images and icons

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)

## 🙏 Acknowledgments

- [React](https://reactjs.org/) for the amazing library
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Headless UI](https://headlessui.dev/) for accessible components
- [Heroicons](https://heroicons.com/) for beautiful icons
- [Framer Motion](https://www.framer.com/motion/) for smooth animations

---

## 📸 Screenshots

### Login Screen
![Login Screen](screenshots/login.png)

### Dashboard - Light Mode
![Dashboard Light](screenshots/dashboard-light.png)

### Dashboard - Dark Mode
![Dashboard Dark](screenshots/dashboard-dark.png)

### Task Management
![Task Management](screenshots/task-management.png)

---

**Built with ❤️ using React, TypeScript, and modern web technologies**

![Task Manager Demo](https://via.placeholder.com/800x400/3B82F6/FFFFFF?text=Task+Manager+Dashboard)

## 🚀 Features

### Core Functionality
- **User Authentication**: Secure login with mocked JWT authentication
- **Task Management**: Complete CRUD operations for tasks
- **Real-time Updates**: Immediate UI updates with optimistic updates
- **Status Tracking**: Track tasks through todo, in-progress, and done states
- **Search & Filter**: Find tasks quickly with search and status filters
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile

### Technical Features
- **State Management**: Redux Toolkit for predictable state management
- **Mocked API**: Mock Service Worker (MSW) for realistic API simulation
- **TypeScript**: Full type safety throughout the application
- **Modern UI**: Tailwind CSS for responsive, clean design
- **Authentication Flow**: Protected routes and session management

## 🛠️ Technologies Used

| Category | Technology |
|----------|------------|
| Framework | React 18 with TypeScript |
| Build Tool | Vite |
| State Management | Redux Toolkit |
| Styling | Tailwind CSS |
| Mock API | Mock Service Worker (MSW) |
| Icons | Lucide React |
| HTTP Client | Fetch API |
| Development | ESLint, PostCSS |

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── TaskCard.tsx    # Individual task display
│   ├── TaskForm.tsx    # Task creation/editing form
│   └── ProtectedRoute.tsx # Authentication guard
├── pages/              # Main application pages
│   ├── Login.tsx       # Authentication page
│   └── Dashboard.tsx   # Main task management interface
├── store/              # Redux store and slices
│   ├── index.ts        # Store configuration
│   ├── authSlice.ts    # Authentication state
│   └── taskSlice.ts    # Task management state
├── hooks/              # Custom React hooks
│   └── redux.ts        # Typed Redux hooks
├── services/           # API service layer
│   └── api.ts          # HTTP API functions
├── mocks/              # MSW configuration
│   ├── handlers.ts     # API endpoint handlers
│   └── browser.ts      # MSW setup
└── types/              # TypeScript type definitions
```

## 🚀 Getting Started

### Prerequisites
- Node.js 20.19+ or 22.12+ (or use Node.js 20.17+ with warnings)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd task-manager
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Default Credentials
- **Username**: `test`
- **Password**: `test123`

## 🔧 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## 🎭 How the Mocking Works

This application uses **Mock Service Worker (MSW)** to simulate a real backend API without requiring an actual server. Here's how it works:

### MSW Setup
1. **Service Worker**: MSW installs a service worker that intercepts network requests
2. **Request Handlers**: Custom handlers define how each API endpoint should respond
3. **Data Persistence**: Mock data is stored in memory and persists during the session
4. **Realistic Behavior**: Includes proper HTTP status codes, delays, and error handling

### Mock API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/login` | User authentication |
| `GET` | `/api/tasks` | Fetch all tasks |
| `POST` | `/api/tasks` | Create new task |
| `PUT` | `/api/tasks/:id` | Update existing task |
| `DELETE` | `/api/tasks/:id` | Delete task |

### Data Persistence
- **Session Storage**: Authentication tokens persist in localStorage
- **Memory Storage**: Task data persists in memory during the session
- **Automatic Cleanup**: Data resets on page refresh (simulating server restart)

## 📱 User Interface

### Login Page
- Clean, centered login form
- Input validation and error handling
- Loading states for better UX
- Helpful credential hints

### Dashboard
- **Header**: Welcome message and logout functionality
- **Stats Cards**: Overview of task counts by status
- **Search & Filter**: Real-time search and status filtering
- **Task Grid**: Responsive grid layout for task cards
- **Task Actions**: Edit, delete, and status change functionality

### Task Management
- **Create Tasks**: Modal form for new task creation
- **Edit Tasks**: In-place editing with pre-filled forms
- **Status Updates**: Dropdown for quick status changes
- **Delete Confirmation**: Safe task deletion

## 🎨 Design System

### Color Palette
- **Primary**: Blue (#3B82F6)
- **Success**: Green (#10B981)
- **Warning**: Yellow (#F59E0B)
- **Error**: Red (#EF4444)
- **Neutral**: Gray scale

### Typography
- **Headings**: Font weights from 600-800
- **Body**: Regular (400) and medium (500)
- **Small text**: 12px-14px for metadata

### Components
- **Cards**: Rounded corners with subtle shadows
- **Buttons**: Consistent padding and hover states
- **Forms**: Outlined inputs with focus states
- **Modals**: Centered overlays with backdrop

## 🔒 Authentication Flow

1. **Initial Load**: Check for existing token in localStorage
2. **Login Process**: Validate credentials against mock user
3. **Token Storage**: Store JWT-like token in localStorage
4. **Route Protection**: Redirect unauthenticated users to login
5. **Logout**: Clear token and redirect to login

## 📊 State Management

### Auth State
```typescript
interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}
```

### Task State
```typescript
interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}
```

## 🧪 Testing Considerations

While this demo focuses on core functionality, here are testing approaches to consider:

- **Unit Tests**: Test individual components and utilities
- **Integration Tests**: Test component interactions
- **MSW Tests**: Test API interactions with the same mock handlers
- **E2E Tests**: Test complete user workflows

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
1. Connect your GitHub repository to Vercel
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Deploy automatically on push to main branch

### Deploy to Netlify
1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Deploy automatically on push to main branch

## 🔮 Future Enhancements

### Bonus Features to Implement
- [ ] **Dark Mode**: Toggle between light and dark themes
- [ ] **Task Categories**: Organize tasks by categories/projects
- [ ] **Due Dates**: Add deadline tracking and notifications
- [ ] **Priority Levels**: High, medium, low priority sorting
- [ ] **Task Comments**: Add notes and comments to tasks
- [ ] **Data Export**: Export tasks to CSV/JSON
- [ ] **Drag & Drop**: Reorder tasks with drag and drop
- [ ] **Real-time Sync**: WebSocket integration for multi-user support

### Technical Improvements
- [ ] **Unit Tests**: Comprehensive test suite
- [ ] **Docker**: Containerize the application
- [ ] **PWA**: Progressive Web App capabilities
- [ ] **Performance**: Code splitting and lazy loading
- [ ] **Accessibility**: WCAG compliance improvements

## 📝 Development Notes

### Code Quality
- **TypeScript**: Strict mode enabled for maximum type safety
- **ESLint**: Configured for React and TypeScript best practices
- **Component Structure**: Functional components with hooks
- **State Management**: Predictable Redux patterns

### Performance Optimizations
- **Code Splitting**: Lazy load components when needed
- **Memo Usage**: Prevent unnecessary re-renders
- **Optimistic Updates**: Immediate UI updates for better UX
- **Bundle Analysis**: Monitor bundle size and optimize

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - The web framework used
- [Redux Toolkit](https://redux-toolkit.js.org/) - State management
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Mock Service Worker](https://mswjs.io/) - API mocking library
- [Lucide React](https://lucide.dev/) - Beautiful icons
- [Vite](https://vitejs.dev/) - Fast build tool

---

**Live Demo**: [Deploy your app and add the URL here]

**Repository**: [Add your repository URL here]

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
