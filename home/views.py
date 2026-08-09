from django.shortcuts import render, redirect, get_object_or_404

def welcome(request):
    if request.method == 'GET':
        return render(request, 'welcome.html')