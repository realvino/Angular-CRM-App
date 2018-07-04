import { Component, ViewChild, Injector, ElementRef, Output, EventEmitter, OnInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { AppComponentBase } from '@shared/common/app-component-base';
import { IAjaxResponse } from '@abp/abpHttp';
import { TokenService } from '@abp/auth/token.service';
import { AppConsts } from '@shared/AppConsts';
// import { HttpClient } from './http-client';

@Component({
    selector: 'quotationPreviewModal',
    templateUrl: './quotation-preview.component.html'
})
export class QuotationPreviewModalComponent extends AppComponentBase {
 
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('modal') modal: ModalDirective;
    quotation_id : number;
    type_preview:number;
    download_url:any;
    head_preview:string;
    active = false;
    saving = false;
    loading:boolean;
    constructor(
        injector: Injector,
        // private _quotationService: QuotationServiceProxy,
        private _tokenService: TokenService,
        // private http: HttpClient
    ) {
        super(injector);
    }
   show(quotationId?: number,type?:number): void {
        document.getElementById("myDiv").innerHTML = "";
        this.quotation_id = quotationId;
        this.type_preview = type;
        switch(this.type_preview){
            case 1:
              var url = AppConsts.remoteServiceBaseUrl + "Pdf/ExportQuotation?QuotationId="+quotationId;
              this.download_url = AppConsts.remoteServiceBaseUrl +'Pdf/download?QuotationId='+this.quotation_id;
              this.head_preview = 'Standard';
            break;
            case 2:
              var url = AppConsts.remoteServiceBaseUrl + "Pdf/ExportPhotoEmphasis?QuotationId="+quotationId;
              this.download_url = AppConsts.remoteServiceBaseUrl +'Pdf/DownloadEmp?QuotationId='+this.quotation_id;
              this.head_preview = 'PhotoEmphasis';
            break;
            case 3:
              var url = AppConsts.remoteServiceBaseUrl + "Pdf/QuotationProductCategory?QuotationId="+quotationId;
              this.download_url = AppConsts.remoteServiceBaseUrl +'Pdf/DownloadprodPdf?QuotationId='+this.quotation_id;
              this.head_preview = 'ProductCategory';
            break;
            case 4:
              var url = AppConsts.remoteServiceBaseUrl + "Pdf/StandardQuotation?QuotationId="+quotationId;
              this.download_url = AppConsts.remoteServiceBaseUrl +'Pdf/PreviewDownload?QuotationId='+this.quotation_id;
              this.head_preview = 'Standard Optional 1';
            break;
            case 5:
            var url = AppConsts.remoteServiceBaseUrl + "Pdf/ExportStandardQuotation?QuotationId="+quotationId;
            this.download_url = AppConsts.remoteServiceBaseUrl +'Pdf/StandardQuotationDownload?QuotationId='+this.quotation_id;
            this.head_preview = 'Government';
            break;
            case 6:
            var url = AppConsts.remoteServiceBaseUrl + "Pdf/OptionalQuotation?QuotationId="+quotationId;
            this.download_url = AppConsts.remoteServiceBaseUrl +'Pdf/OptionalQuotationDownload?QuotationId='+this.quotation_id;
            this.head_preview = 'Standard Optional 2';
            break;
            default:
    
            break;    
        }

        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("GET", url, true);
        xmlhttp.send();

      if(quotationId){
         xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == XMLHttpRequest.DONE ) {
           if (xmlhttp.status == 200) {
               if(typeof xmlhttp.response!=="undefined"){
                    document.getElementById("myDiv").innerHTML = JSON.parse(xmlhttp.response).result;
                    return false;
               }
           }
           else if (xmlhttp.status == 400) {
              alert('There was an error 400');  
           }
           else {
               alert('something else other than 200 was returned');
           }
        }
    };
    }
  
        this.active = true;
        this.modal.show();
    }
    onShown(): void {
        
    }
    close(): void {
        this.quotation_id = 0;
        this.modal.hide();
        document.getElementById("myDiv").innerHTML = "";
        this.active = false;
    }
    download(){
        window.location.assign(this.download_url);
    }
    load() {
      this.loading = false;
    }
}
