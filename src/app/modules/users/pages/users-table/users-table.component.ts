import { Component, OnInit } from '@angular/core';

import { DataSourceUser } from './data-source';
import { UsersService } from '@services/users.service';
import { User } from '@models/users.model';
import { AuthService } from '@services/auth.service';

@Component({
  selector: 'app-users-table',
  templateUrl: './users-table.component.html'
})
export class UsersTableComponent implements OnInit {

  //user: User | null = null
  user$ = this.authSvc.user$

  dataSource = new DataSourceUser();
  columns: string[] = ['id', 'avatar', 'name', 'email'];

  constructor(private usersSvc: UsersService,
    private authSvc: AuthService) { }

  ngOnInit(): void {
    this.usersSvc.getUsers()
      .subscribe({
        next: (users) => {
          this.dataSource.init(users)
        },
        error: (error) => {
          console.log(error)
        }
      })
    // this.authSvc.user$
    //   .subscribe(
    //     user => {
    //       this.user = user
    //     }
    //   )
  }

}
