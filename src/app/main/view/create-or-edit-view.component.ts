import { Component, ViewChild, Injector, ElementRef, Output, EventEmitter, OnInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ViewServiceProxy, ViewInput, Datadto, Select2ServiceProxy, ColumnDto, ViewListDto } from 'shared/service-proxies/service-proxies';
export interface SelectOption{
    id?: number;
    text?: string;
 }

@Component({
    selector: 'createViewModal',
    templateUrl: './create-or-edit-view.component.html'
})
export class CreateViewComponent extends AppComponentBase {
 
    query: string;
    cities: { id: number; text: string; }[];
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('modal') modal: ModalDirective;
    @ViewChild('nameInput') nameInput: ElementRef;
    viewsInput: ViewInput = new ViewInput();
    views: ViewListDto = new ViewListDto();
    eventOriginal = this.views;
    dropdownList = [];
    selectedItems = [];
    dropdownSettings = {};
    active = false;
    saving = false;
    personDto: Datadto[];
    statusDto: Datadto[];
    dfilterDto: Datadto[];
    columnDto: ColumnDto[];
    person:Array<any>;
    status:Array<any>;
    dfilter:Array<any>;
    active_person:SelectOption[];
    active_status:SelectOption[];
    active_filter:SelectOption[];
    active_enq:SelectOption[];
    IsEquiry:boolean = true;
    enqStatus: { id: number; text: string; }[] = [
            { id: 1, text: 'Open' },
            { id: 2, text: 'Closed' },
            { id: 3, text: 'Won' },
            { id: 4, text: 'Lost' }
        ];
    constructor(
        injector: Injector,
        private _viewService: ViewServiceProxy,
        private _select2Service: Select2ServiceProxy

    ) {
        super(injector);
    }


show(viewsId?: number): void {
        this.active_person=[];
        this.active_filter=[];
        this.active_status=[];
        this.active_enq=[];    
        this.views = new ViewListDto();
        /* this._select2Service.getReportColumn().subscribe((result) =>{
            if(result.select5data != null){
                this.cities = [];
                this.columnDto = result.select5data;
                this.columnDto.forEach((p:{id: number, name: string})=>{
                    this.cities.push({
                      id:   p.id,
                      text: p.name
                    });
                });
            } */
     
            this._viewService.getViewForEdit(viewsId).subscribe((result) => {
                /* this._select2Service.getReportAllPerson().subscribe((result) =>{
                      if(result.select3data != null){
                          this.person = [];
                          this.personDto = result.select3data;
                          this.personDto.forEach((p:{id: number, name: string})=>{
                              this.person.push({
                                 id:   p.id,
                                 text: p.name
                              });
                          });
                       }
                });
                this._select2Service.getReportFilters().subscribe((result) =>{
                    if(result.select2data != null){
                       this.dfilter = [];
                       this.dfilterDto = result.select2data;
                        this.dfilterDto.forEach((p:{id: number, name: string})=>{
                            this.dfilter.push({
                               id:   p.id,
                               text: p.name
                            });
                        });
                    }
                });
                this._select2Service.getQuotationStatus().subscribe((result) =>{
                    if(result.select2data != null){
                        this.status = [];
                        this.statusDto = result.select2data;
                        this.statusDto.forEach((p:{id: number, name: string})=>{
                            this.status.push({
                                id:   p.id,
                                text: p.name
                            });
                        });
                    }
                });
                this.selectedItems = []; */
                if (result.viewdatas != null) {
                    console.log(result.viewdatas);
                    this.views = result.viewdatas;
                   /* if( this.views.enqStatusId > 0)
                    {
                         var index = this.enqStatus.findIndex(x=> x.id == this.views.enqStatusId);
                            if(index >= 0){
                                this.active_enq=[{id: this.enqStatus[index].id,text:this.enqStatus[index].text}];                             
                            }
                    }
                   
                    if(this.views.allPersonId > 0)
                    {
                        this.active_person=[{id:this.views.allPersonId,text:this.views.personName}];
                    }
                    if(this.views.dateFilterId > 0)
                    {
                       this.active_filter=[{id:this.views.dateFilterId,text:this.views.filterName}];
                    }
                    if(this.views.quotationStatusId > 0)
                    {
                       this.active_status=[{id:this.views.quotationStatusId,text:this.views.statusName}];
                    } 
                    console.log(this.cities);
                    var ss = this.views.query.split(","); 
                    for (var i in ss) {  
                        var selectindex = this.cities.findIndex(x=> x.text==ss[i]);
                           if(selectindex >= 0){
                            if(this.cities[selectindex].text == "Quotation Ref No")
                            {
                               this.IsEquiry = false;
                            }
                                this.selectedItems.push({
                                   id: this.cities[selectindex].id,
                                   text: this.cities[selectindex].text,
                                 });
                            }
                    } */
                }
            
                /* this.dropdownSettings = {
                   singleSelection: false,
                   idField: 'id',
                   textField: 'text',
                   selectAllText: 'Select All',
                   unSelectAllText: 'UnSelect All',
                   itemsShowLimit: 10,
                   allowSearchFilter: false
                }; */
          
                 this.active = true;
                 this.modal.show();
            });
        /* }); */
    }
    onItemSelect(item:any){
        // console.log(this.selectedItems);
    }
    onSelectAll(items: any){
        // console.log(items);
    }
    onListAll(items: any){
        this.IsEquiry = true;
        this.query = "";
            items.forEach((item:{id:number, text:string}) => {
                if(item.text == "Quotation Ref No")
                {
                   this.IsEquiry = false;
                }
                this.query = this.query + item.text + ",";
               });   
               this.views.query = this.query;
            }
            
