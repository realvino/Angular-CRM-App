import { Component, ViewChild, Injector, ElementRef, Output, EventEmitter, OnInit, ViewEncapsulation } from '@angular/core';
import { ModalDirective,TabsetComponent } from 'ngx-bootstrap';
import { AppComponentBase } from '@shared/common/app-component-base';
import { TeamServiceProxy, TeamListDto,CreateTeamInput,Select2ServiceProxy,Datadto,TeamDetailList,CreateTeamDetailInput } from "shared/service-proxies/service-proxies";
 
export interface SelectOption{
   id?: number;
   text?: string;
}
@Component({
    selector: 'createTeamModal',
    templateUrl: './create-edit-team.component.html',
    
    //styleUrls: ['./create-mile-stone.component.css'],
    encapsulation: ViewEncapsulation.None  // Enable dynamic HTML styles
})
export class CreateEditTeamComponent extends AppComponentBase implements OnInit {
  //private value:any = {};
	@Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('modal') modal: ModalDirective;
    @ViewChild('nameInput') nameInput: ElementRef;
    @ViewChild('staticTabs') staticTabs: TabsetComponent;
	team:CreateTeamInput = new CreateTeamInput();
	teams: TeamListDto [] = [];
	teamdetails:TeamDetailList[] =[];
	teamdetailscreate:CreateTeamDetailInput = new CreateTeamDetailInput();
    active = false;
	saving = false;
	active_teamdetails = false;
	private items:Array<any> = [];
    filter:string='';
	active_managed:SelectOption[]=[];
	private managedBy:Array<any> = [];
    managedType:Datadto[]=[];
	active_dept:SelectOption[]=[];
	private deptType:Array<any> = [];
    departtype:Datadto[]=[];
	managedId:number=0;
	saledepartId:number=0;
	eventOriginal = this.team;
	active_selmanaged:SelectOption[]=[];
	private selmanagedBy:Array<any> = [];
    selmanagedType:Datadto[]=[];
	teamsId:number;
    constructor(
        injector: Injector,
        private _teamProxyService: TeamServiceProxy,
		private _selectServiceProxy: Select2ServiceProxy
       
    ) {
        super(injector);
    }
 ngOnInit() {
	 this.getManager();
	 this.getdepartment();
	 this.getsaleManager();
 }
   show(teamId?: number): void {
	    this.team =new CreateTeamInput();
        this.getteambyId(teamId);
		this.getdepartment();
		this.getManager();
		this.getsaleManager(); 
		this.getteamdetails(teamId);
		this.teamsId = teamId;
		this.active_dept=[];
		this.active_selmanaged=[];
		if(teamId){
			 
            this.getteambyId(teamId);
			if(this.team.id){
			this.staticTabs.tabs[0].active = true;
            }	
        } 
	   
        this.active = true;
		this.active_teamdetails=true;
        this.modal.show();
      
    }
   
   
   save(): void {
        this.saving = true;
           if (this.team.id == null) {
               this.team.id = 0;
           }
          // this.team.tenantId = abp.multiTenancy.getTenantIdCookie();
		  console.log(this.team);
           this._teamProxyService.createOrUpdateTeam(this.team)
            .finally(() => this.saving = false)
            .subscribe(() => {
				
               this.notify.info(this.l('SavedSuccessfully'));
				this.team = this.eventOriginal;
				this.close();
				this.modalSave.emit(this.team); 
            });
            
            
    }
    onShown(): void {
        // $(this.nameInput.nativeElement).focus();
    }
    close(): void {
        this.selmanagedBy=[];
        this.active_dept = [];
        this.active = false;
        this.deptType=[];
        this.managedBy=[];
        this.modal.hide();
    }
    
  
  

getsaleManager(){
        this._selectServiceProxy.getOtherSalesManager().subscribe((result) => {
           if (result.select3data != null) {
            this.selmanagedType=result.select3data;
            this.selmanagedBy=[];
            this.selmanagedType.forEach((selmanagedtype:{id:number,name:string})=>{
              this.selmanagedBy.push({
                id:selmanagedtype.id,
                text:selmanagedtype.name
              });
               if(this.managedId==selmanagedtype.id){
                  this.active_selmanaged=[{id:selmanagedtype.id,text:selmanagedtype.name}];
                  this.team.salesManagerId =selmanagedtype.id;
              } 
            });
           } });
    }
	
getManager(){
        this._selectServiceProxy.getOtherSalesman().subscribe((result) => {
           if (result.select3data != null) {
            this.managedType=result.select3data;
            this.managedBy=[];
            this.managedType.forEach((managedtype:{id:number,name:string})=>{
              this.managedBy.push({
                id:managedtype.id,
                text:managedtype.name
              });
			  /* if(this.managedId==managedtype.id){
                  this.active_managed=[{id:managedtype.id,text:managedtype.name}];
                  this.team.salesManagerId =managedtype.id;
              } */
                
            });
           } });
    }
	
  
    getdepartment(){
        this._selectServiceProxy.getDepartment().subscribe((result) => {
           if (result.select2data != null) {
            this.departtype=result.select2data;
            this.deptType=[];
            this.departtype.forEach((departtype:{id:number,name:string})=>{
              this.deptType.push({
                id:departtype.id,
                text:departtype.name
              });
               if(this.saledepartId==departtype.id){
                  this.active_dept=[{id:departtype.id,text:departtype.name}];
                  this.team.departmentId =departtype.id;
              }
            });
           } });
    }

