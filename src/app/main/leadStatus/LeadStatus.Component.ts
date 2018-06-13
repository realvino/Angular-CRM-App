import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import * as _ from 'lodash';
import * as moment from "moment";
import { LeadStatusList,LeadStatusServiceProxy } from "shared/service-proxies/service-proxies";
import { createLeadStatusModalComponent } from "app/main/leadStatus/create-or-edit-leadStatus.component";
import { FileDownloadService } from "shared/utils/file-download.service";

@Component({
    templateUrl: './leadStatus.component.html',
    styleUrls: ['./leadStatus.component.less'],
    animations: [appModuleAnimation()]
})

export class LeadStatusComponent extends AppComponentBase implements OnInit {

   @ViewChild('createLeadStatusModal') createLeadStatusModal: createLeadStatusModalComponent;
   
   filter = '';
   leadstatus: LeadStatusList[] = [];

   constructor(
        injector: Injector,
         private _LeadStatusService: LeadStatusServiceProxy,
        
    )
    {
        super(injector);
    }

  ngOnInit(): void {
        this.getLeadStatus();
    }
  createLeadStatus(): void {
       this.createLeadStatusModal.show(0);
    }

  editLeadStatus(data): void {
       this.createLeadStatusModal.show(data.id);
    }


  getLeadStatus(): void {
     this._LeadStatusService.getLeadStatus(this.filter).subscribe((result) => {
            this.leadstatus = result.items;
        });
 }
 deleteLeadStatus(leads: LeadStatusList): void {
    this.message.confirm(
        this.l('Are you sure to Delete the Leadstatus', leads.leadStatusName),
        isConfirmed => {
            if (isConfirmed) {
                
                this._LeadStatusService.deleteLeadStatus(leads.id).subscribe(() => {
                    this.notify.success(this.l('SuccessfullyDeleted'));
                    _.remove(this.leadstatus, leads);
                });
            }
        }
    );
}

}