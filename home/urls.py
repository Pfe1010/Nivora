from django.urls import path
from .views import(
    welcome,
    dashboard,
    CreateView,
)

urlpatterns = [
    path('', welcome, name='welcome'),
    path('dashboard/', dashboard, name='dashboard'),

    #CRUD

    path('create/', CreateView.as_view(), name='create'),
]