# Generated by Django 5.1 on 2024-08-29 13:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('store', '0013_cartorderitem_coupon'),
    ]

    operations = [
        migrations.AddField(
            model_name='cartorder',
            name='stripe_session_id',
            field=models.CharField(blank=True, max_length=1000, null=True),
        ),
    ]
