import { Component, ViewChild, Injector, ElementRef, Output, EventEmitter, OnInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { AppComponentBase } from '@shared/common/app-component-base';
import { Select2ServiceProxy, Datadto, ProductServiceProxy, ProductInput, ProductPriceLevelInput,Proddto,ProductImagesInput, TemporaryProductServiceProxy, TemporaryProductList, TemporaryProdImages, ProductLinkInput, NullableIdDto, TemporaryProductInput, Productdetailsdto } from "shared/service-proxies/service-proxies";
import { FileUploader, FileUploaderOptions, Headers } from '@node_modules/ng2-file-upload';
import { AppConsts } from "shared/AppConsts";
import { IAjaxResponse } from "abp-ng2-module/src/abpHttp";
import { TokenService } from "abp-ng2-module/src/auth/token.service";
import { EditPriceModalComponent } from "app/main/product/create-or-edit-price.component";
import { Select2Option } from 'app/main/attributeGroup/create-or-edit-attributeGroup.component';


export interface SelectOption {
    id?: number;
    text?: string;
}


@Component({
    selector: 'createEditProductModal',
    templateUrl: './create-or-edit-product.component.html',
    styleUrls : ['./create-or-edit-product.component.css']
})
export class CreateEditProductComponent extends AppComponentBase  {

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('modal') modal: ModalDirective;
    @ViewChild('nameInput') nameInput: ElementRef;
    
    @ViewChild('EditPriceModal') EditPriceModal : EditPriceModalComponent;    
    public active: boolean = false;
    public imguploader: FileUploader;
    public temporaryPictureUrl: string;
    public saving: boolean = false;
    private pictureFileName: string;
    private _uploaderOptions: FileUploaderOptions = {};
    private _$profilePictureResize: JQuery;
    private _$jcropApi: any;
    saveAsInput:NullableIdDto = new NullableIdDto();
    discontinue:boolean=false;
    htmlEditorInput:string;
    private product_group:Array<any>=[];
    product:Proddto[];
    private product_subgroup:Array<any>=[];
    product_sub:Datadto[];
    active_product:SelectOption[];
    active_product_sub:SelectOption[];
    product_input:ProductInput =new ProductInput();
    pricelevel:ProductPriceLevelInput = new ProductPriceLevelInput();
    private price_level:Array<any>;
    priceleveldto:Datadto[];
    priceDetails:any=[];
    active_price_level:SelectOption[];
    path : string = AppConsts.remoteServiceBaseUrl;
    product_imageInput:ProductImagesInput = new ProductImagesInput();
    imageList:Array<any>;
    processed_image:boolean=false;
    temporaryProduct_Details:TemporaryProductList = new TemporaryProductList();
    temporaryProduct_Images:TemporaryProdImages[] = new Array();
    temporaryProductDto:Datadto[];
    private suspectCode:Array<any>;
    active_suspectCode:Select2Option[];
    suspect_Dto:boolean=false;
    temporaryProduct_LinkInput:ProductLinkInput = new ProductLinkInput();   
    
    active_ProductState:SelectOption[];
    productStateDto:Datadto[];
    productState:Array<any>;

    active_StandardProduct:SelectOption[];
    standardProductdto:Productdetailsdto[];
    standardProduct:Array<any>;
    standardProductSelected:boolean = false;
    tempProductInput:TemporaryProductInput =new TemporaryProductInput();
    
    constructor(
        injector: Injector,
        private _selectProxyService: Select2ServiceProxy,
        private _productServiceProxy:ProductServiceProxy,
        private _tokenService: TokenService,
        private _temporaryProductServiceProxy: TemporaryProductServiceProxy
        
    ) {
        super(injector);
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
        console.log(data);
        self.imguploader = new FileUploader({ url: AppConsts.remoteServiceBaseUrl + "/Profile/UploadMultiProductPicture?ProductId="+data.id});
        self._uploaderOptions.autoUpload = true;
        self._uploaderOptions.authToken = 'Bearer ' + self._tokenService.getToken();
        self._uploaderOptions.removeAfterUpload = true;
        self.imguploader.onAfterAddingFile = (file) => {
            file.withCredentials = false;
            console.log(file);
        };
        self.imguploader.onSuccessItem = (item, response, status) => {
            this.processed_image = true;
            let resp = <IAjaxResponse>JSON.parse(response);
            if (resp.success) {
                console.log(resp.result);
                this.temporaryPictureUrl = AppConsts.remoteServiceBaseUrl + resp.result.fileName;
                this.pictureFileName = resp.result.fileName;
                if(this.pictureFileName!=null && this.product_input.id!=null && this.product_input.id!=0){
                    this.product_imageInput.imageUrl = this.pictureFileName;
                    this.product_imageInput.productId = this.product_input.id;
                    this.productImageSave();
                }
            } else {
                this.message.error(resp.error.message);
                this.processed_image = false;
            }
        };
        console.log(this.pictureFileName,'opopopopopop');
        self.imguploader.setOptions(self._uploaderOptions);
    }
    
    show(product?:any): void {
        this.product_input = new ProductInput();
        this._selectProxyService.getProductSpecification().subscribe(result=>{
            if(result.select2data!=null){
                this.product = result.select2data;
                this.product_group = [];
                this.product.forEach((pro:{id:number,name:string})=>{
                    this.product_group.push({
                        id:pro.id,
                        text:pro.name
                    });
                });
            }
        });
        this._selectProxyService.getPriceLevel().subscribe(result=>{
            if(result.select2data!=null){
                this.priceleveldto = result.select2data;
                this.price_level = [];
                this.priceleveldto.forEach((p_l:{id:number,name:string})=>{
                    this.price_level.push({
                        id:p_l.id,
                        text:p_l.name
                    });
                });
            }
        });
        this._selectProxyService.getTemporaryProduct().subscribe(result =>{
            if(result.select2data!=null){
                this.temporaryProductDto = result.select2data;
                this.suspectCode = [];
                this.temporaryProductDto.forEach((temp:{id:number,name:string})=>{
                    this.suspectCode.push({
                        id:temp.id,
                        text:temp.name
                    });
                   
                });
            }

        });

        this._selectProxyService.getProductState().subscribe(result =>{
            if(result.select2data!=null){
                this.productStateDto = result.select2data;
                this.productState = [];
                this.productStateDto.forEach((state:{id:number,name:string})=>{
                    this.productState.push({
                        id:state.id,
                        text:state.name
                    });
                });
            }
        });

        /* this._selectProxyService.getProduct().subscribe(result =>{
            if(result.select2data!=null){
                this.standardProductdto = result.select2data;
                this.standardProduct = [];
                this.standardProductdto.forEach((stdPro:{id:number,name:string})=>{
                    this.standardProduct.push({
                        id:stdPro.id,
                        text:stdPro.name
                    });
                   
                });
            }

        }); */

        this.productEdit(product,1);
        this.modal.show();
        this.active= true;
    }

    selectedStandardProduct(data:any){
        this.active_StandardProduct =[{id:data.id, text:data.text}];
        this.standardProductSelected = true;
        this._productServiceProxy.getProductForEdit(data.id).subscribe(result=>{
            if(result.productLists != null){
                this.product_input.productName = result.productLists.productName;
                this.product_input.productCode = result.productLists.productCode;
                this.product_input.gpcode = result.productLists.gpcode;
                this.product_input.price = result.productLists.price; 
                this.product_input.suspectCode = result.productLists.suspectCode;
                this.product_input.width = result.productLists.width;
                this.product_input.depth = result.productLists.depth;
                this.product_input.height = result.productLists.height;
                if(result.productLists.productStateId != null){
                  this.product_input.productStateId = result.productLists.productStateId;
                  this.active_ProductState = [{id: this.product_input.productStateId, text: result.productLists.productState}];
                }
                this.product_input.description = result.productLists.description;
            }
            if(result.images != null){
                console.log("EditImage",result.images);
                this.imageList = result.images;
            }
        });
    }

    refreshStandardProduct(value:any){
    }
    removedStandardProduct(value:any){
        this.active_StandardProduct = [];
        this.standardProductSelected = false;
        this.product_input.productName = "";
        this.product_input.productCode = "";
        this.product_input.gpcode = "";
        this.product_input.price = null; 
        this.product_input.suspectCode = "";
        this.product_input.width = null;
        this.product_input.depth = null;
        this.product_input.height = null;
        this.product_input.productStateId = null;
        this.active_ProductState = [];
        this.product_input.description = "";
        this.imageList= [];
    }
    typedStandardProduct(value:any){
        this._selectProxyService.getProductDetails(value).subscribe(result=>{			
            if(result.select2data!=null){
                this.standardProductdto = result.select2data;
                  this.standardProduct = [];
                   this.standardProductdto.forEach((stdPro:{
                        id: number,
                        productCode: string,
                        specificationName: string,
                        imageUrl: string,
                        price: number })=>{
    
                        if(stdPro.imageUrl == null || stdPro.imageUrl ==''){	
                            stdPro.imageUrl = AppConsts.appBaseUrl+"assets/common/images/download.png"   
                         }
                         else{ 
                            stdPro.imageUrl= this.path + stdPro.imageUrl;
                         } 
                         if(stdPro.specificationName == null)
                         {
                            stdPro.specificationName = `<custom style="color:red;">Custom Product</custom>`;
                         }
                        this.standardProduct.push({
                           id:stdPro.id,
                           text:`<colorbox style="background:url('${stdPro.imageUrl}');background-size: contain;background-repeat: no-repeat;width:60px;height:60px;display:block;float:left;margin-right:5px;border: 1px dotted #444d58;border-radius: 10px;background-size: cover;background-clip: border-box;"></colorbox>${stdPro.productCode}</br>${stdPro.specificationName}</br> Price:${stdPro.price} AED`					
                        });
                    });
                }
            });
    }

    selectedSuspectCode(data:any){
        console.log("selected",data);
        this.active_suspectCode =[{id:data.id, text:data.text}];
        this.suspect_Dto = true;
        this._temporaryProductServiceProxy.getTemporaryProductForEditBySuspectCode(data.text).subscribe(result=>{
            console.log(result,"TempResult");
            if(result.temporaryProductLists != null){

                if(this.product_input.id == null){
                    this.temporaryProduct_LinkInput.productId = 0;
                    this.product_input.productCode = this.temporaryProduct_Details.productCode;
                }
                else{
                    this.temporaryProduct_LinkInput.productId = this.product_input.id;
                }
                this.temporaryProduct_Details = result.temporaryProductLists;
                this.product_input.suspectCode = this.temporaryProduct_Details.suspectCode;
                this.product_input.productName = this.temporaryProduct_Details.productName;
                this.product_input.gpcode = this.temporaryProduct_Details.gpcode;
                this.product_input.price = this.temporaryProduct_Details.price; 
                this.product_input.description = this.temporaryProduct_Details.description;
                this.temporaryProduct_LinkInput.tempProductId = this.temporaryProduct_Details.id;
                this.product_input.width = this.temporaryProduct_Details.width;
                this.product_input.depth = this.temporaryProduct_Details.depth;
                this.product_input.height = this.temporaryProduct_Details.height;
            }
            if(result.tempProductImages != null){
                this.temporaryProduct_Images = result.tempProductImages;

                                  
            }

        });
                   
    }

    refreshSuspectCode(value:any){
        console.log("refresh",value);
    }
    removedSuspectCode(value:any){
        console.log("remove",value);
        this.active_suspectCode = [];
        this.suspect_Dto = false;
        // this.product_input.suspectCode = "";
        // this.product_input.productCode = "";
        // this.product_input.productName = "";
        // this.product_input.gpcode = "";
        // this.product_input.price = null;
        // this.product_input.description = "";
        this.productEdit(this.product_input.id,1);

        
    }
    typedSuspectCode(data:string){
        console.log("typed",data);
        this.active_suspectCode =[{id:0, text:data}];
        this.suspect_Dto = false;
        this.product_input.suspectCode = data;
        // this.product_input.productCode = "";
        // this.product_input.productName = "";
        // this.product_input.gpcode = "";
        // this.product_input.price = null;
        // this.product_input.description = "";
        
    }

    productEdit(data,from){
        this._productServiceProxy.getProductForEdit(data).subscribe(result=>{
            if(from){
            if(result.productLists){
                            
            if(result.productLists.isQuotation){
                this.suspectCode = [];
            }
                this.product_input = result.productLists;
                if(this.product_input.width == 0)
                this.product_input.width = null;
                if(this.product_input.depth == 0)
                this.product_input.depth = null;
                if(this.product_input.height == 0)
                this.product_input.height = null;
                if(result.productLists.productSpecificationId != null){
                this.active_product = [{id:result.productLists.productSpecificationId,text:result.productLists.productSpecificationName}];
                }
                else{
                    this.active_product = [{id:0,text:"Custom Product"}];
                }
                if(result.productLists.suspectCode != null){
                    this.active_suspectCode = [{id:0,text:result.productLists.suspectCode}];
                    }
               
               if(this.product_input.productStateId != null){
                   this.active_ProductState = [{id: this.product_input.productStateId, text: result.productLists.productState}];
               }     
             this.initializeModal(this.product_input);
            }
            if(result.images!=null){
                this.imageList = result.images;
            }
            if(result.productPriceLevelLists){
                this.priceDetails = result.productPriceLevelLists;
            }
        }else{
            if(result.images!=null){
                this.imageList = result.images;
            }
        }
        });
    }
    private selectedProductgroup(data){
        this.active_product = [{id:data.id,text:data.text}];
        this.product_input.productSpecificationId = data.id;
    }
    private removeProductgroup(data){
        this.active_product = [];
        this.product_input.productSpecificationId = null;
    }

    selectedProductState(data:any){
        this.product_input.productStateId = data.id;
        this.active_ProductState = [{id: data.id, text: data.text}];
    }
    removeProductState(data:any){
        this.product_input.productStateId = null;
        this.active_ProductState = [];
    }

    save(): void {
        this.saving = true;
        if(!this.product_input.id){
            this.product_input.id =0;          
        }
        if(this.product_input.width == null)
        this.product_input.width = 0;
        if(this.product_input.depth == null)
        this.product_input.depth = 0;
        if(this.product_input.height == null)
        this.product_input.height = 0;

        if(this.product_input.id == 0){
            if(this.standardProductSelected){
                this._productServiceProxy.createOrUpdateProduct(this.product_input)
                .finally(() => this.saving = false)
                .subscribe((result) => {
                    if(result > 0){
                        this.product_imageInput.id = 0;
                        this.product_imageInput.productId = result;
                        this.imageList.forEach((image:{id:number,imageUrl:string})=>{
                            this.product_imageInput.imageUrl = image.imageUrl;
                            console.log("Image",this.product_imageInput);
                            this._productServiceProxy.createProductImages(this.product_imageInput).subscribe(result=>{
                            });
                        });
                    }
                    this.close();
                    this.modalSave.emit(this.product_input);
                });
            }
            else{
                this.tempProductInput.id =this.product_input.id;
                this.tempProductInput.productCode =this.product_input.productCode;
                this.tempProductInput.productName =this.product_input.productName;
                this.tempProductInput.gpcode =this.product_input.gpcode;
                this.tempProductInput.suspectCode =this.product_input.suspectCode;
                this.tempProductInput.price =this.product_input.price;
                this.tempProductInput.height =this.product_input.height;
                this.tempProductInput.width =this.product_input.width;
                this.tempProductInput.depth =this.product_input.depth;
                this.tempProductInput.description =this.product_input.description;

                this._temporaryProductServiceProxy.createOrUpdateTemporaryProduct(this.tempProductInput)
                .finally(() => this.saving = false)
                .subscribe(result=>{              
                    this.close();
                    this.modalSave.emit(this.tempProductInput);
                });
            }
            
        }
        else{
            if(this.suspect_Dto){
                console.log(this.temporaryProduct_LinkInput);
                this._productServiceProxy.linkProductToQuotation(this.temporaryProduct_LinkInput).subscribe(result=>{
                    this.close();
                    this.modalSave.emit(this.temporaryProduct_LinkInput);          
               });           
            }
            else
            {
                this._productServiceProxy.createOrUpdateProduct(this.product_input).subscribe(result=>{
                     this.close();
                     this.modalSave.emit(this.product_input);
                },error =>{
                    this.saving = false;
                } 
              );
            }
        }
        
    }

    saveAs(): void {
        this.message.confirm(
            this.l('Are you sure to Create Custom Product'),
                isConfirmed => {
                if (isConfirmed) {
                    this.saving = true;
                    this.saveAsInput.id = this.product_input.id;
                    this._productServiceProxy.createCustomProduct(this.saveAsInput)
                    .finally(() => this.saving = false)
                    .subscribe((result) => {
                        if(result > 0){
                            this.modalSave.emit();
                            this.show(result);
                        }
                    });
                }
            }
        );
    }

    onShown(): void {
    }
    
    close(): void {
        this.temporaryPictureUrl = '';
        this.suspect_Dto = false;
        this.modal.hide();
        this.active = false;
        this.active_suspectCode = [];
        this.active_ProductState = [];
        this.active_StandardProduct = [];
        this.standardProductSelected = false;
    }
    selectedPriceLevel(data){
        this.pricelevel.priceLevelId = data.id;
    }
    removePriceLevel(data){
        this.pricelevel.priceLevelId = null;
    }
    priceLevelSave(){
        if(!this.pricelevel.id){
            this.pricelevel.id = 0;
        }
        this.pricelevel.productId = this.product_input.id;
        this._productServiceProxy.createOrUpdateProductPriceLevel(this.pricelevel).subscribe(result=>{
            this.saving = false;
            this.notify.success("Saved Successfully");
            this.productEdit(this.pricelevel.productId,1);
            this.pricelevel = new ProductPriceLevelInput();
            this.active_price_level = [];
        });
    }
    editPrice(data){
        console.log(data);
        this.EditPriceModal.show(data);
    }
    deletePrice(data):void{
        this.message.confirm(
            this.l('Are you sure to Delete the Product Price Level',data.imageUrl),
                isConfirmed => {
                if (isConfirmed) {
                    this._productServiceProxy.getDeleteProductPriceLevel(data.id).subscribe((result)=>{
                        this.notify.success("Deleted Successfully");
                        this.productEdit(data.productId,1);
                    });
                }
            }
        );
    }
    deleteImg(data){
        console.log(data);
        this.message.confirm(
            this.l('Are you sure to Delete this Product Image'),
            isConfirmed => {
                if(isConfirmed) {
                    this._productServiceProxy.getDeleteProductImages(data).subscribe(result=>{
                        this.notify.success("DeletedSuccessfully");
                        this.productEdit(this.product_input.id,0);
                    });
                }
            }
        );
    }
    productImageSave(){
        this.product_imageInput.id = 0;
        console.log("ImageSave",this.product_imageInput);
        this._productServiceProxy.createProductImages(this.product_imageInput).subscribe(result=>{
            console.log(result);
           
            setTimeout(() => {
                this.processed_image = false;
                this.notify.success("ImageSavedSuccessfully");
            }, 3000);
            
            this.productEdit(this.product_input.id,0);
        });
    }
}