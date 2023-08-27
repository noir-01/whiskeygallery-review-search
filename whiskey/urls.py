"""
URL configuration for whiskey project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from main import views
from django.conf.urls.static import static

from pathlib import Path
import os
app_name = 'main'

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent
STATIC_URL = 'static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
STATICFILES_DIR = [
    os.path.join(str(BASE_DIR.joinpath('static')),)
]

urlpatterns = [
    #path('admin/', admin.site.urls),
    #path('', views.post_view),
    #path('other/', views.post_view),
    path('other/search/', views.search),
    path('search/', views.search),

]+ static(STATIC_URL, document_root=STATIC_ROOT)
