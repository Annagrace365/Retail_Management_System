from rest_framework import serializers
from .models import Customer, Product, Supplier, Order, OrderItem, Payment, ProductSupplier

class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = '__all__'

class SupplierSerializer(serializers.ModelSerializer):
    class Meta:
        model = Supplier
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    suppliers = serializers.SerializerMethodField()
    
    class Meta:
        model = Product
        fields = ['product_id', 'name', 'price', 'stock', 'suppliers']
    
    def get_suppliers(self, obj):
        suppliers = Supplier.objects.filter(productsupplier__product=obj)
        return SupplierSerializer(suppliers, many=True).data

class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_price = serializers.DecimalField(source='product.price', max_digits=10, decimal_places=2, read_only=True)
    
    class Meta:
        model = OrderItem
        fields = ['product', 'product_name', 'product_price', 'quantity']

class OrderSerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(source='customer.name', read_only=True)
    items = OrderItemSerializer(many=True, read_only=True)
    
    class Meta:
        model = Order
        fields = ['order_id', 'customer', 'customer_name', 'order_date', 'amount', 'items']

class OrderCreateSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, write_only=True)
    
    class Meta:
        model = Order
        fields = ['customer', 'amount', 'items']
    
    def create(self, validated_data):
        items_data = validated_data.pop('items')
        order = Order.objects.create(**validated_data)
        
        for item_data in items_data:
            OrderItem.objects.create(order=order, **item_data)
            # Update stock
            product = item_data['product']
            product.stock -= item_data['quantity']
            product.save()
        
        return order

class PaymentSerializer(serializers.ModelSerializer):
    order_customer = serializers.CharField(source='order.customer.name', read_only=True)
    
    class Meta:
        model = Payment
        fields = ['payment_id', 'order', 'order_customer', 'amount', 'payment_mode', 'payment_date']

class ProductSupplierSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    supplier_name = serializers.CharField(source='supplier.name', read_only=True)
    
    class Meta:
        model = ProductSupplier
        fields = ['product', 'product_name', 'supplier', 'supplier_name']