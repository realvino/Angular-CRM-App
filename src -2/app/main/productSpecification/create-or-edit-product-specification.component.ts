import { Component, ViewChild, Injector, ElementRef, Output, EventEmitter, OnInit,OnDestroy } from '@angular/core';
import { ModalDirective,TabsetComponent } from 'ngx-bootstrap';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ProductSpecificationServiceProxy,CreateProductSpecification, CreateProductSpecificationInput, Select2ServiceProxy,AttributeGroupListDto,AttributeGroupServiceProxy,Datadto,ProductGroupDetailChangeInput,EntityDto, ProductServiceProxy } from 'shared/service-proxies/service-proxies';
import { FileUploader, FileUploaderOptions, Headers } from '@node_modules/ng2-file-upload';
import { IAjaxResponse } from "abp-ng2-module/src/abpHttp";
import { TokenService } from "abp-ng2-module/src/auth/token.service";
import { AppConsts } from "shared/AppConsts";
import * as _ from 'lodash';
import { DataTable } from 'primeng/components/datatable/datatable';
import { Paginator } from 'primeng/components/paginator/paginator';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { Console } from '@angular/core/src/console';
import { CreateEditProductComponent } from 'app/main/product/create-or-edit-product.component';

export interface selectOption{
    id?:number,
    text?:string
}
@Component({
    selector: 'createProductSpecificationModal',
    templateUrl: './create-or-edit-product-specification.component.html'
})
export class CreateProductSpecificationComponent extends AppComponentBase implements OnDestroy {
 
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('modal') modal: ModalDirective;
    @ViewChild('staticTabs') staticTabs: TabsetComponent;
    @ViewChild('nameInput') nameInput: ElementRef;
    @ViewChild('newTable') newTable: DataTable;
    @ViewChild('paginator') paginator: Paginator;
    @ViewChild('createEditProductModal') createEditProductModal: CreateEditProductComponent;
    
    filterText: string = '';
    productSpecification: CreateProductSpecification = new CreateProductSpecification();
    eventOriginal = this.productSpecification;
    public imguploader: FileUploader;
    public temporaryPictureUrl: string;
    public saving: boolean = false;
    private pictureFileName: string;
    private _uploaderOptions: FileUploaderOptions = {};
    private _$profilePictureResize: JQuery;
    private _$jcropApi: any;
    path : string = AppConsts.remoteServiceBaseUrl;
    specificationDetails:Array<any>;
    ProductList:Array<any>;
    specificationDetailInput:CreateProductSpecificationInput = new CreateProductSpecificationInput();
    specifications:Array<any>;
    specificationGroupDto:AttributeGroupListDto[];
    filter:string='';
    expand:boolean=false;
    expand_index:number;
    gen_but_enble:boolean =false;
    gen_pro_enble:boolean =false;    
    SpecificationId:number;
    active_family:selectOption[];
    productFamily:Array<any>;
    productFamilyDto:Datadto[];
    productGroupChangeInput: ProductGroupDetailChangeInput = new ProductGroupDetailChangeInput();
    progress_percent:number=0;
    generateInput: EntityDto =new EntityDto();
    created:number;
    available:number;
    progress_view:boolean =false;
    isReset:boolean;
    active = false;
    group:Array<any>=[];
    datas:any;
    
