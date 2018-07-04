import { Component, ViewChild, Injector, ElementRef, Output, EventEmitter} from '@angular/core';
import { ModalDirective, TabsetComponent } from 'ngx-bootstrap';
import { AppComponentBase } from '@shared/common/app-component-base';
import { FinishedServiceProxy, FinishedList, FinishedInput } from "shared/service-proxies/service-proxies";

@Component({
    selector: 'createEditFinishedModal',
    templateUrl: './createOReditFinishedComponent.html'
})

export class CreateEditFinishedComponent extends AppComponentBase  {

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('modal') modal: ModalDirective;
    @ViewChild('nameInput') nameInput: ElementRef;
    
    finished: FinishedList = new FinishedList();
    finishedInput: FinishedInput = new FinishedInput();
    eventOriginal = this.finishedInput;
    active = false;
    saving = false;

    constructor(
        injector: Injector,
        private _finishedService: FinishedServiceProxy,
    ) {
        super(injector);
    }

   show(finishedId?: number): void {
        this.finishedInput.id = finishedId;
        this._finishedService.getFinishedForEdit(finishedId).subscribe((result) => {
           if (result != null) {
            this.finished = result;
            this.finishedInput.id = this.finished.id;
            this.finishedInput.code = this.finished.code;
            this.finishedInput.name = this.finished.name;
            this.finishedInput.description = this.finished.description;
           }
        });
        this.active = true;
        this.modal.show();
    }
    
    save(): void {
        this.saving = true;
            if (this.finishedInput.id == null) {
               this.finishedInput.id = 0;
            }
            this._finishedService.createOrUpdateFinished(this.finishedInput)
            .finally(() => this.saving = false)
            .subscribe(() => {
                this.notify.info(this.l('SavedSuccessfully'));
                this.modalSave.emit(this.finishedInput);
                this.finishedInput = this.eventOriginal;
                this.close();
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
