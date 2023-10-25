import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  faBell,
  faInfoCircle,
  faClose,
  faAngleDown
} from '@fortawesome/free-solid-svg-icons';
import { User } from '@models/users.model';
import { AuthService } from '@services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
})
export class NavbarComponent implements OnInit{

  user:  User | null = null

  faBell = faBell;
  faInfoCircle = faInfoCircle;
  faClose = faClose;
  faAngleDown = faAngleDown;

  isOpenOverlayAvatar = false;
  isOpenOverlayBoards = false;

  constructor(private authSvc: AuthService,
    private router: Router) { }

  ngOnInit(): void {
    this.authSvc.profile()
    .subscribe({
      next: (user) => {
        this.user = user
      },
      error: (error) => {
        console.log(error)
      }
    })
  }

  logout() {
    this.authSvc.logout()
    this.router.navigate(['/login'])
  }
}
