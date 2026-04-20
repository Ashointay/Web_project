import { Component, OnInit } from '@angular/core';
import { MovieService } from '../../services/movie.service';

@Component({
  selector: 'app-movie-list',
  templateUrl: './movie-list.component.html',
  standalone: false
})
export class MovieListComponent implements OnInit {
  movies: any[] = [];
  filteredMovies: any[] = [];
  
  // Обновил жанры на русские, так как TMDB теперь отдает их на русском
  genres: string[] = ['Боевик', 'Комедия', 'Драма', 'Фантастика', 'Мультфильм', 'Ужасы'];

  constructor(private movieService: MovieService) {}

  ngOnInit() {
    this.loadMovies();
  }

  // Вынес в отдельный метод, чтобы можно было вызывать при обновлении
  loadMovies() {
    this.movieService.getMovies().subscribe({
      next: (data) => {
        this.movies = data;
        this.filteredMovies = data;
      },
      error: (err) => {
        console.error('Не удалось загрузить фильмы', err);
        alert('Убедитесь, что у вас активна подписка в админке!');
      }
    });
  }

  // Оставил только ОДНУ версию метода
  filterGenre(genre: string) {
    if (genre === 'All') {
      this.filteredMovies = this.movies;
    } else {
      // Очищаем пробелы и приводим к нижнему регистру для надежности
      this.filteredMovies = this.movies.filter(m => 
        m.genre_name && m.genre_name.trim().toLowerCase() === genre.trim().toLowerCase()
      );
    }
  }

  // Сброс при клике на "Главная"
  onHomeClick() {
    this.filteredMovies = this.movies;
  }
}