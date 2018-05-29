import { Component, ViewChild, Injector, ElementRef, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AppConsts } from '@shared/AppConsts';
import { RegionServiceProxy, RegionList, RegionCityList, Datadto, Select2ServiceProxy } from 'shared/service-proxies/service-proxies';

import * as _ from "lodash";
export interface SelectOption{
   id?: number;
   text?: string;
}
@Component({
    selector: 'createRegionModal',
    styleUrls: ['./region.component.less'],
    templateUrl: './createoreditregion.component.html'   
})
export class CreateRegionModalComponent extends AppComponentBase {
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('modal') modal: ModalDirective;
    @ViewChild('nameInput') nameInput: ElementRef;
    @ViewChild('cityCombobox') cityCombobox: ElementRef;

    region: RegionList = new RegionList();
    regioncitylist: RegionCityList = new RegionCityList();
    eventOriginal = this.region;
    eventOrginal2 = this.regioncitylist;
    active_city:SelectOption[]=[];
    citys: Datadto[] = [];
    private cities:Array<any> = [];
    active = false;
    saving = false;
    citytab:boolean = false;

    constructor(
        injector: Injector,
        private _regionService: RegionServiceProxy,
        private _selectService: Select2ServiceProxy
    ) {
        super(injector);
    }
    regioncitys: RegionCityList[] = [];

    citydetails: Datadto[] = [];
    SelectedCity:number = 0; 
    SelectedCityName:string = "";
    
    getRegionCity(regionId){
        this._regionService.getRegionCity(regionId).subscribe((result) => {
            this.regioncitys = result.items;
        });
    }
	doSomething(data?:any): void {
        console.log(data.id);
     this.regioncitylist.cityId = data.id;
    }
    removeCity(data?:any){
        this.regioncitylist.cityId =null;
    }
   show(regionId?: number,open?: boolean): void {
   	   this.region = new RegionList();
       this.citytab = open;
       this.regioncitylist =  new RegionCityList();
       this.SelectedCity = 0;
        this.SelectedCityName = "";
        this._selectService.getCity().subscribe((result) => {
           if (result.select2data != null) {
            this.citys = result.select2data;
            this.citys.forEach((ci_ty :{id:number,name:string})=>{
                this.cities.push({
                    id:ci_ty.id,
                    text:ci_ty.name
                });
            });
           } });
           console.log(this.citydetails);
        this._regionService.getRegionForEdit(regionId).subscribe((result) => {
           if (result.regions != null) {
            this.region = result.regions;
            this.getRegionCity(regionId);
            console.log(this.citytab);
           }
           else
           {
             this.citytab =null;
           }
             this.active = true;
             this.modal.show();
             setTimeout(() => {
                    $(this.cityCombobox.nativeElement).selectpicker('refresh');
            }, 0);
        });      
    }

deletereci(regioncity:RegionCityList): void {
    this.message.confirm(
        this.l('AreYouSureToDeleteTheCity'),
        isConfirmed => {
            if (isConfirmed) {
                this._regionService.getDeleteRegionCity(regioncity.id).subscribe(() => {
                    this.notify.info(this.l('SuccessfullyDeleted'));
                    this.getRegionCity(regioncity.regionId);
                    
                    //_.remove(this.regioncitylist, regioncity); 
                });
            }
        }
    );
} 
save2():void{
    this.saving = true;
    if (this.regioncitylist.id == null) {
               this.regioncitylist.id = 0;
           }
        this.regioncitylist.regionId = this.region.id;
        
    this._regionService.addRegionCity(this.regioncitylist)
            .finally(() => this.saving = false)
            .subscribe(() => {
                this.notify.info(this.l('SavedSuccessfully'));
                this.getRegionCity(this.region.id);
                this.regioncitylist = this.eventOrginal2;
              setTimeout(() => {
                    $(this.cityCombobox.nativeElement).selectpicker('refresh');
            }, 0);
            });
            
}

 save(): void {
        this.saving = true;
           if (this.region.id == null) {
               this.region.id = 0;
           }
             this._regionService.createOrUpdateRegion(this.region)
            .finally(() => this.saving = false)
            .subscribe(() => {
                this.notify.info(this.l('SavedSuccessfully'));
                this.region = this.eventOriginal;
                this.close();
                this.modalSave.emit(this.region);
            });
    }

    onShown(): void {
        $(this.nameInput.nativeElement).focus();
    }
    close(): void {
        this.active_city =[];
        this.modal.hide();
        this.active = false;
    }
}
