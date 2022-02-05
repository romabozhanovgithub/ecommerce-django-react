from django.db.models.signals import pre_save
from django.contrib.auth.models import User
from .models import Product, OrderItem

def update_user(sender, instance, **kwargs):
    user = instance

    if user.email != "":
        user.username = user.email

def update_order(sender, instance, **kwargs):
    product = Product.objects.filter(id=instance.product.id).first()
    product.count_in_stock -= instance.qty
    product.save()

pre_save.connect(update_user, sender=User)
pre_save.connect(update_order, sender=OrderItem)
