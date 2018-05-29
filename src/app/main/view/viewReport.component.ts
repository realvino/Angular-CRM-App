import { Component, Injector, OnInit, AfterViewInit, ViewChild, Pipe } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { ViewServiceProxy, Select2ServiceProxy, Datadto, ColumnList, InquiryServiceProxy, ViewDto, QuotationServiceProxy, ViewInput, UpdateViewInput } from "shared/service-proxies/service-proxies";
import { DataTable } from 'primeng/components/datatable/datatable';
import { Paginator } from 'primeng/components/paginator/paginator';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { CreateViewComponent } from '@app/main/view/create-or-edit-view.component';
import { ViewCreateComponent } from '@app/main/view/createview.component';
import { Router } from '@angular/router';

export interface SelectOption{
    id?: number;
    text?: string;
 }
@Pipe({
    name: 'filter'
})
@Component({
    templateUrl: './viewReport.component.html',
    animations: [appModuleAnimation()]
})

export class ViewReportComponent extends AppComponentBase implements OnInit {
    whyBafco: string;
    categorie: string;
    coordinator: string;
    designer: string;
    status: string;
    probability: string;
    emirate: string;
    depatmentName: string;
    designationName: string;
    potentialCustomer: string;
    teamName: string;
    enquiryStatus: string;
    mileStoneName: string;
    salesman: string;
    quotationCreateBy: string;
    userId: string;
    name: string;
    statusFilter: string;
    inquiryCreateBy: string;   
    getId: string;
    areaName: string;
    buildingName: string;
    hidedColumns:Array<any>=[];
    query:string;
    quotationCreation: any;
    inquiryCreation: any;
    closureDate: any;
    lastActivity: any;

    @ViewChild('dataTable') dataTable: DataTable;
    @ViewChild('paginator') paginator: Paginator;
    @ViewChild('salesQuotdataTable') salesQuotdataTable: DataTable;
    @ViewChild('ViewcreateModal') ViewcreateModal: ViewCreateComponent;
    
    viewDto: ViewDto[];
    view:Array<any>;
    filterText: string = '';
    active_view:SelectOption[];
    gridColumn:ColumnList[];
    gridColumnCount:number=0;
    viewId:number;
    gridData:any[]=[];
    quotationArray: Array<any>;
    quotationArrayCount:number=0;  
    whyBafcos: any;
    categories: Array<any> = [];
    coordinators: Array<any> = [];
    designers: Array<any> = [];
    statuses: Array<any> = [];
    probabilitys: Array<any> = [];
    emirates: Array<any> = [];
    depatmentNames: Array<any> = [];
    designationNames: Array<any> = [];
    potentialCustomers: Array<any> = [];
    teamNames: Array<any> = [];
    enquiryStatuses: Array<any> = [];
    mileStoneNames: Array<any> = [];
    salesmans: Array<any> = [];
    quotationCreateBys: Array<any> = [];
    userIds: Array<any> = [];
    names: Array<any> = [];
    areaNames: Array<any> = [];
    buildingNames: Array<any> = [];
    CreationId:number;
    LastActId:number;
    ClosureId:number;
    updateColumnInput:UpdateViewInput = new UpdateViewInput();
    filtered: Map<string, boolean> = new Map<string, boolean>();
    filter= {
        date: [],
        stage: [],
        percentage: [],
        actionDate: [],
        whyBafco: [],
        categorie: [],
        coordinator: [],
        designer: [],
        status: [],
        milestone: [],
        probability: [],
        emirates: [],
        depatmentName: [],
        designationName: [],
        potentialCustomer: [],
        teamName: [],
        enquiryStatus: [],
        mileStoneName: [],
        salesman :[]
    };
    stages:Array<any> = [];
    percentages:Array<any> = [];
    viewsInput: ViewInput = new ViewInput();
    newView= [{id:0, selected:false}];

