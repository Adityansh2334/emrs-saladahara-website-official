import { Component } from '@angular/core';
import {NgClass, NgIf} from '@angular/common';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  standalone: true,
  imports: [
    NgIf,
    RouterLink,
    FaIconComponent,
    NgClass,
    RouterLinkActive
  ],
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  menuOpen = false;
  faBars = faBars;

  constructor(private router: Router) {}

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu() {
    this.menuOpen = false;
  }

  isActive(group: string): boolean {
    const url = this.router.url;
    if (group === 'home') return [ '/principal','/admission'].some(path => url.startsWith(path));
    if (group === 'academics') return ['/curriculum', '/exams', '/calendar', '/resources', '/faculty'].some(path => url.startsWith(path));
    if (group === 'activities') return ['/hall-of-administration', '/sports-fitness', '/science', '/parent'].some(path => url.startsWith(path));
    return false;
  }
}
