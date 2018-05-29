import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import * as _ from 'lodash';
import * as moment from "moment";
import { SourceListDto, SourceServiceProxy } from "shared/service-proxies/service-proxies";
import { CreateSourceModalComponent } from "app/main/source/create-or-edit-source.component";
import { FileDownloadService } from "shared/utils/file-download.service";
@Component({
    templateUrl: './source.component.html',
    styleUrls: ['./source.component.less'],
    animations: [appModuleAnimation()]
})

export class SourceComponent extends AppComponentBase implements OnInit {

  @ViewChild('createSourceModal') createSourceModal: CreateSourceModalComponent;
   filter = '';
   sources: SourceListDto[] = [];

   constructor(
        injector: Injector,
        private _sourceService: SourceServiceProxy,
        private _fileDownloadService: FileDownloadService
    )
    {
        super(injector);
    }

  ngOnInit(): void {
        this.getSource();
    }
  createSource(): void {
       this.createSourceModal.show(0);
    }

  editSource(data): void {
       this.createSourceModal.show(data.id);
    }


  getSource(): void {
     this._sourceService.getSources(this.filter).subscribe((result) => {
            this.sources = result.items;
        });
 }

 deleteSource(source: SourceListDto): void {
    this.message.confirm(
        this.l('AreYouSureToDeleteTheSource', source.sourceName),
        isConfirmed => {
            if (isConfirmed) {
                this._sourceService.getDeleteSource(source.id).subscribe(() => {
                    this.notify.info(this.l('SuccessfullyDeleted'));
                    _.remove(this.sources, source);
                });
            }
        }
    );
}


    exportExcel():void{
        this._sourceService.getSourceToExcel()
            .subscribe(result => {
                this._fileDownloadService.downloadTempFile(result);
            });
    }

/*deleteSource(source: SourceListDto): void {
    this.message.confirm(
        this.l('Are you sure to Delete the Source', source.sourceName),
        isConfirmed => {
            if (isConfirmed) {
              this._sourceService.getMappedSource(source.id).subscribe(result=>{
                 if(result)
                  {
                    this.notify.error(this.l('This source has used, So could not delete'));
                  }else{
                    this.sourceDelete(source);
                  }
              });
            }
        }
    );
}
  sourceDelete(source_data?:any):void{
    this._sourceService.getDeleteSource(source_data.id).subscribe(() => {
                    this.notify.success(this.l('Successfully Deleted'));
                    _.remove(this.sources, source_data); 
                });
  }*/

}
