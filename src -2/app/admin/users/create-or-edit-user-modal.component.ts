import { Component, ViewChild, Injector, Output, EventEmitter, ElementRef } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { UserServiceProxy, ProfileServiceProxy,UserEditDto,SalesCoordinatorInput, CreateOrUpdateUserInput,SalesCoordinatorList, OrganizationUnitDto, UserRoleDto,Datadto,Datadtos, PasswordComplexitySetting,Select2ServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AppConsts } from '@shared/AppConsts';

import * as _ from "lodash";

export interface SelectOption{
    id?: number;
    text?: string;
}
@Component({
    selector: 'createOrEditUserModal',
    templateUrl: './create-or-edit-user-modal.component.html',
    styles: [`.user-edit-dialog-profile-image {
             margin-bottom: 20px;
        }`
    ]
})
export class CreateOrEditUserModalComponent extends AppComponentBase {

    @ViewChild('nameInput') nameInput: ElementRef;
    @ViewChild('createOrEditModal') modal: ModalDirective;

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    userDesignation:any=[];
    userDesig:Datadto[]=[];
    active_deg:SelectOption[]; 
    active_tagdept:SelectOption[];
    active: boolean = false;
    private roleIds:any = {};    
    selectedOption:boolean = true;
    saving: boolean = false;
    canChangeUserName: boolean = true;
    isTwoFactorEnabled: boolean = this.setting.getBoolean("Abp.Zero.UserManagement.TwoFactorLogin.IsEnabled");
    isLockoutEnabled: boolean = this.setting.getBoolean("Abp.Zero.UserManagement.UserLockOut.IsEnabled");
    passwordComplexitySetting: PasswordComplexitySetting = new PasswordComplexitySetting();
	
	enable_co_tab = true;
	enable_dep:boolean=false;
    user: UserEditDto = new UserEditDto();
    roles: UserRoleDto[];
    rolesCustom:Array<any>;
    organizationUnits: OrganizationUnitDto[];
    sendActivationEmail: boolean = true;
    setRandomPassword: boolean = true;
    passwordComplexityInfo: string = '';
    profilePicture: string;
    departments:any=[];
    private value:any = {};
    depts: Datadto[] = [];
	active_coordinator: SelectOption[];
    private selCoordinator:Datadtos[] = [];
    private coordinator:Array<any> = [];
    saless: SalesCoordinatorList= new SalesCoordinatorList();
    coOrdinatorInput:SalesCoordinatorInput = new SalesCoordinatorInput();
    displayName:string;
    constructor(
        injector: Injector,
        private _userService: UserServiceProxy,
        private _profileService: ProfileServiceProxy,
        private _select2Service: Select2ServiceProxy
    ) {
        super(injector);
    }
    toggle(data?: any):void
    {
      console.log(data);
    }
    
