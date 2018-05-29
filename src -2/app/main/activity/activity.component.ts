import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import * as _ from 'lodash';
import * as moment from "moment";
import { ActivityListDto, ActivityServiceProxy } from "shared/service-proxies/service-proxies";
import { CreateActivityModalComponent } from "app/main/activity/create-or-edit-activity.component";
import { FileDownloadService } from "shared/utils/file-download.service";

@Component({
    templateUrl: './activity.component.html',
    styleUrls: ['./activity.component.less'],
    animations: [appModuleAnimation()]
})

export class ActivityComponent extends AppComponentBase implements OnInit {

   @ViewChild('createActivityModal') createActivityModal: CreateActivityModalComponent;
   currentStep: number = 1;
   filter = '';
   activites: ActivityListDto[] = [];

   constructor(
        injector: Injector,
        private _activityService: ActivityServiceProxy,
        private _fileDownloadService: FileDownloadService
    )
    {
        super(injector);
    }

  ngOnInit(): void {
        this.getActivity();
    }
  createActivity(): void {
       this.createActivityModal.show(0);
    }

  editActivity(data): void {
       this.createActivityModal.show(data.id);
    }


  getActivity(): void {
     this._activityService.getActivity(this.filter).subscribe((result) => {
            this.activites = result.items;
        });
 }
 deleteActivity(activity: ActivityListDto): void {
    this.message.confirm(
        this.l('Are you sure to Delete the Activity', activity.activityName),
        isConfirmed => {
            if (isConfirmed) {
                /*this._activityService.getMappedActivityType(activity.id).subscribe(result=>{
                  if(result)
                  {
                    this.notify.error(this.l('This activity has used, So could not delete this activity'));
                  }else{
                    this.activityDelete(activity);
                  }
                });*/
                this._activityService.getDeleteActivityType(activity.id).subscribe(() => {
                    this.notify.success(this.l('SuccessfullyDeleted'));
                    _.remove(this.activites, activity);
                });
            }
        }
    );
}


    exportExcel():void{
        this._activityService.getActivityTypeToExcel()
            .subscribe(result => {
                this._fileDownloadService.downloadTempFile(result);
            });
    }
 /*activityDelete(activity?:any):void{

 

 } */

}