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
    templateUrl: './inquiry.component.html',
    animations: [appModuleAnimation()]
})

export class InquiryComponent extends AppComponentBase implements AfterViewInit {

   @ViewChild('createInquiryModal') createInquiryModal: CreateInquiryModalComponent;
    advancedFiltersAreShown: boolean = false;
    filterText: string = '';
    selectedPermission: string = '';
    @ViewChild('dataTable') dataTable: DataTable;
    @ViewChild('paginator') paginator: Paginator;
     list = [
        { field: 'subMmissionId', header: 'Ref No', id: 20055 },
        { field: 'name', header: "Title Of Enquiry", id: 20053 },
        { field: 'companyName', header: 'Company Name', id: 45652 }
    ];
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

        this._inquiryProxyService.getInquiry(
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
        this.router.navigate(['/app/main/enquiry-create']);
    }

    editInquiry(data): void {
    this._chatSignalrService.setPageTitle(data.name);
    this._chatSignalrService.setPageTag('Edit');
    this._chatSignalrService.sendInfo('pageInfo');
    //this.createInquiryModal.show(data.id);
    this.router.navigate(['/app/main/enquiry/'+data.id]);
    }
 
    deleteInquiry(inquiry: InquiryListDto): void {
        this.message.confirm(
            this.l('Are you sure to Delete the Inquiry', inquiry.companyName),
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
//     deleteInquiry(inquiry: InquiryListDto): void {
//     this.message.confirm(
//         this.l('InquiryDeleteWarningMessage', inquiry.companyName),
//         isConfirmed => {
//             if (isConfirmed) {
//               this._inquiryProxyService.getMappedInquiry(inquiry.id).subscribe(result=>{
//                  if(result)
//                   {
//                     this.notify.error(this.l('This Company has used, So could not delete'));
//                   }else{
//                     this.inquiryDelete(inquiry);
//                   }
//               });
//             }
//         }
//     );
// }
//   inquiryDelete(inquiry_data?:any):void{
//     this._inquiryProxyService.getDeleteInquiry(inquiry_data.id).subscribe(() => {
//                     this.notify.success(this.l('Successfully Deleted'));
//                     //_.remove(this.countrys, country_data); 
//                 });
//   }

exportToExcel(): void {
        this._inquiryProxyService.getGeneralInquiryToExcel()
            .subscribe(result => {
                this._fileDownloadService.downloadTempFile(result);
            });
    }
}