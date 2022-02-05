from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Product, Order, OrderItem, ShippingAddress, Review


class UserSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField(read_only=True)
    isAdmin = serializers.BooleanField(source="is_staff", read_only=True)

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "name",
            "isAdmin"
        ]

    def get_name(self, obj):
        name = obj.first_name
        if name == "":
            name = obj.email

        return name


class UserSerializerWithToken(UserSerializer):
    token = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "name",
            "isAdmin",
            "token"
        ]

    def get_token(self, obj):
        token = RefreshToken.for_user(obj)
        return str(token.access_token)


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = "__all__"


class ProductSerializer(serializers.ModelSerializer):
    numReviews = serializers.IntegerField(source="num_reviews", read_only=True)
    countInStock = serializers.IntegerField(source="count_in_stock")
    image = serializers.ImageField(read_only=True)

    class Meta:
        model = Product
        fields = [
            "id",
            "name",
            "image",
            "brand",
            "category",
            "description",
            "rating",
            "numReviews",
            "price",
            "countInStock"
        ]


class ProductWithReviewsSerializer(ProductSerializer):
    reviews = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Product
        fields = fields = [
            "id",
            "name",
            "image",
            "brand",
            "category",
            "description",
            "rating",
            "numReviews",
            "price",
            "countInStock",
            "reviews"
        ]

    def get_reviews(self, obj):
        reviews = obj.reviews.all()
        serializer = ReviewSerializer(reviews, many=True)
        return serializer.data


class ShippingAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShippingAddress
        fields = "__all__"


class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)

    class Meta:
        model = OrderItem
        fields = "__all__"


class OrderSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField(read_only=True)
    paymentMethod = serializers.CharField(source="payment_method")
    taxPrice = serializers.DecimalField(source="tax_price", max_digits=8, decimal_places=2, read_only=True)
    shippingPrice = serializers.DecimalField(source="shipping_price", max_digits=8, decimal_places=2, read_only=True)
    totalPrice = serializers.DecimalField(source="total_price", max_digits=8, decimal_places=2, read_only=True)
    isPaid = serializers.BooleanField(source="is_paid", read_only=True)
    paidAt = serializers.DateTimeField(source="paid_at", read_only=True)
    isDelivered = serializers.BooleanField(source="is_delevered", read_only=True)
    createdAt = serializers.DateTimeField(source="created_at", read_only=True)
    orderItems = OrderItemSerializer(source="orderitems", many=True)
    shippingAddress = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Order
        fields = [
            "id",
            "user",
            "paymentMethod",
            "taxPrice",
            "shippingPrice",
            "totalPrice",
            "isPaid",
            "paidAt",
            "isDelivered",
            "createdAt",
            "orderItems",
            "shippingAddress"
        ]

    def create(self, validated_data):
        order_items = validated_data.pop("orderitems")
        order = Order.objects.create(**validated_data)
        total_price = 0

        for order_item in order_items:
            product = Product.objects.get(id=order_item["product"].id)
            OrderItem.objects.create(product=product, order=order, qty=order_item["qty"])
            total_price += product.price * order_item["qty"]

        order.tax_price = float(total_price) * 0.08
        order.shipping_price = 0 if total_price > 100 else 10
        order.total_price = total_price + order.tax_price + order.shipping_price
        order.save()

        return order

    def get_shippingAddress(self, obj):
        try:
            address = ShippingAddressSerializer(obj.shipping_address, many=False).data
        except:
            address = False
        return address

    def get_user(self, obj):
        user = obj.user
        serializer = UserSerializer(user, many=False)
        return serializer.data
