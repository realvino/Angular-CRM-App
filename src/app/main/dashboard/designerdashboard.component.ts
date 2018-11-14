import { Component, AfterViewInit, Injector, ViewEncapsulation, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { TenantDashboardServiceProxy, RecentInquiryClosureList, RecentInquiryActivityList } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppSalesSummaryDatePeriod } from '@shared/AppEnums';
declare let d3, Datamap: any;
import * as _ from "lodash";
import {Subject} from 'rxjs/Subject';
import * as moment from "moment";
import { AppConsts } from '@shared/AppConsts';
import { Router } from '@angular/router';

@Component({
    templateUrl: './designerdashboard.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class DesignerDashboardComponent extends AppComponentBase implements AfterViewInit, OnDestroy {

    clsdata: number = 4;
    endata: number = 1;
    @ViewChild('DesignerDashDateRangePicker') sampleDateTimePicker: ElementRef;
    dashdateRangePickerStartDate: moment.Moment;
    dashdateRangePickerEndDate: moment.Moment;
    appSalesSummaryDateInterval = AppSalesSummaryDatePeriod;
    private destroy$ = new Subject();
    selectedSalesSummaryDatePeriod: any = AppSalesSummaryDatePeriod.Daily;
    dashboardHeaderStats: DashboardHeaderStats;
    memberActivityTable: MemberActivityTable;
    chart : any;
    lrgoption: Object;
    lsgoption: Object;
    conoption: Object;
    cardIndex:number = 0;
    teamIdselect: string;
    IsSales:boolean = false;
    SliderCount:number;
    dropdownSettings = {
        itemsShowLimit : 1,
        allowSearchFilter : false,
        enableCheckAll :false
    };
    path : string = AppConsts.remoteServiceBaseUrl;
    AllOutput = [];
    QuotOutput = [];
    WonOutput = [];
    LostOutput = [];
    Concersionratio:number = 0;

    @ViewChild('carousel')carousel:any;
    slides : Array<Object> = [];
    Closure : RecentInquiryClosureList = new RecentInquiryClosureList();
    Activity : RecentInquiryActivityList = new RecentInquiryActivityList();
    ActivityInput : string;
    options2 : Object = {
    clicking: true,
    sourceProp: 'src',
    visible: 7,
    perspective: 1  ,
    startSlide: 0,
    border: 2,
    dir: 'ltr',
    width: 350,
    height: 175,
    space: 210,
    autoRotationSpeed: 1000 * 60 * 60 * 24,
    loop: true
}

    constructor(
        injector: Injector,
        private _dashboardService: TenantDashboardServiceProxy,
        private router: Router
    ) {
        super(injector);
        this.dashdateRangePickerStartDate = moment().startOf('year');
        this.dashdateRangePickerEndDate = moment().endOf('day');
        this.dashboardHeaderStats = new DashboardHeaderStats();
        this.memberActivityTable = new MemberActivityTable(this._dashboardService);
    }
    reportClick(value):void{
        this.endata = value;
    }
    ClosureClick(value):void{
        this.clsdata = value;
    }
    slideClicked(index): void  {
        this.cardIndex = index;
        this.carousel.slideClicked(this.cardIndex);
        this.lostreasonpiegraph(this.slides[this.cardIndex]);
        this.leadsummaryfunnelgraph(this.slides[this.cardIndex]);
        this.Closuresoon(this.slides[this.cardIndex]);
        this.LastActivity(this.slides[this.cardIndex]);
    }
    /* getDashboardStatisticsData(datePeriod): void {
        this._dashboardService
            .getDashboardData(datePeriod)
            .subscribe(result => {
                this.dashboardHeaderStats.init(result.totalProfit, result.newFeedbacks, result.newOrders, result.newUsers);
      });
    }; */
    Closuresoon(data:any): void {
        
        this._dashboardService
            .getDesignerRecentClosure(data.id)
            .subscribe(result => {
                this.Closure = result;
      });
    };
    LastActivity(data:any): void {
        this._dashboardService
            .getDesignerRecentActivity(data.id)
            .subscribe(result => {
                this.Activity = result;
      });
    };

    ngAfterViewInit(): void {
        //this.getDashboardStatisticsData(AppSalesSummaryDatePeriod.Daily);
        this.memberActivityTable.init();
        this.loadslider();
    }
    
    GotoLead(enq_data):void{
        let x = abp.session.userId;
		switch (x) {
			case enq_data.coordinatorId:
            window.open('app/main/sales-enquiry/'+enq_data.inquiryId, "_blank");
			break;
			case enq_data.creatorUserId:
            window.open('app/main/sales-enquiry/'+enq_data.inquiryId, "_blank");
			break;
			case enq_data.designerId:
            window.open('app/main/sales-enquiry/'+enq_data.inquiryId, "_blank");
			break;	
			case enq_data.salesPersonId:
            window.open('app/main/sales-enquiry/'+enq_data.inquiryId, "_blank");
			break;	
			case enq_data.salesManagerId:
            window.open('app/main/sales-enquiry/'+enq_data.inquiryId, "_blank");
			break;
			default:
            if(this.isGranted('Pages.Manage.Leads')){
                window.open('app/main/sales-enquiry/'+enq_data.inquiryId, "_blank");
            }
            else{
			this.notify.warn(this.l('You are not authorized to access this lead'));
            }		
        }
    }

    loadslider():void{
        this.slides = [];

        this._dashboardService.getUserDesignerSlider()
        .subscribe(result =>{
            let newSlide = new Array<object>()
            result.forEach((item) => {
                newSlide.push({src: item['profilePicture'],name: item['name'],id: item['id'],email: item['email']})
            });
            this.slides = newSlide.concat(this.slides);
            this.lostreasonpiegraph(this.slides[this.cardIndex]);
            this.leadsummaryfunnelgraph(this.slides[this.cardIndex]);
            this.Closuresoon(this.slides[this.cardIndex]);
            this.LastActivity(this.slides[this.cardIndex]);
            //this.conversionRatiograph(this.slides[this.cardIndex]);
           // this.leadQuotationCount(this.slides[this.cardIndex]);

        });
    }  
    dashsubmitDateRange(): void {
        this.lostreasonpiegraph(this.slides[this.cardIndex]);
        this.leadsummaryfunnelgraph(this.slides[this.cardIndex]);
        //this.conversionRatiograph(this.slides[this.cardIndex]);
        //this.leadQuotationCount(this.slides[this.cardIndex]);
    }
    lostreasonpiegraph(value:any):void{
        var scorelrp = []; 
        var colorlrp = [];        
        this._dashboardService.getDesignerLostReasonGraph(value.id," ", this.dashdateRangePickerStartDate, this.dashdateRangePickerEndDate)
        .subscribe((result) => {
            for (var i = 0; i < result.length; i++) {
                scorelrp.push([result[i].reason, result[i].total]);
                colorlrp.push([result[i].color]);
            }
            this.lrgoption = {
                chart: { type: 'pie' },
                title: { text : 'Lost Reason'},
                series: [{
                    name: 'Lost Reason',
                    showInLegend: true,
                    data: scorelrp
                }],
                plotOptions: {
                    pie: {
                        cursor: 'pointer',
                        allowPointSelect: false,
                        dataLabels: {
                            enabled: true,
                            format: '<b>({point.percentage:.1f} %)</b>'
                            }
                        }
                    },
                tooltip: {
                    pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f} AED</b><br/>'
                },
                legend: {
                    enabled: true
                },
                credits: {
                    enabled: false
                },
                showInLegend: true,
            };
         }); 
    }
    leadsummaryfunnelgraph(value:any):void{
        var scorelsp = [];
        var colorlsp = [];
        this._dashboardService.getDesignerLeadSummaryGraph(value.id," ", this.dashdateRangePickerStartDate, this.dashdateRangePickerEndDate)
        .subscribe((result) => {
            for (var i = 0; i < result.length; i++) {
                scorelsp.push([result[i].stageName, result[i].total]);
                colorlsp .push([result[i].color]);
            }
            this.lsgoption = {
                chart: { type: 'funnel' },
                title: { text : 'Lead Summary'},
                plotOptions: {
                    series: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true,
                            format: '({point.y:,.2f})',
                        },
                        center: ['40%', '50%'],
                        neckWidth: '20%',
                        neckHeight: '25%',
                        width: '70%',
                        showInLegend: true
                    }
                },
                series: [{
                    name: 'Opportunity',
                    data: scorelsp
                }],
                tooltip: {
                    pointFormat: '<span style="color:{point.color}">{point.name} %</span>: <b>{point.y:.2f} AED</b><br/>'
                },
                credits: {
                    enabled: false
                },
            };        
         });
    }
    /* conversionRatiograph(value:any):void{

        this._dashboardService.getConversionRatioGraph(value.id,this.teamselect, this.dashdateRangePickerStartDate, this.dashdateRangePickerEndDate)
        .subscribe((result) => {
           
            this.conoption = {
                chart: {
                    type: 'column'
                },
                title: {
                    text: 'SUBMITTED VS WON'
                },
                subtitle: {
                    text: 'Source: Quotation'
                },
                xAxis: {
                    categories: result.catagries,
                    crosshair: true
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Total (AED)'
                    }
                },
                tooltip: {
                    headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                    pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                        '<td style="padding:0"><b>{point.y:.1f} AED</b></td></tr>',
                    footerFormat: '</table>',
                    shared: true,
                    useHTML: true
                },
                plotOptions: {
                    column: {
                        pointPadding: 0.2,
                        borderWidth: 0
                    }
                },
                series: result.conversionRatio
            };
         });
    } */
    /* leadQuotationCount(value:any):void{
        this._dashboardService.getLeadQuotationGraph(value.id,this.teamIdselect,this.dashdateRangePickerStartDate,this.dashdateRangePickerEndDate)
        .subscribe((result)=>{
            if(result != null){
                this.AllOutput = result[0];
                this.QuotOutput =result[1];
                this.WonOutput = result[2];
                this.LostOutput = result[3];
                this.Concersionratio = Math.round((result[4].inquiryCount/result[4].total)*100);
                console.log(result);
                console.log(this.AllOutput);
            }
        });
    } */

    ngOnDestroy() {
    }
 isEmpty(val){
        return (val === undefined || val == null || val.length <= 0) ? true : false;
    }
};


