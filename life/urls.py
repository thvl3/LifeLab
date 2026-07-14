from django.urls import path

from . import views


urlpatterns = [
    path("", views.simulator, name="simulator"),
    path("library/", views.library, name="library"),
    path("pattern/<int:pk>/", views.pattern_detail, name="pattern_detail"),
]
