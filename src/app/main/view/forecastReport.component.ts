import { Component, Injector, OnInit, AfterViewInit, ViewChild, Pipe } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { ViewServiceProxy, Select2ServiceProxy, Datadto, ColumnList, InquiryServiceProxy, ViewDto, QuotationServiceProxy, QuotationReportListDto, Select2TeamDto, TeamReportListDto } from "shared/service-proxies/service-proxies";
import { DataTable } from 'primeng/components/datatable/datatable';
import { Paginator } from 'primeng/components/paginator/paginator';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { CreateOrEditNewQuotationModalComponent } from '@app/main/quotation/create-or-edit-new-quotation.component';
import { ActivatedRoute, Router } from '@angular/router';
import { FileDownloadService } from '@shared/utils/file-download.service';

export interface SelectOption{
    id?: number;
    text?: string;
 }
@Pipe({
    name: 'filter'
})
@Component({
    templateUrl: './forecastReport.component.html',
    animations: [appModuleAnimation()]
})

export class ForecastReportComponent extends AppComponentBase implements OnInit {

    getId: any;
    @ViewChild('dataTable') dataTable: DataTable;
    @ViewChild('paginator') paginator: Paginator;
    @ViewChild('salesQuotdataTable') salesQuotdataTable: DataTable;
    @ViewChild('createNewQuotationModal') createNewQuotationModal: CreateOrEditNewQuotationModalComponent;
    viewDto: ViewDto[];
    view:Array<any>;
    salesDto: Datadto[];
    sales:Array<any>;
    filterText: string = '';
    active_view:SelectOption[];
    gridColumn:ColumnList[];
    gridColumnCount:number=0;
    viewId:number;
    count:number;
    gridData:any[]=[];
    quotationArray: Array<any>;
    quotationArrayCount:number=0;
    quotation:QuotationReportListDto = new QuotationReportListDto();
    teams:Array<any>;
    team_list: Select2TeamDto[];
    active_team:SelectOption[] = [];
    teamId:number;
    teamReportList:TeamReportListDto = new TeamReportListDto();
    teamArray: Array<any>;
    teamArrayCount: number=0;
    teamSalesmanArray:Array<any>;
    teamSalesmanArrayCount: number=0;

   constructor(
        injector: Injector,
        private _activatedRoute: ActivatedRoute,
        private route:Router,
        private _viewService: ViewServiceProxy,
        private _select2Service: Select2ServiceProxy,
        private _quoatationService: QuotationServiceProxy,
        private _inquiryProxyService: InquiryServiceProxy,
        private _fileDownloadService: FileDownloadService

    )
    {
        super(injector);
    }

    ngOnInit() {
        this.sales = [
            {brand: 'Apple', lastYearSale: '51%', thisYearSale: '40%', lastYearProfit: '$54,406.00', thisYearProfit: '$43,342'},
            {brand: 'Samsung', lastYearSale: '83%', thisYearSale: '96%', lastYearProfit: '$423,132', thisYearProfit: '$312,122'},
            {brand: 'Microsoft', lastYearSale: '38%', thisYearSale: '5%', lastYearProfit: '$12,321', thisYearProfit: '$8,500'},
            {brand: 'Philips', lastYearSale: '49%', thisYearSale: '22%', lastYearProfit: '$745,232', thisYearProfit: '$650,323,'},
            {brand: 'Song', lastYearSale: '17%', thisYearSale: '79%', lastYearProfit: '$643,242', thisYearProfit: '500,332'},
            {brand: 'LG', lastYearSale: '52%', thisYearSale: ' 65%', lastYearProfit: '$421,132', thisYearProfit: '$150,005'},
            {brand: 'Sharp', lastYearSale: '82%', thisYearSale: '12%', lastYearProfit: '$131,211', thisYearProfit: '$100,214'},
            {brand: 'Panasonic', lastYearSale: '44%', thisYearSale: '45%', lastYearProfit: '$66,442', thisYearProfit: '$53,322'},
            {brand: 'HTC', lastYearSale: '90%', thisYearSale: '56%', lastYearProfit: '$765,442', thisYearProfit: '$296,232'},
            {brand: 'Toshiba', lastYearSale: '75%', thisYearSale: '54%', lastYearProfit: '$21,212', thisYearProfit: '$12,533'}
        ];

        this._select2Service.getTeam().subscribe((result) => { 
           if (result.selectData != null) {
                this.teams = [];
                this.team_list = result.selectData;
                this.team_list.forEach((team: {id: number, name: string}) => {
                    this.teams.push({
                       id: team.id,
                       text: team.name,
                    });
                });
            }
         });
        
    }
    ngAfterViewInit(): void {
        this.getAllTeamInquiry();
    }

