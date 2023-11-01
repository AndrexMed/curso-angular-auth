import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  faBell,
  faInfoCircle,
  faClose,
  faAngleDown
} from '@fortawesome/free-solid-svg-icons';
import { Colors, NAVBAR_BACKGROUNDS } from '@models/color.model';
import { AuthService } from '@services/auth.service';
import { BoardsService } from '@services/boards.service';
import { TokenService } from '@services/token.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
})
export class NavbarComponent implements OnInit {

  //user:  User | null = null
  user$ = this.authSvc.user$

  faBell = faBell;
  faInfoCircle = faInfoCircle;
  faClose = faClose;
  faAngleDown = faAngleDown;

  isOpenOverlayAvatar = false;
  isOpenOverlayBoards = false;
  isOpenOverlayCreateBoard = false;

  navBarBackgroundColor: Colors = 'sky'
  navBarColors = NAVBAR_BACKGROUNDS

  constructor(private authSvc: AuthService,
    private router: Router,
    private tokenSvc: TokenService,
    private boardSvc: BoardsService) {

    this.boardSvc.backgroundColor$.subscribe(color => {
      this.navBarBackgroundColor = color
    })
  }

  ngOnInit(): void {
    // this.authSvc.profile()
    // .subscribe({
    //   next: (user) => {
    //     this.user = user
    //   },
    //   error: (error) => {
    //     console.log(error)
    //   }
    // })
  }

  logout() {
    this.authSvc.logout()
    this.router.navigate(['/login'])
  }

  isValidToken() {
    console.log(this.tokenSvc.isValidToken())
  }

  close(event: boolean) {
    this.isOpenOverlayCreateBoard = event
  }

  get colors() {
    const classes = this.navBarColors[this.navBarBackgroundColor]
    if (classes) {
      return classes ? classes : {}
    }
    return {}
  }
}
