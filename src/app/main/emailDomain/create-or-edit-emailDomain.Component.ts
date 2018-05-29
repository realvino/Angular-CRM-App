import { Component, ViewChild, Injector, ElementRef, Output, EventEmitter, OnInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { AppComponentBase } from '@shared/common/app-component-base';
import { EmaildomainList, EmaildomainServiceProxy } from "shared/service-proxies/service-proxies";

@Component({
    selector: 'createEmailDomainModal',
    templateUrl: './create-or-edit-emailDomain.Component.html'
})
export class CreateEmailDomainModalComponent extends AppComponentBase {
    
       @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
       @ViewChild('modal') modal: ModalDirective;
       @ViewChild('nameInput') nameInput: ElementRef;
       datas: EmaildomainList = new EmaildomainList();
       eventOriginal = this.datas;
    
       active = false;
       saving = false;
   
       constructor(
           injector: Injector,
           private _emailDomainService: EmaildomainServiceProxy,  
       ) {
           super(injector);
       }
   
    show(domainId?: number): void {
           this.datas = new EmaildomainList();
                  this._emailDomainService.getEmaildomainForEdit(domainId).subscribe((result) => {
               if (result.emaildomainList != null) {
               this.datas = result.emaildomainList;
              }
                this.active = true;
                this.modal.show();
           });
       }
   
      
    save(): void {
           this.saving = true;
              if (this.datas.id == null) {
                  this.datas.id = 0;
              }
                this._emailDomainService.createOrUpdateEmaildomain(this.datas)
               .finally(() => this.saving = false)
               .subscribe(() => {
                   this.notify.info(this.l('SavedSuccessfully'));
                   this.datas = this.eventOriginal;
                   this.close();
                   this.modalSave.emit(this.datas);
               });
       }
   
       onShown(): void {
           $(this.nameInput.nativeElement).focus();
       }
       close(): void {
           this.modal.hide();
           this.active = false;
       }
   }
   