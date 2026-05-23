# Frontend Client

This directory contains the user interface client for the Store Rating and Assessment System. It is constructed as a React SPA optimized with Vite, Tailwind CSS, and React Router, enforcing client-side route guards based on user authorization levels.

---

## 1. Technologies & Design Choices

* **Framework**: React 19 utilizing Context API for session orchestration and custom hooks for component decoupling.
* **Build tool**: Vite 8 for fast build optimization and instant module reloading.
* **Styling Engine**: Tailwind CSS v4 featuring post-processed styling rules.
* **Theme System**: Custom light/dark mode configuration using React Context (`ThemeContext`) storing preference in local storage and matching system preference by default, toggled via a Sun/Moon visual switch component (`ThemeToggle.jsx`).
* **Layout Adaptability & Mobile Responsiveness**: Dedicated layout implementations (`AdminLayout.jsx` and `UserOwnerLayout.jsx`) providing mobile-responsive elements such as collapsible side drawers and accordion navigation systems.
* **Form validation**: React Hook Form 7 to prevent unnecessary DOM re-renders during form state updates.
* **Routing**: React Router Dom 7 implementing sub-routing and layout shells.
* **HTTP Client**: Axios with global configuration and request interceptors to automatically bind JWT Bearer headers to outgoing API calls.

---

## 2. Directory Layout and Architecture

* **[src/context/AuthContext.jsx](src/context/AuthContext.jsx)**: Houses login, logout, validation states, and caches session payloads in `localStorage`.
* **[src/context/ThemeContext.jsx](src/context/ThemeContext.jsx)**: Provides dark/light theme state tracking, auto-detecting system preference and synchronizing state with local storage.
* **[src/components/ProtectedRoute.jsx](src/components/ProtectedRoute.jsx)**: A layout route guard that blocks unauthorized access, matching user roles against a whitelist (e.g. `allowedRoles={['ADMIN']}`).
* **[src/components/AdminLayout.jsx](src/components/AdminLayout.jsx)**: Global UI dashboard shell for Administrators. Renders a fixed sidebar on desktop screen sizes and a toggleable, overlay-driven navigation drawer on mobile viewports.
* **[src/components/UserOwnerLayout.jsx](src/components/UserOwnerLayout.jsx)**: Global UI shell for Customers and Store Owners. Employs a collapsible accordion navigation system optimized for smaller viewports.
* **[src/components/ThemeToggle.jsx](src/components/ThemeToggle.jsx)**: A Sun/Moon mode-switch component.
* **[src/pages/](src/pages/)**: Contains specific page components for dashboards, profiles, authentication entrypoints, and records tables.
* **[src/utils/axiosInstance.js](src/utils/axiosInstance.js)**: Pre-configured Axios instance that automatically retrieves the JWT authorization token and attaches it to request headers.

---

## 3. Core Pages & Dashboards

### Authentication Screens
* **Login & Register**: Entry screens featuring real-time client-side checks matching validation constraints set on the server (e.g., password criteria, name length requirements).

### Administrator Panels
* **Admin Dashboard**: Aggregated metadata screen presenting key metrics (total system users, active stores, ratings).
* **Users List**: Dynamic user management grid displaying Customers, Store Owners, and Administrators (decorated with a rose-pink role badge). Supports multi-field query filters (name, email, address, role) and dynamic column sorting.
* **User Profile Detail**: Inspection page showcasing specific account configurations, owned store profile, and performance metrics.
* **Stores list**: View listing of registered stores. Administrators can create a new store and assign it to an owner user, enforcing that the recipient holds the `STORE_OWNER` role.

### Store Owner Dashboard
* **Performance Overview**: Features calculated average ratings.
* **Customer Review Log**: Tabular overview displaying customer reviews, containing the customer's name, email, individual rating score, and date of submission.
* **Owner Profile**: Settings view to update security credentials.

### Customer Interface
* **Stores Hub**: Interactive catalog showing stores and average scores. Allows users to submit or dynamically update their rating (1–5 stars) via an interactive interface.
* **User Profile**: Account details sheet with credentials update form.

---

## 4. Setup & Running Instructions

### Configuration
Ensure that the client can reach the backend server. Create a `.env` or `.env.local` file inside the `frontend/` root:

```env
VITE_API_URL="http://localhost:8000"
```

### Installation
1. Install client dependencies:
   ```bash
   npm install
   ```
2. Run the local development server:
   ```bash
   npm run dev
   ```
   *The dev server will initialize, exposing the site locally (typically at `http://localhost:5173`).*

3. Compile the production-ready static bundle:
   ```bash
   npm run build
   ```
4. Preview the production build locally:
   ```bash
   npm run preview
   ```
