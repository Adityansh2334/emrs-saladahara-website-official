import {Component, HostListener, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {NavigationEnd, Router, RouterOutlet} from '@angular/router';
import {NavbarComponent} from './components/navbar/navbar.component';
import {FooterComponent} from './components/footer/footer.component';
import {TopBarComponent} from './components/top-bar/top-bar.component';
import {MainBarComponent} from './components/main-bar/main-bar.component';
import {ImageScrollerComponent} from './components/image-scroller/image-scroller.component';
import {isPlatformBrowser, NgIf} from '@angular/common';
import {filter} from 'rxjs/operators';
import {AboutSectionComponent} from './components/about-section/about-section.component';
import {NotificationBoardComponent} from './components/notification-board/notification-board.component';
import {AboveFooterComponent} from './components/above-footer/above-footer.component';
import {AchievementGlanceComponent} from './components/achievement-glance/achievement-glance.component';
import {FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import {LoaderComponent} from './components/loader/loader.component'; // Import FontAwesome icons
import { AppInitService } from './services/app-init.service';
import {ToastComponent} from './admin/shared/toast/toast.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, FooterComponent, TopBarComponent, MainBarComponent,
    ImageScrollerComponent, NgIf, AboutSectionComponent, NotificationBoardComponent,
    AboveFooterComponent, AchievementGlanceComponent, FaIconComponent, LoaderComponent, ToastComponent],
  templateUrl: './app.component.html',
  standalone: true,
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  showLayout = true;
  // existing properties...
  isLoading = true;
  title = 'emrs-saladahara-website';
  isHomePage: boolean | undefined;
  showScrollArrows: false | boolean | undefined = false;
  atBottom = false;

  faArrowUp = faArrowUp;  // Assign the scroll up icon
  faArrowDown = faArrowDown; // Assign the scroll down icon

  constructor(private appInitService: AppInitService, private router: Router, @Inject(PLATFORM_ID) private platformId: Object) {
    // Track if the user is on the Home page
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.isHomePage = event.urlAfterRedirects === '/' || event.url === '/';
        // Hide layout for any /admin/** routes (except /admin/login optionally)
        const url = (event as NavigationEnd).urlAfterRedirects;
        this.showLayout = !url.startsWith('/admin');
        // Scroll to top when navigating to any page, only in the browser
        if (isPlatformBrowser(this.platformId)) {
          window.scrollTo(0, 0);
        }
      });
  }

  ngOnInit(): void {
    this.appInitService.initApp().then(() => {
      this.isLoading = false;
    });

    // Optional: scroll to top on navigation
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        if (isPlatformBrowser(this.platformId)) {
          window.scrollTo(0, 0);
        }
      });
  }

  // Listen for the arrow keys (up and down) to scroll the page
  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    // Allow scroll up and down only on the Home page and in the browser
    if (this.isHomePage && isPlatformBrowser(this.platformId)) {
      if (event.key === 'ArrowUp') {
        window.scrollBy(0, -100); // Scroll up by 100px
      } else if (event.key === 'ArrowDown') {
        window.scrollBy(0, 100); // Scroll down by 100px
      }
    }
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    if (isPlatformBrowser(this.platformId)) {
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;

      this.showScrollArrows = scrollTop > 700 && this.isHomePage;
      this.atBottom = scrollTop + clientHeight >= scrollHeight - 50;
    }
  }

  scrollToTop(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  scrollToBottom(): void {
    if (isPlatformBrowser(this.platformId)) {
      const scrollHeight = document.documentElement.scrollHeight;
      window.scrollTo({ top: scrollHeight, behavior: 'smooth' });
    }
  }
}
