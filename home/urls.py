from django.urls import path
from .views import(
    welcome,
    dashboard,
    CreateView,
    post_detail,
    delete_post,
    explore,
    post_detail_explore,
    post_comments,
    like_post,
    save_post,
)

urlpatterns = [
    path('', welcome, name='welcome'),
    path('dashboard/', dashboard, name='dashboard'),

    #CRUD
    path('create/', CreateView.as_view(), name='create'),
    path('post/<int:pk>/', post_detail, name='post_detail'),
    path('delete/<int:pk>/', delete_post, name='delete_post'),

    #Explore
    path('explore/', explore, name='explore'),
    path('post_detail_explore/<int:pk>/', post_detail_explore, name='post_detail_explore'),

    #Comment
    path('post/<int:pk>/comments/', post_comments, name='post_comments'),

    #Like
    path('post/<int:pk>/like/', like_post, name='like_post'),

    #Save
    path('post/<int:pk>/save/', save_post, name='save_post'),
]