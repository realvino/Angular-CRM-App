import { Component, OnInit, Input, Output, ViewChild, EventEmitter, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { SelectItem } from 'primeng/primeng';
import * as moment from "moment";

import { Pipe, PipeTransform } from '@angular/core';
import { Datadto, Select2ServiceProxy } from 'shared/service-proxies/service-proxies';


const noop = () => {
};

export const PICK_LIST_MENU_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => ActionDateFilterComponent ),
  multi: true
};

@Component({
  selector: 'actionDateFilterModal',
  templateUrl: './actionDateFilterModal.component.html',
  providers: [PICK_LIST_MENU_VALUE_ACCESSOR]

})

export class ActionDateFilterComponent  implements OnInit, ControlValueAccessor {

  @Input() options: any[];
  @Input() defaultLabel: string;
  @ViewChild('menu') menu: any;
  @Output() onChange: EventEmitter<any> = new EventEmitter();
  filterDate3:string;
  filterDate2:string;
  filterDate1:string;
  private model: any = '';
  filterDate:string;
  from:number;
  private onTouchedCallback: () => void = noop;
  private onChangeCallback: (_: any) => void = noop;

  dfilterDto: Datadto[];
  dateFilters:Array<any>;
  closedateFilters:Array<any>;
  creationFilters:Array<any>;

  dateFilterId:number;
  clsdateFilterId:number;
  credateFilterId:number;

  //customRangeId:number;

  constructor(
    private _select2Service: Select2ServiceProxy
  ) { }

  ngOnInit() {
    this._select2Service.getReportFilters().subscribe((result) =>{
      if(result.select2data != null){
         this.dateFilters = [];
         this.closedateFilters = [];
         this.creationFilters = [];

         this.dfilterDto = result.select2data;
         //this.customRangeId=this.dfilterDto.length+1;
          this.dfilterDto.forEach((p:{id: number, name: string})=>{
              this.dateFilters.push({
                 id:   p.id,
                 name: p.name,
                 selected: false
              });
             
          });
          this.dfilterDto.forEach((p:{id: number, name: string})=>{
            this.creationFilters.push({
              id:   p.id,
              name: p.name,
              selected: false
           });
        });
        this.dfilterDto.forEach((p:{id: number, name: string})=>{          
          this.closedateFilters.push({
            id:   p.id,
            name: p.name,
            selected: false
         });
        });
      }
  });
  }

  show($event, target) {
    this.menu.show($event, target);
  }

  toggle($event, target) {
    this.from = target;
    this.menu.toggle($event);
    if(this.options[0].selected == true){
      this.dateFilterId = null;
      this.clsdateFilterId = null;
      this.credateFilterId = null;
      this.dateFilters = [];
      this.closedateFilters = [];
      this.creationFilters = [];
      this.filterDate1 = "";
      this.filterDate2 = "";
      this.filterDate3 = "";
      this.dfilterDto.forEach((p:{id: number, name: string})=>{
        this.dateFilters.push({
           id:   p.id,
           name: p.name,
           selected: false
        });
      });
      this.dfilterDto.forEach((p:{id: number, name: string})=>{          
        this.closedateFilters.push({
          id:   p.id,
          name: p.name,
          selected: false
       });
      });
      this.dfilterDto.forEach((p:{id: number, name: string})=>{
        this.creationFilters.push({
          id:   p.id,
          name: p.name,
          selected: false
       });
      });
      this.options[0].selected = false;
    }
  }
  close()
  {
    if(this.from == 1){
      this.dateFilterId = null;
      this.filterDate1 = "";
      this.dateFilters = [];
      this.dfilterDto.forEach((p:{id: number, name: string})=>{
        this.dateFilters.push({
           id:   p.id,
           name: p.name,
           selected: false
        });
      });
    }
    else if(this.from == 2){
      this.clsdateFilterId = null;
      this.filterDate2 = "";
      this.closedateFilters = [];
      this.dfilterDto.forEach((p:{id: number, name: string})=>{          
        this.closedateFilters.push({
          id:   p.id,
          name: p.name,
          selected: false
       });
      });
    }
    else if(this.from == 3){
      this.credateFilterId = null;
      this.filterDate3 = "";
      this.creationFilters = [];
      this.dfilterDto.forEach((p:{id: number, name: string})=>{
        this.creationFilters.push({
          id:   p.id,
          name: p.name,
          selected: false
       });
      });
    }
    this.onChange.emit({originalEvent: this.from,value: 0, datepicker: ""});
  }

  selectedDateFilter(dateId):void{
    this.dateFilters  =[];
    this.dfilterDto.forEach((p:{id: number, name: string})=>{
      if(p.id == dateId)
         {
            this.dateFilters.push({
               id:   p.id,
               name: p.name,
               selected: true
            });
        }
        else{
            this.dateFilters.push({
               id:   p.id,
               name: p.name,
               selected: false
            });
      }
         
    });
    this.dateFilterId = dateId;
    if(this.dateFilterId != 7){
      this.onChange.emit({originalEvent: this.from,value: this.dateFilterId, datepicker: ""});
    }
  }

  selectedCloseDateFilter(dateId):void{
    this.closedateFilters  =[];
    this.dfilterDto.forEach((p:{id: number, name: string})=>{
      if(p.id == dateId)
         {
            this.closedateFilters.push({
               id:   p.id,
               name: p.name,
               selected: true
            });
        }
        else{
            this.closedateFilters.push({
               id:   p.id,
               name: p.name,
               selected: false
            });
      }
         
    });
    this.clsdateFilterId = dateId;
    if(this.clsdateFilterId != 7){
      this.onChange.emit({originalEvent: this.from,value: this.clsdateFilterId, datepicker: ""});
    }
  }
  selectedCreationDateFilter(dateId):void{
    this.creationFilters  =[];
    this.dfilterDto.forEach((p:{id: number, name: string})=>{
      if(p.id == dateId)
         {
            this.creationFilters.push({
               id:   p.id,
               name: p.name,
               selected: true
            });
        }
        else{
            this.creationFilters.push({
               id:   p.id,
               name: p.name,
               selected: false
            });
      }
         
    });
    this.credateFilterId = dateId;
    if(this.credateFilterId != 7){
      this.onChange.emit({originalEvent: this.from,value: this.credateFilterId, datepicker: ""});
    }
  }

  onSelectMethod1($event) {  
      let d = new Date(Date.parse($event));
      this.onChange.emit({originalEvent: this.from,value: 7, datepicker: moment(d).format('DD-MM-YYYY')});
  }
  
  onSelectMethod2($event) {  
    let d = new Date(Date.parse($event));
    this.onChange.emit({originalEvent: this.from,value: 7, datepicker: moment(d).format('DD-MM-YYYY')});
  }

  onSelectMethod3($event) {  
     let d = new Date(Date.parse($event));
     this.onChange.emit({originalEvent: this.from,value: 7, datepicker: moment(d).format('DD-MM-YYYY')});
  }

  get value(): any {
    return this.model;
  };

  set value(v: any) {
    if (v !== this.model) {
      this.model = v;
      this.onChangeCallback(v);
    }
  }

  onBlur() {
    this.onTouchedCallback();
  }

  writeValue(value: any) {
    if (value !== this.model) {
      this.model = value;
    }
  }

  registerOnChange(fn: any) {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
  }
  
}
