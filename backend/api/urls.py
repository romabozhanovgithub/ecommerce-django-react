from django.urls import path
from . import views

urlpatterns = [
    # User url
    path("users/login/", views.MyTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("users/register/", views.register_user, name="register"),
    path("users/profile/", views.get_user_profile, name="user-profile"),
    path("users/profile/update/", views.update_user_profile, name="user-profile-update"),
    path("users/", views.get_users, name="users"),
    path("users/<str:pk>/", views.get_user_by_id, name="user"),
    path("users/update/<str:pk>/", views.update_user, name="user-update"),
    path("users/delete/<str:pk>/", views.delete_user, name="user-delete"),
    #Product url
    path("products/", views.get_products, name="products"),
    path("product/create/", views.create_product, name="product-create"),
    path("product/upload/", views.upload_image, name="image-upload"),
    path("product/<str:pk>/", views.get_product, name="product"),
    path("product/update/<str:pk>/", views.update_product, name="product-update"),
    path("product/delete/<str:pk>/", views.delete_product, name="product-delete"),
    path("product/<str:pk>/reviews/", views.create_review, name="create-review"),
    # Order url
    path("order/", views.get_orders, name="orders"),
    path("order/add/", views.add_order_items, name="orders-add"),
    path("order/myorders/", views.get_my_orders, name="orders-my-orders"),
    path("order/<str:pk>/", views.get_order_by_id, name="user-order"),
    path("order/<str:pk>/deliver/", views.update_order_to_delivered, name="orders-delivered"),
    path("order/<str:pk>/pay/", views.update_order_to_paid, name="pay"),
]
