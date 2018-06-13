import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { PriceLevelServiceProxy, PriceLevelListDto,FileDto } from 'shared/service-proxies/service-proxies';
import { CreatePriceLevelComponent } from './create-or-edit-price-level.component';
import { FileDownloadService } from "shared/utils/file-download.service";

import * as _ from 'lodash';
import * as moment from "moment";
@Component({
    templateUrl: './price-level.component.html',
    styleUrls: ['./price-level.component.less'],
    animations: [appModuleAnimation()]
})

export class PriceLevelComponent extends AppComponentBase implements OnInit {

   @ViewChild('createPriceLevelModal') createPriceLevelModal: CreatePriceLevelComponent;
   filter = '';
   price_levels: PriceLevelListDto[] = [];
   filedownload:FileDto=new FileDto();

   constructor(
        injector: Injector,
        private _priceLevelService: PriceLevelServiceProxy,
        private _fileDownloadService: FileDownloadService
    )
    {
        super(injector);
    }

  ngOnInit(): void {
        this.getPriceLevel();
  }
  createPriceLevel(): void {
        this.createPriceLevelModal.show(0);
  }

  editPriceLevel(data): void {
        this.createPriceLevelModal.show(data.id);
  }


  getPriceLevel(): void {
     this._priceLevelService.getPriceLevel(this.filter).subscribe((result) => {
            this.price_levels = result.items;
        });
 }
 deletePriceLevel(pricelevel: PriceLevelListDto): void {
    this.message.confirm(
        this.l('Are you sure to Delete the PriceLevel', pricelevel.priceLevelName),
        isConfirmed => {
            if (isConfirmed) {
              this._priceLevelService.getDeletePriceLevel(pricelevel.id).subscribe(() => {
                    this.notify.success(this.l('Successfully Deleted'));
                    _.remove(this.price_levels, pricelevel); 
                });
            }
        }
    );
}
}