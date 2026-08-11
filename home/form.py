from django import forms
from .models import CreatePost

class FormCreatePost(forms.ModelForm):
    class Meta:
        model = CreatePost
        fields = ['media', 'description']
        widgets = {
            'media': forms.ClearableFileInput(
                attrs={
                    'accept': 'image/*,video/*',
                }
            ),
            'description': forms.Textarea(
                attrs={
                    'placeholder': 'Write something worth sharing...',
                    'rows': 8,
                    'maxlength': 1000,
                }
            ),
        }