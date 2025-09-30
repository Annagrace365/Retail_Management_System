# Retail Management System - Backend Installation

## ✅ **All Dependencies Successfully Added to requirements.txt**

### **Core Dependencies**
- ✅ **Django** - Web framework
- ✅ **Django REST Framework** - API framework  
- ✅ **Django REST Framework Simple JWT** - JWT authentication
- ✅ **Django CORS Headers** - Cross-origin resource sharing
- ✅ **PyMySQL** - MySQL database connector (Windows compatible)
- ✅ **Python Decouple** - Environment variable management
- ✅ **DRF YASG** - Swagger/OpenAPI documentation
- ✅ **Django Extensions** - Additional Django utilities

### **Production Dependencies**
- ✅ **Gunicorn** - WSGI server for production
- ✅ **WhiteNoise** - Static file serving
- ✅ **Django Filter** - Advanced filtering for APIs
- ✅ **Django Rate Limit** - API rate limiting

## 🚀 **Installation Commands**

### **Basic Installation**
```bash
cd backend
pip install -r requirements.txt
```

### **Minimal Installation (if having issues)**
```bash
pip install -r requirements-minimal.txt
```

### **Development Installation**
```bash
pip install -r requirements-dev.txt
```

### **Production Installation**
```bash
pip install -r requirements-production.txt
```

## ✅ **Verification Commands**

### **Check Django Configuration**
```bash
python manage.py check
```

### **Check Production Readiness**
```bash
python manage.py check --deploy
```

### **Run Development Server**
```bash
python manage.py runserver
```

## 🔧 **Database Configuration**

The system is configured to use PyMySQL (MySQL compatible) with the following settings:
- **Engine**: `django.db.backends.mysql`
- **Driver**: PyMySQL (Windows compatible)
- **Configuration**: Automatic PyMySQL setup in settings.py

## 📁 **Requirements Files**

1. **requirements.txt** - Main dependencies with version ranges
2. **requirements-minimal.txt** - Essential packages only
3. **requirements-dev.txt** - Development tools and testing
4. **requirements-production.txt** - Production deployment packages

## 🎯 **Next Steps**

1. **Set up environment variables** (create .env file)
2. **Run migrations**: `python manage.py migrate`
3. **Create superuser**: `python manage.py createsuperuser`
4. **Seed data**: `python manage.py seed_data`
5. **Start server**: `python manage.py runserver`

## 🔍 **Troubleshooting**

### **If PyMySQL issues occur:**
- The settings.py file includes `pymysql.install_as_MySQLdb()` to fix compatibility
- This allows Django to use PyMySQL as a MySQLdb replacement

### **If Pillow issues occur:**
- Pillow is commented out in requirements.txt due to Python 3.13 compatibility
- Can be installed separately if needed: `pip install Pillow`

All dependencies have been tested and verified to work with the Retail Management System! 🎉
