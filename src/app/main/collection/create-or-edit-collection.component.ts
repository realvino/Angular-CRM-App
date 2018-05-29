import { Component, ViewChild, Injector, ElementRef, Output, EventEmitter, OnInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { AppComponentBase } from '@shared/common/app-component-base';
import { CollectionServiceProxy,CreateCollectionInput } from 'shared/service-proxies/service-proxies';

@Component({
    selector: 'createCollectionModal',
    templateUrl: './create-or-edit-collection.component.html'
})
export class CreateCollectionComponent extends AppComponentBase {
 
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('modal') modal: ModalDirective;
    @ViewChild('nameInput') nameInput: ElementRef;
    collection: CreateCollectionInput = new CreateCollectionInput();
    eventOriginal = this.collection;

    active = false;
    saving = false;
    constructor(
        injector: Injector,
        private _collectionService: CollectionServiceProxy
    ) {
        super(injector);
    }


   show(collectionId?: number): void {
        this.collection = new CreateCollectionInput();
        this._collectionService.getCollectionForEdit(collectionId).subscribe((result) => {
           if (result.collections != null) {
            this.collection = result.collections;
           }
             this.active = true;
             this.modal.show();
        });
    }

 save(): void {
        this.saving = true;
           if (this.collection.id == null) {
               this.collection.id = 0;
           }
           // console.log(this.collection);
             this._collectionService.createOrUpdateCollection(this.collection)
            .finally(() => this.saving = false)
            .subscribe(() => {
                this.notify.success(this.l('SavedSuccessfully'));
                this.collection = this.eventOriginal;
                this.close();
                this.modalSave.emit(this.collection);
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