   constructor(
        injector: Injector,
        private _viewService: ViewServiceProxy,
        private _select2Service: Select2ServiceProxy,
        private _inquiryProxyService: InquiryServiceProxy,
        private _quoatationService: QuotationServiceProxy,
        private route: Router
    )
    {
        super(injector);
    }

    ngOnInit() {
        // this.viewsInput = new ViewInput();
        this._select2Service.getViews().subscribe((result) =>{
           if(result.select5data != null){
               this.view = [];
               this.viewDto = result.select5data;
                this.viewDto.forEach((view:{id: number, name: string,isEditable:boolean})=>{
                  this.view.push({
                      id:   view.id,
                      text: view.name,
                      isEditable:view.isEditable
                  });
                });
           }
        });
        
    }
    
    selectView(data:any){

        this.viewsInput = new ViewInput();
        this.stages = [];
        this.statuses = [];
        this.percentages = [];
        this.mileStoneNames = [];
        this.teamNames = [];
        this.depatmentNames = [];
        this.categories = [];
        this.salesmans = [];
        this.designers = [];
        this.coordinators = [];
        this. filter= {
            date: [],
            stage: [],
            percentage: [],
            actionDate: [],
            whyBafco: [],
            categorie: [],
            coordinator: [],
            designer: [],
            status: [],
            milestone: [],
            probability: [],
            emirates: [],
            depatmentName: [],
            designationName: [],
            potentialCustomer: [],
            teamName: [],
            enquiryStatus: [],
            mileStoneName: [],
            salesman :[]
        };
        
        this.active_view = [{id:data.id,text:data.text}];
        this.viewId= data.id;
        this.getId = data.id;
        this.name = data.text; 
        this.userId = ""; 
        this.quotationCreateBy= "";
        this.statusFilter= "";
        this.salesman= ""; 
        this.inquiryCreateBy= "";
        this.potentialCustomer= "";
        this.mileStoneName= ""; 
        this.enquiryStatus= ""; 
        this.teamName= "";
        this.coordinator= "";
        this.designer= "";
        this.designationName= "";
        this.emirate= "";
        this.depatmentName= "";
        this.categorie= ""; 
        this.status= "";
        this.whyBafco= ""; 
        this.probability= "";
        this.quotationCreation = "";
        this.lastActivity = "";
        this.closureDate = "";
        this.viewsInput.id = data.id;
        this.newView= [{id:data.id, selected:true}];
        this.CreationId = 0;
        this.ClosureId = 0;
        this.LastActId = 0;
        this.initInquiry();
        this.hideColumn(null);
    }
    removeView(data:any){
        this.active_view =[];
        this.name = ""; 
        this.viewId= null;
        this.getId = null;   
    }

    createview(): void {
        console.log(this.viewsInput);
        this.ViewcreateModal.show(this.viewsInput);
    }

    getInquiry(event?: LazyLoadEvent): void {
        let data;
        if(this.primengDatatableHelper.getMaxResultCount(this.paginator, event)==0){
            data=10;
        }
        else{
            data=this.primengDatatableHelper.getMaxResultCount(this.paginator, event)
        }
        this.primengDatatableHelper.showLoadingIndicator();

        this._quoatationService.getQuotationInquiryFilter(
            this.viewId,
            this.userId, 
            this.quotationCreateBy, 
            "", 
            this.salesman, 
            this.inquiryCreateBy, 
            this.potentialCustomer, 
            this.mileStoneName, 
            this.enquiryStatus, 
            this.teamName, 
            this.coordinator, 
            this.designer, 
            this.designationName, 
            this.emirate, 
            this.depatmentName, 
            this.categorie, 
            this.status, 
            this.whyBafco, 
            this.probability, 
            this.quotationCreation, 
            this.inquiryCreation,  
            this.closureDate,
            this.lastActivity,
            this.statusFilter,          
            this.CreationId,
            this.ClosureId,
            this.LastActId,
            this.primengDatatableHelper.getSorting(this.dataTable),
            data,
            this.primengDatatableHelper.getSkipCount(this.paginator, event)).subscribe(result => {
            this.primengDatatableHelper.totalRecordsCount = result.totalCount;
            this.primengDatatableHelper.records = result.items;
            console.log(result.items); 
            this.primengDatatableHelper.hideLoadingIndicator();
        });
    }

