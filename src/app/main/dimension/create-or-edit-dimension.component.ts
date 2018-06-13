import { Component, ViewChild, Injector, ElementRef, Output, EventEmitter, OnInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { AppComponentBase } from '@shared/common/app-component-base';
import { DimensionServiceProxy,DimensionInputDto } from 'shared/service-proxies/service-proxies';

@Component({
    selector: 'createDimensionModal',
    templateUrl: './create-or-edit-dimension.component.html'
})
export class CreateDimensionComponent extends AppComponentBase {
 
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('modal') modal: ModalDirective;
    @ViewChild('nameInput') nameInput: ElementRef;
    dimension: DimensionInputDto = new DimensionInputDto();
    eventOriginal = this.dimension;

    active = false;
    saving = false;
    constructor(
        injector: Injector,
        private _dimensionService: DimensionServiceProxy
    ) {
        super(injector);
    }


   show(dimensionId?: number): void {
        this.dimension = new DimensionInputDto();
        this._dimensionService.getDimensionForEdit(dimensionId).subscribe((result) => {
           if (result.dimension != null) {
            this.dimension = result.dimension;
           }
             this.active = true;
             this.modal.show();
        });
    }

 save(): void {
        this.saving = true;
           if (this.dimension.id == null) {
               this.dimension.id = 0;
           }
           console.log(this.dimension);
             this._dimensionService.createOrUpdateDimension(this.dimension)
            .finally(() => this.saving = false)
            .subscribe(() => {
                this.notify.success(this.l('SavedSuccessfully'));
                this.dimension = this.eventOriginal;
                this.close();
                this.modalSave.emit(this.dimension);
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
