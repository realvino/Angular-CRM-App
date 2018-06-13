import { Component, Input,OnInit,Injector } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AppComponentBase } from "shared/common/app-component-base";
import { Http } from "@angular/http";
import { Select2ServiceProxy,Datadto,InquiryServiceProxy,LocationInputDto } from "shared/service-proxies/service-proxies";


export interface SelectOption{
   id?: number;
   text?: string;
}

@Component({
    moduleId: module.id,
    selector: 'contact',
    styleUrls: ['./custom.component.css'],
    templateUrl: 'contact.component.html',
})

export class ContactCompComponent extends AppComponentBase implements OnInit{
    @Input('group')
    public contactForm: FormGroup;
    contacttypes:Array<any> = [];
    contactType:Datadto[]=[];
    active_con:SelectOption[];
    constructor(
        injector: Injector,
        private _select2Service: Select2ServiceProxy
        
    ){
        super(injector);
        //console.log(this.companys);
    }
    ngOnInit() {
    	
    	this._select2Service.getContactTypeInfo().subscribe((result) => {
           if (result.select2data != null) {
           	this.contactType=[];
           	this.contacttypes=[];
            this.contactType=result.select2data;
            this.contactType.forEach((company:{id:number,name:string})=>{
            	this.contacttypes.push({
            		id:company.id,
            		text:company.name
            	});
            	if(this.contactForm.value.infoid===company.id){
            		this.active_con=[{id:this.contactForm.value.infoid,text:company.name}];
            	}

            });

           } });
	}
	public refreshContactValue(value:any,model):void {
    model.controls.infoid.setValue(value.id);
    console.log(model.controls.infoid.value,value.id);
  }
} 