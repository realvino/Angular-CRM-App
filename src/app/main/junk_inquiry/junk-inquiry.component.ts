import { Component, Injector, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { Http } from "@angular/http";
import { TokenAuthServiceProxy, InquiryServiceProxy, InquiryListDto,EnquiryJunkUpdateInputDto,EnquiryUpdateServiceProxy } from "shared/service-proxies/service-proxies";
import { ActivatedRoute,Router } from "@angular/router";
import { CreateInquiryComponent } from "app/main/inquiry/createOReditModal.component";
import { ChatSignalrService } from 'app/shared/layout/chat/chat-signalr.service';
import { DataTable } from 'primeng/components/datatable/datatable';
import { Paginator } from 'primeng/components/paginator/paginator';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
@Component({
    templateUrl: './junk-inquiry.component.html',
    animations: [appModuleAnimation()]
})

export class JunkInquiryComponent extends AppComponentBase implements AfterViewInit {

   @ViewChild('createInquiryModal') createInquiryModal: CreateInquiryComponent;
    advancedFiltersAreShown: boolean = false;
    filterText: string = '';
    selectedPermission: string = '';
    @ViewChild('dataTable') dataTable: DataTable;
    @ViewChild('paginator') paginator: Paginator;
    reverseJunkInput:EnquiryJunkUpdateInputDto = new EnquiryJunkUpdateInputDto();
   constructor(
        injector: Injector,
        private _http: Http,
        private _tokenAuth: TokenAuthServiceProxy,
        private _activatedRoute: ActivatedRoute,
        private _inquiryProxyService: InquiryServiceProxy,
        private _enquiryUpdateService: EnquiryUpdateServiceProxy,
		private router: Router,
        private _chatSignalrService:ChatSignalrService
    )
    {
        super(injector);
        _chatSignalrService.setPageTitle('New');
        _chatSignalrService.setPageTag('Details');
        _chatSignalrService.sendInfo('pageInfo');
        router.events.subscribe((val) => {
        /* If any route changes accuired to reload the table */
        this.getJunkInquiry(); 
        
        /* If any route changes accuired to reload the table */
    });

    }
        ngAfterViewInit(): void {

        this.filterText = this._activatedRoute.snapshot.queryParams['filterText'] || '';
            this.getJunkInquiry();
    }
 
    getJunkInquiry(event?: LazyLoadEvent): void {
        let data;
        if(this.primengDatatableHelper.getMaxResultCount(this.paginator, event)==0){
            data=10;
        }
        else{
            data=this.primengDatatableHelper.getMaxResultCount(this.paginator, event)
        }
        this.primengDatatableHelper.showLoadingIndicator();

        this._inquiryProxyService.getJunkInquiry(
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
    this.router.navigate(['/app/main/junk-enquiry/'+data.id]);
    }
 
    deleteInquiry(inquiry: InquiryListDto): void {
        this.message.confirm(
            this.l('Are you sure to Delete the JunkInquiry', inquiry.companyName), 
            (isConfirmed) => {
                if (isConfirmed) {
                    this._inquiryProxyService.getDeleteInquiry(inquiry.id)
                        .subscribe(() => {
                            this.getJunkInquiry();
                            this.notify.success(this.l('SuccessfullyDeleted'));
                        });
                }
            }
        );
    }
    revertInquiry(data): void{
        this.reverseJunkInput.id = data.id;
        this.reverseJunkInput.junk = true;
        this._enquiryUpdateService.reverseJunk(this.reverseJunkInput).subscribe(result=>{
            this.notify.success(this.l('This enquiry Has Reveted!'));
            this.getJunkInquiry();
        });
    }
}