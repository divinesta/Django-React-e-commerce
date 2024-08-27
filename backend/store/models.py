from django.db import models
from django.utils.text import slugify
from django.dispatch import receiver
from django.db.models.signals import post_save

from vendor.models import Vendor
from userauths.models import Profile, User

from shortuuid.django_fields import ShortUUIDField

# Create your models here.


class Category(models.Model):
    title = models.CharField(
        max_length=100, help_text='Name of the category', unique=True, null=False, blank=False)
    image = models.FileField(upload_to='category',
        null=True, blank=True, default="category.jpg")
    active = models.BooleanField(default=False)
    slug = models.SlugField(max_length=100, unique=True)

    def __str__(self):
        return str(self.title)

    class Meta:
        verbose_name_plural = 'Categories'
        ordering = ['title']


class Product(models.Model):

    STATUS = [
        ("DRAFT", 'Draft'),
        ("DISABLED", 'Disabled'),
        ("IN_REVIEW", 'In Review'),
        ("PUBLISHED", 'Published'),
    ]

    title = models.CharField(
        max_length=100, help_text='Name of the product', unique=True, null=False, blank=False)
    image = models.FileField(
        upload_to='product', null=True, blank=True, default="product.jpg")
    category = models.ForeignKey(
        Category, on_delete=models.SET_NULL, null=True, blank=True)
    description = models.TextField(
        help_text='Description of the product', null=True, blank=True)
    # user = models.ForeignKey(User, on_delete=models.CASCADE)
    price = models.DecimalField(
        max_digits=12, decimal_places=2, help_text='Price of the product')
    old_price = models.DecimalField(
        max_digits=12, decimal_places=2, help_text='Old Price of the product')
    shipping_amount = models.DecimalField(
        max_digits=12, decimal_places=2, default=0.00, help_text='Shipping amount')
    stock_qty = models.IntegerField(
        help_text='Stock of the product', null=False, blank=False)
    in_stock = models.BooleanField(default=True)
    status = models.CharField(
        max_length=10, choices=STATUS, default="PUBLISHED")
    featured = models.BooleanField(default=False)
    views = models.PositiveIntegerField(default=0)
    rating = models.PositiveIntegerField(default=0, null=True, blank=True)
    vendor = models.ForeignKey(Vendor, on_delete=models.CASCADE)
    pid = ShortUUIDField(unique=True, length=10, prefix='PID',
        alphabet='abcdefghijk1234567890')
    slug = models.SlugField(max_length=100, unique=True)
    date = models.DateTimeField(auto_now_add=True)

    # active = models.BooleanField(default=False)

    def __str__(self):
        return str(self.title)

    def product_rating(self):
        product_rating = Review.objects.filter(
            product=self).aggregate(avg_rating=models.Avg('rating'))
        return product_rating['avg_rating'] or 0

    def rating_count(self):
        return Review.objects.filter(product=self).count()

    def gallery(self):
        return Gallery.objects.filter(product=self)

    def specification(self):
        return Specification.objects.filter(product=self)

    def color(self):
        return Color.objects.filter(product=self)

    def size(self):
        return Size.objects.filter(product=self)

    def save(self, *args, **kwargs):
        self.rating = self.product_rating()
        super(Product, self).save(*args, **kwargs)
    # class Meta:
    #    verbose_name_plural = 'Products'
    #    ordering = ['-date']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)

        super(Product, self).save(*args, **kwargs)


class Gallery(models.Model):
    product = models.ForeignKey(
        Product, on_delete=models.CASCADE, related_name='gallery')
    image = models.FileField(upload_to="products", default="product.jpg")
    active = models.BooleanField(default=True)
    gid = ShortUUIDField(unique=True, length=10, prefix='GID',
         alphabet='abcdefghijk1234567890')

    def __str__(self):
        return str(self.product.title)

    class Meta:
        verbose_name_plural = 'Product Images'


class Specification(models.Model):
    product = models.ForeignKey(
        Product, on_delete=models.CASCADE, related_name='specification')
    title = models.CharField(
        max_length=100, help_text='Title of the specification', null=False, blank=False)
    content = models.CharField(
        max_length=100, help_text='Value of the specification', null=False, blank=False)

    def __str__(self):
        return str(self.title)


