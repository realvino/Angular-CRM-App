import { Component, ViewChild, Injector, ElementRef, Output, EventEmitter, OnInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { AppComponentBase } from '@shared/common/app-component-base';
import { QuotationStatusServiceProxy,QuotationStatusInput } from 'shared/service-proxies/service-proxies';

@Component({
    selector: 'createQuatationStatusModal',
    templateUrl: './create-or-edit-quatation-status.component.html'
})
export class CreateQuatationStatusComponent extends AppComponentBase {
 
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('modal') modal: ModalDirective;
    @ViewChild('nameInput') nameInput: ElementRef;
    quatation: QuotationStatusInput = new QuotationStatusInput();
    eventOriginal = this.quatation;

    active = false;
    saving = false;
    constructor(
        injector: Injector,
        private _quatationStatusService: QuotationStatusServiceProxy
    ) {
        super(injector);
    }


   show(quatationStatusId?: number): void {
        this.quatation = new QuotationStatusInput();
        this._quatationStatusService.getQuotationStatusForEdit(quatationStatusId).subscribe((result) => {
           if (result.status != null) {
            this.quatation = result.status;
           }
             this.active = true;
             this.modal.show();
        });
    }

 save(): void {
        this.saving = true;
           if (this.quatation.id == null) {
               this.quatation.id = 0;
           }
           // console.log(this.collection);
             this._quatationStatusService.createOrUpdateQuotationStatus(this.quatation)
            .finally(() => this.saving = false)
            .subscribe(() => {
                this.notify.success(this.l('SavedSuccessfully'));
                this.quatation = this.eventOriginal;
                this.close();
                this.modalSave.emit(this.quatation);
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
