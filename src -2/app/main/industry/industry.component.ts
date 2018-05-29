import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import * as _ from 'lodash';
import * as moment from "moment";
import { IndustryListDto, IndustryServiceProxy } from "shared/service-proxies/service-proxies";
import { CreateIndustryModalComponent } from "app/main/industry/create-or-edit-industry.component";
import { FileDownloadService } from "shared/utils/file-download.service";

@Component({
    templateUrl: './industry.component.html',
    styleUrls: ['./industry.component.less'],
    animations: [appModuleAnimation()]
})

export class IndustryComponent extends AppComponentBase implements OnInit {

   @ViewChild('createIndustryModal') createIndustryModal: CreateIndustryModalComponent;
   filter = '';
   industry: IndustryListDto[] = [];

   constructor(
        injector: Injector,
        private _industryService: IndustryServiceProxy,
        private _fileDownloadService: FileDownloadService

    )
    {
        super(injector);
    }

  ngOnInit(): void {
        this.getIndustry();
    }
  createIndustry(): void {
       this.createIndustryModal.show(0);
    }

  editIndustry(data): void {
       this.createIndustryModal.show(data.id);
    }


  getIndustry(): void {
     this._industryService.getIndustry(this.filter).subscribe((result) => {
            this.industry = result.items;
        });
 }
 deleteIndustry(industrys: IndustryListDto): void {
    this.message.confirm(
        this.l('Are you sure to Delete the Industry', industrys.industryName),
        isConfirmed => {
            if (isConfirmed) {
                /*this._industryService.getMappedIndustry(industrys.id).subscribe(result=>{
                  if(result)
                  {
                    this.notify.error(this.l('This Industry has used, So could not delete this industry'));
                  }else{
                    this.industrysDelete(industrys);
                  }
                });*/
                this._industryService.getDeleteIndustry(industrys.id).subscribe(() => {
                  this.notify.success(this.l('SuccessfullyDeleted'));
                  _.remove(this.industry, industrys);
                });
            }
        }
    );
}

    exportExcel():void{
        this._industryService.getIndustryToExcel()
            .subscribe(result => {
                this._fileDownloadService.downloadTempFile(result);
            });
    }


}