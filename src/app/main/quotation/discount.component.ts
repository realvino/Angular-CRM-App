import { Component, ViewChild, Injector, ElementRef, Output, EventEmitter, OnInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { AppComponentBase } from '@shared/common/app-component-base';
import { QuotationServiceProxy, SectionListDto, CreateSectionInput } from 'shared/service-proxies/service-proxies';

@Component({
    selector: 'discountModal',
    templateUrl: './discount.component.html'
})
export class DiscountModalComponent extends AppComponentBase {
 
    discount: any;
    quotationId: any;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('modal') modal: ModalDirective;
    @ViewChild('nameInput') nameInput: ElementRef;
    section: SectionListDto = new SectionListDto();
    sectionInput : CreateSectionInput =new CreateSectionInput();
    eventOriginal = this.section;
     
    active = false;
    saving = false;
    constructor(
        injector: Injector,
        private _quotationService: QuotationServiceProxy
    ) {
        super(injector);
    }


   show(quotationId?: number): void {
        this.active = true;
        this.modal.show();
        this.quotationId = quotationId;
    }

 save(): void {
        this.saving = true;
           console.log(this.section);
             this._quotationService.setDiscountForProducts(this.quotationId,this.discount)
            .finally(() => this.saving = false)
            .subscribe(() => {
                this.notify.info(this.l('Saved Successfully'));
                this.section = this.eventOriginal;
                this.close();
                this.modalSave.emit(this.section);
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
