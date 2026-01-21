from django.contrib import admin
from .models import User, Grid, BoardElement

# Register your models here.
admin.site.register(Grid)
admin.site.register(BoardElement)
