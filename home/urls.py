from django.urls import path
from .views import(
    welcome,
    dashboard,
    CreateView,
    post_detail,
    delete_post,
)

urlpatterns = [
    path('', welcome, name='welcome'),
    path('dashboard/', dashboard, name='dashboard'),

    #CRUD

    path('create/', CreateView.as_view(), name='create'),
    path('post/<int:pk>/', post_detail, name='post_detail'),
    path('delete/<int:pk>/', delete_post, name='delete_post'),
]