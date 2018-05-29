import { Component, ElementRef, Input, AfterViewInit, OnInit } from '@angular/core';

@Component({
    selector: 'required_field',
    template:'<span style="color:red;">*</span>'
})
export class RequiredTemplate implements AfterViewInit,OnInit {

    ngOnInit():void{
    	console.log('required is active');
    }
    ngAfterViewInit():void{
    	
    }
}