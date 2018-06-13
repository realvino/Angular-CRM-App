import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import * as _ from 'lodash';
import * as moment from "moment";
import { ProductGroupListDto, ProductGroupServiceProxy,ProductFamilyServiceProxy,ProductFamilyListDto } from '@shared/service-proxies/service-proxies';
import { CreateProductGroupModalComponent } from "app/main/productGroup/create-or-edit-productgroup.component";
import { FileDownloadService } from "shared/utils/file-download.service";

@Component({
    templateUrl: './productGroup.component.html',
    styleUrls: ['./productGroup.component.less'],
    animations: [appModuleAnimation()]
})

export class ProductGroupComponent extends AppComponentBase implements OnInit {

  @ViewChild('createProductGroupModal') createProductGroupModal: CreateProductGroupModalComponent;
   filter = '';
   filtertext = '';
   productGroups: ProductGroupListDto[] = [];
   productFamilies: ProductFamilyListDto[] = [];

   constructor(
        injector: Injector,
        private _productgroupService: ProductGroupServiceProxy,
        private _productFamilyService: ProductFamilyServiceProxy,
        private _fileDownloadService: FileDownloadService
    )
    {
        super(injector);
    }

  ngOnInit(): void {
        this.getproductGroup();
    }
  createProductGroup(): void {
        this.createProductGroupModal.show(0);
    }

  editProductGroup(data): void {
        this.createProductGroupModal.show(data.id);
    }


  getproductGroup(): void {
     this._productgroupService.getProductGroup(this.filter).subscribe((result) => {
            this.productGroups = result.items;
        });
     this._productFamilyService.getProductFamily(this.filtertext).subscribe((result) => {
            this.productFamilies = result.items;
        });
 }
 deleteproductGroup(group: ProductGroupListDto): void {
    this.message.confirm(
        this.l('Are you sure to Delete the ProductGroup', group.productGroupName),
        isConfirmed => {
            if (isConfirmed) {
                this._productgroupService.getDeleteProductGroup(group.id).subscribe((result) => {
                    this.notify.info(this.l('SuccessfullyDeleted'));
                    _.remove(this.productGroups, group);
                });
            }
        }
    );
}
getFamilyName(familyId:number){
  var family_name = this.productFamilies.findIndex(x=>  x.id == familyId);
  var product_family_name = '';
  if(family_name!=-1){
    product_family_name = this.productFamilies[family_name].productFamilyName;
    return product_family_name;
  }else{
    return product_family_name;
  }
  
}
exportExcel():void{
        this._productgroupService.getProductGroupToExcel()
            .subscribe(result => {
                this._fileDownloadService.downloadTempFile(result);
            });
    }

}