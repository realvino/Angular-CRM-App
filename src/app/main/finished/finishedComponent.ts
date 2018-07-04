import { Component, Injector, AfterViewInit, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { FinishedServiceProxy, FinishedList } from "shared/service-proxies/service-proxies";
import { ActivatedRoute,Router } from "@angular/router";
import { DataTable } from 'primeng/components/datatable/datatable';
import { Paginator } from 'primeng/components/paginator/paginator';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { CreateEditFinishedComponent } from '@app/main/finished/createOReditFinishedComponent';

@Component({
    templateUrl: './finishedComponent.html',
    animations: [appModuleAnimation()]
})

export class FinishedComponent extends AppComponentBase implements AfterViewInit {
     
    filterText: string = '';
    @ViewChild('dataTable') dataTable: DataTable;
    @ViewChild('paginator') paginator: Paginator;
    @ViewChild('createEditFinishedModal') createEditFinishedModal:CreateEditFinishedComponent;

   constructor(
        injector: Injector,
        private _activatedRoute: ActivatedRoute,
        private _finishedService: FinishedServiceProxy,
    )
    {
        super(injector);
    }

    ngAfterViewInit(): void {
        this.filterText = this._activatedRoute.snapshot.queryParams['filterText'] || '';
        this.getFinished();
    }
    
    getFinished(event?: LazyLoadEvent): void {
        let data;
        
        if(this.primengDatatableHelper.getMaxResultCount(this.paginator, event)==0){
            data=10;
        }
        else{
            data=this.primengDatatableHelper.getMaxResultCount(this.paginator, event)
        }
        this.primengDatatableHelper.showLoadingIndicator();

        this._finishedService.getFinished(
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
    createFinished(){
        this.createEditFinishedModal.show(0);
    }
    editFinished(data): void {
        this.createEditFinishedModal.show(data.id);
    }
    deleteFinished(data: FinishedList): void {
        this.message.confirm(
           this.l('Are you sure to Delete', data.name),
            (isConfirmed) => {
                if (isConfirmed) {
                this._finishedService.getDeleteFinished(data.id).subscribe(() => {
                    this.getFinished();
                    this.notify.success(this.l('Deleted Successfully'));
                });
                }
            }
        );
    }
    
}