    initInquiry(event?: LazyLoadEvent): void {
        let data;
        if(this.primengDatatableHelper.getMaxResultCount(this.paginator, event)==0){
            data=10;
        }
        else{
            data=this.primengDatatableHelper.getMaxResultCount(this.paginator, event)
        }
        this.primengDatatableHelper.showLoadingIndicator();

        this._quoatationService.getQuotationInquiryFilter(
            this.viewId,
            this.userId, 
            this.quotationCreateBy, 
            "", 
            this.salesman, 
            this.inquiryCreateBy, 
            this.potentialCustomer, 
            this.mileStoneName, 
            this.enquiryStatus, 
            this.teamName, 
            this.coordinator, 
            this.designer, 
            this.designationName, 
            this.emirate, 
            this.depatmentName, 
            this.categorie, 
            this.status, 
            this.whyBafco, 
            this.probability, 
            this.quotationCreation, 
            this.inquiryCreation,  
            this.closureDate,
            this.lastActivity,
            this.statusFilter,
            this.CreationId,
            this.ClosureId,
            this.LastActId,
            this.primengDatatableHelper.getSorting(this.dataTable),
            data,
            this.primengDatatableHelper.getSkipCount(this.paginator, event)).subscribe(result => {
            this.primengDatatableHelper.totalRecordsCount = result.totalCount;
            this.primengDatatableHelper.records = result.items;
            console.log(result.items); 
            this.primengDatatableHelper.hideLoadingIndicator();
            
            this.primengDatatableHelper.records.forEach((item:{quotationStatus:string})=>{
                if(item.quotationStatus != ""){
                    var index = this.stages.findIndex(x => x.label == item.quotationStatus)
                    if(index == -1){
                        this.stages.push({
                            label: item.quotationStatus,
                            value: item.quotationStatus
                        });                   
                    }
                }
            });
            this.primengDatatableHelper.records.forEach((item:{enquiryStatus:string})=>{
                if(item.enquiryStatus != ""){
                    var index = this.statuses.findIndex(x => x.label == item.enquiryStatus)
                    if(index == -1){
                        this.statuses.push({
                            label: item.enquiryStatus,
                            value: item.enquiryStatus
                        });                   
                    }
                }
            });
            this.primengDatatableHelper.records.forEach((item:{probability:string})=>{
                if(item.probability != ""){
                    var index = this.percentages.findIndex(x => x.label == item.probability)
                    if(index == -1){
                        this.percentages.push({
                            label: item.probability,
                            value: item.probability
                        });                   
                    }
                }
            });
            this.percentages.sort((a, b) => parseFloat(a.label) - parseFloat(b.label));
             console.log(this.percentages);
            this.primengDatatableHelper.records.forEach((item:{mileStoneName:string})=>{
                if(item.mileStoneName != ""){
                    var index = this.mileStoneNames.findIndex(x => x.label == item.mileStoneName)
                    if(index == -1){
                        this.mileStoneNames.push({
                            label: item.mileStoneName,
                            value: item.mileStoneName
                        });                   
                    }
                }
            });
            this.primengDatatableHelper.records.forEach((item:{teamName:string})=>{
                if(item.teamName != ""){
                    var index = this.teamNames.findIndex(x => x.label == item.teamName)
                    if(index == -1){
                        this.teamNames.push({
                            label: item.teamName,
                            value: item.teamName
                        });                   
                    }
                }
            });
            this.primengDatatableHelper.records.forEach((item:{depatmentName:string})=>{
                if(item.depatmentName != ""){
                    var index = this.depatmentNames.findIndex(x => x.label == item.depatmentName)
                    if(index == -1){
                        this.depatmentNames.push({
                            label: item.depatmentName,
                            value: item.depatmentName
                        });                   
                    }
                }
            });
            this.primengDatatableHelper.records.forEach((item:{categories:string})=>{
                if(item.categories != ""){
                    var index = this.categories.findIndex(x => x.label == item.categories)
                    if(index == -1){
                        this.categories.push({
                            label: item.categories,
                            value: item.categories
                        });                   
                    }
                }
            });
            this.primengDatatableHelper.records.forEach((item:{salesman:string})=>{
                if(item.salesman != ""){
                    var index = this.salesmans.findIndex(x => x.label == item.salesman)
                    if(index == -1){
                        this.salesmans.push({
                            label: item.salesman,
                            value: item.salesman
                        });                   
                    }
                }
            });
            this.primengDatatableHelper.records.forEach((item:{designer:string})=>{
                if(item.designer != ""){
                    var index = this.designers.findIndex(x => x.label == item.designer)
                    if(index == -1){
                        this.designers.push({
                            label: item.designer,
                            value: item.designer
                        });                   
                    }
                }
            });
            this.primengDatatableHelper.records.forEach((item:{coordinator:string})=>{
                if(item.coordinator != ""){
                    var index = this.coordinators.findIndex(x => x.label == item.coordinator)
                    if(index == -1){
                        this.coordinators.push({
                            label: item.coordinator,
                            value: item.coordinator
                        });                   
                    }
                }
            });
        });
    } 


