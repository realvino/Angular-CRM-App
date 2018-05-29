import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { ProductSpecificationServiceProxy, ProductSpecificationList,FileDto } from 'shared/service-proxies/service-proxies';
import { CreateProductSpecificationComponent } from './create-or-edit-product-specification.component';
import { FileDownloadService } from "shared/utils/file-download.service";

import * as _ from 'lodash';
import * as moment from "moment";
import { AppConsts } from "shared/AppConsts";
@Component({
    templateUrl: './product-specification.component.html',
    styleUrls: ['./product-specification.component.less'],
    animations: [appModuleAnimation()]
})

export class ProductSpecificationComponent extends AppComponentBase implements OnInit {

   @ViewChild('createProductSpecificationModal') createProductSpecificationModal: CreateProductSpecificationComponent;
   filter = '';
   productSpecifications: ProductSpecificationList[] = [];
   filedownload:FileDto=new FileDto();
   path : string = AppConsts.remoteServiceBaseUrl; 
   constructor(
        injector: Injector,
        private _productSpecificationService: ProductSpecificationServiceProxy,
        private _fileDownloadService: FileDownloadService
    )
    {
        super(injector);
    }

  ngOnInit(): void {
        this.getProductSpecification();
  }
  createProductSpecification(): void {
        this.createProductSpecificationModal.show(0);
  }

  editProductSpecification(data): void {
        this.createProductSpecificationModal.show(data.id);
  }


  getProductSpecification(): void {
     this._productSpecificationService.getProductSpecification(this.filter).subscribe((result) => {
          if(result.items!=null){
            this.productSpecifications = result.items;
          }
        });
 }
 deleteProductSpecification(product_specification: ProductSpecificationList): void {
    this.message.confirm(
        this.l('Are you sure to Delete the Product Specification', product_specification.name),
        isConfirmed => {
            if (isConfirmed) {
              this._productSpecificationService.getDeleteProductSpecification(product_specification.id).subscribe(() => {
                    this.notify.success(this.l('Successfully Deleted'));
                    _.remove(this.productSpecifications, product_specification); 
                });
            }
        }
    );
 }
 exportExcel():void{
        this._productSpecificationService.getProductSpecificationToExcel()
            .subscribe(result => {
                this._fileDownloadService.downloadTempFile(result);
            });
    }
}