from django.shortcuts import render, redirect, get_object_or_404
from .models import CreatePost
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views import View
from .form import FormCreatePost

def welcome(request):
    if request.method == 'GET':
        return render(request, 'welcome.html')

def dashboard(request):
    if request.method == 'GET':
        posts = CreatePost.objects.filter(author=request.user).order_by('-created')
        return render(request, 'dashboard.html', {'posts':posts})

class CreateView(LoginRequiredMixin, View):
    def post(self, request):
        form = FormCreatePost(request.POST, request.FILES)
        if form.is_valid():
            post = form.save(commit=False)
            post.author = request.user
            post.save()
            return redirect('dashboard')
        return render(request, 'create.html', {'form':form})

    def get(self, request):
        form = FormCreatePost()
        return render(request, 'create.html', {'form':form})