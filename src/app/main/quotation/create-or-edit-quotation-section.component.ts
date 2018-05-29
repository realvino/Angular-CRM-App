import { Component, ViewChild, Injector, ElementRef, Output, EventEmitter, OnInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { AppComponentBase } from '@shared/common/app-component-base';
import { QuotationServiceProxy, SectionListDto, CreateSectionInput } from 'shared/service-proxies/service-proxies';

@Component({
    selector: 'createQuotationSectionModal',
    templateUrl: './create-or-edit-quotation-section.component.html'
})
export class CreateQuotationSectionModalComponent extends AppComponentBase {
 
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


   show(sectionId?:number,quotationId?: number): void {
        this.section = new SectionListDto();
        this.sectionInput = new CreateSectionInput();
        if(sectionId){
            this._quotationService.getSectionForEdit(sectionId).subscribe((result) => {
               if (result.section != null) {
                    this.section = result.section;
                    this.sectionInput.id =this.section.id;
                    this.sectionInput.name = this.section.name;
                    this.sectionInput.quotationId = this.section.quotationId;
               }
            });
        }else{
            this.sectionInput.id = null;
            this.sectionInput.quotationId = quotationId;
        }
        this.active = true;
        this.modal.show();
    }

 save(): void {
        this.saving = true;
           if (this.sectionInput.id == null) {
               this.sectionInput.id = 0;
           }

           console.log(this.section);
             this._quotationService.createOrUpdateSection(this.sectionInput)
            .finally(() => this.saving = false)
            .subscribe(() => {
                this.notify.info(this.l('SavedSuccessfully'));
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
