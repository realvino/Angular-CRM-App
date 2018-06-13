import { Component, ViewChild, Injector, ElementRef, Output, EventEmitter, OnInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { AppComponentBase } from '@shared/common/app-component-base';
import { CityServiceProxy, Select2ServiceProxy, CityList, Datadto } from "shared/service-proxies/service-proxies";
export interface SelectOption{
   id?: number;
   text?: string;
}
@Component({
    selector: 'createCityModal',
    templateUrl: './create-or-edit-city.component.html',
    styleUrls: ['./create-or-edit-city.component.less']
})
export class CreateOrEditCityModalComponent extends AppComponentBase  {

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('modal') modal: ModalDirective;
    @ViewChild('nameInput') nameInput: ElementRef;
    @ViewChild('cityCombobox') cityCombobox: ElementRef;

    city: CityList = new CityList();
    SelectedCountry:number = 0; 
    SelectedCountryName:string = ""; 
    country: Datadto[] = [];
    eventOriginal = this.city;
    private countrys:Array<any> = [];
    active_country:SelectOption[]=[];
     active = false;
    saving = false;

    constructor(
        injector: Injector,
        private _cityProxyService: CityServiceProxy,
        private _select2Service: Select2ServiceProxy
    ) {
        super(injector);
    }

   show(cityId?: number): void {
        this.active_country = [];
        this.city = new CityList();
        this.SelectedCountry = 0;
        this.SelectedCountryName = "";
        this._select2Service.getCountry().subscribe((result) => {
           if (result.select2data != null) {
            this.country = result.select2data;
            this.countrys = [];
            this.country.forEach((count_ry:{id:number,name:string})=>{
                this.countrys.push({
                    id:count_ry.id,
                    text:count_ry.name
                });
            });
           } });

        this._cityProxyService.getCityForEdit(cityId).subscribe((result) => {
           if (result.myCity != null) {
            this.city = result.myCity;
            this.SelectedCountry = result.myCity.countryId;
            this.SelectedCountryName = result.myCity.countryName;
            this.active_country = [{id:result.myCity.countryId,text:result.myCity.countryName}]; 
           }
             
        });
        this.active = true;
        this.modal.show();
    }
    doSomething(data?:any): void {
        console.log(data.id,'mmm');
     this.city.countryId = data.id;
    }
    removeCountry(data?:any){
        this.city.countryId = null;
    }
   save(): void {
        this.saving = true;
           if (this.city.id == null) {
               this.city.id = 0;
           }
             this._cityProxyService.createOrUpdateCity(this.city)
            .finally(() => this.saving = false)
            .subscribe(() => {
                this.notify.info(this.l('SavedSuccessfully'));
                this.city = this.eventOriginal;
                this.close();
                this.modalSave.emit(this.city);
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
