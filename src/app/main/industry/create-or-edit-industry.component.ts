import { Component, ViewChild, Injector, ElementRef, Output, EventEmitter, OnInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { AppComponentBase } from '@shared/common/app-component-base';
import { IndustryListDto, IndustryServiceProxy } from "shared/service-proxies/service-proxies";

@Component({
    selector: 'createIndustryModal',
    templateUrl: './create-or-edit-industry.component.html'
})
export class CreateIndustryModalComponent extends AppComponentBase {
 
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('modal') modal: ModalDirective;
    @ViewChild('nameInput') nameInput: ElementRef;
    industry: IndustryListDto = new IndustryListDto();
    eventOriginal = this.industry;

    active = false;
    saving = false;
    constructor(
        injector: Injector,
        private _industryService: IndustryServiceProxy
    ) {
        super(injector);
    }
 
    show(activityId?: number): void {
        this.industry = new IndustryListDto();
        this._industryService.getIndustryForEdit(activityId).subscribe((result) => {
            if (result.industrys != null) {
              this.industry = result.industrys; 
            }
             this.active = true;
             this.modal.show();
        });
    }


    save(): void {
        this.saving = true;
           if (this.industry.id == null) {
               this.industry.id = 0;
           }
             this._industryService.createOrUpdateIndustry(this.industry)
            .finally(() => this.saving = false)
            .subscribe(() => {
                this.notify.info(this.l('SavedSuccessfully'));
                this.industry = this.eventOriginal;
                this.close();
                this.modalSave.emit(this.industry);
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