    selectedStage(filter) {
        this.statusFilter = "";
        var i = 1;
        filter.value.forEach(element => {
            if(i == 1)
            {
                this.statusFilter =  element ;
                i = 0;
            }
            else{
                this.statusFilter = this.statusFilter + "," + element;
            }
            
        });
        this.viewsInput.statusForQuotation = this.statusFilter;
           this.getInquiry();
      }
      selectedStone(filter) {
        this.mileStoneName = "";
        var i = 1;
        filter.value.forEach(element => {
            if(i == 1)
            {
                this.mileStoneName =  element ;
                i = 0;
            }
            else{
                this.mileStoneName = this.mileStoneName + "," + element;
            }
            
        });
        this.viewsInput.mileStoneName = this.mileStoneName;
           this.getInquiry();
      }

      selectedCatagiries(filter) {
        this.categorie = "";
        var i = 1;
        filter.value.forEach(element => {
            if(i == 1)
            {
                this.categorie =  element ;
                i = 0;
            }
            else{
                this.categorie = this.categorie + "," + element;
            }
            
        });
           this.viewsInput.categories = this.categorie;
           this.getInquiry();
      }

       selectedCoordinator(filter) {
        this.coordinator = "";
        var i = 1;
        filter.value.forEach(element => {
            if(i == 1)
            {
                this.coordinator =  element ;
                i = 0;
            }
            else{
                this.coordinator = this.coordinator + "," + element;
            }
            
        });
        this.viewsInput.coordinator = this.coordinator;
           this.getInquiry();
      }

       selectedDept(filter) {
        this.depatmentName = "";
        var i = 1;
        filter.value.forEach(element => {
            if(i == 1)
            {
                this.depatmentName =  element ;
                i = 0;
            }
            else{
                this.depatmentName = this.depatmentName + "," + element;
            }
            
        });
        this.viewsInput.depatmentName = this.depatmentName;
           this.getInquiry();
      }

      selectedDesigner(filter) {
        this.designer = "";
        var i = 1;
        filter.value.forEach(element => {
            if(i == 1)
            {
                this.designer =  element ;
                i = 0;
            }
            else{
                this.designer = this.designer + "," + element;
            }
            
        });
        this.viewsInput.designer = this.designer;
           this.getInquiry();
      }

       selectedSales(filter) {
        this.salesman = "";
        var i = 1;
        filter.value.forEach(element => {
            if(i == 1)
            {
                this.salesman =  element ;
                i = 0;
            }
            else{
                this.salesman = this.salesman + "," + element;
            }
            
        });
        this.viewsInput.salesman = this.salesman;
           this.getInquiry();
      }

