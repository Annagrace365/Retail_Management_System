from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from core.models import Customer, Product, Supplier, Order, OrderItem, Payment, ProductSupplier
from decimal import Decimal
import random

class Command(BaseCommand):
    help = 'Seed the database with sample data'

    def handle(self, *args, **options):
        # Create superuser if not exists
        if not User.objects.filter(username='admin').exists():
            User.objects.create_superuser('admin', 'admin@example.com', 'admin123')
            self.stdout.write(self.style.SUCCESS('Created superuser: admin/admin123'))

        # Create customers
        customers_data = [
            {'name': 'John Doe', 'address': '123 Main St, City A', 'phone': '1234567890'},
            {'name': 'Jane Smith', 'address': '456 Oak Ave, City B', 'phone': '0987654321'},
            {'name': 'Bob Johnson', 'address': '789 Pine St, City C', 'phone': '5555555555'},
        ]
        
        customers = []
        for data in customers_data:
            customer, created = Customer.objects.get_or_create(
                name=data['name'], 
                defaults=data
            )
            customers.append(customer)
            if created:
                self.stdout.write(f'Created customer: {customer.name}')

        # Create suppliers
        suppliers_data = [
            {'name': 'Tech Supply Co.', 'contact': '1111111111'},
            {'name': 'Office Materials Inc.', 'contact': '2222222222'},
            {'name': 'Electronics Wholesale', 'contact': '3333333333'},
        ]
        
        suppliers = []
        for data in suppliers_data:
            supplier, created = Supplier.objects.get_or_create(
                name=data['name'],
                defaults=data
            )
            suppliers.append(supplier)
            if created:
                self.stdout.write(f'Created supplier: {supplier.name}')

        # Create products
        products_data = [
            {'name': 'Laptop', 'price': Decimal('999.99'), 'stock': 15},
            {'name': 'Mouse', 'price': Decimal('29.99'), 'stock': 50},
            {'name': 'Keyboard', 'price': Decimal('79.99'), 'stock': 25},
            {'name': 'Monitor', 'price': Decimal('299.99'), 'stock': 8},
            {'name': 'Headphones', 'price': Decimal('149.99'), 'stock': 20},
        ]
        
        products = []
        for data in products_data:
            product, created = Product.objects.get_or_create(
                name=data['name'],
                defaults=data
            )
            products.append(product)
            if created:
                self.stdout.write(f'Created product: {product.name}')

        # Link products to suppliers
        for product in products:
            supplier = random.choice(suppliers)
            ProductSupplier.objects.get_or_create(
                product=product,
                supplier=supplier
            )

        # Create orders
        for i in range(5):
            customer = random.choice(customers)
            order = Order.objects.create(
                customer=customer,
                amount=Decimal('0.00')
            )
            
            total_amount = Decimal('0.00')
            num_items = random.randint(1, 3)
            
            for _ in range(num_items):
                product = random.choice(products)
                quantity = random.randint(1, 5)
                OrderItem.objects.create(
                    order=order,
                    product=product,
                    quantity=quantity
                )
                total_amount += product.price * quantity
            
            order.amount = total_amount
            order.save()
            
            # Create payment
            Payment.objects.create(
                order=order,
                amount=total_amount,
                payment_mode=random.choice(['cash', 'card', 'upi'])
            )
            
            self.stdout.write(f'Created order: {order.order_id}')

        self.stdout.write(self.style.SUCCESS('Successfully seeded the database!'))