from .models import BoardElement, Grid
from django.contrib.auth.models import User
from rest_framework import serializers

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('username', 'password', 'email')

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password']
        )
        return user

class BoardElementSerializer(serializers.ModelSerializer):
    class Meta:
        model = BoardElement
        fields = ['id', 'board', 'element_type', 'x', 'y', 'properties', 'updated_at']
class GridDetailSerializer(serializers.ModelSerializer):
    elements = BoardElementSerializer(many=True, read_only=True)
    class Meta:
        model = Grid
        fields = ['id', 'name', 'created_at', 'owner', 'elements']
        read_only_fields = ['owner']
class GridSerializer(serializers.ModelSerializer):
    class Meta:
        model = Grid
        fields = ['id', 'name', 'created_at', 'owner']
        read_only_fields = ['owner']
class GridListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Grid
        fields = ['id', 'name', 'created_at']