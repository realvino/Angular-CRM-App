import { Component, ViewChild, Injector, ElementRef, Output, EventEmitter, OnInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { AppComponentBase } from '@shared/common/app-component-base';
import { TemporaryProductServiceProxy, TemporaryProductInput, TemporaryProductImageInput, QuotationProductInput, QuotationServiceProxy, FinishedServiceProxy, TemporaryFinishedDetailList } from "shared/service-proxies/service-proxies";
import { FileUploader, FileUploaderOptions, Headers } from '@node_modules/ng2-file-upload';
import { AppConsts } from "shared/AppConsts";
import { IAjaxResponse } from "abp-ng2-module/src/abpHttp";
import { TokenService } from "abp-ng2-module/src/auth/token.service";
import { CreateEditFinishedDetailComponent } from '@app/main/finished/createOReditFinishedDetailComponent';


export interface SelectOption {
    id?: number;
    text?: string;
}


@Component({
    selector: 'createTempProductModal',
    templateUrl: './create-or-edit-tempProducts.component.html'
    
})
export class CreateOrEditTempProductModalComponent extends AppComponentBase  {

    testData: any;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('modal') modal: ModalDirective;
    @ViewChild('nameInput') nameInput: ElementRef;

    @ViewChild('createEditFinishedDetailModal') createEditFinishedDetailModal: CreateEditFinishedDetailComponent;
    public active: boolean = false;
    public imguploader: FileUploader;
    public temporaryPictureUrl: string;
    public saving: boolean = false;
    private pictureFileName: string;
    private _uploaderOptions: FileUploaderOptions = {};
    private _$profilePictureResize: JQuery;
    private _$jcropApi: any;

    
    htmlEditorInput:string;
    from:number;
    tempProduct_input:TemporaryProductInput =new TemporaryProductInput();
    eventOriginal = this.tempProduct_input;
    path : string = AppConsts.remoteServiceBaseUrl;
    temp_imageInput:TemporaryProductImageInput = new TemporaryProductImageInput();
    imageList:Array<any>;
    updateQuotationProduct: QuotationProductInput = new QuotationProductInput();
    
    processed_image:boolean=false;

    finishedDetails: TemporaryFinishedDetailList[];
    
    constructor(
        injector: Injector,
        private _tempProductServiceProxy:TemporaryProductServiceProxy,
        private _tokenService: TokenService,
        private _quotationService: QuotationServiceProxy,
        private _finishedService: FinishedServiceProxy
        
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
        //console.log(data);
        self.imguploader = new FileUploader({ url: AppConsts.remoteServiceBaseUrl + "/Profile/UploadMultiTempProductPicture?TempProductId="+data.id});
        self._uploaderOptions.autoUpload = true;
        self._uploaderOptions.authToken = 'Bearer ' + self._tokenService.getToken();
        self._uploaderOptions.removeAfterUpload = true;
        self.imguploader.onAfterAddingFile = (file) => {
            file.withCredentials = false;
            //console.log(file);
        };
        self.imguploader.onSuccessItem = (item, response, status) => {
            this.processed_image = true;
            let resp = <IAjaxResponse>JSON.parse(response);
            if (resp.success) {
                //console.log(resp.result);
                this.temporaryPictureUrl = AppConsts.remoteServiceBaseUrl + resp.result.fileName;
                this.pictureFileName = resp.result.fileName;
                if(this.pictureFileName!=null && this.tempProduct_input.id!=null && this.tempProduct_input.id!=0){
                    this.temp_imageInput.imageUrl = this.pictureFileName;
                    this.temp_imageInput.temporaryProductId = this.tempProduct_input.id;
                    this.productImageSave();
                }
            } else {
                this.message.error(resp.error.message);
                this.processed_image = false;
            }
        };
        //console.log(this.pictureFileName);
        self.imguploader.setOptions(self._uploaderOptions);
    }
    
    show(QuotationProduct?:any,from?:number): void {
        this.from = from;
        this.tempProduct_input = new TemporaryProductInput();
        if(from == 1){
            this.testData = QuotationProduct;
            this._tempProductServiceProxy.getTemporaryProductForEdit(QuotationProduct.id).subscribe(result=>{
                console.log(result);
                if(result.temporaryProductLists){
                    this.tempProduct_input = result.temporaryProductLists;
                    this.initializeModal(this.tempProduct_input);
                    this.getFinishedDetails(result.temporaryProductLists.id);
                }
                if(result.tempProductImages!=null){
                    this.imageList = result.tempProductImages;
                }
     
            });
        }
        else{
            this.updateQuotationProduct = QuotationProduct;
            this._tempProductServiceProxy.getTemporaryProductForEdit(this.updateQuotationProduct.temporaryProductId).subscribe(result=>{
                console.log(result);
                if(result.temporaryProductLists){
                    this.tempProduct_input = result.temporaryProductLists;
                    this.initializeModal(this.tempProduct_input);
                    this.getFinishedDetails(result.temporaryProductLists.id);
                }
                if(result.tempProductImages!=null){
                    this.imageList = result.tempProductImages;
                }
     
            });
        }
        this.modal.show();
        this.active= true;
    }
    
    save(): void {
        this.saving = true;
        if(this.tempProduct_input.id == null){
            this.tempProduct_input.id = 0;
            this.tempProduct_input.gpcode = this.tempProduct_input.suspectCode;
        }
        //if(this.from == 1)
        //{
            this._tempProductServiceProxy.createOrUpdateTemporaryProduct(this.tempProduct_input).subscribe(result=>{              
                this.saving = false;
                this.close();
                this.modalSave.emit();
            });
        //}
        /* else{
            this._tempProductServiceProxy.createOrUpdateTemporaryProduct(this.tempProduct_input).subscribe(result=>{
                this.updateQuotationProduct.unitOfPrice = this.tempProduct_input.price;
                this.updateQuotationProduct.overAllPrice = Math.round(this.updateQuotationProduct.unitOfPrice * this.updateQuotationProduct.quantity);
                this.updateQuotationProduct.totalAmount = Math.round(this.updateQuotationProduct.unitOfPrice * this.updateQuotationProduct.quantity);
                console.log(this.updateQuotationProduct);
                alert(1);
                if(this.updateQuotationProduct.id > 0)
                {
                    this._quotationService.createOrUpdateQuotationProduct(this.updateQuotationProduct).subscribe(() => {
                    });
                }             
                this.saving = false;
                this.close();
                this.modalSave.emit();
            });
        } */
       
      
    }


    onShown(): void {
         //$(this.nameInput.nativeElement).focus();
    }
    close(): void {
        this.temp_imageInput = new TemporaryProductImageInput();
        this.temporaryPictureUrl = '';
        this.modal.hide();
        this.active = false;
        this.modalSave.emit();
    }
   
    deleteImg(data){
        console.log(data);
        this.message.confirm(
            this.l('Are you sure to Delete this TemporaryProduct Image'),
            isConfirmed => {
                if(isConfirmed) {
                    this._tempProductServiceProxy.getDeleteTemporaryProductImage(data).subscribe(result=>{
                        this.notify.success("DeletedSuccessfully");
                        if(this.from  == 1)
                        {
                            this.show(this.testData,this.from);
                        }
                        else{
                            this.show(this.updateQuotationProduct,this.from);
                        }                    });
                }
            }
        );
    }
    productImageSave(){
        this.temp_imageInput.id = 0;
        this._tempProductServiceProxy.createTemporaryProductImage(this.temp_imageInput).subscribe(result=>{
            
            setTimeout(() => {
                this.processed_image = false;
                this.notify.success("ImageSavedSuccessfully");
            }, 3000);
            if(this.from  == 1)
            {
                this.show(this.testData,this.from);
                this.processed_image = false;
            }
            else{
                this.show(this.updateQuotationProduct,this.from);
                this.processed_image = false;
            }
        });
    }
    check(event: KeyboardEvent) {
        if (event.keyCode == 189 || event.keyCode == 109) {
          event.preventDefault();
        }
    }
    getFinishedDetails(pId) {
        this._finishedService.getTemporaryFinishedDetail(pId).subscribe((result) => {
            this.finishedDetails = result;
        });
    }

    createFinishedDetails(){
        this.createEditFinishedDetailModal.show(0,0,this.tempProduct_input.id);
    }
    editFinishedDetails(data){
        this.createEditFinishedDetailModal.show(data.id,0,this.tempProduct_input.id);
    }
    deleteFinishedDetails(data) {
        this.message.confirm(
            this.l('Are you sure to Delete the Finished Details', data.gpCode),
                isConfirmed => {
                    if (isConfirmed) {
                         this._finishedService.deleteTemporaryFinishedDetail(data.id).subscribe(() => {
                          this.notify.success(this.l('Deleted Successfully'));
                          this.getFinishedDetails(data.temporaryProductId);
                      });
                  }
              }); 
      }
}