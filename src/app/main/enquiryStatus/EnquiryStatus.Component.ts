import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import * as _ from 'lodash';
import * as moment from "moment";
import { EnquiryStatusListDto, EnquiryStatusServiceProxy } from "shared/service-proxies/service-proxies";
import { createEnquiryStatusModalComponent } from "app/main/enquiryStatus/create-or-edit-enquiryStatus.component";
import { FileDownloadService } from "shared/utils/file-download.service";

@Component({
    templateUrl: './enquiryStatus.component.html',
    styleUrls: ['./enquiryStatus.component.less'],
    animations: [appModuleAnimation()]
})

export class EnquiryStatusComponent extends AppComponentBase implements OnInit {

   @ViewChild('createEnquiryStatusModal') createEnquiryStatusModal: createEnquiryStatusModalComponent;
   
   filter = '';
   enqstatus: EnquiryStatusListDto[] = [];

   constructor(
        injector: Injector,
        private _EnquiryStatusService: EnquiryStatusServiceProxy,
        private _fileDownloadService: FileDownloadService
    )
    {
        super(injector);
    }

  ngOnInit(): void {
        this.getEnqStatus();
    }
  createEnquiryStatus(): void {
       this.createEnquiryStatusModal.show(0);
    }

  editEnquiryStatus(data): void {
       this.createEnquiryStatusModal.show(data.id);
    }


  getEnqStatus(): void {
     this._EnquiryStatusService.getEnquiryStatus(this.filter).subscribe((result) => {
            this.enqstatus = result.items;
        });
 }
 deleteEnquiryStatus(enquiryStatus: EnquiryStatusListDto): void {
    this.message.confirm(
        this.l('Are you sure to Delete the Enquirystatus', enquiryStatus.enqStatusName),
        isConfirmed => {
            if (isConfirmed) {
                /*this._EnquiryStatusService.getMappedEnquiryStatus(enquiryStatus.id).subscribe(result=>{
                  if(result)
                  {
                    this.notify.error(this.l('This Leadstatus has used, So could not delete this leadstatus'));
                  }else{
                    this.enquiryStatusDelete(enquiryStatus);
                  }
                });*/
                this._EnquiryStatusService.getDeleteEnquiryStatus(enquiryStatus.id).subscribe(() => {
                    this.notify.success(this.l('SuccessfullyDeleted'));
                    _.remove(this.enqstatus, enquiryStatus);
                });
            }
        }
    );
}


    exportExcel():void{
        this._EnquiryStatusService.getEnquiryStatusToExcel()
            .subscribe(result => {
                this._fileDownloadService.downloadTempFile(result);
            });
    }
/* enquiryStatusDelete(enquiryStatus?:any):void{

 

 } */

}