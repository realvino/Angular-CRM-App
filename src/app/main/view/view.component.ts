import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { ViewServiceProxy, ViewListDto } from 'shared/service-proxies/service-proxies';
import { CreateViewComponent } from './create-or-edit-view.component';


import * as _ from 'lodash';
import * as moment from "moment";
@Component({
    templateUrl: './view.component.html',
    styleUrls: ['./view.component.less'],
    animations: [appModuleAnimation()]
})

export class ViewComponent extends AppComponentBase implements OnInit {

   @ViewChild('createViewModal') createViewModal: CreateViewComponent;
   filter = '';
   datas: ViewListDto[] = [];
   
   constructor(
        injector: Injector,
        private _viewService: ViewServiceProxy
       
    )
    {
        super(injector);
    }

  ngOnInit(): void {
        this.getview();
  }
  createview(): void {
        this.createViewModal.show(0);
  }

  editview(data): void {
        this.createViewModal.show(data.id);
  }


  getview(): void {
     this._viewService.getViews(this.filter).subscribe((result) => {
            this.datas = result.items;
      });
 }
  
 deleteview(datas: ViewListDto): void {
      this.message.confirm(
         this.l('To Delete the View', datas.name),
          (isConfirmed) => {
              if (isConfirmed) {
              this._viewService.getDeleteView(datas.id).subscribe(() => {
                          this.getview();
                          this.notify.success(this.l('SuccessfullyDeleted'));
              });
              }
          }
      );
  }
}