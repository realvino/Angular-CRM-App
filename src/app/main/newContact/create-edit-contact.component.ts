import { Component, ViewChild, Injector, ElementRef, Output, EventEmitter, OnInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { AppComponentBase } from '@shared/common/app-component-base';
import { Router,ActivatedRoute } from "@angular/router";

import { NewCompanyContactServiceProxy, Select2ServiceProxy, CreateContactInput,EnquiryContactServiceProxy,CreateCompanyOrContact,EnquiryContactInputDto, TitleDto,Datadto, DesiginationDto, CompanyDto } from "shared/service-proxies/service-proxies";
export interface SelectOption{
   id?: number;
   text?: string;
}

@Component({
    selector: 'createNewContactModal',
    templateUrl: './create-edit-contact.component.html'
})
export class CreateOrEditContactNewModalComponent extends AppComponentBase  {


    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('modal') modal: ModalDirective;
    @ViewChild('nameInput') nameInput: ElementRef;

    act_comp:SelectOption[]=[];
    //titles: any = [];
    companys:CompanyDto[] = [];
    types:Datadto[];
    comp_disabled:boolean=false;
    designations: DesiginationDto[] = [];
    SelectedContactName:string = "";
    plusvalid:boolean=false;
    private items:Array<any> = [];
    private itemss:Array<any> = [];
	private title:Array<any> = [];
    private value:any = {};
    contact: CreateCompanyOrContact = new CreateCompanyOrContact();

    eventOriginal = this.contact;

    active = false;
    saving = false;
    enq_id:number=0;
    comp_id:number=0;
    come_from:string = "";
	  contactInput:EnquiryContactInputDto = new EnquiryContactInputDto();
	  public pathname:string='';
    public addcontact:boolean=false;
    private desg:Array<any>=[];
    allDesignation:Datadto[];
    constructor(
        injector: Injector,
        private _companyService: NewCompanyContactServiceProxy,
        private _select2Service: Select2ServiceProxy,
        private _activatedRoute: ActivatedRoute,
		private _enquiryContactServiceProxy: EnquiryContactServiceProxy,
        private router:Router

    ) {
        super(injector);
        /*this._activatedRoute.params.subscribe(params => {
            this.id = +params['id'];   //<----- + sign converts string value to number
            this.enq_id = +params['enId'];
        });*/
    }

    show(companyId?: number,enquiryId?:number,type?:string,companyName?:string): void {
        //this.contact = this.eventOriginal;
        console.log(enquiryId);
        
         this.enq_id = enquiryId; 
		 this.pathname = window.location.href;
       
		if(this.pathname.indexOf('main/kanban/')!== -1){
		console.log(this.pathname,'ffffffffffff');
		this.addcontact=true;
		}
        this.come_from = type;
        this.comp_id = companyId;
        if(this.come_from=='company')
        {
            this._select2Service.getAllCompany(companyName).subscribe((result) => {
                if (result.select2data != null) {
                 this.types = result.select2data;
                 this.itemss=[];
                   this.types.forEach((company:{id:number, name:string}) => {
                   this.itemss.push({
                   id: company.id,
                   text: company.name
                   }); 
                   if(this.comp_id==company.id){
                   this.act_comp=[{id:company.id,text:company.name}];
                    this.comp_disabled = true;
                    this.contact.newCompanyId=companyId;
                   }
                });   
                } 
            });
        }
           this._select2Service.getNewCustomerType().subscribe((result) => {
           if (result.select2data != null) {
            this.types = result.select2data;
            this.items=[];
              this.types.forEach((customer:{id:number, name:string}) => {
              this.items.push({
              id: customer.id,
              text: customer.name
              });
             });
            } });
        
		this._select2Service.getTitle().subscribe((result) => {
            if (result.select2data != null) {
              this.types = result.select2data;
              this.title=[];
                this.types.forEach((tit:{id:number, name:string}) => {
                  this.title.push({
                    id: tit.id,
                    text: tit.name
                  });
                });
            } 
		});
    this._select2Service.getDesignation().subscribe((result) => {
           if (result.select2data != null) {
            this.allDesignation=result.select2data;
            this.desg=[];
            this.allDesignation.forEach((desgn:{id:number,name:string})=>{
              this.desg.push({
                id:desgn.id,
                text:desgn.name
              });
        });
            
    } });
         this.active = true;
             this.modal.show();
             
    }

public refreshCompany(value:any):void {
    this.value = value;
  }
public removedCompany(value:any):void {
    console.log('Removed value is: ', value);
    this.contact.newCompanyId= 0;
    //this.plusvalid=false;
  }

public typedCompany(event):void {
  var value = event.target.value;
  this.getCompanys(value);
          for(let i=0;i<this.itemss.length;i++)
          {
               if(value.toLowerCase()==this.itemss[i].text.toLowerCase()||value==""){
                        this.plusvalid=false;
                        break;
               }
               else{                   
                   this.plusvalid=true;
                   //this.country.countryName = value;
               }
           } 
  }


 getCompanys(data):void{
    this._select2Service.getAllCompany(data).subscribe((result) => {
        if (result.select2data != null) {
         this.types = result.select2data;
         this.itemss=[];
           this.types.forEach((company:{id:number, name:string}) => {
           this.itemss.push({
           id: company.id,
           text: company.name
           });        
          });
         }
         
     });
  }

  public refreshCustomerTypeValue(value:any):void {
    this.value = value;
  }
public removedCustomerType(value:any):void {
    console.log('Removed value is: ', value);
    this.contact.newCustomerTypeId=0;
    //this.plusvalid=false;
  }
public selectedCompany(value:any):void {
        this.contact.newCompanyId=value.id;
        //this.plusvalid=false;
    }
    public selectedCustomerType(value:any):void {
        this.contact.newCustomerTypeId=value.id;
        this.plusvalid=false;
    }
	
	public refreshTitle(value:any):void {
         this.value = value;
    }
    public removedTitle(value:any):void {
         console.log('Removed value is: ', value);
    }
    public selectedTitle(value:any):void {
		//this.titles.id = this.value;
        this.contact.titleId = value.id;
		console.log('Selected value is: ', value);
        
    }
   save(form): void {
        this.saving = true;
           if (this.contact.id == null) {
               this.contact.id = 0;
           }
           //this.contact.name=this.SelectedContactName;
		   console.log(121,this.contact);
		     this._companyService.createOrUpdateCompanyOrContact(this.contact)
			 .finally(() => this.saving = false)
            .subscribe((result) => {
				this.notify.info(this.l('SavedSuccessfully'));
                this.contact = this.eventOriginal;
                this.close(form);
                this.modalSave.emit(this.contact);
                console.log(result);
                if(this.come_from=='company'){
                this.router.navigate(['app/main/company/contact/'+result,this.comp_id]);
              }else if(this.come_from=='enquiry'){
                  this.router.navigate(['app/main/contact/'+result,this.enq_id]);
                }else{
                  this.router.navigate(['app/main/contact/'+result,0]);
                }
            
			if(this.addcontact){

					this.contactInput.contactId = result;
					this.contactInput.inquiryId = this.enq_id;
					this.updateLinkedContact();
                 }
			});
              
    }
    onShown(): void {
        $(this.nameInput.nativeElement).focus();
    }
	
    close(form): void {
        form.resetForm();
        this.modal.hide();
        this.active = false;
        this.plusvalid=false;
        this.comp_disabled = false;
        this.act_comp =[];
    }
	updateLinkedContact(){
		this.contactInput.id = 0;
               
			this._enquiryContactServiceProxy.createOrUpdateEnquiryContact(this.contactInput)
			.subscribe(() => {
				this.notify.info(this.l('SavedSuccessfully'));
			});
		
	}
  refreshDesg(value:any){
      this.contact.designationId = value.id;
  }
  removedDesg(value:any){
      this.contact.designationId =null;
  }
}
