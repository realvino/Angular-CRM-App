import { Component, Injector, OnInit,ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppConsts } from '@shared/AppConsts';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { RegionServiceProxy, RegionList } from 'shared/service-proxies/service-proxies';
import { CreateRegionModalComponent } from './createoreditregion.component';
import { FileDownloadService } from "shared/utils/file-download.service";

import * as _ from 'lodash';
import * as moment from "moment";
@Component({
    templateUrl: './region.component.html',
    styleUrls: ['./region.component.less'],
    animations: [appModuleAnimation()]
})

export class RegionComponent extends AppComponentBase implements OnInit {

   @ViewChild('createRegionModal') createRegionModal: CreateRegionModalComponent;
   filter = '';
   regions: RegionList[] = [];
   selectedPermission: string = '';

   constructor(
        injector: Injector,
        private _regionService: RegionServiceProxy,
        private _fileDownloadService: FileDownloadService
    )
    {
        super(injector);
    }

  ngOnInit(): void {
        this.getRegion();
    }
  createRegion(): void {
        this.createRegionModal.show(0,false);
    }

  editRegion(data): void {
        this.createRegionModal.show(data.id,true);
    }


  getRegion(): void {
     this._regionService.getRegion(this.filter).subscribe((result) => {
            this.regions = result.items;
        });
 }
deleteRegion(region: RegionList): void {
    this.message.confirm(
        this.l('Are you sure to Delete the Region', region.regionName),
        isConfirmed => {
            if (isConfirmed) {
              /*this._regionService.getMappedRegion(region.id).subscribe(result=>{
                 if(result)
                  {
                    this.notify.error(this.l('This region has used, So could not delete'));
                  }else{
                    this.regionDelete(region);
                  }
              });*/
              this._regionService.getDeleteRegion(region.id).subscribe(() => {
                    this.notify.success(this.l('Successfully Deleted'));
                    _.remove(this.regions, region); 
                });
            }
        }
    );
}
 /* regionDelete(region_data?:any):void{
    
  }*/
   exportToExcel(): void {
        this._regionService.getRegionToExcel()
            .subscribe(result => {
                this._fileDownloadService.downloadTempFile(result);
            });
    } 
}