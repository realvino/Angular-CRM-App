import { Component, ViewChild, Injector, ElementRef, Output, EventEmitter, OnInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ProductTypeServiceProxy,ProductTypeInputDto } from 'shared/service-proxies/service-proxies';

@Component({
    selector: 'createProductTypeModal',
    templateUrl: './create-or-edit-product-type.component.html'
})
export class CreateProductTypeComponent extends AppComponentBase {
 
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('modal') modal: ModalDirective;
    @ViewChild('nameInput') nameInput: ElementRef;
    productType: ProductTypeInputDto = new ProductTypeInputDto();
    eventOriginal = this.productType;

    active = false;
    saving = false;
    constructor(
        injector: Injector,
        private _productTypeService: ProductTypeServiceProxy
    ) {
        super(injector);
    }


   show(productTypeId?: number): void {
        this.productType = new ProductTypeInputDto();
        this._productTypeService.getProductTypeForEdit(productTypeId).subscribe((result) => {
           if (result.producttype != null) {
            this.productType = result.producttype;
           }
             this.active = true;
             this.modal.show();
        });
    }

 save(): void {
        this.saving = true;
           if (this.productType.id == null) {
               this.productType.id = 0;
           }
           console.log(this.productType);
             this._productTypeService.createOrUpdateProductType(this.productType)
            .finally(() => this.saving = false)
            .subscribe(() => {
                this.notify.success(this.l('SavedSuccessfully'));
                this.productType = this.eventOriginal;
                this.close();
                this.modalSave.emit(this.productType);
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
