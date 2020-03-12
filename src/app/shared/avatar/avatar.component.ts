import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss']
})
export class AvatarComponent implements OnInit {

  public cssClass: String = '';
  public colors: Array<String> = ['success', 'info', 'danger', 'warning', 'primary'];

  @Input()
  public data;

  @Input()
  public width = '2.8rem';

  @Input()
  public height = '2.8rem';

  @Input()
  public randomColor = false;

  @Input()
  public fontSize = 'inherit';

  constructor() { }

  ngOnInit() {
    if (this.randomColor) {
      this.cssClass = this.colors[Math.floor(Math.random() * this.colors.length)];
    } else {
      this.cssClass = 'gray';
    }
  }

}
