import { Component, ViewChild, Injector, ElementRef, Output, EventEmitter, OnInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ProductAttributeServiceProxy,CreateProductAttributeInput } from 'shared/service-proxies/service-proxies';
import { FileUploader, FileUploaderOptions, Headers } from '@node_modules/ng2-file-upload';
import { IAjaxResponse } from "abp-ng2-module/src/abpHttp";
import { TokenService } from "abp-ng2-module/src/auth/token.service";
import { AppConsts } from "shared/AppConsts";

@Component({
    selector: 'createProductAttributeModal',
    templateUrl: './create-or-edit-product-attribute.component.html'
})
export class CreateProductAttributeComponent extends AppComponentBase {
 
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('modal') modal: ModalDirective;
    @ViewChild('nameInput') nameInput: ElementRef;
    productAttribute: CreateProductAttributeInput = new CreateProductAttributeInput();
    eventOriginal = this.productAttribute;

    public imguploader: FileUploader;
    public temporaryPictureUrl: string;
    public saving: boolean = false;
    private pictureFileName: string;
    private _uploaderOptions: FileUploaderOptions = {};
    private _$profilePictureResize: JQuery;
    private _$jcropApi: any;
    path : string = AppConsts.remoteServiceBaseUrl;

    active = false;
    constructor(
        injector: Injector,
        private _productAttributeService: ProductAttributeServiceProxy,
        private _tokenService: TokenService
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
        console.log(AppConsts.remoteServiceBaseUrl);
        self.imguploader = new FileUploader({ url: AppConsts.remoteServiceBaseUrl + "/Profile/UploadColorCodePicture?ProductId="+data.id+"&ImgPath="+data.color});
        self._uploaderOptions.autoUpload = true;
        self._uploaderOptions.authToken = 'Bearer ' + self._tokenService.getToken();
        self._uploaderOptions.removeAfterUpload = true;
        self.imguploader.onAfterAddingFile = (file) => {
            file.withCredentials = false;
            console.log(file);
        };
        self.imguploader.onSuccessItem = (item, response, status) => {
            let resp = <IAjaxResponse>JSON.parse(response);
            if (resp.success) {
                console.log(resp.result);
                this.temporaryPictureUrl = AppConsts.remoteServiceBaseUrl + resp.result.fileName;
                this.pictureFileName = resp.result.fileName;
            } else {
                this.message.error(resp.error.message);
            }
        };
        self.imguploader.setOptions(self._uploaderOptions);
    }
   show(productAttributeId?: number): void {
        this.productAttribute = new CreateProductAttributeInput();
        this._productAttributeService.getProductAttributeForEdit(productAttributeId).subscribe((result) => {
			console.log(result,1);
           if (result.attribute != null) {
            this.productAttribute = result.attribute;
            this.temporaryPictureUrl = this.path + result.attribute.imageurl;
			
            this.initializeModal(this.productAttribute);
           }
             this.active = true;
             this.modal.show();
        });
    }

 save(): void {
        this.saving = true;
           if (this.productAttribute.id == null) {
               this.productAttribute.id = 0;
           }
           console.log(this.productAttribute);
           if(this.pictureFileName){
                this.productAttribute.imageurl = this.pictureFileName;
            }else{
                this.productAttribute.imageurl = this.productAttribute.imageurl;
            }    
             this._productAttributeService.createOrUpdateProductAttribute(this.productAttribute)
            .finally(() => this.saving = false)
            .subscribe(result => {
                this.notify.success(this.l('SavedSuccessfully'));
                this.productAttribute = this.eventOriginal;
                this.close();
                this.modalSave.emit(this.productAttribute);
            });
    }

    onShown(): void {
        $(this.nameInput.nativeElement).focus();
    }
    close(): void {
        this.temporaryPictureUrl = '';
        this.modal.hide();
        this.active = false;
    }
}
