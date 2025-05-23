// admin-layout.component.ts
import {Component, OnInit} from '@angular/core';
import {Router, RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import { faHome, faBullhorn, faImages, faSignOutAlt, faContactBook, faPeopleGroup } from '@fortawesome/free-solid-svg-icons';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {AuthService} from '../../admin/services/auth.service';
import {InactivityService} from '../../admin/services/inactivity.service';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    FaIconComponent
  ],
  styleUrls: ['./admin-layout.component.scss']
})
export class AdminLayoutComponent  implements OnInit{
  faHome = faHome;
  faBullhorn = faBullhorn;
  faImages = faImages;
  faSignOutAlt = faSignOutAlt;
  faContactBook = faContactBook;
  faPeopleGroup = faPeopleGroup

  constructor(private router: Router, private authService: AuthService, private inactivityService: InactivityService) {}


  logout() {
    this.authService.logout();
    this.router.navigate(['/admin/login']);
  }

  ngOnInit(): void {
    console.log('AdminLayoutComponent initialized');
    // this.inactivityService.startWatching();
  }
}