class Size(models.Model):
    product = models.ForeignKey(
        Product, on_delete=models.CASCADE, related_name='size')
    name = models.CharField(max_length=100, help_text='Title of the size')
    price = models.DecimalField(
        max_digits=12, decimal_places=2, help_text='Price of the product')

    def __str__(self):
        return str(self.name)


class Color(models.Model):
    product = models.ForeignKey(
        Product, on_delete=models.CASCADE, related_name='color')
    name = models.CharField(max_length=100, help_text='Name of the color')
    color_code = models.CharField(
        max_length=100, help_text='Color code of the color')

    def __str__(self):
        return str(self.name)


class Cart(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    user = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True)
    quantity = models.PositiveIntegerField(default=0)
    price = models.DecimalField(
        default=0.00, max_digits=12, decimal_places=2, help_text='Price of the product')
    sub_total = models.DecimalField(
        default=0.00, max_digits=12, decimal_places=2, help_text='Total price of the product')
    shipping_amount = models.DecimalField(
        default=0.00, max_digits=12, decimal_places=2, help_text='Shipping amount')
    service_fee = models.DecimalField(
        default=0.00, max_digits=12, decimal_places=2, help_text='Service fee')
    tax_fee = models.DecimalField(
        default=0.00, max_digits=12, decimal_places=2, help_text='Tax fee')
    total = models.DecimalField(
        default=0.00, max_digits=12, decimal_places=2, help_text='Total amount')
    country = models.CharField(
        max_length=100, help_text='Country of the user', null=True, blank=True)
    size = models.CharField(
        max_length=100, help_text='Size of the product', null=True, blank=True)
    color = models.CharField(
        max_length=100, help_text='Color of the product', null=True, blank=True)
    cart_id = models.CharField(
        max_length=100, help_text='Cart ID', null=True, blank=True)
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.cart_id} - {self.product.title}"

    # class Meta:
    #    verbose_name_plural = 'Cart Items'
    #    ordering = ['-date']


class CartOrder(models.Model):

    PAYMENT_STATUS = [
        ('PENDING', 'Pending'),
        ('PROCESSING', 'Processing'),
        ('PAID', 'Paid'),
        ('CANCELLED', 'Cancelled'),
    ]

    ORDER_STATUS = [
        ('PENDING', 'Pending'),
        ('FULFILLED', 'Fulfilled'),
        ('CANCELLED', 'Cancelled'),
    ]

    vendor = models.ManyToManyField(Vendor, blank=True)
    buyer = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True)
    sub_total = models.DecimalField(
        default=0.00, max_digits=12, decimal_places=2, help_text='Total price of the product')
    shipping_amount = models.DecimalField(
        default=0.00, max_digits=12, decimal_places=2, help_text='Shipping amount')
    service_fee = models.DecimalField(
        default=0.00, max_digits=12, decimal_places=2, help_text='Service fee')
    tax_fee = models.DecimalField(
        default=0.00, max_digits=12, decimal_places=2, help_text='Tax fee')
    total = models.DecimalField(
        default=0.00, max_digits=12, decimal_places=2, help_text='Total amount')
    payment_status = models.CharField(
        choices=PAYMENT_STATUS, max_length=10, default='PENDING')
    order_status = models.CharField(
        choices=ORDER_STATUS, max_length=10, default='PENDING')

    # coupons
    initial_total = models.DecimalField(
        default=0.00, max_digits=12, decimal_places=2, help_text='Initial total amount')
    saved = models.DecimalField(
        default=0.00, max_digits=12, decimal_places=2, help_text='Saved amount')

    # Bio data
    full_name = models.CharField(
        max_length=100, help_text='Full name of the user', null=True, blank=True)
    email = models.CharField(
        max_length=100, help_text='Email of the user', null=True, blank=True)
    mobile = models.CharField(
        max_length=100, help_text='Mobile number of the user', null=True, blank=True)

    # shipping address
    address = models.CharField(
        max_length=100, help_text='Address of the user', null=True, blank=True)
    city = models.CharField(
        max_length=100, help_text='City of the user', null=True, blank=True)
    state = models.CharField(
        max_length=100, help_text='State of the user', null=True, blank=True)
    country = models.CharField(
        max_length=100, help_text='Country of the user', null=True, blank=True)

    oid = ShortUUIDField(unique=True, length=10,
                         alphabet='abcdefghijk1234567890')
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(self.oid)


