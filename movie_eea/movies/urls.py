from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MovieListView, MovieDetailView, ReviewViewSet, ai_search_view, check_subscription

router = DefaultRouter()
router.register(r'reviews', ReviewViewSet)

urlpatterns = [
    path('movies/', MovieListView.as_view()),
    path('movies/<int:pk>/', MovieDetailView.as_view()),
    path('ai-search/', ai_search_view),
    path('sub-status/', check_subscription),
    path('', include(router.urls)),
]