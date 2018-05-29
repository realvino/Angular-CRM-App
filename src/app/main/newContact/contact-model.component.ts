import { Component, Injector, OnInit, AfterViewInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { ActivatedRoute ,Router } from '@angular/router';
import { Http } from '@angular/http';
import { TokenAuthServiceProxy, NewCompanyContactServiceProxy, NewContactListDto } from "shared/service-proxies/service-proxies";
import * as _ from 'lodash';
import * as moment from "moment";
import { CreateOrEditContactNewModalComponent } from "app/main/newContact/create-edit-contact.component";
import { DataTable } from 'primeng/components/datatable/datatable';
import { Paginator } from 'primeng/components/paginator/paginator';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';

@Component({
    templateUrl: './contact-model.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})

export class ContactNewModelComponent extends AppComponentBase implements AfterViewInit {

    @ViewChild('createNewContactModal') createNewContactModal: CreateOrEditContactNewModalComponent;

    advancedFiltersAreShown: boolean = false;
    filterText: string = '';
    selectedPermission: string = '';
    @ViewChild('dataTable') dataTable: DataTable;
    @ViewChild('paginator') paginator: Paginator;
   constructor(
        injector: Injector,
        private _http: Http,
        private route:Router,
        private _tokenAuth: TokenAuthServiceProxy,
        private _activatedRoute: ActivatedRoute,
        private _companyServiceProxy: NewCompanyContactServiceProxy,

    )
    {
        super(injector);
    }


        ngAfterViewInit(): void {

        this.filterText = this._activatedRoute.snapshot.queryParams['filterText'] || '';

            this.getContact();
    }
 
    getContact(event?: LazyLoadEvent): void {
        let data;
        if(this.primengDatatableHelper.getMaxResultCount(this.paginator, event)==0){
            data=10;
        }
        else{
            data=this.primengDatatableHelper.getMaxResultCount(this.paginator, event)
        }
        this.primengDatatableHelper.showLoadingIndicator();

        this._companyServiceProxy.getContacts(
            this.filterText,
            this.primengDatatableHelper.getSorting(this.dataTable),
            data,
            this.primengDatatableHelper.getSkipCount(this.paginator, event)
        ).subscribe(result => {
            this.primengDatatableHelper.totalRecordsCount = result.totalCount;
            this.primengDatatableHelper.records = result.items;
            this.primengDatatableHelper.hideLoadingIndicator();
        });
    }
    createContact(): void {
        this.createNewContactModal.show(0,0,'contact');
    }
    editContact(data): void {
     this.route.navigate(['app/main/contact/'+data.id,0]);
    }
    deleteContact(contact: NewContactListDto): void {
            this.message.confirm(
                this.l('ContactDeleteWarningMessage', contact.contactName),
                (isConfirmed) => {
                    if (isConfirmed) {
                        this._companyServiceProxy.getDeleteContact(contact.id)
                            .subscribe(() => {
                                this.getContact();
                                this.notify.success(this.l('SuccessfullyDeleted'));
                            });
                    }
                }
            );
        }
     /*deleteContact(contact: NewContactListDto): void {
    this.message.confirm(
        this.l('Are you sure to Delete the Contact', contact.contactName),
        isConfirmed => {
            if (isConfirmed) {
              this._companyServiceProxy.getMappedNewContact(contact.id).subscribe(result=>{
                 if(result)
                  {
                    this.notify.error(this.l('This contact has used, So could not delete'));
                  }else{
                    this.contactDelete(contact);
                  }
              });
            }
        }
    );
}
  contactDelete(contact_data?:any):void{
    this._companyServiceProxy.getDeleteContact(contact_data.id).subscribe(() => {
                    this.getContact();
                    this.notify.success(this.l('Successfully Deleted'));
                    //_.remove(this.contacts, contact_data); 
                });
  }*/

}