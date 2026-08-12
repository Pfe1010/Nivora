from django import forms

from .models import CreatePost


class FormCreatePost(forms.ModelForm):

    class Meta:
        model = CreatePost

        fields = [
            'media',
            'description',
        ]

        widgets = {
            'media': forms.ClearableFileInput(
                attrs={
                    'accept': (
                        'image/jpeg,'
                        'image/png,'
                        'image/webp,'
                        'video/mp4,'
                        'video/webm'
                    ),
                }
            ),
        }


    def clean_media(self):

        media = self.cleaned_data.get('media')

        if not media:
            return media


        allowed_content_types = {
            'image/jpeg',
            'image/png',
            'image/webp',
            'video/mp4',
            'video/webm',
        }


        if media.content_type not in allowed_content_types:

            raise forms.ValidationError(
                'Only JPG, PNG, WEBP, MP4 and WEBM files are allowed.'
            )


        allowed_extensions = {
            '.jpg',
            '.jpeg',
            '.png',
            '.webp',
            '.mp4',
            '.webm',
        }


        file_name = media.name.lower()

        extension = '.' + file_name.split('.')[-1]


        if extension not in allowed_extensions:

            raise forms.ValidationError(
                'Only JPG, PNG, WEBP, MP4 and WEBM files are allowed.'
            )


        return media