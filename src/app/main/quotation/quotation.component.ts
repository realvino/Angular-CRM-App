import { Component, Injector, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { Http } from "@angular/http";
import { QuotationServiceProxy,QuotationListDto  } from "shared/service-proxies/service-proxies";
import { ActivatedRoute,Router } from "@angular/router";
import { CreateOrEditNewQuotationModalComponent } from "app/main/quotation/create-or-edit-new-quotation.component";
import { DataTable } from 'primeng/components/datatable/datatable';
import { Paginator } from 'primeng/components/paginator/paginator';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { FileDownloadService } from '@shared/utils/file-download.service';

@Component({
    templateUrl: './quotation.component.html',
    styleUrls :['./quotation.component.less'],
    animations: [appModuleAnimation()]
})

export class QuotationComponent extends AppComponentBase implements AfterViewInit {

    @ViewChild('createNewQuotationModal') createNewQuotationModal: CreateOrEditNewQuotationModalComponent;
    
    filterText: string = '';
    quotations:QuotationListDto[];
    @ViewChild('dataTable') dataTable: DataTable;
    @ViewChild('paginator') paginator: Paginator;

   constructor(
        injector: Injector,
        private _http: Http,
        private _activatedRoute: ActivatedRoute,
        private route:Router,
        private _quotationServiceProxy: QuotationServiceProxy,
        private _fileDownloadService: FileDownloadService
    )
    {
        super(injector);
    }

        ngAfterViewInit(): void {

        this.filterText = this._activatedRoute.snapshot.queryParams['filterText'] || '';

            this.getQuotation();
        
    }
 
    getQuotation(event?: LazyLoadEvent): void {
        let data;
        
        if(this.primengDatatableHelper.getMaxResultCount(this.paginator, event)==0){
            data=10;
        }
        else{
            data=this.primengDatatableHelper.getMaxResultCount(this.paginator, event)
        }
        this.primengDatatableHelper.showLoadingIndicator();

        this._quotationServiceProxy.getQuotation(
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
    reloadPage(): void {
        this.paginator.changePage(this.paginator.getPage(),null);
    }
    /*getQuotation(){
        this._quotationServiceProxy.getQuotation(this.filterText).subscribe(result=>{
            if(result.items!=null){
                this.quotations = result.items;
            }
        });
    }*/
    createQuotation(): void {
        this.createNewQuotationModal.show(0);
    }

    editQuotation(data): void {
        this.route.navigate(['app/main/quotation/'+data.id]);
    }
    open(data): void {
        this.route.navigate(['app/main/openquotation/'+data.id]);
    }
 
    deleteQuotation(quotation: QuotationListDto): void {
        this.message.confirm(
            this.l('Are you sure to Delete the Quotation', quotation.refNo),
            isConfirmed => {
                if (isConfirmed) {
                    this._quotationServiceProxy.getDeleteQuotation(quotation.id).subscribe(result=>{
                        this.notify.success("DeletedSuccessfully");
                        this.getQuotation();
                  });
                }
            }
        );
    }

    exportToExcel(): void {
        this._quotationServiceProxy.getQuotationToExcel()
            .subscribe(result => {
                this._fileDownloadService.downloadTempFile(result);
            }); 
    } 
}