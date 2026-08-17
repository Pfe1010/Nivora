from django.contrib import admin
from .models import CreatePost, Comments, Likes

admin.site.register(CreatePost)
admin.site.register(Comments)
admin.site.register(Likes)