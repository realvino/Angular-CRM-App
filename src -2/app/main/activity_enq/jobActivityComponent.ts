import { Component, Injector, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { Http } from "@angular/http";
import { InquiryServiceProxy } from "shared/service-proxies/service-proxies";
import { ActivatedRoute,Router } from "@angular/router";
import { DataTable } from 'primeng/components/datatable/datatable';
import { Paginator } from 'primeng/components/paginator/paginator';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { CreateJobActivityModalComponent } from '@app/main/inquiry/create-or-edit-jobActivity.Component';

@Component({
    templateUrl: './jobActivityComponent.html',
    //styleUrls :['./quotation.component.less'],
    animations: [appModuleAnimation()]
})

export class JobActivityComponent extends AppComponentBase implements AfterViewInit {
     
    filterText: string = '';
    @ViewChild('dataTable') dataTable: DataTable;
    @ViewChild('paginator') paginator: Paginator;
    @ViewChild('createJobActivityModal') createJobActivityModal:CreateJobActivityModalComponent;

   constructor(
        injector: Injector,
        private _http: Http,
        private _activatedRoute: ActivatedRoute,
        private router:Router,
        private _inquiryServiceProxy: InquiryServiceProxy
    )
    {
        super(injector);
    }

    ngAfterViewInit(): void {
        this.filterText = this._activatedRoute.snapshot.queryParams['filterText'] || '';
        this.getJobActivity();
    }
 
    getJobActivity(event?: LazyLoadEvent): void {
        let data;
        
        if(this.primengDatatableHelper.getMaxResultCount(this.paginator, event)==0){
            data=10;
        }
        else{
            data=this.primengDatatableHelper.getMaxResultCount(this.paginator, event)
        }
        this.primengDatatableHelper.showLoadingIndicator();

        this._inquiryServiceProxy.getOverallJobActivity(
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
    openJobActivity(data): void {
        this.createJobActivityModal.show(data.id,data.designerId,data.inquiryId);
    }
    editJobActivity(data): void {
        console.log(data);
        if(data.inquiryId > 0)
        {
          this.router.navigate(["/app/main/sales-enquiry",data.inquiryId]);
        }
        else{
            this.notify.warn(this.l('Cannot Edit'));
        }
      
    }
    
}