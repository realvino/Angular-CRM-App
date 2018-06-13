import { Component, ViewChild, Injector, ElementRef, Output, EventEmitter, OnInit,OnDestroy } from '@angular/core';
import { ModalDirective ,TabsetComponent} from 'ngx-bootstrap';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ProductGroupListDto, ProductGroupServiceProxy,Select2ServiceProxy, Datadto,AttributeGroupServiceProxy,AttributeGroupListDto,CreateProductGroupDetailInput,ProductSpecificationServiceProxy,ProductGroupDetailChangeInput } from "shared/service-proxies/service-proxies";
import * as _ from 'lodash';
import { AppConsts } from 'shared/AppConsts';
import { DragulaService } from 'ng2-dragula/ng2-dragula';
export interface selectOption {
    id?:number,
    text?:string
}

@Component({
    selector: 'createProductGroupModal',
    templateUrl: './create-or-edit-productgroup.component.html'
})
export class CreateProductGroupModalComponent extends AppComponentBase implements OnDestroy {
 
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('modal') modal: ModalDirective;
    @ViewChild('tabsActive') tabsActive: TabsetComponent;
    @ViewChild('nameInput') nameInput: ElementRef;
    productGroup: ProductGroupListDto = new ProductGroupListDto();
    eventOriginal = this.productGroup;

    active_family:selectOption[];
    productFamily:Array<any>;
    productFamilyDto:Datadto[];

    active_category:selectOption[];
    productCategoryDto:Datadto[];
    productCategory:Array<any>;

    path : string = AppConsts.remoteServiceBaseUrl;    
    active_attribute_group : selectOption[];
    attributeGroupdto : AttributeGroupListDto[];
    attributeGroup:Array<any>;
    attributeGroupInput:CreateProductGroupDetailInput = new CreateProductGroupDetailInput();
    attributeGroupDetails:Array<any>;
    expand:boolean = false;
    expand_index:number;

    filter:string = '';
    active = false;
    saving = false;
    productGroup_id:number=null;
    productGroupChangeInput: ProductGroupDetailChangeInput = new ProductGroupDetailChangeInput();
    isReset:boolean;
    constructor(
        injector: Injector,
        private _productGroupService: ProductGroupServiceProxy,
        private _select2Service: Select2ServiceProxy,
        private _attributeGroupService : AttributeGroupServiceProxy,
        private _productSpecificationService: ProductSpecificationServiceProxy,
        private productdragulaService: DragulaService
    ) {
        super(injector);
        productdragulaService.drag.subscribe((value) => {
          //this.onDrag(value.slice(1));
        });
        
        productdragulaService.setOptions('product-bag', {
            revertOnSpill: true,        
            /*moves: function (el, container, handle) { 
                return container.getAttribute("data-milestoneId") =='Assigned' || container.getAttribute("data-type") =='status' || container.getAttribute("data-milestoneId") =='junk' ? false : true;
            }*/
        });
        productdragulaService.drop.subscribe((value) => {
            let [eu, elu] = value.slice(2);
                console.log(eu.getAttribute("data-type"));
                this.onProductSpecificationDrop(value.slice(1),value.slice(4), value.slice(2));
            
        });
    }