    show(userId?: number): void {
		this.coOrdinatorInput = new SalesCoordinatorInput();
        this.getDepartment();
        if (!userId) {
            this.active = true;
            this.setRandomPassword = true;
            this.sendActivationEmail = true;
        }
        
        this._userService.getUserForEdit(userId).subscribe(result => {
            this.user = result.user;
            this.roles = result.roles;
			 let enabledep =0;
            this.roles.forEach((data:{roleName:string,isAssigned:boolean}) =>{
                if(data.roleName=='3bf42d83c959410d95695aebed463ffd' && data.isAssigned==true){
                    enabledep++;
                }
            });
            this.rolesCustom = [];
            this.roles.forEach((UserRoleDto:{roleId:number,roleName:string,roleDisplayName :string,isAssigned:boolean})=>{
                this.rolesCustom.push({
                    roleId: UserRoleDto.roleId,
                    roleName: UserRoleDto.roleName,
                    roleDisplayName:UserRoleDto.roleDisplayName,
                    isAssigned:UserRoleDto.isAssigned
                });                               
           });

            if( enabledep >0 ){ 
				this.enable_dep = true; 
			}else{
				this.enable_dep = false;
			}
			
            var index = this.roles.findIndex(x=> x.isAssigned==true);
            this.displayName = this.roles[index].roleDisplayName;

            this.organizationUnits = result.organizationUnits;
            this.canChangeUserName = this.user.userName !== AppConsts.userManagement.defaultAdminUserName;

            this.getProfilePicture(result.profilePictureId);

            if (userId) {
                this.active = true;
                this.setRandomPassword = false;
                this.sendActivationEmail = false;
            }

            this._select2Service.getUserDesignation().subscribe(result => {
                if (result != null ) {
    
                    this.userDesignation =[];
                    this.userDesig = result.select2data;
                        this.userDesig.forEach((userdeg:{id:number, name:string}) => {
                            this.userDesignation.push({
                                id: userdeg.id,
                                text: userdeg.name
                            });
                            if(userdeg.id === this.user.userDesignationId){
                                this.active_deg= [{id:userdeg.id,text:userdeg.name}];
    
                            }
    
                        });
    
    
    
                }

        });
        
		
            this._profileService.getPasswordComplexitySetting().subscribe(result => {
                this.passwordComplexitySetting = result.setting;
                this.setPasswordComplexityInfo();

                this.modal.show();
            });
			
			
            this._userService.getSalesCoordinator(userId).subscribe(result=>{

                if(result.saless != null || result.saless != undefined){
                    this.saless=result.saless;
                    this.coOrdinatorInput.id = this.saless.id;
                    console.log(this.saless,789);
                    this.active_coordinator = [{id:this.saless.coordinatorId,text:this.saless.coordinatorName}];
                }else{  this.enable_co_tab = true;}


            });



            this._select2Service.getSalesCoordinator().subscribe(result=>{

                if (result != null ) {

                    this.coordinator =[];
                    this.selCoordinator = result.select3data;

                    this.selCoordinator.forEach((type:{id:number, name:string}) => {
                        this.coordinator.push({
                            id: type.id,
                            text: type.name
                        });
                    });
                }
            });
			
        });

    }

    setPasswordComplexityInfo(): void {

        this.passwordComplexityInfo = '<ul>';

        if (this.passwordComplexitySetting.requireDigit) {
            this.passwordComplexityInfo += '<li>' + this.l("PasswordComplexity_RequireDigit_Hint") + '</li>';
        }

        if (this.passwordComplexitySetting.requireLowercase) {
            this.passwordComplexityInfo += '<li>' + this.l("PasswordComplexity_RequireLowercase_Hint") + '</li>';
        }

        if (this.passwordComplexitySetting.requireUppercase) {
            this.passwordComplexityInfo += '<li>' + this.l("PasswordComplexity_RequireUppercase_Hint") + '</li>';
        }

        if (this.passwordComplexitySetting.requireNonAlphanumeric) {
            this.passwordComplexityInfo += '<li>' + this.l("PasswordComplexity_RequireNonAlphanumeric_Hint") + '</li>';
        }

        if (this.passwordComplexitySetting.requiredLength) {
            this.passwordComplexityInfo += '<li>' + this.l("PasswordComplexity_RequiredLength_Hint", this.passwordComplexitySetting.requiredLength) + '</li>';
        }

        this.passwordComplexityInfo += '</ul>';
    }

    getProfilePicture(profilePictureId: string): void {
        if (!profilePictureId) {
            this.profilePicture = "/assets/common/images/default-profile-picture.png";
        } else {
            this._profileService.getProfilePictureById(profilePictureId).subscribe(result => {

                if (result && result.profilePicture) {
                    this.profilePicture = 'data:image/jpeg;base64,' + result.profilePicture;
                } else {
                    this.profilePicture = "/assets/common/images/default-profile-picture.png";
                }
            });
        }
    }

    onShown(): void {
        $(this.nameInput.nativeElement).focus();
    }

