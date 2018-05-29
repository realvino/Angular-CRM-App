import { Component, Injector, OnInit, AfterViewInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { ActivatedRoute } from '@angular/router';
import { Http } from '@angular/http';
import { TokenAuthServiceProxy, NewInfoTypeServiceProxy, NewInfoTypeListDto } from "shared/service-proxies/service-proxies";
import * as _ from 'lodash';
import * as moment from "moment";
import { CreateOrEditNewInfoTypeComponent } from "app/main/newInfoType/createEditNewInfoType.component";
import { DataTable } from 'primeng/components/datatable/datatable';
import { Paginator } from 'primeng/components/paginator/paginator';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';

@Component({
    templateUrl: './newInfoType.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]})

export class NewInfoTypeComponent extends AppComponentBase implements AfterViewInit {

   @ViewChild('createNewInfoTypeModal') createNewInfoTypeModal: CreateOrEditNewInfoTypeComponent;

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
        private _infoTypeProxyService: NewInfoTypeServiceProxy,

    ) 
    {
        super(injector);
    }

    
        ngAfterViewInit(): void {

        this.filterText = this._activatedRoute.snapshot.queryParams['filterText'] || '';
            this.getInfoType();
       
    }
 
    getInfoType(event?: LazyLoadEvent): void {
        let data;
        if(this.primengDatatableHelper.getMaxResultCount(this.paginator, event)==0){
            data=10;
        }
        else{
            data=this.primengDatatableHelper.getMaxResultCount(this.paginator, event)
        }
        this.primengDatatableHelper.showLoadingIndicator();

        this._infoTypeProxyService.getNewInfoType(
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
 
    createInfoType(): void {
        this.createNewInfoTypeModal.show();
    }

    editInfoType(data): void {
     this.createNewInfoTypeModal.show(data.id); 
    }
 
    deleteInfoType(infotype: NewInfoTypeListDto): void {
        this.message.confirm(
            this.l('Are you sure to Delete the InfoType', infotype.contactName),
            (isConfirmed) => {
                if (isConfirmed) {
                    this._infoTypeProxyService.getDeleteNewInfoType(infotype.id)
                        .subscribe(() => {
                            this.getInfoType();
                            this.notify.success(this.l('SuccessfullyDeleted'));
                        });
                }
            }
        );
    }


/*deleteInfoType(infotype: NewInfoTypeListDto): void {
    this.message.confirm(
        this.l('Are you sure to Delete the InfoType', infotype.contactName),
        isConfirmed => {
            if (isConfirmed) {
              this._infoTypeProxyService.getMappedNewInfoType(infotype.id).subscribe(result=>{
                 if(result)
                  {
                    this.notify.error(this.l('This infotype has used, So could not delete'));
                  }else{
                    this.infotypeDelete(infotype);
                  }
              });
            }
        }
    );
}
  infotypeDelete(infotype_data?:any):void{
    this._infoTypeProxyService.getDeleteNewInfoType(infotype_data.id).subscribe(() => {
                    this.getInfoType();
                    this.notify.success(this.l('Successfully Deleted'));
                    // _.remove(this.countrys, infotype_data); 
                });
  }*/

} 