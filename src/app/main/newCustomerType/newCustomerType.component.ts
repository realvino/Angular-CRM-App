import { Component, Injector, OnInit, AfterViewInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { ActivatedRoute } from '@angular/router';
import { Http } from '@angular/http';
import { TokenAuthServiceProxy, NewCustomerTypeServiceProxy, NewCustomerTypeListDto } from "shared/service-proxies/service-proxies";
import * as _ from 'lodash';
import * as moment from "moment";
import { CreateOrEditNewCustomerTypeComponent } from "app/main/newCustomerType/createEditNewCustomerType.component";
import { DataTable } from 'primeng/components/datatable/datatable';
import { Paginator } from 'primeng/components/paginator/paginator';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
@Component({
    templateUrl: './newCustomerType.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]})

export class NewCustomerTypeComponent extends AppComponentBase implements AfterViewInit {

   @ViewChild('createNewCustomerTypeModal') createNewCustomerTypeModal: CreateOrEditNewCustomerTypeComponent;

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
        private _customerTypeProxyService: NewCustomerTypeServiceProxy,

    ) 
    {
        super(injector);
    }

    
        ngAfterViewInit(): void {

        this.filterText = this._activatedRoute.snapshot.queryParams['filterText'] || '';
            this.getCustomerType();
       
    }
 
    getCustomerType(event?: LazyLoadEvent): void {
        let data;
        if(this.primengDatatableHelper.getMaxResultCount(this.paginator, event)==0){
            data=10;
        }
        else{
            data=this.primengDatatableHelper.getMaxResultCount(this.paginator, event)
        }
        this.primengDatatableHelper.showLoadingIndicator();

        this._customerTypeProxyService.getNewCustomerType(
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
 
    createCustomerType(): void {
        this.createNewCustomerTypeModal.show();
    }

    editCustomerType(data): void {
     this.createNewCustomerTypeModal.show(data.id); 
    }
 
deleteCustomerType(customertype: NewCustomerTypeListDto): void {
    this.message.confirm(
        this.l('Are you sure to Delete the CustomerType', customertype.title), 
        isConfirmed => {
            if (isConfirmed) {
              /*this._customerTypeProxyService.getMappedNewCustomerType(customertype.id).subscribe(result=>{
                 if(result)
                  {
                    this.notify.error(this.l('This customertype has used, So could not delete'));
                  }else{
                    //this.customertypeDelete(customertype);
                  }
              });*/
              this._customerTypeProxyService.getDeleteNewCustomerType(customertype.id).subscribe(() => {
                    this.getCustomerType();
                    this.notify.success(this.l('Successfully Deleted'));
                   // _.remove(this.countrys, customertypeDelete_data); 
                });
            }
        }
    );
}
  /*customertypeDelete(customertypeDelete_data?:any):void{
    
  }*/

} 