    selectSales(data:any){
        this.active_view = [{id:data.id,text:data.text}];
        this.viewId= data.id;
        this.getId = data.id;    
        this.getInquiry();
    }

    removeSales(data:any){
        this.active_view =[];
        this.viewId = 0;
        this.getInquiry();
    }
    exportToExcel(): void {
        if(this.viewId > 0){
            this._quoatationService.getTeamEnquiryReportExcel(this.viewId).subscribe(result => {
                this._fileDownloadService.downloadTempFile(result);
            });
        }
        else if(this.teamId > 0){
            this._quoatationService.getTeamReportExcel(this.teamId).subscribe(result => {
                this._fileDownloadService.downloadTempFile(result);
            });
        }
        else{
            this._quoatationService.getAllTeamReportExcel().subscribe(result => {
                this._fileDownloadService.downloadTempFile(result);
            });
        }
         
    }
    cellClicked(event:any)
    {
        window.open('app/main/sales-enquiry/'+event.data.inquiryId, "_blank");
    }
    getSalesman(teamId){
        this._select2Service.getTeamSalesman(teamId).subscribe(result=>{
            if(result != null){
               this.sales = [];
               this.salesDto = result.select3data;
                this.salesDto.forEach((view:{id:number,name:string})=>{
                    this.sales.push({
                       id:view.id,
                       text:view.name
                    });
                });
            }
        });
    }

    selectedTeam(value:any):void {
      this.active_team = [{id: value.id, text: value.text}];
      this.teamId = value.id;
      this.getTeamInquiry();
      this.getSalesman(this.teamId);
    }
    refreshTeam(value:any):void{
      this.active_team = [{id: value.id, text: value.text}];
      this.teamId = value.id;
      if(this.teamId > 0){
        this.getTeamInquiry();
        this.getSalesman(this.teamId);
        this.active_view =[];
        this.viewId = 0;
      }
    }
    removedTeam(value:any):void {
        this.teamId = 0;
        this.active_team = [];
        this.active_view =[];
        this.viewId = 0;
        this.getAllTeamInquiry();
    }

    getInquiry(event?: LazyLoadEvent): void {
        let data;
        if(this.primengDatatableHelper.getMaxResultCount(this.paginator, event)==0){
            data=10;
        }
        else{
            data=this.primengDatatableHelper.getMaxResultCount(this.paginator, event)
        }
        this.primengDatatableHelper.showLoadingIndicator();

        this._quoatationService.getTeamEnquiryReport(
            this.viewId,
            this.filterText,
            this.primengDatatableHelper.getSorting(this.dataTable),
            data,
            this.primengDatatableHelper.getSkipCount(this.paginator, event)
        ).subscribe(result => {
            this.primengDatatableHelper.totalRecordsCount = result.totalCount;
            this.count = result.totalCount;
            this.primengDatatableHelper.records = result.items;
            this.primengDatatableHelper.hideLoadingIndicator();
            this.quotation.aedValue = result.items.reduce((sum, item) => sum + item.aedValue, 0);
            this.quotation.weightedAED = result.items.reduce((sum, item) => sum + item.weightedAED, 0);
            this.quotation.total1Value = result.items.reduce((sum, item) => sum + item.total1Value, 0);
            this.quotation.total2Value = result.items.reduce((sum, item) => sum + item.total2Value, 0);
            this.quotation.total3Value = result.items.reduce((sum, item) => sum + item.total3Value, 0);
            this.quotation.total4Value = result.items.reduce((sum, item) => sum + item.total4Value, 0);
            this.quotation.total5Value = result.items.reduce((sum, item) => sum + item.total5Value, 0);
            this.quotation.total6Value = result.items.reduce((sum, item) => sum + item.total6Value, 0);
            this.quotation.total7Value = result.items.reduce((sum, item) => sum + item.total7Value, 0);
            this.quotation.total8Value = result.items.reduce((sum, item) => sum + item.total8Value, 0);
            this.quotation.total9Value = result.items.reduce((sum, item) => sum + item.total9Value, 0);
            this.quotation.total10Value = result.items.reduce((sum, item) => sum + item.total10Value, 0);
            this.quotation.total11Value = result.items.reduce((sum, item) => sum + item.total11Value, 0);
            this.quotation.total12Value = result.items.reduce((sum, item) => sum + item.total12Value, 0);
            this.quotation.total1ValueFormat = result.items[0].total1ValueFormat;
            this.quotation.total2ValueFormat = result.items[0].total2ValueFormat;
            this.quotation.total3ValueFormat = result.items[0].total3ValueFormat;
            this.quotation.total4ValueFormat = result.items[0].total4ValueFormat;
            this.quotation.total5ValueFormat = result.items[0].total5ValueFormat;
            this.quotation.total6ValueFormat = result.items[0].total6ValueFormat;
            this.quotation.total7ValueFormat = result.items[0].total7ValueFormat;
            this.quotation.total8ValueFormat = result.items[0].total8ValueFormat;
            this.quotation.total9ValueFormat = result.items[0].total9ValueFormat;
            this.quotation.total10ValueFormat = result.items[0].total10ValueFormat;
            this.quotation.total11ValueFormat = result.items[0].total11ValueFormat;
            this.quotation.total12ValueFormat = result.items[0].total12ValueFormat;
        });
        
        //  this._quoatationService.getTeamEnquiryReportTotal(this.viewId).subscribe(result => {
        //      if(result != null)
        //         {
                  
        //           this.quotation = result.forecast;
        //         }
        // });
    }