    private onProductSpecificationDrop(itemArg, curArg, updatedArg){
        let [ei, eli] = itemArg;
        let [ec, elc] = curArg;
        let [eu, elu] = updatedArg;
        this.isReset = false;
        // console.log(ei.getAttribute("data-currId") ,Array.from(ei.parentNode.children).indexOf(ei));
        this.productGroupChangeInput.source = Number(ei.getAttribute("data-currId"));
        this.productGroupChangeInput.destination = Array.from(ei.parentNode.children).indexOf(ei);
        this.productGroupChangeInput.productGroupId =  this.productGroup.id;
        this.productGroupChangeInput.rowId =  Number(ei.getAttribute("data-rowId"));
        this.orderChange();
    }
    orderChange(){
        this._productSpecificationService.productGroupDetailChange(this.productGroupChangeInput).subscribe(result=>{
            this.getProductAttributeGroup(this.productGroup.id);
        });
    }
   show(productGroupId?: number): void {
        this.active_family = [];
        this.productGroup = new ProductGroupListDto();
        this._select2Service.getProductFamily().subscribe(result=>{
                if(result.select2data){
                    this.productFamilyDto = result.select2data;
                    this.productFamily = [];
                    this.productFamilyDto.forEach((sp_group:{id:number,name:string})=>{
                        this.productFamily.push({
                            id:sp_group.id,
                            text:sp_group.name
                        });
                    });
                }
        });
        this._attributeGroupService.getAttributeGroup(this.filter).subscribe(result=>{
                if(result.items!=null){
                    this.attributeGroupdto = result.items;
                    this.attributeGroup = [];
                    this.attributeGroupdto.forEach((attr_group:{id:number,attributeGroupName:string})=>{
                            this.attributeGroup.push({
                                id: attr_group.id,
                                text: attr_group.attributeGroupName
                            });
                    });
                }
        });
        this.active_category = [];
    
        this._select2Service.getProductCategory().subscribe(result=>{
                   if(result.select2data){
                       this.productFamilyDto = result.select2data;
                       this.productCategory= [];
                        this.productFamilyDto.forEach((sp_group:{id:number,name:string})=>{
                           this.productCategory.push({
                               id:sp_group.id,
                               text:sp_group.name
                           });
                       });
                   }
               });
              
        if(productGroupId){
            this.productGroup_id = productGroupId;
            this.getProductAttributeGroup(productGroupId);
            if(this.productGroup.id){
                this.tabsActive.tabs[0].active = true;
            }
        }
        this.active = true;
        this.modal.show();     
    }
    getProductAttributeGroup(data){
        this._productGroupService.getProductGroupForEdit(data).subscribe((result) => {
           if (result.productGroup != null) {
            this.productGroup = result.productGroup;
           }
           if(result.familyDatas != null){
                this.active_family = [{id:result.familyDatas.id,text:result.familyDatas.name}];
           }
           if(result.productGroupDetails!=null){
                this.attributeGroupDetails = result.productGroupDetails;
           }
           if(result.categoryDatas!=null)
           {
            this.active_category=[{id:result.categoryDatas.id,text:result.categoryDatas.name}];
            }
        }); 
    }
 save(): void {
        this.saving = true;
           if (this.productGroup.id == null) {
               this.productGroup.id = 0;
           }
             this._productGroupService.createOrUpdateProductGroup(this.productGroup)
            .finally(() => this.saving = false)
            .subscribe(() => {
                this.notify.success(this.l('SavedSuccessfully'));
                this.productGroup = this.eventOriginal;
                this.close();
                this.modalSave.emit(this.productGroup);
            });
    }

    onShown(): void {
        // $(this.nameInput.nativeElement).focus();
    }
    close(): void {
        this.modal.hide();
        this.active = false;
    }
    selectedFamily(data:any){
        this.productGroup.familyId = data.id;
    }
    removeFamily(data:any){
        this.productGroup.familyId = null;
    }
    productGroupSave(){
        if(this.attributeGroupInput.id==null){
            this.attributeGroupInput.id = 0;
        }
        this.attributeGroupInput.metedata = "null";
        this.attributeGroupInput.productGroupId =  this.productGroup.id;
        this._productGroupService.createOrUpdateProductGroupDetail(this.attributeGroupInput).subscribe(result=>{
                this.notify.success(this.l("SavedSuccessfully"));
                this.getProductAttributeGroup(this.productGroup.id);
        });
    }
    selectedProductGroup(data:any){
        this.attributeGroupInput.attributeGroupId = data.id;
    }
    removeProductGroup(data:any){
        this.attributeGroupInput.attributeGroupId = null;
    }
    expand_group(data:number){
        this.expand = this.expand?false:true;
        this.expand_index = data;
    }
    selectedCategory(data:any){
        this.productGroup.productCategoryId= data.id;
    }
    removeCategory(data:any){
        this.productGroup.productCategoryId = null;
    }
    deleteAttributeGroup(attr_group_data){
        this.message.confirm(
            this.l('Are you sure to Delete the Product Group Detail'+attr_group_data.productGroupName),
            isConfirmed => {
                if (isConfirmed) {
                        this._productGroupService.getDeleteGroupDetail(attr_group_data.rowId).subscribe(result=>{
                                this.notify.success(this.l("DeletedSuccessfully"));
                                this.getProductAttributeGroup(this.productGroup_id);
                                _.remove(this.attributeGroupDetails, attr_group_data);
                        });
                }
            }
        );                
    }
    resetOrder(){
        this.isReset = true;
        this.productGroupChangeInput.productGroupId =  this.productGroup.id;
        this.productGroupChangeInput.rowId =  0;
        this.productGroupChangeInput.source = 0;
        this.productGroupChangeInput.destination = 0;
        this.orderChange();
    }
    ngOnDestroy(){
        this.productdragulaService.destroy('product-bag');
    }
}
