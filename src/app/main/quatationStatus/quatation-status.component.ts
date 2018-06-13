import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { QuotationStatusServiceProxy, QuotationStatusList,FileDto } from 'shared/service-proxies/service-proxies';
import { CreateQuatationStatusComponent } from './create-or-edit-quatation-status.component';
import { FileDownloadService } from "shared/utils/file-download.service";

import * as _ from 'lodash';
import * as moment from "moment";
@Component({
    templateUrl: './quatation-status.component.html',
    styleUrls: ['./quatation-status.component.less'],
    animations: [appModuleAnimation()]
})

export class QuatationStatusComponent extends AppComponentBase implements OnInit {

   @ViewChild('createQuatationStatusModal') createQuatationStatusModal: CreateQuatationStatusComponent;
   filter = '';
   quatationStatus: QuotationStatusList[] = [];
   filedownload:FileDto=new FileDto();

   constructor(
        injector: Injector,
        private _quatationStatusService: QuotationStatusServiceProxy,
        private _fileDownloadService: FileDownloadService
    )
    {
        super(injector);
    }

  ngOnInit(): void {
        this.getQuatationStatus();
  }
  createQuatationStatus(): void {
        this.createQuatationStatusModal.show(0);
  }

  editQuatationStatus(data): void {
        this.createQuatationStatusModal.show(data.id);
  }


  getQuatationStatus(): void {
     this._quatationStatusService.getQuotationStatus(this.filter).subscribe((result) => {
            this.quatationStatus = result.items;
        });
 }
  deleteQuatationStatus(quatation: QuotationStatusList): void {
    this.message.confirm(
        this.l('Are you sure to Delete the Quatation Status', quatation.name),
        isConfirmed => {
            if (isConfirmed) {
              this._quatationStatusService.deleteQuotationStatus(quatation.id).subscribe(() => {
                    this.notify.success(this.l('Successfully Deleted'));
                    _.remove(this.quatationStatus, quatation); 
                });
              
            }
        }
    );
  }
}