import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { UserDesignationServiceProxy, UserDesignationListDto } from 'shared/service-proxies/service-proxies';
import { CreateUserDesignationComponent } from './create-or-edit-userDesignation.component';

import * as _ from 'lodash';
import * as moment from "moment";
@Component({
    templateUrl: './userDesignation.component.html',
    styleUrls: ['./userDesignation.Component.less'],
    animations: [appModuleAnimation()]
})

export class UserDesignationComponent extends AppComponentBase implements OnInit {

   @ViewChild('createUserDesignationModal') createUserDesignationModal: CreateUserDesignationComponent;
   filter = '';
   userdesignation: UserDesignationListDto[] = [];
   

   constructor(
        injector: Injector,
        private _userDesignationService: UserDesignationServiceProxy,
        
    )
    {
        super(injector);
    }

  ngOnInit(): void {
        this.getuserDesignation();
  }
  createUserDesignation(): void {
        this.createUserDesignationModal.show(0);
  }

  editUserDesignation(data): void {
        this.createUserDesignationModal.show(data.id);
  }


  getuserDesignation(): void {
     this._userDesignationService.getUserDesignation(this.filter).subscribe((result) => {
            this.userdesignation= result.items;
       });
 }
 deleteuserDesignation(designation: UserDesignationListDto): void {
    this.message.confirm(
        this.l('Are you sure to Delete the User Designation', designation.name),
        isConfirmed => {
            if (isConfirmed) {
              this._userDesignationService.deleteUserDesignation(designation.id).subscribe(() => {
                    this.notify.success(this.l('Successfully Deleted'));
                    _.remove(this.userdesignation, designation); 
                });
              
            }
        }
    );
  }
}