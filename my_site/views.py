#my_site/views.py
from django.http import HttpResponse
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from my_site.functions.functions import handle_uploaded_file 

def home_page_view(request):
    return HttpResponse('Hello World')

@login_required
def home_page_view_with_render(request):
    if(request.POST):
        return render(request, "form_page.html",{"value1":"Valeur envoyé depuis views.py"});
    return render(request, "home_page.html")

def carte(request):
    return render(request, "carte.html")

def form(request):
    if request.method == "POST":
        print(request.POST)
        alpha = request.POST["data"]
        print(alpha)
    return render(request, "form_page.html",{"value1":"Valeur envoyé depuis views.py"})


    