import { Component, ChangeDetectorRef,OnInit, Injector,AfterViewInit,ViewChild } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { Customer } from './customer.interface';
import { appModuleAnimation } from "shared/animations/routerTransition";
import { AppComponentBase } from "shared/common/app-component-base";
import { Router,ActivatedRoute } from "@angular/router";
import { Http } from "@angular/http";
import { Select2ServiceProxy, Datadto,NewCompanyContactServiceProxy,CreateAddressInfo,CreateContactInfo,CreateCompanyOrContact,NewContactListDto, EntityDto } from "shared/service-proxies/service-proxies";
import { CreateOrEditContactNewModalComponent } from "app/main/newContact/create-edit-contact.component";
import { ISlimScrollOptions } from 'ng2-slimscroll';

export interface SelectOption{
   id?: number;
   text?: string;
}

@Component({
    templateUrl: './newCompany.component.html',
    styleUrls: ['./custom.component.css'],
    animations: [appModuleAnimation()]
})
export class newCompanyComponent extends AppComponentBase implements OnInit,AfterViewInit {

  appr: boolean;
@ViewChild('createNewContactModal') createNewContactModal: CreateOrEditContactNewModalComponent;
  private value:any = {};
  private _disabledV:string = '0';
  private disabled:boolean = false;
  initData:number=0;
  addinitData:number=0;
  values_arr:any=[];
  contact_arr:any=[];
  companyContacts:NewContactListDto[] = [];
  company: CreateCompanyOrContact = new CreateCompanyOrContact();
  address:CreateAddressInfo =new CreateAddressInfo();
  contact:CreateContactInfo = new CreateContactInfo();
  removed_address_arr:any=[];
  remove_contact_arr:any=[];
  private companytypes:Array<any> = [];
  companyType:Datadto[]=[];
  active_company:SelectOption[];
   public myForm: FormGroup;
   cusTypeId:number=0;
   cmpname:string='';
   customer_id:string='';
   TRNNumber:string='';
   TradeLicence:string='';
   isApproved:boolean=false;
   formdata:any=[];
   dataCon: any=[];
   contact_remove_values:any=[];
   address_remove_values:any=[];
   id:number=0;
   enq_id:number=0;
   saving:boolean=true;
   opts: ISlimScrollOptions;
    set_opacity:string='1';
    active_managed:SelectOption[]=[];
    active_user:SelectOption[]=[];
    active_app:SelectOption[]=[];

    managedId:number=0;
    approved:number=0;
    isapproved:boolean= true;

    private managedBy:Array<any> = [];
    managedType:Datadto[]=[];
    AppInput:EntityDto = new  EntityDto();
    private indus:Array<any>=[];
    allIndustry:Datadto[];
    active_indus:SelectOption[];