    save(): void {
        var input = new CreateOrUpdateUserInput();

        input.user = this.user;
        input.setRandomPassword = this.setRandomPassword;
        input.sendActivationEmail = this.sendActivationEmail;
        input.assignedRoleNames =
            _.map(
                _.filter(this.rolesCustom, { isAssigned: true }), role => role.roleName
            );

        this.saving = true;
        this._userService.createOrUpdateUser(input)
            .finally(() => { this.saving = false; })
            .subscribe(() => {
                this.notify.info(this.l('SavedSuccessfully'));
                this.close();
                this.modalSave.emit(null);
            });
    }
    public selectuserDesignation(value:any):void {
        this.user.userDesignationId = this.value.id;            
       }
    public refreshDesigValue(value:any):void {
        this.value = value;

    }
    public removeuserDesignation(value:any):void {
        this.active_deg = null;
        this.user.userDesignationId =null;
    }

    clickMe(data) {
                   this.rolesCustom  =[];
                    this.roles.forEach((UserRoleDto:{roleId:number,roleName:string,roleDisplayName :string,isAssigned:boolean})=>{
                         if(data.roleId == UserRoleDto.roleId)
                         {
                            this.rolesCustom.push({
                                roleId: UserRoleDto.roleId,
                                roleName: UserRoleDto.roleName,
                                roleDisplayName:UserRoleDto.roleDisplayName,
                                isAssigned:true
                            });                         
                        }
                        else{
                            this.rolesCustom.push({
                                roleId: UserRoleDto.roleId,
                                roleName: UserRoleDto.roleName,
                                roleDisplayName:UserRoleDto.roleDisplayName,
                                isAssigned:false
                            });    
                        }
                         
                    });
                    console.log(this.rolesCustom);
       }
    close(): void {
        this.active = false;
        this.modal.hide();
    }
    
    getAssignedRoleCount(): number {
            if(_.filter(this.roles, { isAssigned: true }).length > 1){
               this.roleIds =  _.map(
                 _.filter(this.roles, { isAssigned: true }), role => role.roleId
               );
           
               this.roles.forEach((d:any)=>{
                if(d.roleId != this.roleIds){
                    d.isAssigned = false;
                }
               });
            }
            return _.filter(this.roles, { isAssigned: true }).length;
        }


        // getAssignedRoleCount(): number {
        //     return _.filter(this.roles, { isAssigned: true }).length;
        // }


    getDepartment(): void{
        this._select2Service.getDepartment().subscribe(result => {
            if (result != null ) {

                this.departments =[];
                this.depts = result.select2data;

                    this.depts.forEach((type:{id:number, name:string}) => {
                        this.departments.push({
                            id: type.id,
                            text: type.name
                        });
                        if(type.id === this.user.departmentId){
                            this.active_tagdept = [{id:type.id,text:type.name}];

                        }

                    });



            }

        });
    }
    

    public selectedDeptValue(value:any):void {
        console.log('Selected value is: ');
        this.user.departmentId = this.value.id;
       // this.EnqActivity.deptId=this.value.id;
    }
    public refreshDeptValue(value:any):void {
        this.value = value;

    }
    public removedDeptValue(value:any):void {
        console.log('Removed value is: ', value);
    }
    public typedDeptValue(value:any):void {
        console.log('New search input: ', value);
    }
	selectcoordinator(data):void{
        this.coOrdinatorInput.coordinatorId=data.id;
		this.enable_co_tab = false;
    }
    removecoordinator(data):void{
        this.coOrdinatorInput.coordinatorId=null;
		this.enable_co_tab = true;
    }

    setCoordinator():void{


       // this.coOrdinatorInput = new SalesCoordinatorInput();
        if(this.coOrdinatorInput.id==null){
            this.coOrdinatorInput.id = 0;
        }

        this.coOrdinatorInput.userId= this.user.id;
        this.saving = true;
        console.log(this.coOrdinatorInput,'input');
        this._userService.createOrUpdateSalesCoordinator(this.coOrdinatorInput)
            .finally(() => { this.saving = false; })
            .subscribe(() => {
                this.notify.info(this.l('SavedSuccessfully'));
            });
        }
}