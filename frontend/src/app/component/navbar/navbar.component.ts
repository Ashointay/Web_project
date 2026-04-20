import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MovieService } from '../../services/movie.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  standalone: false
})
export class NavbarComponent {
  searchQuery: string = "";
  
  // ВОТ ЭТОЙ СТРОЧКИ НЕ ХВАТАЛО:
  isSearching: boolean = false; 

  constructor(
    private movieService: MovieService, 
    private authService: AuthService,
    private router: Router
  ) {}

  onAiSearch() {
    if (this.searchQuery.length < 5) return;
    
    this.isSearching = true; // Теперь ошибка исчезнет

    this.movieService.aiSearch(this.searchQuery).subscribe({
      next: (movie: any) => {
        this.isSearching = false;
        this.router.navigate(['/movie', movie.id]);
        this.searchQuery = "";
      },
      error: () => {
        this.isSearching = false;
        alert("Ничего не нашли, попробуй описать по-другому");
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