   selectManagedBy(data){
       this.teamdetailscreate.salesmanId=data.id;
    }
    removeManagedBy(data){
        this.teamdetailscreate.salesmanId=null;
    }
	selectselManagedBy(data){
       this.team.salesManagerId=data.id;
    }
    removeselManagedBy(data){
        this.team.salesManagerId=null;
    }
	selectdeptType(data){
       this.team.departmentId=data.id;
    }
    removedeptType(data){
       this.team.departmentId=null;
    }
    
   getteambyId(teamId):void{
		
        this._teamProxyService.getTeamForEdit(teamId).subscribe((result) => {
			if (result.teams != null) {
				this.team = result.teams;
				this.managedId = result.teams.salesManagerId;
				this.saledepartId = result.teams.departmentId;
				this.active_selmanaged = [{id: result.teams.salesManagerId, text: result.teams.salesManager}];
                this.active_dept = [{id: result.teams.departmentId, text: result.teams.departmentName}];
            }
        }); 
    } 
	 getteamdetails(teamId) {
      console.log(this.teamdetails);
        //this.teamdetails.teamId = this.teams.id;
        this._teamProxyService.getTeamDetail(teamId).subscribe((result) => {
			console.log(result.items,'details');
            this.teamdetails = result.items;


        });
    }

	 teamdetailssave() {

        if (this.teamdetailscreate.id == null) {
            this.teamdetailscreate.id = 0;
        }

        this.teamdetailscreate.teamId = this.team.id;
        console.log(this.teamdetailscreate, 'save');
        this._teamProxyService.createTeamDetail(this.teamdetailscreate).subscribe(result=> {
            console.log(this.teamdetailscreate);
             this.notify.success(this.l("SavedSuccessfully"));
            this.teamdetailscreate = new CreateTeamDetailInput();
            this.getteamdetails(this.team.id); 


        });

    }
	 deleteteamdetails(data) {

        this.message.confirm(
            this.l('Are you sure to Delete the Team Details', data.salesman),
                isConfirmed => {
                if (isConfirmed) {
                    this._teamProxyService.deleteTeamDetail(data.id).subscribe(() => {
                        this.notify.success(this.l('Deleted Successfully'));
                        this.getteamdetails(this.teamsId);
                    });
                }
            }); 
    } 
}
