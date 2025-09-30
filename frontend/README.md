# Retail Management System - Frontend

A modern React frontend for the Retail Management System built with Vite, TypeScript, and TailwindCSS.

## 🚀 Features

- **Modern React 18** with TypeScript
- **Vite** for fast development and building
- **TailwindCSS** for responsive styling
- **React Router** for navigation
- **Axios** for API communication
- **JWT Authentication** with role-based access
- **Responsive Design** for all screen sizes
- **Role-based Access Control** (Admin, Staff, Inventory Manager)

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable components
│   │   ├── Layout.tsx      # Main layout with sidebar
│   │   ├── LoadingSpinner.tsx
│   │   ├── FormInput.tsx
│   │   ├── Modal.tsx
│   │   ├── ConfirmDialog.tsx
│   │   └── ProtectedRoute.tsx
│   ├── pages/              # Page components
│   │   ├── Login.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Customers.tsx
│   │   ├── Products.tsx
│   │   ├── Orders.tsx
│   │   ├── Payments.tsx
│   │   └── Suppliers.tsx
│   ├── services/           # API services
│   │   └── api.ts
│   ├── types/              # TypeScript interfaces
│   │   └── index.ts
│   ├── utils/              # Utility functions
│   │   └── auth.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

## 🛠️ Installation

### Prerequisites

- Node.js 16+ and npm
- Backend API running on http://localhost:8000

### Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` file with your API URL:
   ```
   VITE_API_URL=http://localhost:8000/api
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

## 🎯 Pages & Features

### 🔐 Authentication
- **Login Page** - JWT authentication with demo credentials
- **Protected Routes** - Role-based access control
- **Auto-logout** on token expiration

### 📊 Dashboard
- **Role-based Statistics** - Different views for Admin, Staff, Inventory Manager
- **Real-time Data** - Total customers, products, orders, revenue
- **Low Stock Alerts** - Products needing restocking
- **Recent Orders** - Latest order activity
- **Quick Actions** - Fast access to common tasks

### 👥 Customers
- **CRUD Operations** - Create, read, update, delete customers
- **Search & Filter** - Find customers by name, phone, or address
- **Form Validation** - Client-side and server-side validation
- **Responsive Table** - Mobile-friendly data display

### 📦 Products
- **Inventory Management** - Track stock levels and pricing
- **Low Stock Warnings** - Visual alerts for products needing restocking
- **Supplier Relationships** - View linked suppliers
- **Stock Status** - In Stock, Low Stock, Out of Stock indicators

### 🛒 Orders
- **Multi-product Orders** - Add multiple products to single order
- **Real-time Calculations** - Automatic total amount calculation
- **Stock Validation** - Prevent overselling
- **Order Details** - View complete order information
- **Customer Selection** - Link orders to customers

### 💳 Payments
- **Multiple Payment Modes** - Cash, Card, UPI, Bank Transfer
- **Order Integration** - Link payments to specific orders
- **Payment History** - Track all payment transactions
- **Filtering** - Search by customer, order, or payment mode

### 🚚 Suppliers
- **Supplier Management** - Add, edit, delete suppliers
- **Product Linking** - Connect products to suppliers
- **Relationship Tracking** - View product-supplier connections
- **Contact Management** - Store supplier contact information

## 🎨 UI Components

### Reusable Components
- **Layout** - Responsive sidebar navigation with role-based menu items
- **LoadingSpinner** - Consistent loading states
- **FormInput** - Standardized form inputs with validation
- **Modal** - Reusable modal dialogs
- **ConfirmDialog** - Confirmation dialogs for destructive actions
- **ProtectedRoute** - Route protection with role checking

### Design System
- **TailwindCSS** - Utility-first CSS framework
- **Responsive Design** - Mobile-first approach
- **Accessibility** - ARIA labels and keyboard navigation
- **Consistent Styling** - Reusable CSS classes
- **Dark Mode Ready** - Prepared for future dark mode implementation

## 🔒 Role-Based Access Control

### Admin (Superuser)
- Full access to all features
- User management capabilities
- System configuration access

### Staff
- Customer management
- Order processing
- Payment handling
- Product viewing

### Inventory Manager
- Product management
- Stock tracking
- Supplier management
- Inventory reports

## 🚀 Development

### Available Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Code Structure

- **TypeScript** - Full type safety
- **Functional Components** - Modern React patterns
- **Custom Hooks** - Reusable state logic
- **Error Boundaries** - Graceful error handling
- **Loading States** - Better user experience

## 🔧 Configuration

### Environment Variables

```env
VITE_API_URL=http://localhost:8000/api
VITE_APP_TITLE=Retail Management System
VITE_APP_VERSION=1.0.0
```

### API Integration

- **Axios Interceptors** - Automatic token attachment
- **Error Handling** - Consistent error responses
- **Loading States** - Request/response indicators
- **Type Safety** - Full TypeScript integration

## 📱 Responsive Design

- **Mobile First** - Optimized for mobile devices
- **Tablet Support** - Medium screen optimizations
- **Desktop Layout** - Full desktop experience
- **Touch Friendly** - Mobile gesture support

## 🎯 Future Enhancements

- **Barcode Scanner** - Product scanning capabilities
- **Receipt Printing** - Thermal printer integration
- **Offline Support** - PWA capabilities
- **Real-time Updates** - WebSocket integration
- **Advanced Analytics** - Charts and reporting
- **Multi-language** - Internationalization support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is part of the Retail Management System and follows the same license terms.
