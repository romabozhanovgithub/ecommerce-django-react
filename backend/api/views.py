from django.shortcuts import render
from django.http import JsonResponse
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import status
from .models import Product, Order, OrderItem, ShippingAddress, Review
from .serializers import ProductSerializer, UserSerializer, UserSerializerWithToken, OrderSerializer, ProductWithReviewsSerializer
from datetime import datetime


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        serializer = UserSerializerWithToken(self.user).data

        for key, value in serializer.items():
            data[key] = value

        return data


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_user_profile(request):
    user = request.user
    serializer = UserSerializer(user, many=False)
    return Response(serializer.data)


@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_user_profile(request):
    user = request.user
    serializer = UserSerializerWithToken(user, many=False)
    data = request.data
    user.first_name = data["name"]
    user.email = data["email"]

    if data["password"] != "":
        user.password = make_password(data["password"])

    user.save()
    return Response(serializer.data)


@api_view(["GET"])
@permission_classes([IsAdminUser])
def get_users(request):
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)


@api_view(["POST"])
def register_user(request):
    data = request.data

    try:
        user = User.objects.create(
            first_name=data["name"],
            username=data["email"],
            email=data["email"],
            password=make_password(data["password"])
        )
        serializer = UserSerializerWithToken(user, many=False)
        return Response(serializer.data)
    except:
        message = {"detail": "User with this email already exists"}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
@permission_classes([IsAdminUser])
def get_user_by_id(request, pk):
    user = User.objects.get(id=pk)
    serializer = UserSerializer(user, many=False)
    return Response(serializer.data)


@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_user(request, pk):
    user = User.objects.get(id=pk)
    serializer_data = UserSerializer(user, data=request.data, many=False)
    data = serializer_data.initial_data

    user.first_name = data["name"]
    user.email = data["email"]
    user.is_staff = data["isAdmin"]

    user.save()

    serializer = UserSerializerWithToken(user, many=False)
    return Response(serializer.data)


@api_view(["DELETE"])
@permission_classes([IsAdminUser])
def delete_user(request, pk):
    user = User.objects.get(id=pk)
    user.delete()
    return Response("User was deleted")


@api_view(["GET"])
def get_products(request):
    products = Product.objects.all()
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)


@api_view(["GET"])
def get_product(request, pk):
    product = Product.objects.get(id=pk)
    serializer = ProductWithReviewsSerializer(product, many=False)
    return Response(serializer.data)


@api_view(["POST"])
@permission_classes([IsAdminUser])
def create_product(request):
    user = request.user
    data = request.data

    product = Product.objects.create(
        user=user,
        name=data["name"],
        price=data["price"],
        brand=data["brand"],
        count_in_stock=data["countInStock"],
        category=data["category"],
        description=data["description"]
    )

    serializer = ProductSerializer(product)
    return Response(serializer.data)


@api_view(["PUT"])
@permission_classes([IsAdminUser])
def update_product(request, pk):
    data = request.data
    product = Product.objects.get(id=pk)

    product.name = data["name"]
    product.price = data["price"]
    product.brand = data["brand"]
    product.count_in_stock = data["countInStock"]
    product.category = data["category"]
    product.description = data["description"]

    product.save()

    serializer = ProductSerializer(product, many=False)
    return Response(serializer.data)


@api_view(["DELETE"])
@permission_classes([IsAdminUser])
def delete_product(request, pk):
    product = Product.objects.get(id=pk)
    product.delete()
    return Response("Product was deleted")


@api_view(["POST"])
def upload_image(request):
    data = request.data

    product = Product.objects.get(id=data["productId"])

    product.image = request.FILES.get("image")
    product.save()

    return Response("Image was uploaded")


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def add_order_items(request):
    user = request.user
    data = request.data

    order_items = data["orderItems"]

    if order_items and not len(order_items):
        return Response({"detail": "No Order Items"}, status=status.HTTP_400_BAD_REQUEST)
    
    order = Order.objects.create(
        user=user,
        payment_method=data["paymentMethod"],
        tax_price=data["taxPrice"],
        shipping_price=data["shippingPrice"],
        total_price=data["totalPrice"]
    )

    shipping = ShippingAddress.objects.create(
        order=order,
        address=data["shippingAddress"]["address"],
        city=data["shippingAddress"]["city"],
        postal_code=data["shippingAddress"]["postalCode"],
        country=data["shippingAddress"]["country"],
    )

    for i in order_items:
        product = Product.objects.get(id=i["product"])

        item = OrderItem.objects.create(
            product=product,
            order=order,
            name=product.name,
            qty=i["qty"],
            price=i["price"],
            image=product.image.url,
        )

        product.count_in_stock -= item.qty
        product.save()

    serialzier = OrderSerializer(order, many=False)
    return Response(serialzier.data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_my_orders(request):
    user = request.user
    orders = user.order_set.all()
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)


@api_view(["GET"])
@permission_classes([IsAdminUser])
def get_orders(reqeust):
    orders = Order.objects.all()
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_order_by_id(request, pk):
    user = request.user

    try:
        order = Order.objects.get(id=pk)

        if user.is_staff or order.user == user:
            serializer = OrderSerializer(order, many=False)
            return Response(serializer.data)
        
        return Response({"detail": "Not authorized to view this order"}, status=status.HTTP_400_BAD_REQUEST)
    except:
        return Response({"detail": "Order does not exists"}, status=status.HTTP_400_BAD_REQUEST)


@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_order_to_paid(request, pk):
    order = Order.objects.get(id=pk)

    order.is_paid = True
    order.paid_at = datetime.now()
    order.save()

    return Response("Order was paid")


@api_view(["PUT"])
@permission_classes([IsAdminUser])
def update_order_to_delivered(request, pk):
    order = Order.objects.get(id=pk)

    order.is_delivered = True
    order.delivered_at = datetime.now()
    order.save()

    return Response("Order was delivered")

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_review(request, pk):
    user = request.user
    data = request.data
    product = Product.objects.get(id=pk)

    if product.review_set.filter(user=user).exists():
        return Response({"detail": "Product review already exists"}, status=status.HTTP_400_BAD_REQUEST)
    elif not data["rating"] or not data["comment"]:
        return Response({"detail": "Review details"}, status=status.HTTP_400_BAD_REQUEST)

    review = Review.objects.create(
        user=user,
        product=product,
        name=user.first_name,
        rating=data["rating"],
        comment=data["comment"]
    )
    product.num_reviews += 1
    rating = 0

    for i in product.review_set.all():
        rating += i.rating

    product.rating = rating / product.num_reviews
    product.save()

    return Response("Review added")
