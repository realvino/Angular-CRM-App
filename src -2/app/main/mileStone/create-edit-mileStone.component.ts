import { Component, ViewChild, Injector, ElementRef, Output, EventEmitter, OnInit, ViewEncapsulation } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { AppComponentBase } from '@shared/common/app-component-base';
//import { Select2OptionData } from 'ng2-select2/ng2-select2';
import { MileStoneServiceProxy, MileStoneList, SourceTypees, Select2ServiceProxy, Datadto, MileStoneDetailInput, StageDetailListDto } from "shared/service-proxies/service-proxies";
const COLORS = [
  {'name': 'Blue 10', 'hex': '#C0E6FF'},
  {'name': 'Blue 20', 'hex': '#7CC7FF'},
  {'name': 'Blue 30', 'hex': '#5AAAFA'},
  {'name': 'Blue 40', 'hex': '#5596E6'},
  {'name': 'Blue 50', 'hex': '#4178BE'}
]; 
export interface SelectOption{
   id?: number;
   text?: string;
}
@Component({
    selector: 'createMileStoneModal',
    templateUrl: './create-edit-mileStone.component.html',
    styles: [`colorbox,.colorbox { display:inline-block; height:14px; width:14px;margin-right:4px; border:1px solid #000;}`],
    encapsulation: ViewEncapsulation.None  // Enable dynamic HTML styles
})
export class CreateOrEditMileStoneModalComponent extends AppComponentBase implements OnInit {
  private value:any = {};
  private _disabledV:string = '0';
  private disabled:boolean = false;
  private items:Array<any> = [];

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('modal') modal: ModalDirective;
    @ViewChild('nameInput') nameInput: ElementRef;
    @ViewChild('milesourceCombobox') milesourceCombobox: ElementRef;

    milestone: MileStoneList = new MileStoneList();
    stage:MileStoneDetailInput = new MileStoneDetailInput();
    Stagedetails: StageDetailListDto[] = [];
    SelectedSourceId:number = 0; 
    SelectedSourceName:string = ""; 
    sourcetype: SourceTypees[] = [];
    eventOriginal = this.milestone;
    selectedVal:boolean=false;
    active = false;
    saving = false;
    private sourcesType:Array<any>= [];
    active_source:SelectOption[]=[];
    stages:Array<any> = [];
    allStatus:Datadto[];

    constructor(
        injector: Injector,
        private _mileStoneProxyService: MileStoneServiceProxy,
        private _select2Service: Select2ServiceProxy,
    ) {
        super(injector);
    }
  public ngOnInit():any {
    COLORS.forEach((color:{name:string, hex:string}) => {
      this.items.push({
        id: color.hex,
        text: `<colorbox style='background-color:${color.hex};'></colorbox>${color.name} (${color.hex})`
      });
    });
  }
   show(MileStoneId?: number): void {
        this.milestone =new MileStoneList();
        this.SelectedSourceId = 0;
        this.SelectedSourceName = "";
        this.sourcetype = [];
        this.active_source = [];
        this._mileStoneProxyService.getMileStoneForEdit(MileStoneId).subscribe((result) => {
           this.sourcetype = result.sourceTyped;
           this.Stagedetails = result.stages;
           if (result.mileStones != null) {
            this.milestone = result.mileStones;
            this.SelectedSourceId = result.mileStones.sourceTypeId;
            this.SelectedSourceName = result.mileStones.sourceTypeName;
            this.active_source = [{id:result.mileStones.sourceTypeId,text:result.mileStones.sourceTypeName}];
            this.selectedVal =true;
           }
           console.log(result.mileStones);
           if(this.sourcetype.length>0){
              this.sourcesType=[];
                this.sourcetype.forEach((source:{sourceTypeId:number,sourceTypeName:string})=>{
                    this.sourcesType.push({
                      id:source.sourceTypeId,
                      text:source.sourceTypeName
                    })
                });
             }
             
        });

        this._select2Service.getEnquiryStatus().subscribe((result)=>{
          if(result.select2data !=null){
            this.allStatus = result.select2data;
            this.stages = [];
            this.allStatus.forEach((stat:{id:number,name:string})=>{
              this.stages.push({
                id:stat.id,
                text:stat.name
              });
            });
          }
       });

        this.active = true;
        this.modal.show();
    }

    InitDetails(data:any):void{

      this._mileStoneProxyService.getMileStoneForEdit(data).subscribe((result) => {
         this.Stagedetails = result.stages;
      });

      this._select2Service.getEnquiryStatus().subscribe((result)=>{
        if(result.select2data !=null){
          this.allStatus = result.select2data;
          this.stages = [];
          this.allStatus.forEach((stat:{id:number,name:string})=>{
            this.stages.push({
              id:stat.id,
              text:stat.name
            });
          });
        }
     });
    }

    selectedStage(data:any){
      this.stage.stageId = data.id;
    }
    removeStage(data:any){
      this.stage.mileStoneId = null;
    }

    doSomething(data): void {
        console.log(data);
     this.milestone.sourceTypeId = data.id;
     this.selectedVal =true;
    }
    removeSourceType(data):void{
      console.log(data);
      this.milestone.sourceTypeId = null;
      this.selectedVal =false;
    }
   save(): void {
        this.saving = true;
           if (this.milestone.id == null) {
               this.milestone.id = 0;
           }
           
             this._mileStoneProxyService.createOrUpdateMileStone(this.milestone)
            .finally(() => this.saving = false)
            .subscribe(() => {
                this.notify.info(this.l('SavedSuccessfully'));
                this.milestone = this.eventOriginal;
                this.close();
                this.modalSave.emit(this.milestone);
            });
    }

    milesoneStagesave(): void
    {
      this.stage.mileStoneId = this.milestone.id;
      this._mileStoneProxyService.createMileStoneStage(this.stage)
      .finally(() => this.saving = false)
      .subscribe(() => {
          this.notify.info(this.l('SavedSuccessfully'));
          this.InitDetails(this.milestone.id);
      });
    }
    deleteStage(data):void{
      this.message.confirm(
        this.l('Are you sure to Delete the Stage', data.stageName),
            isConfirmed => {
            if (isConfirmed) {
                this._mileStoneProxyService.getDeleteMileStoneDetail(data.id).subscribe(() => {
                    this.notify.success(this.l('Deleted Successfully'));
                    this.InitDetails(this.milestone.id);
                });
            }
        }); 
    }

    onShown(): void {
        $(this.nameInput.nativeElement).focus();
    }
    close(): void {
        this.modal.hide();
        this.active = false;
        //this.milestone = this.eventOriginal;
    }
    private get disabledV():string {
    return this._disabledV;
  }
  isValid(formValid){
    if(formValid && this.selectedVal){
        return false;
    }else{
      return true;
    }
  }
  private set disabledV(value:string) {
    this._disabledV = value;
    this.disabled = this._disabledV === '1';
  }

  public selected(value:any):void {
    console.log('Selected value is: ', value);
  }

  public removed(value:any):void {
    console.log('Removed value is: ', value);
  }

  public typed(value:any):void {
    console.log('New search input: ', value);
  }

  public refreshValue(value:any):void {
    this.value = value;
  }
}
