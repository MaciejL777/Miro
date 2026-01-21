from django.contrib.auth.hashers import check_password, make_password
from django.db import models
from django.contrib.auth.models import User



# Jakby jednak uzytkownik miał miec weicej Siatek
class Grid(models.Model):
    name = models.CharField(max_length=255)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="boards")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

#Na elementy
class BoardElement(models.Model):
    board = models.ForeignKey(Grid, on_delete=models.CASCADE, related_name="elements")
    
    element_type = models.CharField(max_length=50)
    x = models.FloatField()
    y = models.FloatField()
    
    properties = models.JSONField(default=dict) 

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.element_type} on {self.board.name}"
    


