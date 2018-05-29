import { Component, Injector, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { Http } from "@angular/http";
import { ActivatedRoute } from "@angular/router";
import { TokenAuthServiceProxy, ProductSubGroupServiceProxy, ProductSubGroupListDto } from "shared/service-proxies/service-proxies";
import { CreateproductsubgroupModalComponent } from "app/main/productSubGroup/create-or-edit-productsubgroup.component";
import { DataTable } from 'primeng/components/datatable/datatable';
import { Paginator } from 'primeng/components/paginator/paginator';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';

@Component({
    templateUrl: './productsubgroup.component.html',
    animations: [appModuleAnimation()]
})

export class ProductSubGroupComponent extends AppComponentBase implements AfterViewInit {

    @ViewChild('createProductSubGroupModal') createProductSubGroupModal: CreateproductsubgroupModalComponent;
    @ViewChild('dataTable') dataTable: DataTable;
    @ViewChild('paginator') paginator: Paginator;
    advancedFiltersAreShown: boolean = false;
    filterText: string = '';
    selectedPermission: string = '';
    private _$productSubGroupTable: JQuery; 

   constructor(
        injector: Injector,
        private _http: Http,
        private _tokenAuth: TokenAuthServiceProxy,
        private _activatedRoute: ActivatedRoute,
        private _productSubGroupProxyService: ProductSubGroupServiceProxy,
    )
    {
        super(injector);
    }

        ngAfterViewInit(): void {

        this.filterText = this._activatedRoute.snapshot.queryParams['filterText'] || '';

    }
 
    getSubGroup(event?: LazyLoadEvent): void {
		this.primengDatatableHelper.showLoadingIndicator();
		this._productSubGroupProxyService.getProductSubGroup(
            this.filterText,
            this.primengDatatableHelper.getSorting(this.dataTable),
            this.primengDatatableHelper.getMaxResultCount(this.paginator, event),
            this.primengDatatableHelper.getSkipCount(this.paginator, event)
        ).subscribe(result => {
            this.primengDatatableHelper.totalRecordsCount = result.totalCount;
            this.primengDatatableHelper.records = result.items;
            this.primengDatatableHelper.hideLoadingIndicator();
        });
    }
 
    createSubGroup(): void {
        this.createProductSubGroupModal.show();
    }

    editSubGroup(data): void {
     this.createProductSubGroupModal.show(data.id);
    }
 
    deleteSubGroup(subGroup: ProductSubGroupListDto): void {
        this.message.confirm(
            this.l('Are you sure to Delete the ProductSubGroup', subGroup.productSubGroupName),
            (isConfirmed) => {
                if (isConfirmed) {
                    this._productSubGroupProxyService.deleteProductSubGroup(subGroup.id)
                        .subscribe(() => {
                            this.getSubGroup();
                            this.notify.success(this.l('SuccessfullyDeleted'));
                        }); 
                }
            }
        );
    }
} 