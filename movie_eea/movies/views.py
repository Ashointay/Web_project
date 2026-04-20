from rest_framework import viewsets, generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Movie, Review, Subscription
from .serializers import MovieSerializer, ReviewSerializer
from .ai_logic import find_movie_by_description

# 1. Список всех фильмов по подписке
class MovieListView(generics.ListAPIView):
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        sub = Subscription.objects.filter(user=self.request.user, is_active=True).exists()
        if not sub:
            return Movie.objects.none()
        return super().get_queryset()

# 2. Детальная информация о фильме (для плеера)
class MovieDetailView(generics.RetrieveAPIView):
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer
    permission_classes = [IsAuthenticated]

# 3. CRUD для отзывов
class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

# 4. ИИ поиск
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def ai_search_view(request):
    query = request.data.get('query', '')
    movie = find_movie_by_description(query)
    if movie:
        return Response(MovieSerializer(movie).data)
    return Response({"error": "Ничего не найдено"}, status=404)

# 5. Статус подписки
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def check_subscription(request):
    sub = Subscription.objects.filter(user=request.user, is_active=True).exists()
    return Response({"is_active": sub})