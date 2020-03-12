import { Component, OnInit } from '@angular/core';
import { UserService } from '@app/core/services/user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  /**
   * Array of users 
   */
  public users: Array<any> = [];

  constructor(
    private userService: UserService
  ) { }

  ngOnInit() {
    this.userService
      .loadUsers()
      .snapshotChanges(['child_added', 'child_changed', 'child_removed'])
      .subscribe(actions => {
        this.users = []
        actions.forEach(action => {
          let user = action.payload.val() as any
          user['key'] = action.key
          this.users.push(user);
        })
      });
  }

}
