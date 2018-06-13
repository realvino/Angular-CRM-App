import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import * as _ from 'lodash';
import * as moment from "moment";
import { LineTypeListDto, LineTypeServiceProxy } from "shared/service-proxies/service-proxies";
import { CreateLineItemModalComponent } from "app/main/lineItem/createORedit_lineItem.component";
@Component({
    templateUrl: './lineItem.component.html',
    styleUrls: ['./lineItem.component.less'],
    animations: [appModuleAnimation()]
})

export class LineItemComponent extends AppComponentBase implements OnInit {

   @ViewChild('createLineItemModal') createLineItemModal: CreateLineItemModalComponent;
   filter = '';
   lineItems: LineTypeListDto[] = [];

   constructor(
        injector: Injector,
        private _lineTypeServiceProxy: LineTypeServiceProxy
    )
    {
        super(injector);
    }

  ngOnInit(): void {
        this.getLineItem();
    }
  createLineItem(): void {
        this.createLineItemModal.show(0);
    }

  editLineType(data): void {
        this.createLineItemModal.show(data.id);
    }


  getLineItem(): void {
     this._lineTypeServiceProxy.getLineTypes(this.filter).subscribe((result) => {
            this.lineItems = result.items;
        });
 }
 deleteLineType(line: LineTypeListDto): void {
    this.message.confirm(
        this.l('Are you sure to Delete the LineItem', line.lineTypeName),
        isConfirmed => {
            if (isConfirmed) {
                this._lineTypeServiceProxy.deleteLineType(line.id).subscribe(() => {
                    this.notify.info(this.l('SuccessfullyDeleted'));
                    _.remove(this.lineItems, line); 
                });
            }
        }
    );
} 

// deleteLineType(line: LineTypeListDto): void {
//     this.message.confirm(
//         this.l('AreYouSureToDeleteTheLineItem',  line.lineTypeName),
//         isConfirmed => {
//             if (isConfirmed) {
//               this._lineTypeServiceProxy.getMappedLineType(line.id).subscribe(result=>{
//                  if(result)
//                   {
//                     this.notify.error(this.l('This LineType has used, So could not delete'));
//                   }else{
//                     this.lineDelete(line);
//                   }
//               });
//             }
//         }
//     );
// }
//   lineDelete(line_data?:any):void{
//     this._lineTypeServiceProxy.deleteLineType(line_data.id).subscribe(() => {
//                     this.notify.success(this.l('Successfully Deleted'));
//                     _.remove(this.lineItems, line_data); 
//                 });
//   }

}