class CartOrderItem(models.Model):
    order = models.ForeignKey(CartOrder, on_delete=models.CASCADE)
    vendor = models.ForeignKey(Vendor, on_delete=models.SET_NULL, null=True)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=0)
    price = models.DecimalField(
        default=0.00, max_digits=12, decimal_places=2, help_text='Price of the product')
    sub_total = models.DecimalField(
        default=0.00, max_digits=12, decimal_places=2, help_text='Total price of the product')
    shipping_amount = models.DecimalField(
        default=0.00, max_digits=12, decimal_places=2, help_text='Shipping amount')
    service_fee = models.DecimalField(
        default=0.00, max_digits=12, decimal_places=2, help_text='Service fee')
    tax_fee = models.DecimalField(
        default=0.00, max_digits=12, decimal_places=2, help_text='Tax fee')
    total = models.DecimalField(
        default=0.00, max_digits=12, decimal_places=2, help_text='Total amount')
    country = models.CharField(
        max_length=100, help_text='Country of the user', null=True, blank=True)

    size = models.CharField(
        max_length=100, help_text='Size of the product', null=True, blank=True)
    color = models.CharField(
        max_length=100, help_text='Color of the product', null=True, blank=True)

    # coupons
    initial_total = models.DecimalField(
        default=0.00, max_digits=12, decimal_places=2, help_text='Initial total amount')
    saved = models.DecimalField(
        default=0.00, max_digits=12, decimal_places=2, help_text='Saved amount')
    oid = ShortUUIDField(unique=True, length=10,
        alphabet='abcdefghijk1234567890')
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.oid


class ProductFaq(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    question = models.CharField(max_length=1000)
    answer = models.TextField(null=True, blank=True)
    active = models.BooleanField(default=False)
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.question

    class Meta:
        verbose_name_plural = 'Product FAQs'


class Review(models.Model):
    RATINGS = [
        (1, '1 Star'),
        (2, '2 Stars'),
        (3, '3 Stars'),
        (4, '4 Stars'),
        (5, '5 Stars'),
    ]

    user = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    reply = models.TextField(null=True, blank=True)
    review = models.TextField()
    rating = models.PositiveIntegerField(default=None, choices=RATINGS)
    active = models.BooleanField(default=False)
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.review

    class Meta:
        verbose_name_plural = 'Product Reviews'

    def profile(self):
        return Profile.objects.get(user=self.user)


@receiver(post_save, sender=Review)
def update_product_rating(sender, instance, created, **kwargs):
    if instance.product:
        instance.product.save()


class Wishlist(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.product.title


class Notification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    vendor = models.ForeignKey(Vendor, on_delete=models.CASCADE)
    order = models.ForeignKey(
        CartOrder, on_delete=models.SET_NULL, null=True, blank=True)
    order_item = models.ForeignKey(
        CartOrderItem, on_delete=models.SET_NULL, null=True, blank=True)
    seen = models.BooleanField(default=False)
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        if self.order:
            return f"Order Notification: {self.order.oid}"
        else:
            return f"Order Item Notification: {self.pk}"


class Coupon(models.Model):
    vendor = models.ForeignKey(Vendor, on_delete=models.CASCADE)
    user_by = models.ManyToManyField(User, blank=True)
    code = models.CharField(
        max_length=100, help_text='Coupon code', unique=True)
    discount = models.IntegerField(default=1)
    active = models.BooleanField(default=False)
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.code


class Tax(models.Model):
    country = models.CharField(max_length=100, help_text='Country of the user')
    rate = models.IntegerField(default=5, help_text='Tax rate')
    active = models.BooleanField(default=False)
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.country

    class Meta:
        verbose_name_plural = 'Taxes'
        ordering = ['country']