      selectedTeam(filter) {
        this.salesman = "";
        var i = 1;
        filter.value.forEach(element => {
            if(i == 1)
            {
                this.teamName =  element ;
                i = 0;
            }
            else{
                this.teamName = this.teamName + "," + element;
            }
            
        });
        this.viewsInput.teamName = this.teamName;
           this.getInquiry();
      }

    //    selectedWhybafco(filter) {
    //     this.whyBafco = "";
    //     var i = 1;
    //     filter.value.forEach(element => {
    //         if(i == 1)
    //         {
    //             this.whyBafco =  element ;
    //             i = 0;
    //         }
    //         else{
    //             this.whyBafco = this.whyBafco + "," + element;
    //         }
            
    //     });
    //        this.getInquiry();
    //   }

      selectedStatus(filter) {
        this.status = "";
        var i = 1;
        filter.value.forEach(element => {
            if(i == 1)
            {
                this.status =  element ;
                i = 0;
            }
            else{
                this.status = this.status + "," + element;
            }
            
        });
        this.viewsInput.enquiryStatus = this.status;
           this.getInquiry();
      }
      selectedPercentage(filter) {
        this.probability = "";
        var i = 1;
        filter.value.forEach(element => {
            if(i == 1)
            {
                this.probability =  element ;
                i = 0;
            }
            else{
                this.probability = this.probability + "," + element;
            }
            
        });
        this.viewsInput.probability = this.probability;
           this.getInquiry();
      }
      selectedActionDate(filter) {
        console.log(filter)
       if(filter.originalEvent == 1)
       {
        this.lastActivity = "";
          this.viewsInput.lastActivityDateFilterId = filter.value;
          this.LastActId = filter.value;
          if(filter.value == 7)
          {
            this.LastActId = 0;
            this.lastActivity = filter.datepicker;
          }
       }
      else if(filter.originalEvent == 2)
       {
          this.closureDate = "";
          this.viewsInput.closureDateFilterId = filter.value;
          this.ClosureId = filter.value;
          if(filter.value == 7)
          {
            this.closureDate = filter.datepicker;
            this.ClosureId = 0;
          }
       }
      else if(filter.originalEvent == 3)
       {
          this.quotationCreation = "";
          this.viewsInput.dateFilterId = filter.value;
          this.CreationId = filter.value;
          if(filter.value == 7)
          {
            this.quotationCreation = filter.datepicker;
            this.CreationId = 0;
          }
       }
       this.viewsInput.lastActivity = this.lastActivity;
       this.viewsInput.closureDate = this.closureDate;
       this.viewsInput.quotationCreation = this.quotationCreation;
       this.getInquiry();
    }
      /* selectedActionDate(filter) {
          console.log(filter)
         if(filter.originalEvent == 1)
         {
            this.lastActivity = filter.datepicker;
         }
        else if(filter.originalEvent == 2)
         {
            this.closureDate = filter.datepicker;
         }
        else if(filter.originalEvent == 3)
         {
            this.quotationCreation = filter.datepicker;
         }
         this.viewsInput.lastActivity = this.lastActivity;
         this.viewsInput.closureDate = this.closureDate;
         this.viewsInput.quotationCreation = this.quotationCreation;
         this.getInquiry();
      } */
    // getGridColumns(viewId){
    //     this._viewService.getGridColumns(viewId).subscribe((result)=>{
    //         if(result.listDtos != null){
    //            this.gridColumn = result.listDtos;
    //            this.gridColumnCount = result.listDtos.length;
    //            console.log(this.gridColumn, this.gridColumnCount);
    //            this.getInquiry();
    //         }
    //     });
    // }
    // getViewReport(event?: LazyLoadEvent): void {
    //     let data;
        
