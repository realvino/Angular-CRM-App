import { Component, ViewChild, Injector, Renderer,ElementRef,Input, Output, EventEmitter, OnInit, AfterViewInit ,OnDestroy} from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { Select2ServiceProxy,InquiryServiceProxy, InquiryListDto,EnqActList,Datadto, Userprofiledto} from "shared/service-proxies/service-proxies";
import { ActivatedRoute,Router } from '@angular/router';
import { createCommentActivityModalComponent } from "app/main/activity_enq/createCommentActivityComponent";
import { ISlimScrollOptions } from 'ng2-slimscroll';
import { CreateIncActivityModalComponent } from '@app/main/inquiry/createActivityModelComponent';

export interface SelectOption{
    id?: number;
    text?: string;
 }

@Component({
    selector: 'createInquiry',
    templateUrl: './activity-enq.component.html',
    styleUrls: ['./createOReditModal.component.less'],
    animations: [appModuleAnimation()]

})

export class CreateActivityEnqComponent extends AppComponentBase implements AfterViewInit,OnInit{


    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('modal') modal: ModalDirective;
    @ViewChild('nameInput') nameInput: ElementRef;
    @ViewChild('createCommentModal') createCommentModal: createCommentActivityModalComponent;
    @ViewChild('createActivityModal') createActivityModal:CreateIncActivityModalComponent;
    opts: ISlimScrollOptions;
    set_opacity:string='1';
    config:any ={suppressScrollY:false};
	enqActivityList:any=[];
	filter:string = '';
    actTypes: Datadto[];
    radio_val:string='All';
    radioitems:any=[];

    salesmanId:number=0;
    active_salesman:SelectOption[];
    salesman:Array<any>;
    salesmanData:Userprofiledto[];
    showSelect: number;

	constructor(
        injector: Injector,
        private _inquiryServiceProxy: InquiryServiceProxy,
        private _select2Service: Select2ServiceProxy,
        private route:Router,
    ){
        super(injector);
        //console.log(this.companys);
    }

    ngAfterViewInit(): void {

       this.getAllActivities();

    }

    ngOnInit(): void{
        this.opts = {
      position: 'right',
      barBackground: 'grey',
      barWidth:'7',
      gridWidth:'5',
      gridBackground:'white'

    }
    this.radioitems.push({id:0,name:'All'});
    this._select2Service.getActivityTypes().subscribe((result) =>{

          if (result.select2data != null) {
              this.actTypes = result.select2data;
              this.actTypes.forEach((activity:{id:number,name:string}) =>{
                this.radioitems.push({
                  id:activity.id,
                  name:activity.name
              });
              });
              
          }

       });
       this._select2Service.getUserProfile().subscribe(result=>{			
		 if(result.select3data!=null){
			this.salesmanData = result.select3data;
			  this.salesman = [];
				this.salesmanData.forEach((sales:{id: number,name: string})=>{
					this.salesman.push({
						id: sales.id,
						text: sales.name
					});
				});
				this.showSelect = this.salesmanData.length;
				if(this.salesmanData.length == 1 ){
				  this.active_salesman = [{id: this.salesmanData[0].id,text: this.salesmanData[0].name}];
				  this.salesmanId = this.salesmanData[0].id;
				  this.getAllActivities();
				}
		}
	   });

    }

    show(): void {

        this.modal.show();

    }

    createComActivity(data): void {

        this.createCommentModal.show(data);
    }

    editEnqActivity(data): void {
        if(data.activityName != 'Task')
        {
            this.createActivityModal.show(data.enquiryId,data.id);
        }
        else{
            this.notify.warn(this.l('Cannot Edit Enquiry Activity'));
        }
        
    }

    openEnquiry(data): void {
        if(data.mileStoneId > 3){
            this.route.navigate(["/app/main/sales-enquiry",data.enquiryId]);
        }
        else{
            this.route.navigate(["/app/main/kanban",data.enquiryId]);
        }
        
    }
    activityEnquId(enquiryId): void {

        window.location.href='/app/main/kanban' + '/' + enquiryId;

    }
    over(){
        //this.set_opacity = this.set_opacity?'1':'0';
       /* if(this.set_opacity==='0'){
            this.set_opacity='1';
        }else{
            this.set_opacity='0';
        }
        this.opts = {
      position: 'right',
      barBackground: 'grey',
      barWidth:'7',
      gridWidth:'5',
      gridBackground:'white',
      barOpacity: this.set_opacity

    }*/
    console.log(this.set_opacity);
    }
    onRadioChange(name:string){
      console.log(name,' activity');
      this.radio_val = name;
    }
    getAllActivities():void{
        this._inquiryServiceProxy.getOverAllEnquiryActivitys(this.filter,this.salesmanId).subscribe((result) => {
            if(result.items != null){
               /* result.items.forEach((data)=>{
                    this._inquiryServiceProxy.getEnqActComment(this.filter,data.id).subscribe((response) => {

                        data['datalen'] = response.items.length;

                    });
                });*/
                this.enqActivityList = result.items;
                //console.log(71, this.enqActivityList);
            }

        });

    }

    selectSalesman(data:any){
        this.salesmanId = data.id;
        this.getAllActivities();
    }
    removeSalesman(data:any){
        this.salesmanId = 0;
        this.getAllActivities();
    }



}	