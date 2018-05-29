import { Component, OnInit, ViewChild, AfterViewInit, Injector, Inject, OpaqueToken,Output,EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AppConsts } from '@shared/AppConsts';
import { FileUploader, FileUploaderOptions, Headers } from '@node_modules/ng2-file-upload';
import { QuotationServiceProxy } from "@shared/service-proxies/service-proxies";
import { IAjaxResponse } from '@abp/abpHttp';
import { TokenService } from '@abp/auth/token.service';

@Component({
    selector: 'ProductImportModal',
    templateUrl: './product-import-modal.component.html'
})
export class ProductImportModalComponent extends AppComponentBase {

    @ViewChild('ProductImportModal') modal: ModalDirective;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    public active: boolean = false;
    public uploader: FileUploader;
    public temporaryPictureUrl: string;
    public saving: boolean = false;

    private temporaryPictureFileName: string;
    private _uploaderOptions: FileUploaderOptions = {};
    private _$profilePictureResize: JQuery;
    private _$jcropApi: any;
    quotation_id:number;
    file_path:string;

    constructor(
        injector: Injector,
        private _quotationService: QuotationServiceProxy,
        private _tokenService: TokenService
    ) {
        super(injector);
    }


    initializeModal(): void {
        this.active = true;
        this.temporaryPictureUrl = '';
        this.temporaryPictureFileName = '';
        this._$profilePictureResize = null;
        this._$jcropApi = null;
        this.initFileUploader();
    }

    initFileUploader(): void {
        let self = this;
        self.uploader = new FileUploader({ url: AppConsts.remoteServiceBaseUrl + "Profile/UploadQuotationProduct" });
        self._uploaderOptions.autoUpload = true;
        self._uploaderOptions.authToken = 'Bearer ' + self._tokenService.getToken();
        self._uploaderOptions.removeAfterUpload = true;
        self.uploader.onAfterAddingFile = (file) => {
            file.withCredentials = false;
        };

        self.uploader.onSuccessItem = (item, response, status) => {
            let resp = <IAjaxResponse>JSON.parse(response);
            if (resp.success) {
                self.temporaryPictureFileName = resp.result.name;
                self.file_path = resp.result.fileName;
                //console.log(resp.result);

            } else {
                this.message.error(resp.error.message);
            }
        };

        self.uploader.setOptions(self._uploaderOptions);
    }

    onModalShown() {
        // this._$profilePictureResize = $("#ProfilePictureResize");
    }

    show(quotationId?:any): void {
        this.quotation_id = quotationId;
        this.initializeModal();
        this.modal.show();
    }

    close(): void {
        this.active = false;
        this.modal.hide();
    }

    save(): void {
        this._quotationService.getProductImport(this.quotation_id,this.file_path,this.temporaryPictureFileName).subscribe(result=>{
                this.close();
                this.modalSave.emit(this.quotation_id);
                this.notify.success("SavedSuccessfull");
        });
       
    }
}