    getAllTeamInquiry(event?: LazyLoadEvent): void {
        let data;
        if(this.primengDatatableHelper.getMaxResultCount(this.paginator, event)==0){
            data=10;
        }
        else{
            data=this.primengDatatableHelper.getMaxResultCount(this.paginator, event)
        }
        this.primengDatatableHelper.showLoadingIndicator();

        this._quoatationService.getAllTeamReport(
            0,
            this.filterText,
            this.primengDatatableHelper.getSorting(this.dataTable),
            data,
            this.primengDatatableHelper.getSkipCount(this.paginator, event)
        ).subscribe(result => {
            this.teamArrayCount = result.totalCount;
            this.teamArray = result.items;
            this.primengDatatableHelper.hideLoadingIndicator();
            this.teamReportList.totalAEDValue =  parseFloat(result.items.reduce((sum, item) => sum + item.totalAEDValue, 0).toFixed(2));
            this.teamReportList.totalWeightedAED =  parseFloat(result.items.reduce((sum, item) => sum + item.totalWeightedAED, 0).toFixed(2));
            this.teamReportList.total1Value =  parseFloat(result.items.reduce((sum, item) => sum + item.total1Value, 0).toFixed(2));
            this.teamReportList.total2Value =  parseFloat(result.items.reduce((sum, item) => sum + item.total2Value, 0).toFixed(2));
            this.teamReportList.total3Value =  parseFloat(result.items.reduce((sum, item) => sum + item.total3Value, 0).toFixed(2));
            this.teamReportList.total4Value =  parseFloat(result.items.reduce((sum, item) => sum + item.total4Value, 0).toFixed(2));
            this.teamReportList.total5Value =  parseFloat(result.items.reduce((sum, item) => sum + item.total5Value, 0).toFixed(2));
            this.teamReportList.total6Value =  parseFloat(result.items.reduce((sum, item) => sum + item.total6Value, 0).toFixed(2));
            this.teamReportList.total7Value =  parseFloat(result.items.reduce((sum, item) => sum + item.total7Value, 0).toFixed(2));
            this.teamReportList.total8Value =  parseFloat(result.items.reduce((sum, item) => sum + item.total8Value, 0).toFixed(2));
            this.teamReportList.total9Value =  parseFloat(result.items.reduce((sum, item) => sum + item.total9Value, 0).toFixed(2));
            this.teamReportList.total10Value =  parseFloat(result.items.reduce((sum, item) => sum + item.total10Value, 0).toFixed(2));
            this.teamReportList.total11Value =  parseFloat(result.items.reduce((sum, item) => sum + item.total11Value, 0).toFixed(2));
            this.teamReportList.total12Value =  parseFloat(result.items.reduce((sum, item) => sum + item.total12Value, 0).toFixed(2));
            this.teamReportList.total1ValueFormat = result.items[0].total1ValueFormat;
            this.teamReportList.total2ValueFormat = result.items[0].total2ValueFormat;
            this.teamReportList.total3ValueFormat = result.items[0].total3ValueFormat;
            this.teamReportList.total4ValueFormat = result.items[0].total4ValueFormat;
            this.teamReportList.total5ValueFormat = result.items[0].total5ValueFormat;
            this.teamReportList.total6ValueFormat = result.items[0].total6ValueFormat;
            this.teamReportList.total7ValueFormat = result.items[0].total7ValueFormat;
            this.teamReportList.total8ValueFormat = result.items[0].total8ValueFormat;
            this.teamReportList.total9ValueFormat = result.items[0].total9ValueFormat;
            this.teamReportList.total10ValueFormat = result.items[0].total10ValueFormat;
            this.teamReportList.total11ValueFormat = result.items[0].total11ValueFormat;
            this.teamReportList.total12ValueFormat = result.items[0].total12ValueFormat;
        });

        //  this._quoatationService.getTotalTeamsReports().subscribe(result => {
        //      if(result != null)
        //         {
        //           this.teamReportList = result.teamReport;
        //         }
        // });
    }

