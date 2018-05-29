import 'jquery';
import 'bootstrap';
import { Component, ViewChild, Injector, Renderer,ElementRef,Input, Output, EventEmitter, OnInit, AfterViewInit ,OnDestroy} from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { AppComponentBase } from '@shared/common/app-component-base';
import {Jsonp} from '@angular/http';
import { ActivatedRoute,Router } from '@angular/router';
import { InquiryServiceProxy, EnqActCreate, Select2ServiceProxy, EnqActList, InquiryListDto, EnquiryContactServiceProxy } from "shared/service-proxies/service-proxies";

export interface SelectOption{
   id?: number;
   text?: string;
}

@Component({
    selector: 'createInqModal',
    templateUrl: './createActivityModelComponent.html',
    //styleUrls: ['./createActivityModal.component.less']

})
export class CreateIncActivityModalComponent extends AppComponentBase implements AfterViewInit,OnInit,OnDestroy {

	@Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
	@ViewChild('modal') modal: ModalDirective;
    @ViewChild('nameInput') nameInput: ElementRef;
	@ViewChild('activitytypeCombobox') activitytypeCombobox: ElementRef;
	@ViewChild('companyContactCombobox') companyContactCombobox: ElementRef;
	active_tagActType: SelectOption[];
	active_tagcontact:SelectOption[];
	
	filter = '';
    title='';
	notes='';
	types: any = [];
	enqActivity: any =[];
	contacts: any = [];
	inid: number;
	actid: number;
	private value:any = {};
	private sub: any; 
	enqActCreate: EnqActCreate = new EnqActCreate();
	EnqActivity: EnqActList = new EnqActList();
	additional:boolean = true;
    active = false;
	saving = false;
	
    constructor(
        injector: Injector,
        private renderer:Renderer,
        private _jsonp: Jsonp,
		private route: ActivatedRoute,
		private router: Router,
		private enqAct: InquiryServiceProxy,
	    private _select2Service: Select2ServiceProxy,
		private _enquiryContactServiceProxy: EnquiryContactServiceProxy
		
    )
	{
        super(injector);
    }
	
	ngAfterViewInit(): void {

    }
	ngOnInit(): void {
		this.sub = this.route.params.subscribe(params => {
			this.inid = +params['id'];
		});

		this.getActdetails();

  	}

	ngOnDestroy():void {
	
	}
	
	show(companyId:number,enqActivityId?:number): void {
		this.EnqActivity=new EnqActList();
		this.actid = enqActivityId;

		if(!this.inid){
			this.inid = companyId;
		}
		this.getComments();
		
		this.enqAct.getActivityForEdit(enqActivityId).subscribe((result) => {
           
            if (result.activities != null) {

                this.EnqActivity = result.activities;
		        this.enqActivity.id = this.actid;
			    this.enqActivity.enquiryId = this.EnqActivity.enquiryId; 
			    this.enqActivity.activityId = this.EnqActivity.activityId; 
                this.enqActivity.activityName = this.EnqActivity.activityName; 
			    this.enqActivity.title = this.EnqActivity.title; 
			    this.enqActivity.message = this.EnqActivity.message;
	            this.additional = false;
                this.active_tagActType = [{id:this.EnqActivity.activityId,text:this.EnqActivity.activityName}];
				this.active_tagcontact = [{id:this.EnqActivity.contactId,text:this.EnqActivity.contactName}];
            }
            
           this.active = true;
           this.modal.show();
        });

		this._enquiryContactServiceProxy.getEnquiryWiseEnquiryContact(this.inid).subscribe((result) => {

			if (result != null ) {

				this.contacts = result.items;
                 console.log(result.items);
				if(typeof(this.contacts) != 'undefined'){
					this.contacts.forEach((type:{contactId:number, newContactName:string}) => {
						this.contacts.push({
							id: type.contactId,
							text: type.newContactName
						});
					});
				}
				else{
					this.contacts=[];
				}
			}
			$(this.companyContactCombobox.nativeElement).selectpicker('refresh')
		});

		
			
    }
	getActdetails(){

		this._select2Service.getActivityTypes().subscribe((result) => {

			if (result != null) {
				this.types = result.select2data;
				this.types.forEach((type:{id:number, name:string}) => {
					if(type.name!='Task'){
					this.types.push({
						id: type.id,
						text: type.name
					});
				}
				});
			}
			$(this.activitytypeCombobox.nativeElement).selectpicker('refresh')
		});




	}
	
	save(): void {
console.log(this.types);
		this.saving = true;
		if(typeof(this.enqActivity.id)!='undefined')
		{
			this.enqActCreate.id =this.enqActivity.id;
		}
		else{
			this.enqActCreate.id=0;
		}


			this.enqActCreate.enquiryId = this.inid;
			this.enqActCreate.activityId = this.EnqActivity.activityId;
			this.enqActCreate.title = this.enqActivity.title;
			this.enqActCreate.message = this.enqActivity.message;
		    this.enqActCreate.contactId = this.EnqActivity.contactId;

	   this.enqAct.createOrUpdateEnquiryActivitys(this.enqActCreate)
            .finally(() => this.saving = false)
            .subscribe(() => {
                this.notify.info(this.l('SavedSuccessfully'));
				this.getComments();
                this.modalSave.emit(this.enqActCreate);
				//this.comment ='';
				this.close();
            });

    }
	onShown(): void {
        $(this.nameInput.nativeElement).focus();
    }
    
	public selectedActTypeValue(value:any):void {
   console.log('Selected value is: ', value);
         this.types.id = this.value;
 		 this.EnqActivity.activityId=this.value.id;
    }
	public refreshActTypeValue(value:any):void {
		this.value = value;
		
    }
    public removedActTypeValue(value:any):void {
       console.log('Removed value is: ', value);
    }
    public typedActTypeValue(value:any):void {
       console.log('New search input: ', value);
    }

	getComments(){
		/*this.enqAct.getEnqActComment(this.filter,this.activeId).subscribe((response) => {
			if(response.items != null){
			this.comments = response.items;
			
			}
		});*/
	}
	public selectedContactValue(value:any):void {
		console.log('Selected value is: ', value);
		this.contacts.id = this.value;
		this.EnqActivity.contactId=this.value.id;
	}
	public refreshContactValue(value:any):void {
		this.value = value;

	}
	public removedContactValue(value:any):void {
		console.log('Removed value is: ', value);
	}
	public typedContactValue(value:any):void {
		console.log('New search input: ', value);
	}

    close(): void {
		
		this.modal.hide();
		this.active = false;

		this.enqActivity.title='';
		this.enqActivity.message='';
		this.active_tagActType = [];
		this.active_tagcontact = [];

    }
	
	
}
