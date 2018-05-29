import { Component, ViewChild, Injector, ElementRef, Output, EventEmitter, OnInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { AppComponentBase } from '@shared/common/app-component-base';
import { PriceLevelServiceProxy,CreatePriceLevelInput } from 'shared/service-proxies/service-proxies';

@Component({
    selector: 'createPriceLevelModal',
    templateUrl: './create-or-edit-price-level.component.html'
})
export class CreatePriceLevelComponent extends AppComponentBase {
 
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('modal') modal: ModalDirective;
    @ViewChild('nameInput') nameInput: ElementRef;
    price_level: CreatePriceLevelInput = new CreatePriceLevelInput();
    eventOriginal = this.price_level;

    active = false;
    saving = false;
    constructor(
        injector: Injector,
        private _priceLevelService: PriceLevelServiceProxy
    ) {
        super(injector);
    }


   show(priceLevelId?: number): void {
        this.price_level = new CreatePriceLevelInput();
        this._priceLevelService.getPriceLevelForEdit(priceLevelId).subscribe((result) => {
           if (result.priceLevels != null) {
            this.price_level = result.priceLevels;
           }
             this.active = true;
             this.modal.show();
        });
    }

 save(): void {
        this.saving = true;
           if (this.price_level.id == null) {
               this.price_level.id = 0;
           }
           console.log(this.price_level);
             this._priceLevelService.createOrUpdatePriceLevel(this.price_level)
            .finally(() => this.saving = false)
            .subscribe(() => {
                this.notify.success(this.l('SavedSuccessfully'));
                this.price_level = this.eventOriginal;
                this.close();
                this.modalSave.emit(this.price_level);
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
