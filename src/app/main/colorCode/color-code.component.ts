import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { ColorCodeServiceProxy, ColorCodeList,FileDto } from 'shared/service-proxies/service-proxies';
import { CreateColorCodeComponent } from './create-or-edit-color-code.component';

import * as _ from 'lodash';
import * as moment from "moment";
import { AppConsts } from "shared/AppConsts";
@Component({
    templateUrl: './color-code.component.html',
    styleUrls: ['./color-code.component.less'],
    animations: [appModuleAnimation()]
})

export class ColorCodeComponent extends AppComponentBase implements OnInit {

   @ViewChild('createColorCodeModal') createColorCodeModal: CreateColorCodeComponent;
   filter = '';
   colorCodes: ColorCodeList[] = [];
   filedownload:FileDto=new FileDto();
   path : string = AppConsts.remoteServiceBaseUrl; 
   constructor(
        injector: Injector,
        private _priceLevelService: ColorCodeServiceProxy
    )
    {
        super(injector);
    }

  ngOnInit(): void {
        this.getColorCodes();
  }
  createColorCode(): void {
        this.createColorCodeModal.show(0);
  }

  editColorCode(data): void {
        this.createColorCodeModal.show(data.id);
  }


  getColorCodes(): void {
     this._priceLevelService.getColorcode(this.filter).subscribe((result) => {
            this.colorCodes = result.items;
        });
 }
 deleteColorCode(colorCode: ColorCodeList): void {
    this.message.confirm(
        this.l('Are you sure to Delete the ColorCode', colorCode.component),
        isConfirmed => {
            if (isConfirmed) {
              this._priceLevelService.deleteColorcode(colorCode.id).subscribe(() => {
                    this.notify.success(this.l('Successfully Deleted'));
                    _.remove(this.colorCodes, colorCode); 
                });
            }
        }
    );
}
}