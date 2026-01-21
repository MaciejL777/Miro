from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view,permission_classes
from rest_framework.permissions import AllowAny
from rest_framework import status
from django.contrib.auth import authenticate, login
from .serializers import RegisterSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from django.conf import settings
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.views import TokenRefreshView
from .serializers import GridSerializer, BoardElementSerializer,GridDetailSerializer,GridListSerializer
from .models import Grid,BoardElement
import json
# python manage.py runserver - do uruchomienia backendu

# Create your views here.


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')

    user = authenticate(username=username, password=password)

    if user is not None:
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        refresh_token = str(refresh)

        response = Response({
            "message": "Zalogowano pomyślnie",
            "username": user.username
        })

        response.set_cookie(
            key='access_token',
            value=access_token,
            httponly=True,  
            secure=True,    
            samesite='None',
            max_age=3600     # 1 godzina
        )
        response.set_cookie(
            key='refresh_token',
            value=refresh_token,
            httponly=True,
            secure=True,
            samesite='None',
            max_age=86400    # 24 godziny
        )

        return response
    
    return Response({"error": "Błędne dane"}, status=401)
@api_view(['POST'])
@permission_classes([AllowAny]) 
def register_view(request):
    serializer = RegisterSerializer(data=request.data)
    
    if serializer.is_valid():
        serializer.save() 
        return Response({
            "message": "Użytkownik został stworzony pomyślnie!"
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
@api_view(['POST'])
@permission_classes([AllowAny]) 
def logout_view(request):
    response = Response({"message": "Wylogowano pomyślnie"})
 
    cookies_to_delete = ['access_token', 'refresh_token']
    
    for cookie in cookies_to_delete:
        response.delete_cookie(
            cookie,
            path='/',          
            domain=None,        
            samesite='None',

        )
        
        response.set_cookie(
            cookie, 
            value='', 
            max_age=0, 
            expires='Thu, 01 Jan 1970 00:00:00 GMT',
            path='/',
            samesite='None',
            httponly=True
        )
    
    return response
class CustomTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get('refresh_token')
        
        if not refresh_token:
            return Response({"error": "No refresh token"}, status=status.HTTP_401_UNAUTHORIZED)
        
        request.data['refresh'] = refresh_token
        
        try:
            response = super().post(request, *args, **kwargs)
            
            if response.status_code == 200:
                access_token = response.data.get('access')
                response.set_cookie(
                    'access_token',
                    access_token,
                    httponly=True,
                    samesite='None', 
                    secure=True, 
                    path='/',
                )
                response.data = {"message": "Token refreshed"}
                
            return response
        except Exception:
            return Response({"error": "Invalid refresh token"}, status=status.HTTP_401_UNAUTHORIZED)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_grid(request):
    serializer = GridSerializer(data=request.data)
    
    if serializer.is_valid():
        serializer.save(owner=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_grid(request, pk):
    try:
        grid = Grid.objects.get(pk=pk, owner=request.user)
    except Grid.DoesNotExist:
        return Response(
            {"detail": "Nie znaleziono grida lub nie masz uprawnień do jego usunięcia."}, 
            status=status.HTTP_404_NOT_FOUND
        )
    grid.delete()
    
    return Response(
        {"message": "Grid oraz wszystkie jego elementy zostały usunięte."}, 
        status=status.HTTP_204_NO_CONTENT
    )
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_element(request, grid_id):
    try:
        grid = Grid.objects.get(id=grid_id, owner=request.user)
    except Grid.DoesNotExist:
        return Response(
            {"detail": "Nie znaleziono tablicy lub nie masz do niej dostępu."},
            status=status.HTTP_404_NOT_FOUND
        )

    data = request.data.copy()
    data['board'] = grid.id

    serializer = BoardElementSerializer(data=data)
    
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_grid_detail(request, pk):
    try:
        grid = Grid.objects.prefetch_related('elements').get(pk=pk, owner=request.user)
    except Grid.DoesNotExist:
        return Response(
            {"detail": "Nie znaleziono tablicy lub brak dostępu."},
            status=status.HTTP_404_NOT_FOUND
        )

    serializer = GridDetailSerializer(grid)
    return Response(serializer.data)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_grids(request):
    grids = Grid.objects.filter(owner=request.user).order_by('-created_at')
    serializer = GridListSerializer(grids, many=True)
    return Response(serializer.data)
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_element(request, pk):
    try:
        element = BoardElement.objects.get(pk=pk, board__owner=request.user)
    except BoardElement.DoesNotExist:
        return Response(
            {"detail": "Nie znaleziono elementu lub nie masz uprawnień."},
            status=status.HTTP_404_NOT_FOUND
        )

    element.delete()
    return Response(
        {"message": "Element został usunięty."}, 
        status=status.HTTP_204_NO_CONTENT
    )
@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_element(request, pk):
    try:
        element = BoardElement.objects.get(pk=pk, board__owner=request.user)
    except BoardElement.DoesNotExist:
        return Response({"detail": "Nie znaleziono elementu."}, status=status.HTTP_404_NOT_FOUND)

    serializer = BoardElementSerializer(element, data=request.data, partial=True)
    
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_grid(request, pk):
    try:
        grid = Grid.objects.get(pk=pk, owner=request.user)
    except Grid.DoesNotExist:
        return Response(
            {"detail": "Nie znaleziono tablicy lub brak uprawnień."}, 
            status=status.HTTP_404_NOT_FOUND
        )
    serializer = GridListSerializer(grid, data=request.data, partial=True)
    
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)