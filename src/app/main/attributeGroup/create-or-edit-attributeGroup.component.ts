import { Component, ViewChild, Injector, ElementRef, Output, EventEmitter, OnInit } from '@angular/core';
import { ModalDirective,TabsetComponent } from 'ngx-bootstrap';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AttributeGroupServiceProxy,CreateAttributeGroupInput,Select2ServiceProxy,AttributeDto,AttributeGroupDetailInput } from 'shared/service-proxies/service-proxies';
import { AppConsts } from "shared/AppConsts";
import * as _ from 'lodash';
export interface Select2Option{
    id?:number,
    text?:string
}

@Component({
    selector: 'createAttributeGroupModal',
    templateUrl: './create-or-edit-attributeGroup.component.html'
})
export class CreateAttributeGroupComponent extends AppComponentBase {
 
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('modal') modal: ModalDirective;
    @ViewChild('activeTabAttGroup') activeTabAttGroup: TabsetComponent;
    @ViewChild('nameInput') nameInput: ElementRef;
    attributeGroup: CreateAttributeGroupInput = new CreateAttributeGroupInput();
    attributeGroupDetail:AttributeGroupDetailInput =new AttributeGroupDetailInput();
    eventOriginal = this.attributeGroup;
    attributes_dto:AttributeDto[];
    private attributes:Array<any>=[];
    active_attribute:Select2Option[];
    attributes_detail:any=[];
    path : string = AppConsts.remoteServiceBaseUrl;
    active = false;
    saving = false;
    constructor(
        injector: Injector,
        private _attributeGroupService: AttributeGroupServiceProxy,
        private _select2Service:Select2ServiceProxy
    ) {
        super(injector);
    }


   show(attributeGroupId?: number): void {
        this.attributeGroup = new CreateAttributeGroupInput();
        if(attributeGroupId){
            this.getAttributes(attributeGroupId);
            if(this.attributeGroup.id){
                this.activeTabAttGroup.tabs[0].active = true;
            }
        }
        this.active = true;
        this.modal.show();
    }

 save(): void {
        this.saving = true;
           if (this.attributeGroup.id == null) {
               this.attributeGroup.id = 0;
           }
           console.log(this.attributeGroup);
             this._attributeGroupService.createOrUpdateAttributeGroup(this.attributeGroup)
            .finally(() => this.saving = false)
            .subscribe(() => {
                this.notify.success(this.l('SavedSuccessfully'));
                this.attributeGroup = this.eventOriginal;
                this.close();
                this.modalSave.emit(this.attributeGroup);
            });
    }

    onShown(): void {
        $(this.nameInput.nativeElement).focus();
    }
    close(): void {
        this.modal.hide();
        this.active = false;
    }
    deleteAttribute(data){
        this.message.confirm(
            this.l('Are you sure to Delete the Attribute', data.attributeName),
            isConfirmed => {
                if (isConfirmed) {
                  this._attributeGroupService.getDeleteAttributeGroupDetail(data.id).subscribe(() => {
                        this.notify.success(this.l('Deleted Successfully'));
                        _.remove(this.attributes_detail, data); 
                    });
                }
            }
        );
    }
    attributeSave(){
        if(this.attributeGroupDetail.id==null){
            this.attributeGroupDetail.id = 0;
        }
        this.attributeGroupDetail.attributeGroupId = this.attributeGroup.id;
        this._attributeGroupService.createOrUpdateAttributeGroupDetail(this.attributeGroupDetail).subscribe(result=>{
            this.notify.success(this.l("SavedSuccessfully"));
            this.attributeGroupDetail = new AttributeGroupDetailInput();
            this.getAttributes(this.attributeGroup.id);
        });
    }
    selectedAttribute(data){
        this.attributeGroupDetail.attributeId = data.id;
    }
    removeAttribute(data){
        this.attributeGroupDetail.attributeId = null;
    }

    getAttributes(attGroupId){
        this._attributeGroupService.getAttributeGroupForEdit(attGroupId).subscribe((result) => {
           if (result.attributeGroup != null) {
            this.attributeGroup = result.attributeGroup;
            if(result.attributeGroupDetails!=null){
                    this.attributes_detail = result.attributeGroupDetails;
            }
            this._select2Service.getAttribute().subscribe((result) => {
               if (result.select3data != null) {
                this.attributes_dto = result.select3data;
                this.attributes = [];
                this.attributes_dto.forEach((att:{id:number,name:string})=>{
                    this.attributes.push({
                        id:att.id,
                        text:att.name
                    });
                });
               } 
            });
           }
        });
    }
}
