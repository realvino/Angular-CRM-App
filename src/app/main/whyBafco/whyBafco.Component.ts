 import { Component, Injector, OnInit, ViewChild } from '@angular/core';
 import { AppComponentBase } from '@shared/common/app-component-base';
 import { appModuleAnimation } from '@shared/animations/routerTransition';
import { CreateWhyBafcoModalComponent } from "app/main/whyBafco/create-or-edit-whyBafco.Component";
import { YbafcoList, YbafcoServiceProxy } from "shared/service-proxies/service-proxies";
 import { FileDownloadService } from "shared/utils/file-download.service";

import * as _ from 'lodash';
import * as moment from "moment";
@Component({
    templateUrl: './whyBafco.Component.html',
    styleUrls: ['./whyBafco.Component.less'],
    animations: [appModuleAnimation()]
})
export class WhyBafcoComponent extends AppComponentBase implements OnInit {
    @ViewChild('createWhyBafcoModal') createWhyBafcoModal: CreateWhyBafcoModalComponent;
    filter = '';
   list: YbafcoList[] = [];
 
    constructor(
         injector: Injector,
         private _ybafcoService: YbafcoServiceProxy,
         private _fileDownloadService: FileDownloadService
     )
     {
         super(injector);
     }
     ngOnInit(): void {
        this.getWhyBafco();
   }
    createWhyBafco() : void{
        this.createWhyBafcoModal.show(0);
    }
 
   editWhyBafco(data): void {
       console.log(0,data);
             this.createWhyBafcoModal.show(data.id);
     }
 
 
   getWhyBafco(): void {
     this._ybafcoService.getYbafco(this.filter).subscribe((result) => {
            this.list = result.items;
             console.log(0,this.list)
         });
  }
 
  deleteWhyBafco(bafco: YbafcoList): void {
     this.message.confirm(
         this.l('AreYouSureToDeleteTheWhyBafco', bafco.ybafcoName),
         isConfirmed => {
             if (isConfirmed) {
                 this._ybafcoService.getDeleteYbafco(bafco.id).subscribe(() => {
                     this.notify.info(this.l('SuccessfullyDeleted'));
                     _.remove(this.list, bafco);
                 });
             }
         }
     );
 }
 exportExcel():void{
    this._ybafcoService.getYbafcoToExcel()
        .subscribe(result => {
            this._fileDownloadService.downloadTempFile(result);
        });
}
 
    
    }