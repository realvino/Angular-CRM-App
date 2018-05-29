import { Component, ViewChild, Injector, ElementRef, Output, EventEmitter, OnInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { AppComponentBase } from '@shared/common/app-component-base';
import { LeadReasonList, LeadReasonServiceProxy } from "shared/service-proxies/service-proxies";

@Component({
    selector: 'createLeadReasonModal',
    templateUrl: './create-edit.LeadReason.component.html'
})
export class CreateLeadReasonModalComponent extends AppComponentBase {
 
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('modal') modal: ModalDirective;
    @ViewChild('nameInput') nameInput: ElementRef;
    leadReason: LeadReasonList = new LeadReasonList();
    eventOriginal = this.leadReason;

    active = false;
    saving = false;
    constructor(
        injector: Injector,
        private _leadReasonService: LeadReasonServiceProxy
    ) {
        super(injector);
    }


   show(LeadReasonId?: number): void {
        this.leadReason = new LeadReasonList();
        this._leadReasonService.getLeadReasonForEdit(LeadReasonId).subscribe((result) => {
           if (result.leadreasons != null) {
            this.leadReason = result.leadreasons;
           }
             this.active = true;
             this.modal.show();
        });      
    }

 save(): void {
        this.saving = true;
           if (this.leadReason.id == null) {
               this.leadReason.id = 0;
           }
             this._leadReasonService.createOrUpdateLeadReason(this.leadReason)
            .finally(() => this.saving = false)
            .subscribe(() => {
                this.notify.info(this.l('SavedSuccessfully'));
                this.close();
                //this.leadReason = this.eventOriginal;
                this.modalSave.emit(null);
                
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
