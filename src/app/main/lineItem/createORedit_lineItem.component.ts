import { Component, ViewChild, Injector, ElementRef, Output, EventEmitter, OnInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { AppComponentBase } from '@shared/common/app-component-base';
import { LineTypeServiceProxy, LineTypeListDto } from "shared/service-proxies/service-proxies";

@Component({
    selector: 'createLineItemModal',
    templateUrl: './createORedit_lineItem.component.html'
})
export class CreateLineItemModalComponent extends AppComponentBase {
 
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('modal') modal: ModalDirective;
    @ViewChild('nameInput') nameInput: ElementRef;
    line: LineTypeListDto = new LineTypeListDto();
    eventOriginal = this.line;

    active = false;
    saving = false;
    constructor(
        injector: Injector,
        private _lineTypeServiceProxy: LineTypeServiceProxy
    ) {
        super(injector);
    }

   show(lineId?: number): void {
        this.line = new LineTypeListDto();
        this._lineTypeServiceProxy.getLineTypeForEdit(lineId).subscribe((result) => {
           if (result.lineTypes != null) {
            this.line = result.lineTypes;
           }
             this.active = true;
             this.modal.show();
        });
    }

 save(): void {
        this.saving = true;
           if (this.line.id == null) {
               this.line.id = 0;
           }
             this._lineTypeServiceProxy.createOrUpdateLineType(this.line)
            .finally(() => this.saving = false)
            .subscribe(() => {
                this.notify.info(this.l('SavedSuccessfully'));
                this.line = this.eventOriginal;
                this.close();
                this.modalSave.emit(this.line);
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
