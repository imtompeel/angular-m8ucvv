import { Component, AfterViewInit, ElementRef } from '@angular/core';

import * as echarts from 'echarts';

@Component({
  selector: 'app-chart-top-class',
  template: '<ng-container></ng-container>',
  styleUrls: ['./chart-top-class.component.scss']
})
export class ChartTopClassComponent implements AfterViewInit {

  private chart;

  constructor(
    private chartElement: ElementRef
  ) { }

  ngAfterViewInit() {
    /*
    this.chart = echarts.init(this.chartElement.nativeElement);
    this.chart.setOption(this.setChartOptions());
    */
  }

  private setChartOptions() {
    return {
      color: ['#4C83FF', '#9452A5', '#49C628'],
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      legend: {
        x: 'center',
        data: ['paas', 'cpo group', 'ploiy ji']
      },
      series: [{
        type: 'pie',
        radius: ['50%', '70%'],
        center: ['50%', '60%'],
        label: {
          normal: {
            show: false,
            position: 'center'
          },
          emphasis: {
            show: true,
            textStyle: {
              fontSize: '14',
            }
          }
        },
        labelLine: {
          normal: {
            show: false
          }
        },
        data: [
          { value: 335, name: 'paas' },
          { value: 310, name: 'cpo group' },
          { value: 135, name: 'ploiy ji' }
        ]
      }]
    };
  }

}
