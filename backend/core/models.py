from django.db import models
from django.contrib.auth.models import User

class Customer(models.Model):
    customer_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    address = models.TextField()
    phone = models.CharField(max_length=15)
    
    def __str__(self):
        return self.name
    
    class Meta:
        db_table = 'customers'

class Supplier(models.Model):
    supplier_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    contact = models.CharField(max_length=15)
    
    def __str__(self):
        return self.name
    
    class Meta:
        db_table = 'suppliers'

class Product(models.Model):
    product_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.IntegerField(default=0)
    
    def __str__(self):
        return self.name
    
    class Meta:
        db_table = 'products'

class Order(models.Model):
    order_id = models.AutoField(primary_key=True)
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='orders')
    order_date = models.DateTimeField(auto_now_add=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    
    def __str__(self):
        return f"Order {self.order_id} - {self.customer.name}"
    
    class Meta:
        db_table = 'orders'
        ordering = ['-order_date']

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField()
    
    class Meta:
        db_table = 'order_items'
        unique_together = ('order', 'product')
    
    def __str__(self):
        return f"{self.product.name} x {self.quantity}"

class Payment(models.Model):
    PAYMENT_MODES = [
        ('cash', 'Cash'),
        ('card', 'Card'),
        ('upi', 'UPI'),
        ('bank_transfer', 'Bank Transfer'),
    ]
    
    payment_id = models.AutoField(primary_key=True)
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='payments')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_mode = models.CharField(max_length=20, choices=PAYMENT_MODES)
    payment_date = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Payment {self.payment_id} - {self.order}"
    
    class Meta:
        db_table = 'payments'

class ProductSupplier(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    supplier = models.ForeignKey(Supplier, on_delete=models.CASCADE)
    
    class Meta:
        db_table = 'product_suppliers'
        unique_together = ('product', 'supplier')
    
    def __str__(self):
        return f"{self.product.name} - {self.supplier.name}"