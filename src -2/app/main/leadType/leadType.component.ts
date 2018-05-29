import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import * as _ from 'lodash';
import * as moment from "moment";
import { LeadTypeList, LeadTypeServiceProxy } from '@shared/service-proxies/service-proxies';
import { CreateLeadTypeModalComponent } from "app/main/leadType/create-edit.leadType.component";
import { FileDownloadService } from "shared/utils/file-download.service";

@Component({
    templateUrl: './leadType.component.html',
    styleUrls: ['./leadType.component.less'],
    animations: [appModuleAnimation()]
})

export class LeadTypeComponent extends AppComponentBase implements OnInit {

   @ViewChild('createLeadTypeModal') createLeadTypeModal: CreateLeadTypeModalComponent;
   filter = '';
   leadTypes: LeadTypeList[] = [];

   constructor(
        injector: Injector,
        private _leadTypeService: LeadTypeServiceProxy,
        private _fileDownloadService: FileDownloadService
    )
    {
        super(injector);
    }

  ngOnInit(): void {
        this.getLeadType();
    }
  createLeadType(): void {
        this.createLeadTypeModal.show(0);
    }

  editLeadType(data): void {
        this.createLeadTypeModal.show(data.id);
    }


  getLeadType(): void {
     this._leadTypeService.getLeadType(this.filter).subscribe((result) => {
            this.leadTypes = result.items;
        });
 }
 deleteLeadType(lead: LeadTypeList): void {
    this.message.confirm(
        this.l('Are you sure to Delete the LeadType', lead.leadTypeName),
        isConfirmed => {
            if (isConfirmed) {
                this._leadTypeService.getDeleteLeadType(lead.id).subscribe(() => {
                    this.notify.info(this.l('SuccessfullyDeleted'));
                    _.remove(this.leadTypes, lead);
                });
            }
        }
    );
}

    exportExcel():void{
        this._leadTypeService.getLeadTypeToExcel()
            .subscribe(result => {
                this._fileDownloadService.downloadTempFile(result);
            });
    }

// deleteLeadType(lead: LeadTypeList): void {
//     this.message.confirm(
//         this.l('AreYouSureToDeleteTheLeadTypeList', lead.leadTypeName),
//         isConfirmed => {
//             if (isConfirmed) {
//               this._leadTypeService.getMappedLeadType(lead.id).subscribe(result=>{
//                  if(result)
//                   {
//                     this.notify.error(this.l('This lead has used, So could not delete'));
//                   }else{
//                     this.leadTypeDelete(lead);
//                   }
//               });
//             }
//         }
//     );
// }
//   leadTypeDelete(lead_data?:any):void{
//     this._leadTypeService.deleteLeadType(lead_data.id).subscribe(() => {
//                     this.notify.success(this.l('Successfully Deleted'));
//                     _.remove(this.leadTypes, lead_data); 
//                 });
//   }

}