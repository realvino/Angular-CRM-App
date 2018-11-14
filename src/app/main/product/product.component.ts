import { Component, Injector, OnInit, AfterViewInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { ActivatedRoute,Router } from '@angular/router';
import { Http } from '@angular/http';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import * as _ from 'lodash';
import * as moment from "moment";
import { AppConsts } from "shared/AppConsts";
import { CreateEditProductComponent } from "./create-or-edit-product.component";
import { DataTable } from 'primeng/components/datatable/datatable';
import { Paginator } from 'primeng/components/paginator/paginator';
import {ProductServiceProxy, TemporaryProductServiceProxy} from '@shared/service-proxies/service-proxies';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { FileDownloadService } from "shared/utils/file-download.service";
import { CreateOrEditTempProductModalComponent } from 'app/main/temporaryProducts/create-or-edit-tempProducts.component';

@Component({

    templateUrl: './product.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})

export class ProductComponent extends AppComponentBase implements AfterViewInit,OnInit {

    @ViewChild('createEditProductModal') createEditProductModal: CreateEditProductComponent;
    @ViewChild('createTempProductModal') createTempProductModal: CreateOrEditTempProductModalComponent;
    @ViewChild('dataTable') dataTable: DataTable;
    @ViewChild('paginator') paginator: Paginator;

    @ViewChild('tenpProductTable') tenpProductTable: DataTable;

    advancedFiltersAreShown: boolean = false;
    filterText: string = '';
    filterText2:string = '';
    selectedPermission: string = '';
    path : string = AppConsts.remoteServiceBaseUrl;
    tempProductCount:number=0;
    tempProductArray:Array<any>;

    constructor(
        injector: Injector,
        private _http: Http,
        private _activatedRoute: ActivatedRoute,
        private route:Router,
        private _productservice:ProductServiceProxy,
        private _fileDownloadService: FileDownloadService,
        private _tempProductService: TemporaryProductServiceProxy
    )
    {
        super(injector);

    }

    ngOnInit(){
        this.getData();
        this.getTempProduct();
    }

    reload(data?:any){
        if(data){
            if(data.from == 0){
                this.createEditProductModal.show(data.id);
            } else if(data.from == 1){
                this.createTempProductModal.show(data.id);
            }
        }
        else{
            this.ngOnInit();
        }         
    }

    ngAfterViewInit(): void {
        this.filterText = this._activatedRoute.snapshot.queryParams['filterText'] || '';
        this.filterText2 = this._activatedRoute.snapshot.queryParams['filterText2'] || '';
    }
    createProduct(): void {
        this.createEditProductModal.show();
    }
    
    getData(event?: LazyLoadEvent): void {
        let data;
        
        if(this.primengDatatableHelper.getMaxResultCount(this.paginator, event)==0){
            data=10;
        }
        else{
            data=this.primengDatatableHelper.getMaxResultCount(this.paginator, event)
        }
        this.primengDatatableHelper.showLoadingIndicator();

        this._productservice.getProduct(
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
    getTempProduct(event?: LazyLoadEvent): void {
        let data;
        if(this.primengDatatableHelper.getMaxResultCount(this.paginator, event)==0){
            data=10;
        }
        else{
            data=this.primengDatatableHelper.getMaxResultCount(this.paginator, event)
        }
        this.primengDatatableHelper.showLoadingIndicator();
        this._tempProductService.getTemporaryProduct(
            this.filterText2,
            this.primengDatatableHelper.getSorting(this.tenpProductTable),
            data,
            this.primengDatatableHelper.getSkipCount(this.paginator, event)
        ).subscribe(result => {
            this.tempProductCount = result.totalCount;
            this.tempProductArray = result.items;
            this.primengDatatableHelper.hideLoadingIndicator();
        });
    }
    createTempProduct(): void {
        this.createTempProductModal.show(0,1);
    }
    editTempProduct(data): void {
        this.createTempProductModal.show(data.id,1);
    }
    deleteTempProduct(product_list:any): void {
        this.message.confirm(
            this.l('Are you sure to Delete the Non Standard Product', product_list.productName),
                isConfirmed => {
                if (isConfirmed) {
                    this._tempProductService.getDeleteTemporaryProduct(product_list.id).subscribe(result=>{
                        this.getTempProduct();
                    });
                    this.notify.success("Deleted successfully");
                }
            }
        );
    }

    
    deleteLeads(product_list:any): void {
        this.message.confirm(
            this.l('Are you sure to Delete the Product', product_list.productName),
                isConfirmed => {
                if (isConfirmed) {
                    this._productservice.getDeleteProduct(product_list.id).subscribe(result=>{
                        this.getData();
                    });
                    this.notify.success("deleted successfully");
                }
            }
        );
    }

    editLeads(data): void {
        this.createEditProductModal.show(data.id);
    }
    exportExcel():void{
        this._productservice.getProductToExcel()
            .subscribe(result => {
                this._fileDownloadService.downloadTempFile(result);
            });
    }

} 