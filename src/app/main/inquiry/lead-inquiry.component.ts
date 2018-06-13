import { Component, Injector, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { Http } from "@angular/http";
import { TokenAuthServiceProxy, InquiryServiceProxy, InquiryListDto } from "shared/service-proxies/service-proxies";
import { ActivatedRoute,Router } from "@angular/router";
import { CreateInquiryModalComponent } from "app/main/inquiry/createORedit.component";
import { ChatSignalrService } from 'app/shared/layout/chat/chat-signalr.service';
import { FileDownloadService } from "shared/utils/file-download.service";
import { DataTable } from 'primeng/components/datatable/datatable';
import { Paginator } from 'primeng/components/paginator/paginator';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
@Component({
    templateUrl: './lead-inquiry.component.html',
    animations: [appModuleAnimation()]
})


export class LeadInquiryComponent extends AppComponentBase implements AfterViewInit {

   @ViewChild('createInquiryModal') createInquiryModal: CreateInquiryModalComponent;
    advancedFiltersAreShown: boolean = false;
    filterText: string = '';
    selectedPermission: string = '';
    @ViewChild('dataTable') dataTable: DataTable;
    @ViewChild('paginator') paginator: Paginator;

   constructor(
        injector: Injector,
        private _http: Http,
        private _tokenAuth: TokenAuthServiceProxy,
        private _activatedRoute: ActivatedRoute,
        private _inquiryProxyService: InquiryServiceProxy,
		private router: Router,
        private _chatSignalrService:ChatSignalrService,
		private _fileDownloadService: FileDownloadService
    )
    {
        super(injector);
        _chatSignalrService.setPageTitle('New');
        _chatSignalrService.setPageTag('Details');
        _chatSignalrService.sendInfo('pageInfo');
        router.events.subscribe((val) => {
        /* If any route changes accuired to reload the table */
        this.getInquiry(); 
        
        /* If any route changes accuired to reload the table */
    });

    }
        ngAfterViewInit(): void {

        this.filterText = this._activatedRoute.snapshot.queryParams['filterText'] || '';
            this.getInquiry();
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

        this._inquiryProxyService.getLeadInquiry(
            this.filterText,
            this.primengDatatableHelper.getSorting(this.dataTable),
            data,
            this.primengDatatableHelper.getSkipCount(this.paginator, event)
        ).subscribe(result => {
            this.primengDatatableHelper.totalRecordsCount = result.totalCount;
            this.primengDatatableHelper.records = result.items;
            this.primengDatatableHelper.hideLoadingIndicator();
        });
    }
 
    createInquiry(): void {
        this._chatSignalrService.setPageTitle('New');
        this._chatSignalrService.setPageTag('Details');
        this._chatSignalrService.sendInfo('pageInfo');
        this.createInquiryModal.show(0);
    }

    editInquiry(data): void {
    this._chatSignalrService.setPageTitle(data.name);
    this._chatSignalrService.setPageTag('Edit');
    this._chatSignalrService.sendInfo('pageInfo');
    //this.createInquiryModal.show(data.id);
    this.router.navigate(['/app/main/leads/'+data.id]);
    }
 
    deleteInquiry(inquiry: InquiryListDto): void {
        this.message.confirm(
            this.l('Are you sure to Delete the LeadsInquiry', inquiry.companyName),
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
	exportToExcel(): void {
        this._inquiryProxyService.getLeadInquiryToExcel()
            .subscribe(result => {
                this._fileDownloadService.downloadTempFile(result);
            });
    }
}