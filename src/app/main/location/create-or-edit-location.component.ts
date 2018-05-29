import { Component, ViewChild, Injector, ElementRef, Output, EventEmitter, OnInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { AppComponentBase } from '@shared/common/app-component-base';
import { LocationListDto, LocationServiceProxy, Datadto, Select2ServiceProxy } from "shared/service-proxies/service-proxies";

export interface SelectOption{
   id?: number;
   text?: string;
}
@Component({
    selector: 'createLocationModal',
    templateUrl: './create-or-edit-location.component.html'
})
export class CreateOrEditLocationModalComponent extends AppComponentBase  {
    
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('modal') modal: ModalDirective;
    @ViewChild('nameInput') nameInput: ElementRef;
    @ViewChild('locationCombobox') locationCombobox: ElementRef;

    location: LocationListDto = new LocationListDto();
    SelectedCity:number = 0; 
    SelectedCityName:string = ""; 
    citys: Datadto[] = [];
    eventOriginal = this.location;
    private cities:Array<any> = [];
    active_city:SelectOption[]=[];
     active = false;
    saving = false;

    constructor(
        injector: Injector,
        private _locationService: LocationServiceProxy,
        private _select2Service: Select2ServiceProxy 

    ) {
        super(injector);
    }

   show(locationId?: number): void {
        this.active_city = [];
        this.location = new LocationListDto();
        this.SelectedCity = 0;
        this.SelectedCityName = "";
        this._select2Service.getCity().subscribe((result) => {
           if (result.select2data != null) {
            this.citys = result.select2data;
            this.cities = [];
            this.citys.forEach((ci_ty :{id:number,name:string})=>{
                this.cities.push({
                    id:ci_ty.id,
                    text:ci_ty.name
                });
            });
           } });

        this._locationService.getlocationForEdit(locationId).subscribe((result) => {
           if (result.locations != null) {
            this.location = result.locations;
            this.SelectedCity = result.locations.cityId;
            this.SelectedCityName = result.locations.cityName;
            this.active_city = [{ id:result.locations.cityId,text:result.locations.cityName }];
           }
                          
        });
        this.active = true;
        this.modal.show();
    }
    doSomething(data?:any): void {
        console.log(data.id);
     this.location.cityId = data.id;
    }
    removeCity(data?:any){
        this.location.cityId =null;
    }
   save(): void {
        this.saving = true;
           if (this.location.id == null) {
               this.location.id = 0;
           }
             this._locationService.createOrUpdateLocation(this.location)
            .finally(() => this.saving = false)
            .subscribe(() => {
                this.notify.info(this.l('SavedSuccessfully'));
                this.location = this.eventOriginal;
                this.close();
                this.modalSave.emit(this.location); 
            });
    }
    onShown(): void {
        $(this.nameInput.nativeElement).focus();
    }
    close(): void {
        this.location = this.eventOriginal;
        this.active_city =[];
        this.modal.hide();
        this.active = false;
    }
}