    constructor(
        injector: Injector,
        private _productSpecificationService: ProductSpecificationServiceProxy,
        private _tokenService: TokenService,
        private _select2Service: Select2ServiceProxy,
        private _attributeGroupService: AttributeGroupServiceProxy,
        private _productservice:ProductServiceProxy 
    ) {
        super(injector);
        /*productdragulaService.drag.subscribe((value) => {
          
        });
        
        productdragulaService.setOptions('product-bag', {
            revertOnSpill: true,        
            moves: function (el, container, handle) { 
                return container.getAttribute("data-milestoneId") =='Assigned' || container.getAttribute("data-type") =='status' || container.getAttribute("data-milestoneId") =='junk' ? false : true;
            }
        });
        productdragulaService.drop.subscribe((value) => {
            let [eu, elu] = value.slice(2);
                console.log(eu.getAttribute("data-type"));
                this.onProductSpecificationDrop(value.slice(1),value.slice(4), value.slice(2));
            
        });*/
        this.progress_percent = 0;
        this.progress_view = false;
        this.isReset = true;
    }
    /*private onProductSpecificationDrop(itemArg, curArg, updatedArg){
        let [ei, eli] = itemArg;
        let [ec, elc] = curArg;
        let [eu, elu] = updatedArg;
        this.isReset = false;
        // console.log(ei.getAttribute("data-currId") ,Array.from(ei.parentNode.children).indexOf(ei));
        this.productGroupChangeInput.source = Number(ei.getAttribute("data-currId"));
        this.productGroupChangeInput.destination = Array.from(ei.parentNode.children).indexOf(ei);
        this.productGroupChangeInput.productGroupId =  this.productSpecification.productGroupId;
        this.productGroupChangeInput.rowId =  Number(ei.getAttribute("data-rowId"));
        this.orderChange();
    }*/
    orderChange(){
        this._productSpecificationService.productGroupDetailChange(this.productGroupChangeInput).subscribe(result=>{
            this.getProductSpecicationEdit(this.productSpecification.id);
        });
    }
    initializeModal(data? : any): void {
        this.active = true;
        this.pictureFileName = null;
        this._$profilePictureResize = null;
        this._$jcropApi = null;
        this.initFileUploader(data);
    }

