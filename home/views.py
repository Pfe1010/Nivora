from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views import View
from django.http import JsonResponse
from .models import CreatePost, Comments, Likes, SavedPost, Profile
from .form import FormCreatePost
from django.views.decorators.http import require_POST
from django.contrib import messages
from django.contrib.auth import get_user_model

User = get_user_model()

def welcome(request):
    return render(request, "welcome.html")

@login_required
def dashboard(request):
    posts = CreatePost.objects.filter(author=request.user).order_by("-created")
    return render(request, "dashboard.html", {"posts": posts})
        
class CreateView(LoginRequiredMixin, View):
    def get(self, request):
        form = FormCreatePost()
        return render(request, "create.html", {"form": form})
            
    def post(self, request):
        form = FormCreatePost(request.POST, request.FILES)
        if form.is_valid():
            post = form.save(commit=False)
            post.author = request.user
            post.save()
            return redirect("dashboard")

        return render(request, "create.html", {"form": form})
            
@login_required
def post_detail(request, pk):
    post = get_object_or_404(CreatePost, pk=pk)
    liked_by_user = Likes.objects.filter(user=request.user, post=post).exists()
    like_count = Likes.objects.filter(post=post).count()
    comment_count = Comments.objects.filter(post=post).count()
    return render(request, "post_detail.html", {"post": post, "liked_by_user": liked_by_user, "like_count": like_count, "comment_count": comment_count, "source": "dashboard"})

@login_required
def delete_post(request, pk):
    post = get_object_or_404(CreatePost, pk=pk, author=request.user)
    if request.method == "POST":
        post.delete()
        return redirect("dashboard")

    return render(request, "post_delete.html", {"post": post})
    
@login_required
def explore(request):
    posts = CreatePost.objects.exclude(author=request.user).order_by("-created")
    return render(request, "explore.html", {"posts": posts})

@login_required
def post_detail_explore(request, pk):
    post = get_object_or_404(CreatePost, pk=pk)
    liked_by_user = Likes.objects.filter(user=request.user, post=post).exists()
    saved_by_user = SavedPost.objects.filter(user=request.user, post=post).exists()
    like_count = Likes.objects.filter(post=post).count()
    comment_count = Comments.objects.filter(post=post).count()
    return render(request, "post_detail_explore.html", {"post": post, "liked_by_user": liked_by_user, "saved_by_user": saved_by_user, "like_count": like_count, "comment_count": comment_count, "source": "explore"})

@login_required
def post_comments(request, pk):
    post = get_object_or_404(CreatePost, pk=pk)
    source = request.GET.get("from", request.POST.get("from", "dashboard"))
    if source not in ["dashboard", "explore"]:
        source = "dashboard"

    if request.method == "POST":
        content = request.POST.get("content", "").strip()
        parent_id = request.POST.get("parent_id")
        if content:
            parent = None
            if parent_id:
                parent = get_object_or_404(Comments, pk=parent_id, post=post)
            Comments.objects.create(user=request.user, post=post, parent=parent, content=content)
        return redirect(f"/post/{post.pk}/comments/?from={source}")
    comments = (Comments.objects.filter(post=post, parent__isnull=True).select_related("user").prefetch_related("replies", "replies__user", "replies__replies",
            "replies__replies__user"
        ).order_by("created"))
    comment_count = Comments.objects.filter(post=post).count()
    return render(request, "comments.html", {"post": post, "comments": comments, "comment_count": comment_count, "source": source,})
        
@login_required
def like_post(request, pk):
    post = get_object_or_404(CreatePost, pk=pk)
    if request.method != "POST":
        return JsonResponse({"error": "Invalid request method."}, status=405)

    like = Likes.objects.filter(user=request.user, post=post).first()
    if like:
        like.delete()
        liked = False
    else:
        Likes.objects.create(user=request.user, post=post)
        liked = True

    like_count = Likes.objects.filter(post=post).count()
    return JsonResponse({"liked": liked, "count": like_count})

@login_required
def saved_posts(request):
    saved = (SavedPost.objects.filter(user=request.user).select_related("post", "post__author").order_by("-created"))
    return render(request, "saved_posts.html", {"saved_items": saved})

@login_required
@require_POST
def toggle_save(request, post_id):
    post = get_object_or_404(CreatePost, pk=post_id)
    saved_post = SavedPost.objects.filter(user=request.user, post=post).first()
    if saved_post:
        saved_post.delete()
        saved = False
    else:
        SavedPost.objects.create(user=request.user, post=post)
        saved = True
        
    return JsonResponse({"saved": saved})

@login_required
def profile_view(request):
    profile, _ = Profile.objects.get_or_create(user=request.user)
    if request.method == "POST":
        new_username = request.POST.get("username", "").strip()
        avatar = request.FILES.get("avatar")
        if new_username and new_username != request.user.username:
            is_taken = (User.objects.filter(username__iexact=new_username).exclude(pk=request.user.pk).exists())
            if is_taken:
                messages.error(request, "This username is already taken.", extra_tags="profile-update")
                return redirect("profile")
 
            request.user.username = new_username
            request.user.save(update_fields=["username"])

        if avatar:
            profile.avatar = avatar
            profile.save(update_fields=["avatar"])
 
        messages.success(request, "Your profile updated successfully", extra_tags="profile-update")
        return redirect("profile")
 
    return render(request, "profile.html", {"profile": profile})
 
 
@login_required
def check_username(request):
    """
    AJAX endpoint: /profile/check-username/?username=xyz
    برای بررسی realtime یونیک بودن یوزرنیم قبل از ثبت فرم
    """
 
    username = request.GET.get("username", "").strip()
    if not username:
        return JsonResponse({"available": False, "reason": "empty"})
    if username == request.user.username:
        return JsonResponse({"available": True, "reason": "current"})
 
    is_taken = (User.objects.filter(username__iexact=username).exclude(pk=request.user.pk).exists())
    return JsonResponse({"available": not is_taken})