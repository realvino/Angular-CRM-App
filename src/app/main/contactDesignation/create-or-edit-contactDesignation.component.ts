import { Component, ViewChild, Injector, ElementRef, Output, EventEmitter, OnInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ContactDesignationServiceProxy, ContactDesignationInput } from 'shared/service-proxies/service-proxies';

@Component({
    selector: 'contactDesignationModal',
    templateUrl: './create-or-edit-contactDesignation.component.html'
})
export class CreateEditContactDesignationComponent extends AppComponentBase {
 
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('modal') modal: ModalDirective;
    @ViewChild('nameInput') nameInput: ElementRef;
    contactDesignation: ContactDesignationInput = new ContactDesignationInput();
    eventOriginal = this.contactDesignation;

    active = false;
    saving = false;
    constructor(
        injector: Injector,
        private _contactDesignationService: ContactDesignationServiceProxy
    ) {
        super(injector);
    }

    show(contactDesignationId?: number): void {
        this.contactDesignation = new ContactDesignationInput();
        this._contactDesignationService.getContactDesignationForEdit(contactDesignationId).subscribe((result) => {
           if (result.contactDesignation != null) {
              this.contactDesignation = result.contactDesignation;
           }
           this.active = true;
           this.modal.show();
        });
    }

    save(): void {
        this.saving = true;
        if (this.contactDesignation.id == null) {
           this.contactDesignation.id = 0;
        }
        this._contactDesignationService.contactDesignationCreateOrUpdate(this.contactDesignation)
            .finally(() => this.saving = false)
            .subscribe(() => {
                this.notify.success(this.l('Saved Successfully'));
                this.contactDesignation = this.eventOriginal;
                this.close();
                this.modalSave.emit(this.contactDesignation);
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
