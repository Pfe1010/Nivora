from django.shortcuts import render, redirect, get_object_or_404
from .models import CreatePost, Comments
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views import View
from .form import FormCreatePost

def welcome(request):
    if request.method == 'GET':
        return render(request, 'welcome.html')

@login_required
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

@login_required
def post_detail(request, pk):
    post = get_object_or_404(CreatePost, pk=pk, author=request.user)
    return render(request, 'post_detail.html', {'post':post})

@login_required
def delete_post(request, pk):
    post = get_object_or_404(CreatePost, pk=pk, author=request.user)
    if request.method == 'POST':
        post.delete()
        return redirect('dashboard')
        
    return render(request, 'post_delete.html', {'post':post})

@login_required
def explore(request):
    posts = CreatePost.objects.exclude(author=request.user)
    return render(request, 'explore.html', {'posts':posts})

@login_required
def post_detail_explore(request, pk):
    post = get_object_or_404(CreatePost, pk=pk)
    post_comments = (post.comments.select_related('user').order_by('-created'))
    return render(request, 'post_detail_explore.html', {'post': post, 'post_comments': post_comments,})

@login_required
def post_comments(request, pk):
    post = get_object_or_404(CreatePost, pk=pk)
    if request.method == "POST":
        content = request.POST.get("content", "", ).strip()
        parent_id = request.POST.get("parent_id")
        if content:
            parent = None
            if parent_id:
                parent = get_object_or_404(Comments, pk=parent_id, post=post)

            Comments.objects.create(user=request.user, post=post, parent=parent, content=content)
        return redirect("post_comments", pk=post.pk)
        
    post_comments = (Comments.objects.filter(post=post, parent__isnull=True).select_related("user").prefetch_related("replies__user")).order_by("-created")
    return render(request, "comments.html", {"post": post, "post_comments": post_comments})