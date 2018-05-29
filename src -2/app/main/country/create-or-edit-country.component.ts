import { Component, ViewChild, Injector, ElementRef, Output, EventEmitter, OnInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { AppComponentBase } from '@shared/common/app-component-base';
import { CountryServiceProxy, CountryListDto } from 'shared/service-proxies/service-proxies';

@Component({
    selector: 'createCountryModal',
    templateUrl: './create-or-edit-country.component.html'
})
export class CreateCountryModalComponent extends AppComponentBase {
 
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('modal') modal: ModalDirective;
    @ViewChild('nameInput') nameInput: ElementRef;
    country: CountryListDto = new CountryListDto();
    eventOriginal = this.country;

    active = false;
    saving = false;
    constructor(
        injector: Injector,
        private _countryService: CountryServiceProxy
    ) {
        super(injector);
    }


   show(countryId?: number): void {
        this.country = new CountryListDto();
        this._countryService.getCountryForEdit(countryId).subscribe((result) => {
           if (result.countrys != null) {
            this.country = result.countrys;
           }
        });
        this.active = true;
        this.modal.show();
    }

 save(): void {
        this.saving = true;
           if (this.country.id == null) {
               this.country.id = 0;
           }
           console.log(this.country);
             this._countryService.createOrUpdateCountry(this.country)
            .finally(() => this.saving = false)
            .subscribe(() => {
                this.notify.info(this.l('SavedSuccessfully'));
                this.country = this.eventOriginal;
                this.close();
                this.modalSave.emit(this.country);
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
