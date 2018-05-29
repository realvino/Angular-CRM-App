import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { CreateOpportunitySourceModalComponent } from "app/main/opportunitySource/create-or-edit-opportunitySource.Component";
import { OpportunitySourceList, OpportunitySourceServiceProxy } from "shared/service-proxies/service-proxies";
import { FileDownloadService } from "shared/utils/file-download.service";

import * as _ from 'lodash';
import * as moment from "moment";
@Component({
    templateUrl: './opportunitySource.Component.html',
    styleUrls: ['./opportunitySource.Component.less'],
    animations: [appModuleAnimation()]
})
export class OpportunitySourceComponent extends AppComponentBase implements OnInit {
    @ViewChild('createOpportunitySourceModal') createOpportunitySourceModal: CreateOpportunitySourceModalComponent;
    filter = '';
    source: OpportunitySourceList[] = [];
 
    constructor(
         injector: Injector,
         private _opportunitySourceService: OpportunitySourceServiceProxy,
         private _fileDownloadService: FileDownloadService
     )
     {
         super(injector);
     }
 
   ngOnInit(): void {
         this.getOpportunitySource();
     }
   createOpportunitySource(): void {
        this.createOpportunitySourceModal.show(0);
     }
 
   editOpportunitySource(data): void {
              this.createOpportunitySourceModal.show(data.id);
     }
 
 
   getOpportunitySource(): void {
      this._opportunitySourceService.getOpportunitySource(this.filter).subscribe((result) => {
             this.source = result.items;
             //console.log(0,this.source)
         });
  }
 
  deleteOpportunitySource(opportunitysource: OpportunitySourceList): void {
     this.message.confirm(
         this.l('AreYouSureToDeleteTheOpportunitySource', opportunitysource.name),
         isConfirmed => {
             if (isConfirmed) {
                 this._opportunitySourceService.deleteOpportunitySource(opportunitysource.id).subscribe(() => {
                     this.notify.info(this.l('SuccessfullyDeleted'));
                     _.remove(this.source, opportunitysource);
                 });
             }
         }
     );
 }
 
 
    
 
 
 
 }