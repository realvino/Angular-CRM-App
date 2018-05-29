import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { CreateEmailDomainModalComponent } from "app/main/emailDomain/create-or-edit-emailDomain.Component";
import { EmaildomainList, EmaildomainServiceProxy } from "shared/service-proxies/service-proxies";
import { FileDownloadService } from "shared/utils/file-download.service";

import * as _ from 'lodash';
import * as moment from "moment";
@Component({
    templateUrl: './emailDomain.Component.html',
    styleUrls: ['./emailDomain.Component.less'],
    animations: [appModuleAnimation()]
})
export class EmailDomainComponent extends AppComponentBase implements OnInit {
    @ViewChild('createEmailDomainModal') createEmailDomainModal: CreateEmailDomainModalComponent;
    filter = '';
    datas: EmaildomainList[] = [];
 
    constructor(
         injector: Injector,
         private _emailDomainService: EmaildomainServiceProxy,
         private _fileDownloadService: FileDownloadService
     )
     {
         super(injector);
     }
 
   ngOnInit(): void {
         this.getEmailDomain();
     }
   createEmailDomain(): void {
        this.createEmailDomainModal.show(0);
     }
 
   editEmailDomain(data): void {
              this.createEmailDomainModal.show(data.id);
     }
 
 
   getEmailDomain(): void {
      this._emailDomainService.getEmaildomain(this.filter).subscribe((result) => {
             this.datas = result.items;
             console.log(0,this.datas)
         });
  }
 
  deleteEmailDomain(domain: EmaildomainList): void {
     this.message.confirm(
         this.l('AreYouSureToDeleteTheEmailDomain', domain.emaildomainName),
         isConfirmed => {
             if (isConfirmed) {
                 this._emailDomainService.getDeleteEmaildomain(domain.id).subscribe(() => {
                     this.notify.info(this.l('SuccessfullyDeleted'));
                     _.remove(this.datas, domain);
                 });
             }
         }
     );
 }
 
 exportExcel():void{
    this._emailDomainService.getEmaildomainToExcel()
        .subscribe(result => {
            this._fileDownloadService.downloadTempFile(result);
        });
}
    
 
 
 
 }