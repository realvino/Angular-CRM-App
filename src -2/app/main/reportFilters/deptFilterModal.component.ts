import { Component, OnInit, Input, Output, ViewChild, EventEmitter, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { SelectItem } from 'primeng/primeng';
import * as moment from "moment";

const noop = () => {
};

export const PICK_LIST_MENU_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => DeptFilterComponent ),
  multi: true
};

@Component({
  selector: 'deptFilterModal',
  templateUrl: './deptFilterModal.component.html',
  providers: [PICK_LIST_MENU_VALUE_ACCESSOR]
})
export class DeptFilterComponent  implements OnInit, ControlValueAccessor {

  @Input() options: SelectItem[];
  @Input() defaultLabel: string;
  @ViewChild('menu') menu: any;
  @Output() onChange: EventEmitter<any> = new EventEmitter();

  private model: any = '';
  private onTouchedCallback: () => void = noop;
  private onChangeCallback: (_: any) => void = noop;

  constructor() { }

  ngOnInit() {
  }

  show($event, target) {
    this.menu.show($event, target);
  }

  toggle($event, target) {
    this.menu.toggle($event, target);
  }

  onMenuChange($event) {
    this.onChange.emit($event);
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
