import { Component, ViewChild, Injector, ElementRef, Output, EventEmitter, OnInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { AppComponentBase } from '@shared/common/app-component-base';
import { LeadStatusList,LeadStatusServiceProxy } from "shared/service-proxies/service-proxies";
import { selectOption } from 'app/main/productGroup/create-or-edit-productgroup.component';


@Component({
    selector: 'createLeadStatusModal',
    templateUrl: './create-or-edit-leadStatus.component.html'
})

export class createLeadStatusModalComponent extends AppComponentBase {
 
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('modal') modal: ModalDirective;
    @ViewChild('nameInput') nameInput: ElementRef;
    lead: LeadStatusList = new LeadStatusList();
    eventOriginal = this.lead;

    
    active = false;
    saving = false;
    constructor(
        injector: Injector,
         private _LeadStatusService: LeadStatusServiceProxy,
        
    ) {
        super(injector);
    }
 
    show(leadStatusId?: number): void {
        this.lead = new LeadStatusList();
        this._LeadStatusService.getLeadStatusForEdit(leadStatusId).subscribe((result) => {
           if (result.leadstatus != null) {
            this.lead = result.leadstatus; 
           }
             this.active = true;
             this.modal.show();
        });
        

    }
    

    save(): void {
        this.saving = true;
           if (this.lead.id == null) {
               this.lead.id = 0;
           }
           
             this._LeadStatusService.createOrUpdateLeadStatus(this.lead)
            .finally(() => this.saving = false)
            .subscribe(() => {
                this.notify.info(this.l('SavedSuccessfully'));
                this.lead = this.eventOriginal;
                this.close();
                this.modalSave.emit(this.lead);
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
