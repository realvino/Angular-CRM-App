import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { ProductTypeServiceProxy, ProductTypeListDto,FileDto } from 'shared/service-proxies/service-proxies';
import { CreateProductTypeComponent } from './create-or-edit-product-type.component';
import { FileDownloadService } from "shared/utils/file-download.service";

import * as _ from 'lodash';
import * as moment from "moment";
@Component({
    templateUrl: './product-type.component.html',
    styleUrls: ['./product-type.component.less'],
    animations: [appModuleAnimation()]
})

export class ProductTypeComponent extends AppComponentBase implements OnInit {

   @ViewChild('createProductTypeModal') createProductTypeModal: CreateProductTypeComponent;
   filter = '';
   productTypes: ProductTypeListDto[] = [];
   filedownload:FileDto=new FileDto();

   constructor(
        injector: Injector,
        private _productTypeService: ProductTypeServiceProxy,
        private _fileDownloadService: FileDownloadService
    )
    {
        super(injector);
    }

  ngOnInit(): void {
        this.getProductType();
  }
  createProductType(): void {
        this.createProductTypeModal.show(0);
  }

  editProductType(data): void {
        this.createProductTypeModal.show(data.id);
  }


  getProductType(): void {
     this._productTypeService.getProductType(this.filter).subscribe((result) => {
            this.productTypes = result.items;
        });
 }
 deleteProductType(productType: ProductTypeListDto): void {
    this.message.confirm(
        this.l('Are you sure to Delete the Product Type', productType.productTypeName),
        isConfirmed => {
            if (isConfirmed) {
              this._productTypeService.getDeleteProductType(productType.id).subscribe(() => {
                    this.notify.success(this.l('Successfully Deleted'));
                    _.remove(this.productTypes, productType); 
                });
              /*this._productTypeService.getMappedCountry(productType.id).subscribe(result=>{
                 if(result)
                  {
                    this.notify.error(this.l('This country has used, So could not delete'));
                  }else{
                    this.countryDelete(country);
                  }
              });*/
            }
        }
    );
}
  // countryDelete(country_data?:any):void{
    
  // }

  /*exportToExcel(): void {
        this._countryService.getCountryToExcel()
            .subscribe(result => {
                this._fileDownloadService.downloadTempFile(result);
            });
    }*/ 
}