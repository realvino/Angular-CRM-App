import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import * as _ from 'lodash';
import * as moment from "moment";
import { LeadReasonList, LeadReasonServiceProxy } from '@shared/service-proxies/service-proxies';
import { CreateLeadReasonModalComponent } from "app/main/leadReason/create-edit.leadReason.component";
import { FileDownloadService } from "shared/utils/file-download.service";


@Component({
    templateUrl: './leadReason.component.html',
    styleUrls: ['./leadReason.component.less'],
    animations: [appModuleAnimation()]
})

export class LeadReasonComponent extends AppComponentBase implements OnInit {

  @ViewChild('createLeadReasonModal') createLeadReasonModal: CreateLeadReasonModalComponent;
   filter = '';
   leadReasons: LeadReasonList[] = [];

   constructor(
        injector: Injector,
        private _leadReasonService: LeadReasonServiceProxy,
        private _fileDownloadService: FileDownloadService
    )
    {
        super(injector);
    }

  ngOnInit(): void {
        this.getLeadReason();
    }
  createLeadReason(): void {
        this.createLeadReasonModal.show(0);
    }

  editLeadReason(data): void {
        this.createLeadReasonModal.show(data.id);
    }


  getLeadReason(): void {
     this._leadReasonService.getLeadReason(this.filter).subscribe((result) => {
            this.leadReasons = result.items;
        });
 }
 deleteLeadReason(lead: LeadReasonList): void {
    this.message.confirm(
        this.l('Are you sure to Delete the LeadReason', lead.leadReasonName),
        isConfirmed => {
            if (isConfirmed) {
                this._leadReasonService.deleteLeadReason(lead.id).subscribe(() => {
                    this.notify.info(this.l('SuccessfullyDeleted'));
                    _.remove(this.leadReasons, lead);
                });
            }
        }
    );
}

    exportExcel():void{
        this._leadReasonService.getLeadReasonToExcel()
            .subscribe(result => {
                this._fileDownloadService.downloadTempFile(result);
            });
    }

// deleteLeadReason(lead: LeadReasonList): void {
//     this.message.confirm(
//         this.l('AreYouSureToDeleteTheLeadReason', lead.leadReasonName),
//         isConfirmed => {
//             if (isConfirmed) {
//               this._leadReasonService.getMappedLeadReason(lead.id).subscribe(result=>{
//                  if(result)
//                   {
//                     this.notify.error(this.l('This leadreason has used, So could not delete'));
//                   }else{
//                     this.leadDelete(lead);
//                   }
//               });
//             }
//         }
//     );
// }
//   leadDelete(lead_data?:any):void{
//     this._leadReasonService.deleteLeadReason(lead_data.id).subscribe(() => {
//                     this.notify.success(this.l('Successfully Deleted'));
//                     _.remove(this.leadReasons, lead_data); 
//                 });
//   }

}