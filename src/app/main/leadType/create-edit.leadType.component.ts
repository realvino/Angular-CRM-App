import { Component, ViewChild, Injector, ElementRef, Output, EventEmitter, OnInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { AppComponentBase } from '@shared/common/app-component-base';
import { LeadTypeList, LeadTypeServiceProxy } from "shared/service-proxies/service-proxies";

@Component({
    selector: 'createLeadTypeModal',
    templateUrl: './create-edit.LeadType.component.html'
})
export class CreateLeadTypeModalComponent extends AppComponentBase {
 
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('modal') modal: ModalDirective;
    @ViewChild('nameInput') nameInput: ElementRef;
    leadType: LeadTypeList = new LeadTypeList();
    eventOriginal = this.leadType;

    active = false;
    saving = false;
    constructor(
        injector: Injector,
        private _leadTypeService: LeadTypeServiceProxy
    ) {
        super(injector);
    }


   show(leadTypeId?: number): void {
        this.leadType = new LeadTypeList();
        this._leadTypeService.getLeadTypeForEdit(leadTypeId).subscribe((result) => {
           if (result.leadtypes != null) {
            this.leadType = result.leadtypes;
           }
             this.active = true;
             this.modal.show();
        });      
    }

 save(): void {
        this.saving = true;
           if (this.leadType.id == null) {
               this.leadType.id = 0;
           }
             this._leadTypeService.createOrUpdateLeadType(this.leadType)
            .finally(() => this.saving = false)
            .subscribe(() => {
                this.notify.info(this.l('SavedSuccessfully'));
                this.close();
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
