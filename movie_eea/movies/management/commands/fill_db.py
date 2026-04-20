import requests
import time
from django.core.management.base import BaseCommand
from movies.models import Movie, Genre

class Command(BaseCommand):
    def handle(self, *args, **kwargs):
        api_key = "f27a622107025b468f08a4ead0cb0695"
        img_base = "https://image.tmdb.org/t/p/w500"

        Movie.objects.all().delete()
        Genre.objects.all().delete()

        genre_url = f"https://api.themoviedb.org/3/genre/movie/list?api_key={api_key}&language=ru-RU"
        genre_map = {g['id']: g['name'] for g in requests.get(genre_url).json().get('genres', [])}

        for page in range(1, 4): # Загрузим 60 фильмов для скорости
            url = f"https://api.themoviedb.org/3/movie/popular?api_key={api_key}&language=ru-RU&page={page}"
            res = requests.get(url).json().get('results', [])
            
            for item in res:
                g_id = item.get('genre_ids', [0])[0]
                genre_obj, _ = Genre.objects.get_or_create(name=genre_map.get(g_id, "Кино"))
                
                # Сохраняем ТОЛЬКО ID фильма в video_url, фронт сделает остальное
                Movie.objects.create(
                    title=item.get('title'),
                    description=item.get('overview'),
                    genre=genre_obj,
                    year=int(item['release_date'][:4]) if item.get('release_date') else 2026,
                    poster_url=f"{img_base}{item['poster_path']}",
                    video_url=str(item.get('id')) # Это теперь TMDB ID
                )
            print(f"Page {page} loaded")