import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { DimensionServiceProxy, DimensionListDto,FileDto } from 'shared/service-proxies/service-proxies';
import { CreateDimensionComponent } from './create-or-edit-dimension.component';
import { FileDownloadService } from "shared/utils/file-download.service";

import * as _ from 'lodash';
import * as moment from "moment";
@Component({
    templateUrl: './dimension.component.html',
    styleUrls: ['./dimension.component.less'],
    animations: [appModuleAnimation()]
})

export class DimensionComponent extends AppComponentBase implements OnInit {

   @ViewChild('createDimensionModal') createDimensionModal: CreateDimensionComponent;
   filter = '';
   dimensions: DimensionListDto[] = [];
   filedownload:FileDto=new FileDto();

   constructor(
        injector: Injector,
        private _dimensionService: DimensionServiceProxy,
        private _fileDownloadService: FileDownloadService
    )
    {
        super(injector);
    }

  ngOnInit(): void {
        this.getDimension();
  }
  createDimension(): void {
        this.createDimensionModal.show(0);
  }

  editDimension(data): void {
        this.createDimensionModal.show(data.id);
  }


  getDimension(): void {
     this._dimensionService.getDimension(this.filter).subscribe((result) => {
            this.dimensions = result.items;
        });
 }
 deleteDimension(dimension: DimensionListDto): void {
    this.message.confirm(
        this.l('Are you sure to Delete the Dimension', dimension.dimensionName),
        isConfirmed => {
            if (isConfirmed) {
              this._dimensionService.deleteDimension(dimension.id).subscribe(() => {
                    this.notify.success(this.l('Successfully Deleted'));
                    _.remove(this.dimensions, dimension); 
                });
              /*this._dimensionService.getMappedCountry(dimension.id).subscribe(result=>{
                 if(result)
                  {
                    this.notify.error(this.l('This country has used, So could not delete'));
                  }else{
                    this.countryDelete(country);
                  }
              });*/
            }
        }
    );
}
  // countryDelete(country_data?:any):void{
    
  // }

  /*exportToExcel(): void {
        this._countryService.getCountryToExcel()
            .subscribe(result => {
                this._fileDownloadService.downloadTempFile(result);
            });
    }*/ 
}