abstract class DashboardChartBase {
    loading: boolean = true;

    showLoading() {
        setTimeout(() => { this.loading = true; });
    }

    hideLoading() {
        setTimeout(() => { this.loading = false; });
    }
};




class DashboardHeaderStats extends DashboardChartBase {

    totalProfit: number = 0; totalProfitCounter: number = 0;
    newFeedbacks: number = 0; newFeedbacksCounter: number = 0;
    newOrders: number = 0; newOrdersCounter: number = 0;
    newUsers: number = 0; newUsersCounter: number = 0;

    totalProfitChange: number = 76; totalProfitChangeCounter: number = 0;
    newFeedbacksChange: number = 85; newFeedbacksChangeCounter: number = 0;
    newOrdersChange: number = 45; newOrdersChangeCounter: number = 0;
    newUsersChange: number = 57; newUsersChangeCounter: number = 0;

    init(totalProfit, newFeedbacks, newOrders, newUsers) {
        this.totalProfit = totalProfit;
        this.newFeedbacks = newFeedbacks;
        this.newOrders = newOrders;
        this.newUsers = newUsers;
        this.hideLoading();
    };
};

class MemberActivityTable extends DashboardChartBase {

    memberActivities: Array<any>;

    constructor(private _dashboardService: TenantDashboardServiceProxy) {
        super();
    }

    init() {
        this.reload();
    }

    reload() {
        this.showLoading();
        this._dashboardService
            .getMemberActivity()
            .subscribe(result => {
                this.memberActivities = result.memberActivities;
                this.hideLoading();
            });
    }
}
