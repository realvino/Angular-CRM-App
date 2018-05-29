import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { ProductFamilyServiceProxy, ProductFamilyListDto,FileDto } from 'shared/service-proxies/service-proxies';
import { CreateProductFamilyComponent } from './create-or-edit-product-family.component';
import { FileDownloadService } from "shared/utils/file-download.service";

import * as _ from 'lodash';
import * as moment from "moment";
@Component({
    templateUrl: './product-family.component.html',
    styleUrls: ['./product-family.component.less'],
    animations: [appModuleAnimation()]
})

export class ProductFamilyComponent extends AppComponentBase implements OnInit {

   @ViewChild('createProductFamilyModal') createProductFamilyModal: CreateProductFamilyComponent;
   filter = '';
   productFamilies: ProductFamilyListDto[] = [];
   filedownload:FileDto=new FileDto();

   constructor(
        injector: Injector,
        private _productFamilyService: ProductFamilyServiceProxy,
        private _fileDownloadService: FileDownloadService
    )
    {
        super(injector);
    }

  ngOnInit(): void {
        this.getProductFamily();
  }
  createProductFamily(): void {
        this.createProductFamilyModal.show(0);
  }

  editProductFamily(data): void {
        this.createProductFamilyModal.show(data.id);
  }


  getProductFamily(): void {
     this._productFamilyService.getProductFamily(this.filter).subscribe((result) => {
            this.productFamilies = result.items;
        });
     console.log(this.productFamilies);
 }
 deleteProductFamily(productFamily: ProductFamilyListDto): void {
    this.message.confirm(
        this.l('Are you sure to Delete the Product Family', productFamily.productFamilyName),
        isConfirmed => {
            if (isConfirmed) {
              this._productFamilyService.getDeleteProductFamily(productFamily.id).subscribe(() => {
                    this.notify.success(this.l('Successfully Deleted'));
                    _.remove(this.productFamilies, productFamily); 
                });
            }
        }
    );
 }
 exportExcel():void{
        this._productFamilyService.getProductFamilyToExcel()
            .subscribe(result => {
                this._fileDownloadService.downloadTempFile(result);
            });
    }
}