# Retail Management System

A full-stack web application built with Django REST Framework backend and React frontend, designed for managing retail operations including customers, products, orders, payments, and suppliers.

## Features

### Backend (Django REST API)
- **Authentication**: JWT-based authentication with admin/staff roles
- **CRUD Operations**: Full CRUD for all entities (Customers, Products, Orders, etc.)
- **Database**: PlanetScale MySQL integration
- **API Documentation**: Auto-generated Swagger/OpenAPI docs
- **Data Models**:
  - Customer: ID, name, address, phone
  - Product: ID, name, price, stock
  - Supplier: ID, name, contact
  - Order: ID, customer, date, amount, items
  - Payment: ID, order, amount, payment mode
  - Product-Supplier relationships

### Frontend (React)
- **Dashboard**: Real-time statistics and recent orders
- **Customer Management**: Add, edit, delete customers
- **Product Management**: Inventory tracking with low-stock alerts
- **Order Management**: Create multi-item orders with automatic stock updates
- **Payment Tracking**: Multiple payment modes (cash, card, UPI, bank transfer)
- **Supplier Management**: Link products to suppliers
- **Responsive Design**: Works on desktop and mobile devices

## Installation Instructions

### Prerequisites
- Python 3.8+
- Node.js 14+
- MySQL database (PlanetScale recommended)

### Backend Setup

1. **Clone and setup backend:**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

2. **Configure environment:**
   - Copy `.env.example` to `.env`
   - Update database credentials for your PlanetScale instance:
     ```
     DB_NAME=your_database_name
     DB_USER=your_database_user
     DB_PASSWORD=your_database_password
     DB_HOST=your_database_host
     DB_PORT=3306
     ```

3. **Run migrations and seed data:**
   ```bash
   python manage.py migrate
   python manage.py seed_data
   python manage.py runserver
   ```

### Frontend Setup

1. **Install and run frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## API Documentation

Once the Django server is running, visit:
- Swagger UI: http://localhost:8000/api/docs/
- ReDoc: http://localhost:8000/api/redoc/

## Default Login

After seeding data:
- **Username**: admin
- **Password**: admin123

## Database Schema

The system uses a normalized MySQL schema with the following relationships:
- Customers can have multiple Orders
- Orders contain multiple OrderItems (many-to-many with Products)
- Orders can have multiple Payments
- Products can have multiple Suppliers (many-to-many relationship)

## Technology Stack

**Backend:**
- Django 4.2
- Django REST Framework
- JWT Authentication
- MySQL (PlanetScale)
- Swagger/OpenAPI documentation

**Frontend:**
- React 18
- TypeScript
- Tailwind CSS
- React Router
- Axios for API calls
- Lucide React for icons

## Project Structure

```
backend/
├── manage.py
├── requirements.txt
├── retail_management/
│   ├── settings.py
│   ├── urls.py
│   └── ...
└── core/
    ├── models.py
    ├── views.py
    ├── serializers.py
    ├── urls.py
    └── management/commands/seed_data.py

frontend/
├── package.json
├── src/
│   ├── components/
│   ├── contexts/
│   ├── pages/
│   ├── services/
│   └── App.tsx
└── ...
```

## License

MIT License - feel free to use this project for learning or commercial purposes.