   constructor(
        injector: Injector,
        private _http: Http,
        private _fb: FormBuilder,
        private _cfb: FormBuilder,
        private router: Router,
        private _activatedRoute: ActivatedRoute,
        private _select2Service: Select2ServiceProxy,
        private _newCompanyContactServiceProxy:NewCompanyContactServiceProxy ,
        private cdr: ChangeDetectorRef 
    )
    {
        super(injector); 
        this._activatedRoute.params.subscribe(params => {
            this.id = +params['id'];   //<----- + sign converts string value to number
            this.enq_id = +params['enId'];
});
        console.log(this.id,this.enq_id);

    }
       showing(){
        console.log(this.cusTypeId);
        return this._fb.group({
            companyName: [this.cmpname, [Validators.required]],
            customerId: [this.customer_id],
            tradeLicense: [this.TradeLicence],
            trNnumber:[this.TRNNumber],
            typeid: this.cusTypeId,
            managed:this.managedId,
            addresses: this._fb.array([]),
            contacts: this._cfb.array([]),
            discountable: [this.company.discountable],
            undiscountable: [this.company.unDiscountable]
        });
        
       } 
       ngOnInit() {
        this.contact_remove_values =[];
        this.address_remove_values=[];
        this.dataCon=[];
        this.formdata=[];
        this.cusTypeId=null;
        this.opts = {
      position: 'right',
      barBackground: 'grey',
      barWidth:'7',
      gridWidth:'5',
      gridBackground:'white'

    }
    this._newCompanyContactServiceProxy.getNewCompanyForEdit(this.id).subscribe((result)=>{
            if(result!=null){
              this.formdata=result[0].addressInfo;
              this.dataCon = result[0].contactinfo;
              this.cmpname = result[0].name;
              this.customer_id = result[0].customerId;
              this.TradeLicence = result[0].tradeLicense;
              this.TRNNumber = result[0].trNnumber;
              this.cusTypeId = result[0].newCustomerTypeId;
              this.managedId = result[0].accountManagerId;
              this.isApproved = result[0].isApproved;
              this.approved = result[0].approvedById;
              this.company.industryId= result[0].industryId;
              this.active_user=[{id:result[0].creatorUserId,text:result[0].userName}];
              this.active_app=[{id:result[0].approvedById,text:result[0].approvedName}];
              this.company.discountable = result[0].discountable;
              this.company.unDiscountable = result[0].unDiscountable;
            this._select2Service.getNewCompanyType().subscribe((result) => {
           if (result.select2data != null) {
            this.companyType=result.select2data;
            this.companytypes=[];
            this.companyType.forEach((company:{id:number,name:string})=>{
              this.companytypes.push({
                id:company.id,
                text:company.name
              });
              if(this.cusTypeId===company.id){
                   this.active_company = [{id:company.id,text:company.name}];
                   this.company.newCustomerTypeId =company.id;
                }
            });
            
           } });

           this._select2Service.getIndustry().subscribe((result) => {
            if (result.select2data != null) {
             this.allIndustry=result.select2data;
             this.indus=[];
             this.allIndustry.forEach((industry:{id:number,name:string})=>{
               this.indus.push({
                 id:industry.id,
                 text:industry.name
               });
               if(this.company.industryId==industry.id){
                 this.active_indus = [{id:industry.id,text:industry.name}];
               }
             });
            } });

            this._select2Service.getSalesman().subscribe((result) => {
           if (result.select3data != null) {
            this.managedType=result.select3data;
            this.managedBy=[];
            this.managedType.forEach((managedtype:{id:number,name:string})=>{
              this.managedBy.push({
                id:managedtype.id,
                text:managedtype.name
              });
              if(this.managedId==managedtype.id){
                  this.active_managed=[{id:managedtype.id,text:managedtype.name}];
                  this.company.accountManagerId =managedtype.id;
              }
            });
           } });
            this.myForm = this.showing();

            this.addAddress(0);
            // // add contact
            this.addContacts(0);

            
          }

        });
        
        this._newCompanyContactServiceProxy.getCompanyContacts(this.id).subscribe((result)=>{
                      if(result!=null){
                        this.companyContacts= result.items;
                      }
                    });
        
        
        this.myForm = this._fb.group({
            companyName: [this.cmpname, [Validators.required, Validators.minLength(5)]],
            customerId:[this.customer_id],
            tradeLicense: [this.TradeLicence],
            trNnumber:[this.TRNNumber],
            typeid: this.cusTypeId,
            managed:this.managedId,
            addresses: this._fb.array([]),
            contacts: this._cfb.array([]),
            discountable:[this.company.discountable],
            undiscountable:[this.company.unDiscountable]
            });
      console.log(this.cmpname);


    }
    ngAfterViewInit(): void {

    }
    getCompanyCon(){
      this._newCompanyContactServiceProxy.getCompanyContacts(this.id).subscribe((result)=>{
                      if(result!=null){
                        this.companyContacts= result.items;
                      }
                    });
    }
 // Contact
  initContact(){
         return this._cfb.group({
            id:0,
            contactinfo: [''],
            infoid: null
        });
    }

