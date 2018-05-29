import { Component, Input,OnInit, Injector} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AppComponentBase } from "shared/common/app-component-base";
import { Http } from "@angular/http";
import { Select2ServiceProxy,Datadto,InquiryServiceProxy,LocationInputDto,Citydto } from "shared/service-proxies/service-proxies";
import { ActivatedRoute,Router } from '@angular/router';

export interface SelectOption{
   id?: number;
   text?: string;
}

@Component({
    moduleId: module.id,
    selector: 'address_con',
    styleUrls: ['./custom.component.css'],
    templateUrl: 'address.component.html',
})
export class ContactAddressNewComponent extends AppComponentBase implements OnInit{
    @Input('group')
    public adressForm: FormGroup;
    private companytypes:Array<any> = [];
    private location:Array<any> = [];
 	companyType:Datadto[]=[];
 	locations: Citydto[] = [];
 	active_location: SelectOption[];
 	active_company:SelectOption[];
 	LocText:string = null;
 	locat:LocationInputDto = new LocationInputDto();
  id:number;
  private sub:any;
  displayOption:boolean=false;
 	constructor(
        injector: Injector,
        private _select2Service: Select2ServiceProxy,
        private _inquiryServiceProxy: InquiryServiceProxy,
        private router:Router,
        private _activatedRoute:ActivatedRoute
        
    ){
        super(injector);
        //console.log(this.companys);

    }
    ngOnInit() {
      this.sub = this._activatedRoute.params.subscribe(params => {
       this.id = +params['id']; // (+) converts string 'id' to a number
       
    });
      // console.log(this.router.url,' address form url');
      if(this.router.url=='/app/main/kanban' || this.router.url=='/app/main/kanban/'+this.id || this.router.url=='/app/main/sales-enquiry' || this.router.url=='/app/main/sales-enquiry/'+this.id || this.router.url=='/app/main/enquiry/'+this.id || this.router.url=='/app/main/leads/'+this.id){
          this.displayOption=true;
      }else{
          this.displayOption=false;
      }
    	this._select2Service.getCompanyTypeinfo().subscribe((result) => {
           if (result.select2data != null) {
           	this.companytypes=[];
            this.companyType=result.select2data;
            this.companyType.forEach((company:{id:number,name:string})=>{
            	this.companytypes.push({
            		id:company.id,
            		text:company.name
            	});
            	if(this.adressForm.value.typeid==company.id){
            		this.active_company=[{id:company.id, text:company.name}];
            	}
            	
            });

           } });
    	this._select2Service.getCity().subscribe((result) => { 
            
           if (result.select2data != null) {
           	this.location = [];
             this.locations = result.select2data;
               this.locations.forEach((loc:{id:number, name:string,country:string}) => {
              this.location.push({
                       id: loc.id,
                       text: loc.name,
                       country:loc.country
              });
              if(this.adressForm.value.cityid==loc.id){
              	this.active_location=[{id: loc.id, text: loc.name}];
              }
              
             });
         } 
        });
    	//this.city_list=[{id:1,text:'NagerCoil'},{id:2,text:'Kottar'}];
    } 
    public refreshValue(value:any,model):void {
    model.controls.typeid.setValue(value.id);
    console.log(model.controls.typeid.value,value.id);
  }
  //Location
public typedLocation(value:any,model:any):void {
    // model.controls.country.setValue('');
    // this.searchTerm(value,this.locations,'city');
  }
 public selectedLocation(value:any,model:any,data:any):void {
    var index = data.findIndex(x => x.id==value.id);
    //console.log('Selected value is: ', value);
    model.controls.cityid.setValue(value.id);
    model.controls.country.setValue(data[index].country);
    //this.active_location = [{id:0,text:data}];
    this.LocText = null;
  }

  public removedLocation(value:any,model:any):void {
    this.LocText = null;
    model.controls.country.setValue('');
    console.log('Removed value is: ', value);
  }

 saveLocation(): void {
       this.message.confirm(
                this.l('Are You Sure To Add Location'),
                (isConfirmed) => {
             if (isConfirmed) {
             this._inquiryServiceProxy.newLocationCreate(this.locat)
            .subscribe((result) => {
                this.notify.info(this.l('SavedSuccessfully'));
                //this.inquiry.locationId = result;
                this.LocText = null;
                });
                }
             }
        );
    }
     searchTerm(data,total_arr,type):void{
    
    for(var i =0;i<total_arr.length;i++) {
              var search_name = total_arr[i].name.toLowerCase();
              if(search_name.indexOf(data.toLowerCase())!= -1 && search_name===data.toLowerCase() || total_arr[i].name==''){
                this.LocText = null;
                break;
              
              }else{
                
                this.LocText = data;
                this.active_location = [{id:0,text:data}];
                this.locat.locationName = data;
                this.locat.locationCode = 'AUTO';
                this.locat.id = 0;
              
                continue;
              
              }
             }

  }
}