import { forwardRef,Input, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit, Component } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

const DATE_PICKER_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => MonthPicker),
    multi: true

};

declare var jQuery: any;

@Component({
    selector: 'my-monthpicker',
    template: `<input #input type="text" style="width:100%;" [(ngModel)]="value" class="form-control">`,
    providers: [DATE_PICKER_VALUE_ACCESSOR]
})
export class MonthPicker implements AfterViewInit {


    @ViewChild('input') input: ElementRef;
    @Input() value = '';
    @Output() dateChange:EventEmitter<any> = new EventEmitter();
    private onTouched = () => { };
    private onChange: (value: string) => void = () => { };
    writeValue(val: string) {
        this.value = val;

        jQuery(this.input.nativeElement).datepicker('setDate', val);
    }
    registerOnChange(fn: any) {
        this.onChange = fn;
    }

    registerOnTouched(fn: any) {
        this.onTouched = fn;
    }


    ngAfterViewInit() {

        var self = this;
        jQuery(this.input.nativeElement).datepicker({format: "M-yyyy",
            minViewMode: "months", // or 1
            orientation: "bottom right",
            autoclose: true,
                startView:'months',


            }
        ).on('changeDate',function(ev){

              self.value= ev.target.value;
              self.onChange(ev);
              self.onTouched();
			  var export_date = new Date(ev.date.setHours(ev.date.getHours() + 6));
              self.dateChange.emit(export_date);

            });

    }

}