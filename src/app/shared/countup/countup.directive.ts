import { Directive, ElementRef, Input, HostListener, AfterViewInit } from '@angular/core';
import * as CountUp from 'countup.js';

@Directive({
  selector: '[appCountup]'
})
export class CountupDirective implements AfterViewInit {

  public countup: any;
  private _endVal: number;

  @Input()
  options: any;

  @Input()
  startVal: number;

  get endVal(): number {
    return this._endVal;
  }

  @Input()
  set endVal(value: number) {

    this._endVal = value;

    if (isNaN(value)) {
      return;
    }

    if (!this.countup) {
      return;
    }

    this.countup.update(value);
  }

  @Input()
  duration: number;

  @Input()
  decimals: number;

  @Input()
  reanimateOnClick: boolean;

  ngAfterViewInit() {
    this.countup = this.createCountUp(this.startVal, this.endVal, this.decimals, this.duration);
    this.animate();
  }

  @HostListener('click')
  onClick() {
    if (this.reanimateOnClick) {
      this.animate();
    }
  }

  constructor(
    private el: ElementRef
  ) {}

  private createCountUp(sta, end, dec, dur) {
    sta = sta || 0;

    if (isNaN(sta)) {
      sta = Number(sta.match(/[\d\-\.]+/g).join(''));
    }

    end = end || 0;

    if (isNaN(end)) {
      end = Number(end.match(/[\d\-\.]+/g).join(''));
    }

    dur = Number(dur) || 2;
    dec = Number(dec) || 0;

    let countUp = new CountUp(this.el.nativeElement, sta, end, dec, dur, this.options);
    const diff = Math.abs(end - sta);

    if (diff > 999) {
      const up = (end > sta) ? -1 : 1;
      countUp = new CountUp(this.el.nativeElement, sta, end + (up * 100), dec, dur / 2, this.options);
    }

    return countUp;
  }

  private animate() {
    this.countup.reset();

    if (this.endVal > 999) {
      this.countup.start(() => this.countup.update(this.endVal));
    } else {
      this.countup.start();
    }
  }
}
