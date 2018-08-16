import { Component, Injector, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { Http } from "@angular/http";
import { TokenAuthServiceProxy, InquiryServiceProxy, InquiryListDto, QuotationServiceProxy, EnquiryUpdateServiceProxy, NullableIdDto } from "shared/service-proxies/service-proxies";
import { ActivatedRoute,Router } from "@angular/router";
import { CreateInquiryModalComponent } from "app/main/inquiry/createORedit.component";
import { ChatSignalrService } from 'app/shared/layout/chat/chat-signalr.service';
import { FileDownloadService } from "shared/utils/file-download.service";
import { DataTable } from 'primeng/components/datatable/datatable';
import { Paginator } from 'primeng/components/paginator/paginator';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
@Component({
    templateUrl: './sales-inquiry.component.html',
    animations: [appModuleAnimation()]
})

export class SalesInquiryComponent extends AppComponentBase implements AfterViewInit {

   @ViewChild('createInquiryModal') createInquiryModal: CreateInquiryModalComponent;
   @ViewChild('ArchidataTable') ArchidataTable: DataTable;
   @ViewChild('ClosedPaginator') ClosedPaginator: Paginator;
   @ViewChild('QuotationPaginator') QuotationPaginator: Paginator;
   @ViewChild('salesQuotdataTable') salesQuotdataTable: DataTable;
   @ViewChild('dataTable') dataTable: DataTable;
   @ViewChild('paginator') paginator: Paginator;

    advancedFiltersAreShown: boolean = false;
    filterText: string = '';
    filterText3: string = '';
    selectedPermission: string = '';
    filterText2: string = '';
    quotationArray: Array<any>;
    quotationArrayCount:number=0;
    closedinquiryArray:Array<any>;
    closedinquiryArrayCount:number=0;
    reverse:NullableIdDto = new NullableIdDto();
    constructor(
        injector: Injector,
        private _http: Http,
        private _tokenAuth: TokenAuthServiceProxy,
        private _activatedRoute: ActivatedRoute,
        private _inquiryProxyService: InquiryServiceProxy,
		private router: Router,
        private _chatSignalrService:ChatSignalrService,
        private _fileDownloadService: FileDownloadService,
        private _quotationServiceProxy: QuotationServiceProxy,
        private _enquiryUpdateService: EnquiryUpdateServiceProxy,
    )
    {
        super(injector);
        _chatSignalrService.setPageTitle('New');
        _chatSignalrService.setPageTag('Details');
        _chatSignalrService.sendInfo('pageInfo');
        router.events.subscribe((val) => {
        /* If any route changes accuired to reload the table */
        // this.getInquiry(); 
        // this.getQuotation();  
    });

    }
    ngAfterViewInit(): void {
        this.filterText = this._activatedRoute.snapshot.queryParams['filterText'] || '';
            this.getInquiry();
            this.filterText2 = this._activatedRoute.snapshot.queryParams['filterText2'] || '';
            this.getQuotation();  
    }
 
    getInquiry(event?: LazyLoadEvent): void {
        let data;
        let gridSkipCount = this.primengDatatableHelper.getSkipCount(this.paginator, event);
        if(this.primengDatatableHelper.getMaxResultCount(this.paginator, event)==0){
            data=10;
        }
        else{
            data=this.primengDatatableHelper.getMaxResultCount(this.paginator, event)
        }
        if(event != undefined){
            let MaxCount = event.rows.toString();
            let SkipCount = event.first.toString();
            sessionStorage.setItem('MaxCount'+abp.session.userId, MaxCount);
            sessionStorage.setItem('SkipCount'+abp.session.userId, SkipCount);
        }
        let Max= sessionStorage.getItem('MaxCount'+abp.session.userId);
        let Skip= sessionStorage.getItem('SkipCount'+abp.session.userId);
        if(Max != null){
            setTimeout(() => {
                this.paginator.rows = JSON.parse(Max);
                data = JSON.parse(Max);
           });    
        }
        if(Skip != null){
            setTimeout(() => {
                this.paginator.first = JSON.parse(Skip);
                gridSkipCount = JSON.parse(Skip);
            });       
         }
        this.primengDatatableHelper.showLoadingIndicator();
        setTimeout(() => {
            this._inquiryProxyService.getSalesInquiry(
                this.filterText,
                this.primengDatatableHelper.getSorting(this.dataTable),
                data,
                gridSkipCount
                ).subscribe(result => {
                this.primengDatatableHelper.totalRecordsCount = result.totalCount;
                this.primengDatatableHelper.records = result.items;
                this.primengDatatableHelper.hideLoadingIndicator();
            });
        });
     }

    createInquiry(): void {
        this._chatSignalrService.setPageTitle('New');
        this._chatSignalrService.setPageTag('Details');
        this._chatSignalrService.sendInfo('pageInfo');
    }

    revertClosedInquiry(data): void{
        this.message.confirm(
            this.l('To Revert the Enquiry'),
                isConfirmed => {
                if (isConfirmed) {
                    this.reverse.id = data.id;
                    this._enquiryUpdateService.reverseClosed(this.reverse).subscribe(result=>{
                       this.notify.success(this.l('This enquiry Has Reverted Successfully !'));
                       this.getclosedInquiry();
                    });
                }
            }
        );
    }

    getQuotation(event?: LazyLoadEvent): void {
        let data;
        if(this.primengDatatableHelper.getMaxResultCount(this.QuotationPaginator, event)==0){
            data=10;
        }
        else{
            data=this.primengDatatableHelper.getMaxResultCount(this.QuotationPaginator, event)
        }
        if(event != undefined){
            let MaxCount = event.rows.toString();
            let SkipCount = event.first.toString();
            sessionStorage.setItem('MaxQuotationCount'+abp.session.userId, MaxCount);
            sessionStorage.setItem('SkipQuotationCount'+abp.session.userId, SkipCount);
        }
        let Max= sessionStorage.getItem('MaxQuotationCount'+abp.session.userId);
        let Skip= sessionStorage.getItem('SkipQuotationCount'+abp.session.userId);
        if(Max != null){
            setTimeout(() => {
                this.QuotationPaginator.rows = JSON.parse(Max);
                data = JSON.parse(Max);
            });    
        }
        if(Skip != null){
            setTimeout(() => {
                this.QuotationPaginator.first = JSON.parse(Skip);
            });       
        }
        this.primengDatatableHelper.showLoadingIndicator();
        setTimeout(() => { 
            this._inquiryProxyService.getSalesQuotations(
                this.filterText3,
                this.primengDatatableHelper.getSorting(this.salesQuotdataTable),
                data,
                this.primengDatatableHelper.getSkipCount(this.QuotationPaginator, event)
            ).subscribe(result => {
                this.quotationArray = result.items;
                this.quotationArrayCount = result.totalCount;
                this.primengDatatableHelper.hideLoadingIndicator();
            });
        });
    }

    openQuotation(data): void {
        this.router.navigate(["/app/main/openEnquiry_quotation",data.id,data.inquiryId]);    
    }
    editQuotation(data): void {
        this.router.navigate(["/app/main/sales-enquiry",data.id,data.inquiryId]);    
        // this.editEnqQuotationModal.show(data.id,data.inquiryId);
    }
    
openClosedInquiry(data): void{
    this.router.navigate(["app/main/archivedEnquiry/",data.id]);  
  }

    deleteQuotation(data): void {
        this.message.confirm(
            this.l('Are you sure to Delete the Quotation', data.refNo),
                isConfirmed => {
                    if (isConfirmed) {
                      this._quotationServiceProxy.getDeleteQuotation(data.id).subscribe(result=>{
                            this.notify.success("DeletedSuccessfully");
                      });
                    }
                }
        );
    }

    editInquiry(data): void {
    this._chatSignalrService.setPageTitle(data.name);
    this._chatSignalrService.setPageTag('Edit');
    this._chatSignalrService.sendInfo('pageInfo');
    //this.createInquiryModal.show(data.id);
    this.router.navigate(['/app/main/sales-grid/'+data.id]);
    }
 
    deleteInquiry(inquiry: InquiryListDto): void {
        this.message.confirm(
            this.l('Are you sure to Delete the SalesInquiry', inquiry.companyName),
            (isConfirmed) => {
                if (isConfirmed) {
                    this._inquiryProxyService.getDeleteInquiry(inquiry.id)
                        .subscribe(() => {
                            this.getInquiry();
                            this.notify.success(this.l('SuccessfullyDeleted'));
                        });
                }
            }
        );
    }
    getclosedInquiry(event?: LazyLoadEvent): void {
        let data;
        if(this.primengDatatableHelper.getMaxResultCount(this.ClosedPaginator, event)==0){
            data=10;
        }
        else{
            data=this.primengDatatableHelper.getMaxResultCount(this.ClosedPaginator, event)
        }
        if(event != undefined){
            let MaxCount = event.rows.toString();
            let SkipCount = event.first.toString();
            sessionStorage.setItem('MaxClosedCount'+abp.session.userId, MaxCount);
            sessionStorage.setItem('SkipClosedCount'+abp.session.userId, SkipCount);
        }
        let Max= sessionStorage.getItem('MaxClosedCount'+abp.session.userId);
        let Skip= sessionStorage.getItem('SkipClosedCount'+abp.session.userId);
        if(Max != null){
            setTimeout(() => {
                this.ClosedPaginator.rows = JSON.parse(Max);
                data = JSON.parse(Max);
            });    
        }
        if(Skip != null){
            setTimeout(() => {
                this.ClosedPaginator.first = JSON.parse(Skip);
            });       
        }
        this.primengDatatableHelper.showLoadingIndicator();

        setTimeout(() => {
            this._inquiryProxyService.getClosedInquiry(
                this.filterText2,
                this.primengDatatableHelper.getSorting(this.ArchidataTable),
                data,
                this.primengDatatableHelper.getSkipCount(this.ClosedPaginator, event)
            ).subscribe(result => {
                this.closedinquiryArrayCount = result.totalCount;
                this.closedinquiryArray = result.items;
                this.primengDatatableHelper.hideLoadingIndicator();
            });
        });
    }
    exportToExcel(from): void {
        if(from == 1){
            this._inquiryProxyService.getSalesInquiryToExcel()
            .subscribe(result => {
                this._fileDownloadService.downloadTempFile(result);
            });
        }
        else{
            this._inquiryProxyService.getClosedInquiryToExcel()
            .subscribe(result => {
                this._fileDownloadService.downloadTempFile(result);
            });
        }
        
    }
}