    getTeamInquiry(event?: LazyLoadEvent): void {
        let data;
        if(this.primengDatatableHelper.getMaxResultCount(this.paginator, event)==0){
            data=10;
        }
        else{
            data=this.primengDatatableHelper.getMaxResultCount(this.paginator, event)
        }
        this.primengDatatableHelper.showLoadingIndicator();

        this._quoatationService.getTeamReport(
            this.teamId,
            this.filterText,
            this.primengDatatableHelper.getSorting(this.dataTable),
            data,
            this.primengDatatableHelper.getSkipCount(this.paginator, event)
        ).subscribe(result => {
            this.teamSalesmanArrayCount = result.totalCount;
            this.teamSalesmanArray = result.items;
            this.primengDatatableHelper.hideLoadingIndicator();
            this.teamReportList.totalAEDValue = parseFloat(result.items.reduce((sum, item) => sum + item.totalAEDValue, 0).toFixed(2));
            this.teamReportList.totalWeightedAED =  parseFloat(result.items.reduce((sum, item) => sum + item.totalWeightedAED, 0).toFixed(2));
            this.teamReportList.total1Value =  parseFloat(result.items.reduce((sum, item) => sum + item.total1Value, 0).toFixed(2));
            this.teamReportList.total2Value =  parseFloat(result.items.reduce((sum, item) => sum + item.total2Value, 0).toFixed(2));
            this.teamReportList.total3Value =  parseFloat(result.items.reduce((sum, item) => sum + item.total3Value, 0).toFixed(2));
            this.teamReportList.total4Value =  parseFloat(result.items.reduce((sum, item) => sum + item.total4Value, 0).toFixed(2));
            this.teamReportList.total5Value =  parseFloat(result.items.reduce((sum, item) => sum + item.total5Value, 0).toFixed(2));
            this.teamReportList.total6Value =  parseFloat(result.items.reduce((sum, item) => sum + item.total6Value, 0).toFixed(2));
            this.teamReportList.total7Value =  parseFloat(result.items.reduce((sum, item) => sum + item.total7Value, 0).toFixed(2));
            this.teamReportList.total8Value =  parseFloat(result.items.reduce((sum, item) => sum + item.total8Value, 0).toFixed(2));
            this.teamReportList.total9Value =  parseFloat(result.items.reduce((sum, item) => sum + item.total9Value, 0).toFixed(2));
            this.teamReportList.total10Value =  parseFloat(result.items.reduce((sum, item) => sum + item.total10Value, 0).toFixed(2));
            this.teamReportList.total11Value =  parseFloat(result.items.reduce((sum, item) => sum + item.total11Value, 0).toFixed(2));
            this.teamReportList.total12Value =  parseFloat(result.items.reduce((sum, item) => sum + item.total12Value, 0).toFixed(2));
            this.teamReportList.total1ValueFormat = result.items[0].total1ValueFormat;
            this.teamReportList.total2ValueFormat = result.items[0].total2ValueFormat;
            this.teamReportList.total3ValueFormat = result.items[0].total3ValueFormat;
            this.teamReportList.total4ValueFormat = result.items[0].total4ValueFormat;
            this.teamReportList.total5ValueFormat = result.items[0].total5ValueFormat;
            this.teamReportList.total6ValueFormat = result.items[0].total6ValueFormat;
            this.teamReportList.total7ValueFormat = result.items[0].total7ValueFormat;
            this.teamReportList.total8ValueFormat = result.items[0].total8ValueFormat;
            this.teamReportList.total9ValueFormat = result.items[0].total9ValueFormat;
            this.teamReportList.total10ValueFormat = result.items[0].total10ValueFormat;
            this.teamReportList.total11ValueFormat = result.items[0].total11ValueFormat;
            this.teamReportList.total12ValueFormat = result.items[0].total12ValueFormat;
        });

        //  this._quoatationService.getTeamReportTotal(this.teamId).subscribe(result => {
        //      if(result != null)
        //         {
        //           this.teamReportList = result.teamReport;
        //         }
        // });
    }
    
    reloadPage(): void {
        this.paginator.changePage(this.paginator.getPage(),null);
    }

    clickedRow(event:any){
        console.log(event.data);
        if(event.data.teamName != ""){
            // var index = this.teams.findIndex(x => x.text == event.data.teamName)
            this.active_team = [{id:event.data.teamId, text:event.data.teamName}];
            this.teamId = event.data.teamId;
            this.getTeamInquiry();
            this.getSalesman(this.teamId);
        }
        if(event.data.accountManager != ""){
            // var index = this.sales.findIndex(x => x.text == event.data.accountManager)
            this.active_view = [{id:event.data.accountManagerId, text:event.data.accountManager}];
            this.viewId = event.data.accountManagerId;
            this.getInquiry();
        }
    }
    
 
    
}