    addContacts(data) {
        //this.dataCon = [ {id:1,contactinfo: 'NagerCoil',infoid: 1,name:'Email'},{id:2,contactinfo: 'Chennai',infoid: 4,name:'Fax'}];
        const con = <FormArray>this.myForm.controls['contacts'];
         const addCon = this.initContact();
         if(this.dataCon.length>=1 && !data){

          this.dataCon.forEach((country:{infoData:string, newInfoTypeId:number,id:number})=>{
              con.push(
                this._cfb.group({
                  id:country.id,
            contactinfo: [country.infoData],
            infoid: country.newInfoTypeId
        })
              )
          });
            return 1;
         }
         con.push(addCon);
        // console.log(this.myForm.controls['contacts']);
        }

    removeContacts(i: number,data:any) {
        const control = <FormArray>this.myForm.controls['contacts'];
        this.remove_contact_arr.push(data._value);
        this.contact_remove_values.push(data._value);
        
        control.removeAt(i);
    }

// Address
    initAddress() {
      
        return this._fb.group({
            id:0,
            street: ['', Validators.required],
            postcode: [''],
            cityid: null,
            typeid: null,
            company:this.id,
            country:['']
        });
    }
    createContact(){
      this.createNewContactModal.show(this.id,0,'company',this.cmpname);
    }
    editCompanyContact(data){
      console.log(data);
      this.router.navigate(['app/main/contact/',data.id,0]);
    }

    allowedChars = new Set('0123456789'.split('').map(c => c.charCodeAt(0)));

    check(event: KeyboardEvent) {
    if (event.keyCode > 31 && !this.allowedChars.has(event.keyCode)) {
      event.preventDefault();
      }
    }
   
    addAddress(data) {
        const control = <FormArray>this.myForm.controls['addresses'];
        const addrCtrl = this.initAddress();
        if(this.formdata.length>=1 && !data){
            this.formdata.forEach((country:{id:number,address1:string, address2:string,cityId:number,newInfoTypeId:number,newCompanyId:number,countryName:string}) =>{
            control.push(this._fb.group({
            id: country.id,  
            street: [country.address1, Validators.required],
            postcode: [country.address2],
            cityid: country.cityId,
            typeid: country.newInfoTypeId,
            company:country.newCompanyId,
            country:country.countryName
        }))
            });

         return 1;
        }
        control.push(addrCtrl);
    }
    removeAddress(i: number,data:any) {
        const control = <FormArray>this.myForm.controls['addresses'];
        this.removed_address_arr.push(data._value);
        this.address_remove_values.push(data._value);
        
        console.log(this.address_remove_values.id);

        control.removeAt(i);
    }

  public selected(value:any):void {
    console.log('Selected value is: ', value);
    this.company.newCustomerTypeId = value.id; 
  }

  public removed(value:any):void {
    this.company.newCustomerTypeId =0;
    console.log('Removed value is: ', value);
  }

  refreshIndus(value:any){
    this.company.industryId = value.id;
  }
  removedIndus(value:any){
    this.company.industryId =null;
  }

  public typed(value:any):void {
    console.log('New search input: ', value);
  }

  public refreshValue(value:any,model):void {
    console.log(value);
    model.value.typeid = value.id;
    this.company.newCustomerTypeId = value.id

  }
  selectManagedBy(data):void{
      //model.value.managed = data.id;
      this.company.accountManagerId=data.id;
    }
    removeManagedBy(data):void{
      this.company.accountManagerId=null;
    }
  goToCompany(){
    if(this.enq_id){
      this.router.navigate(['app/main/kanban/'+this.enq_id]);
    }else{
    this.router.navigate(['app/main/company']);
  }
  }
  getApproved(appr)
  {
    if(appr.target.checked==true)
    {
      this.message.confirm(
        this.l('To Approve this Company'),
        isConfirmed => {
                if (isConfirmed) {
                  this.AppInput.id = this.id
                  this._newCompanyContactServiceProxy.approvedCompany(this.AppInput).subscribe((result)=>{
                    this.notify.success(this.l('Approved Successfully'));
                    this.ngOnInit();
                  })
                }
                else{
                  appr.target.checked= false;
                }
              }
      );
    }      
  }