    //     if(this.primengDatatableHelper.getMaxResultCount(this.paginator, event)==0){
    //         data=10;
    //     }
    //     else{
    //         data=this.primengDatatableHelper.getMaxResultCount(this.paginator, event)
    //     }
    //     this.primengDatatableHelper.showLoadingIndicator();

    //     this._viewService.getGridDatas(this.viewId).subscribe(result => {
    //         this.primengDatatableHelper.totalRecordsCount = result[0].length;
            
    //         this.primengDatatableHelper.records = result[0];
    //         console.log(this.primengDatatableHelper.records);
    //         this.primengDatatableHelper.hideLoadingIndicator();
    //         console.log("data",result[0]);
    //     });
    // }
    /* getGridColumnDatas(viewId){
        this._viewService.getGridDatas(viewId).subscribe((result)=>{
            if(result[0] != null){
               console.log(result[0]);
            }
        });
    } */
    
    
hideColumn(col){
    if(col != null){
      this.message.confirm(
          this.l('Are you sure to Remove the Column', col.header),
          isConfirmed => {
              if (isConfirmed) {
                  this.hidedColumns.push({columnName:col.header});
                  this.query = "";
                  var i = 1;
                  this.hidedColumns.forEach((element:{columnName:string}) => {
                      if(i == 1)
                      {
                          this.query =  element.columnName ;
                          i = 0;
                      }
                      else{
                          this.query = this.query + "," + element.columnName;
                      }
                      
                  });
                  this.viewsInput.query = this.query;
                  this.updateColumnInput.id = this.viewId;
                  this.updateColumnInput.query = this.query;
                  console.log(this.updateColumnInput);
                  this._viewService.updateViewColumns(this.updateColumnInput)
                  .subscribe(() => {
                      this.notify.success(this.l('Removed Successfully'));
                      this.getInquiry();
                  });
              }
          }
      ); 
    }
    else{
      this._viewService.getViewForEdit(this.viewId).subscribe((result) => {
          this.hidedColumns = [];
          if (result.viewdatas != null) {
              console.log(result.viewdatas.query);
              if(result.viewdatas.query != null){
                  var ss = result.viewdatas.query.split(","); 
                  ss.forEach(element => {
                      this.hidedColumns.push({columnName:element});
                  });
              }
          }
          console.log("Edit",this.hidedColumns);
      });
      this.getInquiry();
    }
  }
  Show(data){
    var index = this.hidedColumns.findIndex(x=> x.columnName == data);
    if(index == -1){
        return true;
    }
    else{
        return false;
    }
  }
  checked(name,Id){
      this.message.confirm(
          this.l('Are you sure to Add the Column', name),
          isConfirmed => {
              if (isConfirmed) {
                  var removeIndex = this.hidedColumns.findIndex(x=> x.columnName == name);
                  if (removeIndex !== -1) {
                      this.hidedColumns.splice(removeIndex, 1);
                      this.query = "";
                      var i = 1;
                      this.hidedColumns.forEach((element:{columnName:string}) => {
                          if(i == 1)
                          {
                              this.query =  element.columnName ;
                              i = 0;
                          }
                          else{
                              this.query = this.query + "," + element.columnName;
                          }
                      });
                      this.viewsInput.query = this.query;
                      this.updateColumnInput.id = Id;
                      this.updateColumnInput.query = this.query;
                      console.log(this.updateColumnInput);
                      this._viewService.updateViewColumns(this.updateColumnInput)
                      .subscribe(() => {
                          this.notify.success(this.l('Added Successfully'));
                          this.getInquiry();
                      });
                  }
              }
          }
      );
      
  }

    reloadPage(): void {
        this.paginator.changePage(this.paginator.getPage(),null);
    }
    goToQuotation(event:any){
        console.log(event,event.data.quotationId);
       if(event.data.quotationId > 0)
       {
        window.open('app/main/quotation/'+event.data.quotationId, "_blank");
       }
       else{
        this.notify.error(this.l('No quotation in this Opportunity'));
       }

    }
 
    
}