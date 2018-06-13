import { Component, ViewChild, Injector, ElementRef, Output, EventEmitter, OnInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ProductServiceProxy, ProductPriceLevelInput } from 'shared/service-proxies/service-proxies';

@Component({
    selector: 'EditPriceModal',
    templateUrl: './create-or-edit-price.component.html'
})
export class EditPriceModalComponent extends AppComponentBase {
 
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('modal') modal: ModalDirective;
    @ViewChild('nameInput') nameInput: ElementRef;
    price_edit: ProductPriceLevelInput = new ProductPriceLevelInput();
    eventOriginal = this.price_edit;

    active = false;
    saving = false;
    constructor(
        injector: Injector,
        private _productServiceProxy: ProductServiceProxy
    ) {
        super(injector);
    }


   show(priceData?: any): void {
        this.price_edit = new ProductPriceLevelInput();
        this.price_edit = priceData;
        this.modal.show();
    }

 save(): void {
        this.saving = true;
           
             this._productServiceProxy.createOrUpdateProductPriceLevel(this.price_edit)
            .finally(() => this.saving = false)
            .subscribe(() => {
                this.notify.success(this.l('SavedSuccessfully'));
                this.price_edit = this.eventOriginal;
                this.close();
                this.modalSave.emit(this.price_edit.productId);
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
