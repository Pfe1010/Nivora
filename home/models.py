from django.db import models
from django.contrib.auth import get_user_model
from django.conf import settings

User = get_user_model()

class CreatePost(models.Model):
    media = models.FileField(upload_to='home/static/media', max_length=255)
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    description = models.TextField(blank=True)
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.author} - {self.media}'

class Comments(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey(CreatePost, on_delete=models.CASCADE, related_name='comments')
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='replies')
    content = models.TextField(max_length=255)
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.user} - {self.post}'

class Likes(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey(CreatePost, on_delete=models.CASCADE, related_name='likes')
    created = models.DateTimeField(auto_now_add=True)
    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['user', 'post'],
                name='unique_user_post_like'
            )
        ]

    def __str__(self):
        return f'{self.user} - {self.post}'

class SavedPost(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="saved_posts")
    post = models.ForeignKey(CreatePost, on_delete=models.CASCADE, related_name="saved_by")
    created = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "post")
        ordering = ["-created"]

    def __str__(self):
        return f"{self.user.username} - {self.post_id}"