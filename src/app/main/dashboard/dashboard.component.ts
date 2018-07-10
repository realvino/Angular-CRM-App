import { Component, AfterViewInit, Injector, ViewEncapsulation, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { TenantDashboardServiceProxy, Select2ServiceProxy, Select2Result, Datadto, Datadtoes, RecentInquiryClosureList, RecentInquiryActivityList } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppSalesSummaryDatePeriod } from '@shared/AppEnums';
import { ChartModule } from 'angular2-highcharts'; 
import 'rxjs/add/operator/takeUntil';
import {Subject} from 'rxjs/Subject';
declare let d3, Datamap: any;
import * as _ from "lodash";
import * as moment from "moment";
import { AppConsts } from '@shared/AppConsts';
import { Router } from '@angular/router';
export interface SelectOption{
    id?: number;
    text?: string;
 }
@Component({
    templateUrl: './dashboard.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class DashboardComponent extends AppComponentBase implements AfterViewInit, OnDestroy {

    clsdata: number = 1;
    endata: number = 1;
    @ViewChild('DashDateRangePicker') sampleDateTimePicker: ElementRef;

    dashdateRangePickerStartDate: moment.Moment;
    dashdateRangePickerEndDate: moment.Moment;
    
    appSalesSummaryDateInterval = AppSalesSummaryDatePeriod;
    private destroy$ = new Subject();
    selectedSalesSummaryDatePeriod: any = AppSalesSummaryDatePeriod.Daily;
    dashboardHeaderStats: DashboardHeaderStats;
    memberActivityTable: MemberActivityTable;
    active_team:SelectOption[] = [];
    teams:Array<any>;
    team_list: Datadtoes[];
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
    selectedItems = [];
    teamselect: string;
    allteamselect: string;
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
    options : Object = {
    clicking: true,
    sourceProp: 'src',
    visible: 13,
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
        private _select2Service: Select2ServiceProxy,
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
        this.conversionRatiograph(this.slides[this.cardIndex]);
        this.leadQuotationCount(this.slides[this.cardIndex]);
        this.Closuresoon(this.slides[this.cardIndex]);
        this.LastActivity(this.slides[this.cardIndex]);
    }
    getDashboardStatisticsData(datePeriod): void {
        this._dashboardService
            .getDashboardData(datePeriod)
            .subscribe(result => {
                this.dashboardHeaderStats.init(result.totalProfit, result.newFeedbacks, result.newOrders, result.newUsers);
      });
    };
    Closuresoon(data:any): void {
        
        this._dashboardService
            .getInquiryRecentClosure(this.teamselect,data.id)
            .subscribe(result => {
                this.Closure = result;
                //nextWeekClosureInquiry
                //thisWeekClosureInquiry
      });
    };
    LastActivity(data:any): void {
        this._dashboardService
            .getInquiryRecentActivity(this.teamselect,data.id)
            .subscribe(result => {
                this.Activity = result;
      });
    };

    ngAfterViewInit(): void {
        this.getDashboardStatisticsData(AppSalesSummaryDatePeriod.Daily);
        this.memberActivityTable.init();
        this.teamdetail();
        // this.loadslider(this.active_team);
    }
    onItemSelect(item:any){
        var selected =  this.teamselect;
        this.teamselect = "";
        var i = 1;
        item.forEach((item:{id:number, text:string}) => {
            if (i == 1)
            this.teamselect =  item.id.toString() ;
            else
            this.teamselect = this.teamselect + ","+ item.id;
            i = i + 1;
        }); 
        var data = this.isEmpty(this.teamselect);
        if(data == true)
        {
            this.teamselect = this.allteamselect;   
        }
        if(selected != this.teamselect)
        {
            this.loadslider(this.teamselect);
        }
    }
    GotoLead(enq_id):void{
        if(enq_id > 0)
        {
            this.router.navigate(["/app/main/sales-enquiry",enq_id]);
        }
    }

    teamdetail():void{
        this._dashboardService.getDashboardTeam().takeUntil(this.destroy$).subscribe((result) => { 
            this.allteamselect ="";
            if (result.selectDdata != null) {
                this.team_list = result.selectDdata;
                this.SliderCount = this.team_list.length;
                if (this.SliderCount == 1)
                  {
                       this.IsSales = this.team_list[0].isSales;
                  }
                 this.teams = [];
                this.team_list.forEach((team: {id: number, name: string, photo: string}) => {
                  this.teams.push({
                    id: team.id,
                    text:team.name,
                  });
                });
                this.selectedItems = this.teams;
                this.teamselect = "";
                var i = 1;
                this.teams.forEach((item:{id:number, text:string}) => {
                    if (i == 1)
                    this.teamselect =  item.id.toString() ;
                    else
                    this.teamselect = this.teamselect + ","+ item.id;
                    i = i + 1;
                }); 
                this.allteamselect = this.teamselect;

                this.loadslider(this.teamselect);

            }
        });
    }

    loadslider(value:any):void{
        this.teamIdselect = value;
        this.slides = [];

        this._dashboardService.getSalesExecutive(this.teamIdselect,this.IsSales)
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
            this.conversionRatiograph(this.slides[this.cardIndex]);
            this.leadQuotationCount(this.slides[this.cardIndex]);

        });
    }
    


    dashsubmitDateRange(): void {
        // console.log(this.dashdateRangePickerStartDate);
        // console.log(this.dashdateRangePickerEndDate);
        this.lostreasonpiegraph(this.slides[this.cardIndex]);
        this.leadsummaryfunnelgraph(this.slides[this.cardIndex]);
        this.conversionRatiograph(this.slides[this.cardIndex]);
        this.leadQuotationCount(this.slides[this.cardIndex]);
    }

    lostreasonpiegraph(value:any):void{
        var scorelrp = []; 
        var colorlrp = [];        
        this._dashboardService.getLostReasonGraph(value.id,this.teamselect, this.dashdateRangePickerStartDate, this.dashdateRangePickerEndDate)
        .subscribe((result) => {
            for (var i = 0; i < result.length; i++) {
                scorelrp.push([result[i].reason, result[i].total]);
                colorlrp.push([result[i].color]);
            }
            this.lrgoption = {
                chart: { type: 'pie' },
                title: { text : 'Lost Reason Graph'},
                series: [{
                    name: 'Lost Reason Graph',
                    showInLegend: true,
                    data: scorelrp
                    //data: [['Test1',2],['Test2',5],['Test3',8],['Test4',1],['Test5',5]],
                }],
                plotOptions: {
                    pie: {
                        cursor: 'pointer',
                        allowPointSelect: false,
                        dataLabels: {
                            enabled: true,
                            format: '<b>({point.percentage:.1f} %)</b>'
                            }
                            //colors: colorlrp
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
        this._dashboardService.getLeadSummaryGraph(value.id,this.teamselect, this.dashdateRangePickerStartDate, this.dashdateRangePickerEndDate)
        .subscribe((result) => {
            for (var i = 0; i < result.length; i++) {
                scorelsp.push([result[i].stageName, result[i].total]);
                colorlsp .push([result[i].color]);
            }
            this.lsgoption = {
                chart: { type: 'funnel' },
                title: { text : 'Lead Summary Graph'},
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
                        // colorlsp : colorlsp
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
    conversionRatiograph(value:any):void{

        this._dashboardService.getConversionRatioGraph(value.id,this.teamselect, this.dashdateRangePickerStartDate, this.dashdateRangePickerEndDate)
        .subscribe((result) => {
           
            this.conoption = {
                chart: {
                    type: 'column'
                },
                title: {
                    text: 'CONVERSION RATIO GRAPH'
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
    }

    leadQuotationCount(value:any):void{
        this._dashboardService.getLeadQuotationGraph(value.id,this.teamIdselect,this.dashdateRangePickerStartDate,this.dashdateRangePickerEndDate)
        .subscribe((result)=>{
            if(result != null){
                this.AllOutput = result[0];
                this.QuotOutput =result[1];
                this.WonOutput = result[2];
                this.LostOutput = result[3];
                this.Concersionratio = Math.round((result[2].quotationCount/result[1].quotationCount)*100);
                console.log(result);
                console.log(this.AllOutput);
            }
        });
    }

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
