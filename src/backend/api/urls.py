
from django.urls import path
from .views import CustomTokenRefreshView, add_element, create_grid, delete_element, delete_grid, get_grid_detail, get_user_grids,login_view, logout_view,register_view, update_element, update_grid

urlpatterns = [
    path('login/', login_view,name='login'),
    path('register/', register_view,name='register'),
    path('logout/', logout_view,name='logout'),
    path('token/refresh/', CustomTokenRefreshView.as_view(), name='token_refresh'),
    path('grids/create/', create_grid, name='create_grid'),
    path('grids/<int:pk>/delete/',delete_grid, name='delete_grid'),
    path('grids/<int:grid_id>/elements/add/', add_element, name='add-element'),
    path('grids/<int:pk>/', get_grid_detail, name='get_grid_detail'),
    path('grids/', get_user_grids, name='get_user_grids'),
    path('elements/<int:pk>/delete/', delete_element, name='delete_element'),
    path('elements/<int:pk>/update/', update_element, name='update_element'),
    path('grids/<int:pk>/update/', update_grid, name='update_grid'),
]