import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MovieService } from '../../services/movie.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-movie-detail',
  templateUrl: './movie-detail.component.html',
  standalone: false
})
export class MovieDetailComponent implements OnInit, OnDestroy {
  movie: any = null;
  isLoading: boolean = true;
  private routeSub: Subscription | null = null;
  private retryCount: number = 0;

  constructor(
    private route: ActivatedRoute, 
    private movieService: MovieService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.loadMovie(+params['id']);
    });
  }

  loadMovie(id: number) {
    this.isLoading = true; // Включаем спиннер
    this.movie = null;
    this.retryCount = 0;

    this.movieService.getMovie(id).subscribe({
      next: (data) => {
        console.log('✅ Данные от Django получены:', data);
        this.movie = data;
        
        // КРИТИЧЕСКИ ВАЖНО: Сначала выключаем загрузку, чтобы показать баннер!
        this.isLoading = false; 
        this.cdr.detectChanges(); // Принудительно обновляем экран

        // Плеер пробуем запустить отдельно
        if (data.video_url) {
          setTimeout(() => this.initKinobox(data.video_url), 500);
        }
      },
      error: (err) => {
        console.error('❌ Ошибка API:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  initKinobox(tmdbId: string) {
    const kbox = (window as any).kbox || (window as any).Kinobox;
    const container = document.querySelector('.kinobox_player');

    if (container && typeof kbox !== 'undefined') {
      container.innerHTML = '';
      kbox(container, {
        search: { tmdb: tmdbId.toString().trim() },
        menu: { default: 'menuList' }
      });
      console.log('🎬 Плеер запущен');
    } else {
      this.retryCount++;
      // Ограничиваем количество попыток, чтобы не вешать страницу
      if (this.retryCount < 5) {
        console.warn(`Попытка ${this.retryCount}: ждем контейнер/скрипт...`);
        setTimeout(() => this.initKinobox(tmdbId), 1000);
      } else {
        console.error('Библиотека Kinobox не найдена. Проверьте index.html');
      }
    }
  }

  ngOnDestroy() {
    if (this.routeSub) this.routeSub.unsubscribe();
  }
}