    initFileUploader(data? : any): void {
        let self = this;
        self.imguploader = new FileUploader({ url: AppConsts.remoteServiceBaseUrl + "/Profile/UploadProductSpecificationPicture?SpecificationId="+data.id+"&ImgPath="+data.color});
        self._uploaderOptions.autoUpload = true;
        self._uploaderOptions.authToken = 'Bearer ' + self._tokenService.getToken();
        self._uploaderOptions.removeAfterUpload = true;
        self.imguploader.onAfterAddingFile = (file) => {
            file.withCredentials = false;
        };
        self.imguploader.onSuccessItem = (item, response, status) => {
            let resp = <IAjaxResponse>JSON.parse(response);
            if (resp.success) {
                this.temporaryPictureUrl = AppConsts.remoteServiceBaseUrl + resp.result.fileName;
                this.pictureFileName = resp.result.fileName;
            } else {
                this.message.error(resp.error.message);
            }
        };
        self.imguploader.setOptions(self._uploaderOptions);
    }
   show(productSpeciId?: number): void {
        this.created = 0;
        this.available = 0;
        this.SpecificationId = productSpeciId;
        this.active_family = [];
        this.productSpecification = new CreateProductSpecification();
        this._select2Service.getProductGroup().subscribe(result=>{
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

        if(productSpeciId){
            this.getProductSpecicationEdit(productSpeciId);
            if(this.productSpecification.id){
                this.staticTabs.tabs[0].active = true;
            }
        }
        this.active = true;
        this.modal.show();
    }
   /*  getProductSpecicationEdit(productAttributeId){
        this._productSpecificationService.getProductSpecificationForEdit(productAttributeId).subscribe(result => {
			
            this.created =result.created;
            this.available = result.available;
           if (result.productSpecification != null) {
            this.productSpecification = result.productSpecification;
            this.temporaryPictureUrl = this.path + result.productSpecification.imageUrl;
            this.initializeModal(this.productSpecification);
            if(result.productSpecification.productGroupId!=null){
                this.active_family = [{id:result.productSpecification.productGroupId,text:result.productSpecification.productGroupName}];
            }
            if(result.productSpecification.imageUrl!=null){
                this.pictureFileName = this.path + result.productSpecification.imageUrl;
            }
           }
           if(result.productSpecificationDetails!=null){

                this.specificationDetails = result.productSpecificationDetails;

           }
           this._attributeGroupService.getAttributeGroup(this.filter).subscribe(result=>{
                if(result.items){
                    this.specificationGroupDto = result.items;
                    this.specifications = [];
                    this.specificationGroupDto.forEach((sp_group:{id:number,attributeGroupName:string})=>{
                        this.specifications.push({
                            id:sp_group.id,
                            text:sp_group.attributeGroupName
                        });
                    });
                }
           });
        });
    } */
	getProductSpecicationEdit(productAttributeId){
        this.gen_but_enble = false;
        this._productSpecificationService.getProductSpecificationForEdit(productAttributeId).subscribe(result => {
            this.created =result.created;
            this.available = result.available;
           if (result.productSpecification != null) {
            this.productSpecification = result.productSpecification;
            this.temporaryPictureUrl = this.path + result.productSpecification.imageUrl;
            this.initializeModal(this.productSpecification);
            if(result.productSpecification.productGroupId!=null){
                this.active_family = [{id:result.productSpecification.productGroupId,text:result.productSpecification.productGroupName}];
            }
            if(result.productSpecification.imageUrl!=null){
                this.pictureFileName =  result.productSpecification.imageUrl;
            }
           }
           if(result.productSpecificationDetails!=null){

                this.specificationDetails = result.productSpecificationDetails;
                
                this.specificationDetails.forEach((spe:{id:number,attributeGroups:any})=>{
                    if(spe.attributeGroups.findIndex(x=>x.selected==true)=='-1'){
                        this.gen_but_enble = true;
                    }
					   
                });

                let i=0;
                this.group = [];
                this.specificationDetails.forEach((e)=>{
                    this.group.push({'attributeGroupId':0,'attributeId':[]});
                    e.attributeGroups.forEach((o)=>{
                    this.group[i]['attributeGroupId']=o.attributeGroupId;
                    if(o.selected==true){
                        this.group[i]['attributeId'].push(o.attributeId);
                    }
                    });
                i++;
                });
            }
           this._attributeGroupService.getAttributeGroup(this.filter).subscribe(result=>{
                if(result.items){
                    this.specificationGroupDto = result.items;
                    this.specifications = [];
                    this.specificationGroupDto.forEach((sp_group:{id:number,attributeGroupName:string})=>{
                        this.specifications.push({
                            id:sp_group.id,
                            text:sp_group.attributeGroupName
                        });
                    });
                }
           });
        });
    }

    editProduct(data): void {
        this.createEditProductModal.show(data.id);
    }
    deleteProduct(product_list:any): void {
        this.message.confirm(
            this.l('Are you sure to Delete the Product', product_list.productName),
                isConfirmed => {
                if (isConfirmed) {
                    this._productservice.getDeleteProduct(product_list.id).subscribe(result=>{
                        this.getProductSpecicationEdit(this.productSpecification.id);
                        this.getProduct();
                    });
                    this.notify.success("deleted successfully");
                }
            }
        );
    }
    getProduct(event?: LazyLoadEvent): void {
        let data;
        this.gen_pro_enble = false;        
        try {
            if(this.primengDatatableHelper.getMaxResultCount(this.paginator, event)==0){
                data=10;
            }
            else{
                data=this.primengDatatableHelper.getMaxResultCount(this.paginator, event)
            }
            this.primengDatatableHelper.showLoadingIndicator();
    
            this._productSpecificationService.getProducts(
                this.SpecificationId,
                this.filterText,
                this.primengDatatableHelper.getSorting(this.newTable),
                data,
                this.primengDatatableHelper.getSkipCount(this.paginator, event)
            ).subscribe(result => {
                this.primengDatatableHelper.totalRecordsCount = result.totalCount;
                this.primengDatatableHelper.records = result.items;
                this.primengDatatableHelper.hideLoadingIndicator();
                for(var call of this.primengDatatableHelper.records) {
                    if(call.inQuotationProduct==true){
                                this.gen_pro_enble = true;
                                break;
                     }
                }
            });
        }
        catch(err) {
            this._productSpecificationService.getProducts(
                this.SpecificationId,
                this.filterText,
                "",
                10,0
                
            ).subscribe(result => {
                this.primengDatatableHelper.totalRecordsCount = result.totalCount;
                this.primengDatatableHelper.records = result.items;
                this.primengDatatableHelper.hideLoadingIndicator();
                for(var call of this.primengDatatableHelper.records) {
                    if(call.inQuotationProduct==true){
                                this.gen_pro_enble = true;
                                break;
                     }
                }
               
            });
        }
        
    }
 save(): void {
        this.saving = true;
           if (this.productSpecification.id == null) {
               this.productSpecification.id = 0;
           }
           if(this.pictureFileName){
                this.productSpecification.imageUrl = this.pictureFileName;
            }else{
                this.productSpecification.imageUrl = this.productSpecification.imageUrl;
            }    
             this._productSpecificationService.createOrUpdateProductSpecification(this.productSpecification)
            .finally(() => this.saving = false)
            .subscribe(result => {
                this.notify.success(this.l('SavedSuccessfully'));
                this.productSpecification = this.eventOriginal;
                this.close();
                this.modalSave.emit(this.productSpecification);
            });
    }

    onShown(): void {
        // $(this.nameInput.nativeElement).focus();
    }
    close(): void {
        this.temporaryPictureUrl = '';
        this.expand_index = 0;
        this.modal.hide();
        this.active = false;
    }
    selectedSpecification(data:any){
        this.specificationDetailInput.attributeGroupId = data.id;
    }
    removeSpecification(data:any){
        this.specificationDetailInput.attributeGroupId = null;
    }
    deletespecifications(specificationGroup){
        this.message.confirm(
            this.l('Are you sure to Delete the Product Specification Detail', specificationGroup.productGroupName),
            isConfirmed => {
                if (isConfirmed) {
                    this._productSpecificationService.getDeleteProductSpecificationDetail(specificationGroup.id).subscribe(result=>{
                            this.notify.success(this.l("DeletedSuccessfully"));
                            _.remove(this.specificationDetails, specificationGroup); 
                    });
                }
            }
        );
    }
    uncheckAll(){
        this.specificationDetails.forEach((e)=>{
            e.attributeGroups.forEach((e)=>{
                 e.selected = false;
            })
        });
        
        this.group.forEach((e)=>{
            e.attributeId=[];
        });
        this.gen_but_enble = true;
    }

    expand_group(data:number){
        if( this.expand_index == data ){
            this.expand = this.expand?false:true;
        }else{
            this.expand_index = data;
        }
    }
    selectedFamily(data:any){
        this.productSpecification.productGroupId = data.id;
    }
    removeFamily(data:any){
        this.productSpecification.productGroupId = null;
    }
    checked(data,all_data:any,All){
        let AllData = All;
        var index = this.group.findIndex(p => p.attributeGroupId == all_data.attributeGroupId);
        var attributeindex = this.group[index].attributeId.findIndex(p => p.attributeId == all_data.attributeId);
        if(data==true){

            if(attributeindex == -1){
                this.group[index]['attributeId'].push(all_data.attributeId);
            }

        }
        else{
            this.group[index]['attributeId'].splice(attributeindex,all_data.attributeId);
        }
        this.gen_but_enble = false;        
        AllData.forEach((spe:{id:number,attributeGroups:any})=>{
            if(spe.attributeGroups.findIndex(x=>x.selected==true)=='-1'){
                this.gen_but_enble = true;
            }
               
        });
    }
    saveProduct(){
        this.saving = true;        
        let that =this;
        this.generateInput.id = this.productSpecification.id;
        console.log(this.generateInput);        
        that.datas = {};
                this.datas =  {
                    "productSpecId": this.productSpecification.id,
                    "productGroupId": this.productSpecification.productGroupId,
                    "arributeGroupSelect": this.group
                };

                console.log(this.gen_but_enble,this.gen_pro_enble);

                if(this.gen_but_enble== true)
                {
                    if(this.gen_pro_enble== true){
                        this.message.confirm(
                            this.l('To Reset Product Specification Because Some Products are in Quotation'),
                            isConfirmed => {
                                if (isConfirmed) {
                                    $.ajax({
                                        type: "POST",
                                        url:AppConsts.remoteServiceBaseUrl+"api/services/app/ProductSpecification/CreateOrDeleteProductGroupDetails",
                                        async: false,
                                        data: JSON.stringify(this.datas),
                                        contentType: "application/json",
                                        complete: function (data) {
                                            if(data.status==200){
                                               
                                                that.getProductSpecicationEdit(that.productSpecification.id);
                                                that.notify.success("ProductGeneratedSuccessfully");                                                
                                                this.saving = false;                                    
                                            }
                                            else that.notify.error("Error Occured");
                                        }
                                    });
                                    this._productSpecificationService.confirmDeleteProductSpecification(this.generateInput).subscribe(result=>{                                               
                                        this.getProduct();                                         
                                    });     
                                }
                            }
                        ); 
                        
                    }
                    else{
                        $.ajax({
                            type: "POST",
                            url:AppConsts.remoteServiceBaseUrl+"api/services/app/ProductSpecification/CreateOrDeleteProductGroupDetails",
                            async: false,
                            data: JSON.stringify(this.datas),
                            contentType: "application/json",
                            complete: function (data) {
                                if(data.status==200){
                                    that.getProductSpecicationEdit(that.productSpecification.id);
                                    this.saving = false; 
                                    that.notify.success("ProductGeneratedSuccessfully");                                    
                                }
                                else that.notify.error("Error Occured");
                            }
                        });
                        this._productSpecificationService.confirmDeleteProductSpecification(this.generateInput).subscribe(result=>{   
                            this.getProduct();                             
                        });
                    }
                   
                }else{
                    $.ajax({
                        type: "POST",
                        url:AppConsts.remoteServiceBaseUrl+"api/services/app/ProductSpecification/CreateOrDeleteProductGroupDetails",
                        async: false,
                        data: JSON.stringify(this.datas),
                        contentType: "application/json",
                        complete: function (data) {
                            if(data.status==200){
                                that.notify.success("ProductGeneratedSuccessfully");                              
                                that.getProductSpecicationEdit(that.productSpecification.id);
                                this.saving = false; 
                                this.getProduct();                     
                                   
                            }
                            else that.notify.error("Error Occured");
                        }
                    });
                }
                               
    };
    generateProduct(){
        this.saving = true;                
        this.generateInput.id = this.productSpecification.id;
        this.progress_view = true;
        this._productSpecificationService.generateProduct(this.generateInput).subscribe(result=>{
            this.progress_percent =100;
            this.notify.success("ProductGeneratedSuccessfully");
            this.getProduct();            
            this.getProductSpecicationEdit(this.productSpecification.id);
            this.saving = false;                    
            this.progress_view = false;
        });
        setInterval(() => { this.progress(); },2);
    }
    regenerateProduct(){
        this.saving = true;                
        this.generateInput.id = this.productSpecification.id;
        this.progress_view = true;
        this._productSpecificationService.regenerateProduct(this.generateInput).subscribe(result=>{
            this.progress_percent =100;
            this.notify.success("ProductGeneratedSuccessfully");
            this.getProduct();            
            this.getProductSpecicationEdit(this.productSpecification.id);
            this.saving = false;                    
            this.progress_view = false;
        });
        setInterval(() => { this.progress(); },2);
    }
    progress(){
        if(this.progress_percent!=90){
            this.progress_percent = this.progress_percent+10;
        } 
    };        
    ngOnDestroy(){
    }
}
