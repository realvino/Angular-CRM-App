import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { CreateProductCategoryModalComponent } from "app/main/productCategory/create-or-edit-productCategory.Component";
import { ProductCategoryList, ProductCategoryServiceProxy } from "shared/service-proxies/service-proxies";
import { FileDownloadService } from "shared/utils/file-download.service";

import * as _ from 'lodash';
import * as moment from "moment";
@Component({
    templateUrl: './productCategory.Component.html',
    styleUrls: ['./productCategory.Component.less'],
    animations: [appModuleAnimation()]
})
export class ProductCategoryComponent extends AppComponentBase implements OnInit {
    @ViewChild('createProductCategoryModal') createProductCategoryModal: CreateProductCategoryModalComponent;
    filter = '';
    categories: ProductCategoryList[] = [];
 
    constructor(
         injector: Injector,
         private _productCategoryService: ProductCategoryServiceProxy,
         private _fileDownloadService: FileDownloadService
     )
     {
         super(injector);
     }
 
   ngOnInit(): void {
         this.getProductCategory();
     }
   createProductCategory(): void {
        this.createProductCategoryModal.show(0);
     }
 
   editProductCategory(data): void {
              this.createProductCategoryModal.show(data.id);
     }
 
 
   getProductCategory(): void {
      this._productCategoryService.getProductCategory(this.filter).subscribe((result) => {
             this.categories = result.items;
             console.log(0,this.categories)
         });
  }
 
  deleteProductCategory(productcategory: ProductCategoryList): void {
     this.message.confirm(
         this.l('AreYouSureToDeleteTheProductCategory', productcategory.name),
         isConfirmed => {
             if (isConfirmed) {
                 this._productCategoryService.deleteProductCategory(productcategory.id).subscribe(() => {
                     this.notify.info(this.l('SuccessfullyDeleted'));
                     _.remove(this.categories, productcategory);
                 });
             }
         }
     );
 }
 
 
    
 
 
 
 }