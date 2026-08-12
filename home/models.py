from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class CreatePost(models.Model):
    media = models.FileField(upload_to='home/static/media/', max_length=255)
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    description = models.TextField(blank=True)
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.author} - {self.media}'