import { Component, OnInit } from '@angular/core';

import { AuthService } from '@app/core/services/auth.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.authService.signOut();
  }

}
