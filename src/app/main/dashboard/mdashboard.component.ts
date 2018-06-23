import { Component, AfterViewInit, Injector, ViewEncapsulation, OnDestroy } from '@angular/core';
import { TenantDashboardServiceProxy, Select2ServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppSalesSummaryDatePeriod } from '@shared/AppEnums';
declare let d3, Datamap: any;
import * as _ from "lodash";
import * as moment from "moment";
import * as Highcharts from 'highcharts';
import * as Highcharts3d from 'highcharts/highcharts-3d';

Highcharts3d(Highcharts);

@Component({
    templateUrl: './mdashboard.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class MdashboardComponent extends AppComponentBase implements AfterViewInit, OnDestroy {

    appSalesSummaryDateInterval = AppSalesSummaryDatePeriod;
    selectedSalesSummaryDatePeriod: any = AppSalesSummaryDatePeriod.Daily;
    dashdateRangePickerStartDate: moment.Moment;
    dashdateRangePickerEndDate: moment.Moment;
    lsgoption: Object;
    D3option: Object;
    constructor(
        injector: Injector,
        private _dashboardService: TenantDashboardServiceProxy,
        private _select2Service: Select2ServiceProxy,
    ) {
        super(injector);
    }

    getDashboardStatisticsData(datePeriod): void {
        this._dashboardService
            .getDashboardData(datePeriod)
            .subscribe(result => {

            });
    };

    LeadSummary(): void {
        this._dashboardService
            .getSalesLeadSummary()
            .subscribe(result => {
                this.lsgoption = {
                    chart: {
                        type: 'column'
                    },
                    title: {
                        text: 'Sales Lead Performance'
                    },
                    xAxis: {
                        categories: result.catagries
                    },
                    yAxis: {
                        min: 0,
                        title: {
                            text: 'Total Leads'
                        }
                    },
                    tooltip: {
                        pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.percentage:.0f}%)<br/>',
                        shared: true
                    },
                    plotOptions: {
                        column: {
                            stacking: 'normal'
                        }
                    },
                    series: result.leadDevelop
                };
                
      });
    };

    Leadbreakdown():void{
        var scorelrp = []; 
        var colorlrp = [];

             
        this._dashboardService.getSalesLeadBreakdown()
        .subscribe((result) => {
            console.log(result);
            for (var i = 0; i < result.length; i++) {
                scorelrp.push([result[i].name, result[i].count]);
            }
            this.D3option = {
                chart: {
                    type: 'pie',
                    options3d: {
                        enabled: true,
                        alpha: 45
                    }
                },
                title: {
                    text: 'Lead Breakdown'
                },
                subtitle: {
                    text: 'Number Of Inquires'
                },
                plotOptions: {
                    pie: {
                        innerSize: 100,
                        depth: 45
                    }
                },
                series: [{
                    name: 'Count', 
                    data: scorelrp
                }]
            };
         }); 
    }

    ngAfterViewInit(): void {
        this.getDashboardStatisticsData(AppSalesSummaryDatePeriod.Daily);
        this.LeadSummary();
        this.Leadbreakdown();
    }

    ngOnDestroy() {
    }
};