 save(): void {
        this.saving = true;
           if (this.views.id == null) {
               this.views.id = 0;
           }
             this.viewsInput.id = this.views.id;
             this.viewsInput.name = this.views.name;
             this.viewsInput.query = this.views.query;
             if(this.viewsInput.id > 0)
             {
               this.viewsInput.isEditable = this.views.isEditable;
             }
             else{
               this.viewsInput.isEditable = true;
             }
             this.viewsInput.isEnquiry = this.views.isEnquiry;
             this.viewsInput.quotationStatusId = this.views.quotationStatusId;
             this.viewsInput.allPersonId = this.views.allPersonId;
             this.viewsInput.graterAmount = this.views.graterAmount;
             this.viewsInput.lessAmount = this.views.lessAmount;
             this.viewsInput.dateFilterId = this.views.dateFilterId;

             this.viewsInput.closureDateFilterId = this.views.closureDateFilterId;
             this.viewsInput.lastActivityDateFilterId = this.views.lastActivityDateFilterId;

             this.viewsInput.enqStatusId = this.views.enqStatusId;

             this.viewsInput.userIds = this.views.userIds;
             this.viewsInput.quotationCreateBy = this.views.quotationCreateBy;
             this.viewsInput.quotationStatus = this.views.quotationStatus;
             this.viewsInput.salesman = this.views.salesman;
             this.viewsInput.inquiryCreateBy = this.views.inquiryCreateBy;
             this.viewsInput.potentialCustomer = this.views.potentialCustomer;
             this.viewsInput.mileStoneName = this.views.mileStoneName;
             this.viewsInput.enquiryStatus = this.views.enquiryStatus;
             this.viewsInput.teamName = this.views.teamName;
             this.viewsInput.coordinator = this.views.coordinator;
             this.viewsInput.designer = this.views.designer;
             this.viewsInput.designationName = this.views.designationName;
             this.viewsInput.emirates = this.views.emirates;
             this.viewsInput.depatmentName = this.views.depatmentName;
             this.viewsInput.categories = this.views.categories;
             this.viewsInput.status = this.views.status;
             this.viewsInput.whyBafco = this.views.whyBafco;
             this.viewsInput.probability = this.views.probability;
             this.viewsInput.quotationCreation = this.views.quotationCreation;
             this.viewsInput.inquiryCreation = this.views.inquiryCreation;
             this.viewsInput.closureDate = this.views.closureDate;
             this.viewsInput.lastActivity = this.views.lastActivity;
             this.viewsInput.statusForQuotation = this.views.statusForQuotation;
             
                /* if(this.IsEquiry == false)
                {
                    this.viewsInput.enqStatusId = null;
                } */
             
            console.log("Save",this.viewsInput);
            this._viewService.createOrUpdateView(this.viewsInput)
            .finally(() => this.saving = false)
            .subscribe(() => {
                this.notify.success(this.l('SavedSuccessfully'));
                this.views = this.eventOriginal;
                this.close();
                this.modalSave.emit(this.views);
            });
    }

    onShown(): void {
        $(this.nameInput.nativeElement).focus();
    }

    selectperson(data:any){
     this.views.allPersonId = data.id;
    }
    removeperson(data:any){
                         this.active_person=[];
             this.views.allPersonId = null;
    }

    selectstatus(data:any){
     this.views.quotationStatusId = data.id;
      this.views.enqStatusId = null;
    }
    removestatus(data:any){

        this.active_status=[];
             this.views.quotationStatusId = null;
    }

    selectdate(data:any){
     this.views.dateFilterId = data.id;
    }
    removedate(data:any){
     this.active_filter=[];
     this.views.dateFilterId = null;
    }
    selectenq(data:any){
     this.views.enqStatusId = data.id;
     this.views.quotationStatusId = null;
    }
    removeenq(data:any){
     this.active_enq=[];
     this.views.enqStatusId = null;
    }

    close(): void {
        this.IsEquiry = true;
        this.modal.hide();
        this.active = false;
        this.active_person=[];
        this.active_filter=[];
        this.active_status=[];
        this.active_enq=[];
    }
}