  save(model) {
    console.log(model);
      this.cusTypeId =null;
      this.values_arr=[];
      this.contact_arr=[];
        for(var i=0;i<model.value.addresses.length;i++){
            if(model.value.addresses[i].id==0 || model.value.addresses[i].street!=this.formdata[i].address1 || model.value.addresses[i].postcode!=this.formdata[i].address2 || 
              model.value.addresses[i].cityid!=this.formdata[i].cityId || model.value.addresses[i].typeid!=this.formdata[i].newInfoTypeId){
              this.values_arr.push(model.value.addresses[i]);
              this.address.id = model.value.addresses[i].id;
              this.address.newCompanyId =model.value.addresses[i].company;
              this.address.newInfoTypeId = model.value.addresses[i].typeid;
              this.address.address1 = model.value.addresses[i].street;
              this.address.address2 = model.value.addresses[i].postcode;
              this.address.cityId = model.value.addresses[i].cityid;
              this.address.countryName = model.value.addresses[i].country;
              this._newCompanyContactServiceProxy.createOrUpdateAddressInfo(this.address).subscribe((result)=>{
              });
            }           
        }
        for(var i=0;i<model.value.contacts.length;i++){
            if(model.value.contacts[i].id==0 || model.value.contacts[i].contactinfo!=this.dataCon[i].infoData || model.value.contacts[i].infoid!=this.dataCon[i].newInfoTypeId ){
              this.contact_arr.push(model.value.contacts[i]);
              this.contact.id =model.value.contacts[i].id;
              this.contact.newCompanyId =this.id;
              this.contact.newContacId = null;
              this.contact.newInfoTypeId = model.value.contacts[i].infoid;
              this.contact.infoData = model.value.contacts[i].contactinfo;
              this._newCompanyContactServiceProxy.createOrUpdateContactInfo(this.contact).subscribe((result)=>{
              });
            }
        }
        if(this.cmpname!=model.value.companyName || model.value.typeid!=this.cusTypeId){
          console.log(this.company.newCustomerTypeId);
            this.company.id = this.id;
            this.company.newCompanyId = null;
            this.company.name = model.value.companyName;
            this.company.customerId = model.value.customerId;
            this.company.tradeLicense = model.value.tradeLicense;
            this.company.trNnumber = model.value.trNnumber;
            this.company.isApproved = this.isApproved;
            this.company.discountable = model.value.discountable;
            this.company.unDiscountable = model.value.undiscountable;
            if( this.approved > 0)
            {
              this.company.approvedById = this.approved;
            }
            else{
              this.company.approvedById = null;
            }
            
            this.company.discountable = this.company.discountable > 100?100:this.company.discountable;
            this.company.unDiscountable = this.company.unDiscountable > 100?100:this.company.unDiscountable;

            this._newCompanyContactServiceProxy.createOrUpdateCompanyOrContact(this.company)
            .finally(() => this.saving = false)
            .subscribe((result) => {
                this.company.newCompanyId = null;
                this.company.name = model.value.companyName;
                this.ngOnInit();                 
            });          
        }
        if(this.contact_remove_values.length>=1){
          this.contact_remove_values.forEach((con:{id:number})=>{
            this._newCompanyContactServiceProxy.getDeleteContactInfo(con.id).subscribe((result)=>{
        });
          });
        }
        if(this.address_remove_values.length>=1){
          this.address_remove_values.forEach((add:{id:number})=>{
              this._newCompanyContactServiceProxy.getDeleteAddressInfo(add.id).subscribe((result)=>{
        });
          });
        }
        if(this.enq_id!=0){
          this.router.navigate(['app/main/kanban/'+this.enq_id]);
        }
        this.ngOnInit();
        this.notify.success(this.l('Saved Successfully'));
    }
}