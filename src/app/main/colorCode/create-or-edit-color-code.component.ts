import { Component, ViewChild, Injector, ElementRef, Output, EventEmitter, OnInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ColorCodeServiceProxy,CreateColorCodeInput } from 'shared/service-proxies/service-proxies';
import { FileUploader, FileUploaderOptions, Headers } from '@node_modules/ng2-file-upload';
import { IAjaxResponse } from "abp-ng2-module/src/abpHttp";
import { TokenService } from "abp-ng2-module/src/auth/token.service";
import { AppConsts } from "shared/AppConsts";

@Component({
    selector: 'createColorCodeModal',
    templateUrl: './create-or-edit-color-code.component.html'
})
export class CreateColorCodeComponent extends AppComponentBase {
 
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('modal') modal: ModalDirective;
    @ViewChild('nameInput') nameInput: ElementRef;
    colorCodes: CreateColorCodeInput = new CreateColorCodeInput();
    eventOriginal = this.colorCodes;

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
        private _priceLevelService: ColorCodeServiceProxy,
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
   show(priceLevelId?: number): void {
        this.colorCodes = new CreateColorCodeInput();
        this._priceLevelService.getColorCodeForEdit(priceLevelId).subscribe((result) => {
           if (result.colors != null) {
            this.colorCodes = result.colors;
            this.temporaryPictureUrl = this.path + result.colors.color;
            this.initializeModal(this.colorCodes);
           }
             this.active = true;
             this.modal.show();
        });
    }

 save(): void {
        this.saving = true;
           if (this.colorCodes.id == null) {
               this.colorCodes.id = 0;
           }
           console.log(this.colorCodes);
           if(this.pictureFileName){
                this.colorCodes.color = this.pictureFileName;
            }else{
                this.colorCodes.color = this.colorCodes.color;
            }    
             this._priceLevelService.createOrUpdateColorcode(this.colorCodes)
            .finally(() => this.saving = false)
            .subscribe(() => {
                this.notify.success(this.l('SavedSuccessfully'));
                this.colorCodes = this.eventOriginal;
                this.close();
                this.modalSave.emit(this.colorCodes);
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
