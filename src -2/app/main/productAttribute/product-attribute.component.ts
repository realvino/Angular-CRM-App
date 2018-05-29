import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { ProductAttributeServiceProxy, ProductAttributeListDto,FileDto } from 'shared/service-proxies/service-proxies';
import { CreateProductAttributeComponent } from './create-or-edit-product-attribute.component';
import { FileDownloadService } from "shared/utils/file-download.service";

import * as _ from 'lodash';
import * as moment from "moment";
import { AppConsts } from "shared/AppConsts";
@Component({
    templateUrl: './product-attribute.component.html',
    styleUrls: ['./product-attribute.component.less'],
    animations: [appModuleAnimation()]
})

export class ProductAttributeComponent extends AppComponentBase implements OnInit {

   @ViewChild('createProductAttributeModal') createProductAttributeModal: CreateProductAttributeComponent;
   filter = '';
   productAttributes: ProductAttributeListDto[] = [];
   filedownload:FileDto=new FileDto();
   path : string = AppConsts.remoteServiceBaseUrl; 
   constructor(
        injector: Injector,
        private _productAttributeService: ProductAttributeServiceProxy,
        private _fileDownloadService: FileDownloadService
    )
    {
        super(injector);
    }

  ngOnInit(): void {
        this.getProductAttribute();
  }
  createProductAttribute(): void {
        this.createProductAttributeModal.show(0);
  }

  editProductAttribute(data): void {
    if(data.isEdit == true){
        this.createProductAttributeModal.show(data.id);
    }
    else{
       this.notify.error(this.l('Please uncheck Attribute in Product Specification')); 
    }
}


  getProductAttribute(): void {
     this._productAttributeService.getProductAttribute(this.filter).subscribe((result) => {
          if(result.items!=null){
            this.productAttributes = result.items;
          }
        });
 }
 deleteProductAttribute(product_attribute: ProductAttributeListDto): void {
    this.message.confirm(
        this.l('Are you sure to Delete the Product Attribute', product_attribute.attributeName),
        isConfirmed => {
            if (isConfirmed) {
              this._productAttributeService.getDeleteProductAttribute(product_attribute.id).subscribe(() => {
                    this.notify.success(this.l('Successfully Deleted'));
                    _.remove(this.productAttributes, product_attribute); 
                });
            }
        }
    );
}
exportExcel():void{
        this._productAttributeService.getProductAttributeToExcel()
            .subscribe(result => {
                this._fileDownloadService.downloadTempFile(result);
            });
    }
}