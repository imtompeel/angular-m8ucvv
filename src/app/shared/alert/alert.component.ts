import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit {

  @Input()
  public type = 'success';

  @Input()
  public closeButton = false;

  @Input()
  public message = '';

  constructor() { }

  ngOnInit() {
  }

}
