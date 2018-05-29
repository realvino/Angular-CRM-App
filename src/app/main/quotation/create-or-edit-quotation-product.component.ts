import { Component, ViewChild, Injector, ElementRef, Output, EventEmitter, OnInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { AppComponentBase } from '@shared/common/app-component-base';
import { QuotationServiceProxy, TemporaryProductServiceProxy, Select2ServiceProxy, Datadto,Productdto,Productdetailsdto, QuotationProductListDto,QuotationProductInput, TenantDashboardServiceProxy,CreateDiscountInput, Discountdatadto, TemporaryProductInput, ProductServiceProxy, Categorydto } from 'shared/service-proxies/service-proxies';
import { AppConsts } from "shared/AppConsts";
import { CreateOrEditTempProductModalComponent } from 'app/main/temporaryProducts/create-or-edit-tempProducts.component';
import { CreateEditProductComponent } from '@app/main/product/create-or-edit-product.component';

import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { DataTable } from 'primeng/components/datatable/datatable';
import { Paginator } from 'primeng/components/paginator/paginator';

export interface SelectOption{
   id?: number;
   text?: string;
}

@Component({
    selector: 'createQuotationProductModal',
    templateUrl: './create-or-edit-quotation-product.component.html',
	styles: [`colorbox,.colorbox { display:inline-block; height:14px; width:14px;margin-right:4px; border:1px solid #000;}`]
})
export class CreateQuotationProductModalComponent extends AppComponentBase {
 
    datainput: number;
    advancedSearch: boolean = false;;
    dis: number;
    custom: number;
    companyId: number;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('modal') modal: ModalDirective;
    @ViewChild('nameInput') nameInput: ElementRef;
    @ViewChild('createTempProductModal') createTempProductModal: CreateOrEditTempProductModalComponent;
    @ViewChild('createEditProductModal') createEditProductModal: CreateEditProductComponent;
    product: QuotationProductListDto = new QuotationProductListDto();
    productInput : QuotationProductInput =new QuotationProductInput();
    eventOriginal = this.product;
    allowedChars = new Set('0123456789'.split('').map(c => c.charCodeAt(0)));

    temporaryProductDto:Productdetailsdto[];
    temporaryProduct:Array<any>;
    active_temproduct:SelectOption[];
    activeTempProduct:boolean = false;

    tempProductInput:TemporaryProductInput = new TemporaryProductInput();
    non_editable:boolean=false;

    sectionDto:Datadto[];
    active_section:SelectOption[];
    section:Array<any>;

    active_product:SelectOption[];
    product_arr:Array<any>;
    arr:Array<any>;
    product_dto:Productdto[];
	products_dto:Productdetailsdto[];

    discountInput:Discountdatadto = new Discountdatadto();
    discount_enter:number;
    err_discount:boolean = false;
    active = false;
    saving = false;
    type : string = 'Standard Product';
	path : string = AppConsts.remoteServiceBaseUrl;
	 //private items:Array<any> = [];
    private value:any = {};

    showFilter: boolean = false;
    @ViewChild('dataTable') advancedataTable: DataTable;
    @ViewChild('paginator') paginator: Paginator;
    filterText: string = '';
    productCategoryId:number=0;	
    productSpecificationId:number=0;
    categorydto: Categorydto[];
    productCategory:Array<any>;
    specificationDto: Datadto[];
    productSpecification:Array<any>;
    active_prodCategory:SelectOption[];
    active_prodSpecification:SelectOption[];
    selectedQuotationProductId:number=0;
    

    constructor(
        injector: Injector,
        private _quotationService: QuotationServiceProxy,
        private _select2Service : Select2ServiceProxy,
        private _tenantDashboardService:TenantDashboardServiceProxy,
        private _temporaryProductService:TemporaryProductServiceProxy,
        private _productService:ProductServiceProxy

    ) {
        super(injector);
    }


    show(productId?:number,quotationId?: number,companyId?: number): void { 
        this.advancedSearch = false;
        this.activeTempProduct = false;
        this.companyId = companyId;
        this.custom = 0;
        this.active_product = [];
        this.active_section = [];
        this.product = new QuotationProductListDto();
        this.productInput = new QuotationProductInput();
        this._select2Service.getSection(quotationId).subscribe(result=>{
            if(result.select2data!=null){
                this.sectionDto = result.select2data;
                  this.section = [];
                  this.sectionDto.forEach((sec:{id:number,name:string})=>{
                    this.section.push({
                        id:sec.id,
                        text:sec.name
                    });
                });
            }
        });
      
           
        this.arr = [{ 'id' : '1','name' : 'Standard Product' }, 
                    { 'id' : '2','name' : 'Non Standard Product' }];
        this.productInput.discountable = false;
        this.getDiscounts(companyId);
        if(this.productInput.discountable){
           this.discount_enter = this.discountInput.discountable;
        }else{
            this.discount_enter = this.discountInput.unDiscountable;
        }

        if(productId){
            this._quotationService.getQuotationProductForEdit(productId).subscribe((result) => {
               if (result.product != null) {
                    this.tempProductInput.id = this.product.temporaryProductId;
                    this.product = result.product;
                    this.productInput.id =this.product.id;
                    this.productInput.quantity = this.product.quantity;
                    this.productInput.discount = this.product.discount;
                    this.dis = this.product.discount;
                    this.productInput.unitOfMeasurement = this.product.unitOfMeasurement;
                    this.productInput.unitOfPrice = this.product.unitOfPrice;
                    this.productInput.totalAmount = this.product.totalAmount;
                    this.productInput.productId = this.product.productId;
                    this.productInput.sectionId = this.product.sectionId;
                    this.productInput.productCode = this.product.productCode;
                    this.productInput.discountable = this.product.discountable;
                    this.productInput.quotationId = this.product.quotationId;
                    this.productInput.approval = this.product.approval;
                    this.productInput.temporaryCode = this.product.temporaryCode;
                    this.productInput.locked = this.product.locked;
                    this.productInput.temporaryProductId = this.product.temporaryProductId;
                    this.err_discount = !this.product.approval;
                    if(this.productInput.unitOfPrice)
                    {
                        this.getTotalAmount(this.productInput.unitOfPrice);
                    }
                    if(this.product.overAllPrice){
                        this.productInput.overAllPrice = this.product.overAllPrice;
                    }else{
                        this.productInput.overAllPrice = parseFloat((this.productInput.quantity*this.productInput.unitOfPrice).toFixed(2));
                    }
                    if(this.product.overAllDiscount){
                        this.productInput.overAllDiscount = this.product.overAllDiscount;
                    }else{
                        if(this.productInput.discount){
                         this.productInput.overAllDiscount = parseFloat(((this.productInput.quantity*this.productInput.unitOfPrice)*this.productInput.discount/100).toFixed(2));
                        }
                    }
                    if(this.product.productName == null)
                    {
                       this.custom = 1;
                       this.product.productName = `<custom style="color:red;">Custom Product</custom>`;
                    }
                
                   if(this.productInput.temporaryProductId && !this.productInput.productId){
                    this.activeTempProduct = true;
                    this.type = 'Non Standard Product';
                    this.non_editable = true;
                    if(this.product.imageUrl){
                        this.active_temproduct =[{id: this.productInput.temporaryProductId, text:`<colorbox style="background:url('${this.path}${this.product.imageUrl}');background-size: contain;background-repeat: no-repeat;width:60px;height:60px;display:block;float:left;margin-right:5px;border: 1px dotted #444d58;border-radius: 10px;background-size: cover;background-clip: border-box;"></colorbox>${this.productInput.temporaryCode}</br><custom style="color:red;">Non Standard Product</custom></br> Price:${this.productInput.unitOfPrice} AED`}];
                    }
                    else{
                        this.active_temproduct =[{id: this.productInput.temporaryProductId, text:`<colorbox style="background:url('${AppConsts.appBaseUrl+"assets/common/images/download.png"}');background-size: contain;background-repeat: no-repeat;width:60px;height:60px;dispaly:block;float:left;margin-right:5px;border: 1px dotted #444d58;border-radius: 10px;background-size: cover;background-clip: border-box;"></colorbox>${this.productInput.temporaryCode}</br><custom style="color:red;">Non Standard Product</custom></br>Price:${this.productInput.unitOfPrice} AED`}];
                    }
                    //this.active_temproduct =[{id: this.productInput.temporaryProductId, text: this.productInput.temporaryCode}];
                   }

                   if(this.productInput.productId){
                    this.type = 'Standard Product';
                    if(this.product.imageUrl){
                        this.active_product = [{id:this.product.productId,text:`<colorbox style="background:url('${this.path}${this.product.imageUrl}');background-size: contain;background-repeat: no-repeat;width:60px;height:60px;dispaly:block;float:left;margin-right:5px;border: 1px dotted #444d58;border-radius: 10px;background-size: cover;background-clip: border-box;"></colorbox>${this.product.productCode}</br>${this.product.productName} </br>Price:${this.product.unitOfPrice} AED`}];
                   }else{
                        this.active_product = [{id:this.product.productId,text:`<colorbox style="background:url('${AppConsts.appBaseUrl+"assets/common/images/download.png"}');background-size: contain;background-repeat: no-repeat;width:60px;height:60px;dispaly:block;float:left;margin-right:5px;border: 1px dotted #444d58;border-radius: 10px;background-size: cover;background-clip: border-box;"></colorbox>${this.product.productCode}</br>${this.product.productName} </br>Price:${this.product.unitOfPrice} AED`}];
                   }
                   }
                  this.active_section = [{id: this.product.sectionId, text: this.product.sectionName}];
                    if(this.productInput.discountable){
                       this.discount_enter = this.discountInput.discountable;
                    }else{
                        this.discount_enter = this.discountInput.unDiscountable;
                    }
               }
            });
        }else{
            this.productInput.id = null;
            this.productInput.quotationId = quotationId;
        }
        this.active = true;
        this.modal.show();
    }

    createOrEditProduct(from,_productId):void{
        if(from == true && this.product.temporaryProductId > 0)
        {
            this.createTempProductModal.show(this.product,0);
        }
        else if(from == true )
        {
            this.createEditProductModal.show();
            //this.createTempProductModal.show(this.product,0);
        }
        else if(from != true && this.custom )
        {
            this.createEditProductModal.show(this.product.productId);
        }
        else if(from != true)
        {
            this.createEditProductModal.show();
        }

    }
 editTempProduct(): void {
    this.createTempProductModal.show(this.product);
  }

  getProducts(data): void {

    this._select2Service.getProductDetails(data).subscribe(result=>{			
        if(result.select2data!=null){
            this.products_dto = result.select2data;
              this.product_arr = [];
               this.products_dto.forEach((product:{
                id: number,
                productCode: string,
                productName: string,
                specificationName: string,
                description: string,
                imageUrl: string,
                price: number,
                discount: boolean})=>{

                    if(product.imageUrl == null || product.imageUrl ==''){	
                        product.imageUrl = AppConsts.appBaseUrl+"assets/common/images/download.png"   
                     }
                     else{ 
                        product.imageUrl= this.path+product.imageUrl;
                     } 
                     if(product.specificationName == null)
                     {
                        product.specificationName = `<custom style="color:red;">Custom Product</custom>`;
                     }
                this.product_arr.push({
                    id:product.id,
                    text:`<colorbox style="background:url('${product.imageUrl}');background-size: contain;background-repeat: no-repeat;width:60px;height:60px;display:block;float:left;margin-right:5px;border: 1px dotted #444d58;border-radius: 10px;background-size: cover;background-clip: border-box;"></colorbox>${product.productCode}</br>${product.specificationName}</br> Price:${product.price} AED`					
                    
                });
            });
           if(!this.productInput.unitOfPrice){

                    var index = this.products_dto.findIndex(x=> x.id==this.productInput.productId); 
                    if(index!=-1){ 
                        this.productInput.unitOfPrice = this.products_dto[index].price;
                        this.productInput.discountable = this.products_dto[index].discount;
                        this.getDiscounts(this.companyId);
                        this.getTotalAmount(this.products_dto[index].price);
                    }
                    
                }  
        }
    });
  }

 save(): void {
        this.saving = true;
           if (this.productInput.id == null) {
               this.productInput.id = 0;
           }
           if(this.productInput.discount == null || !this.productInput.discount){
                this.productInput.discount = 0;
                this.productInput.overAllDiscount = 0;
                this.productInput.approval = true;
           }
           if(this.tempProductInput.id == 0){
               this.tempProductInput.price = this.productInput.unitOfPrice;
            //   console.log(this.tempProductInput);
              this._temporaryProductService.createTemporaryProductandId(this.tempProductInput)
              .subscribe((result) => {
                 this.productInput.temporaryProductId = result;
                //  console.log(this.productInput);
                 this._quotationService.createOrUpdateQuotationProduct(this.productInput)
                 .finally(() => this.saving = false)
                 .subscribe(() => {
                     this.notify.info(this.l('SavedSuccessfully'));
                     this.product = this.eventOriginal;
                     this.close();
                     this.modalSave.emit(this.productInput);
                 });
              });
           }
           else{
            //    console.log(this.productInput);
            this._quotationService.createOrUpdateQuotationProduct(this.productInput)
            .finally(() => this.saving = false)
            .subscribe(() => {
                this.notify.info(this.l('SavedSuccessfully'));
                this.product = this.eventOriginal;
                this.close();
                this.modalSave.emit(this.productInput);
            });
           }
            
    }

    onShown(): void {
        // $(this.nameInput.nativeElement).focus();
    }
    close(): void {
        this.activeTempProduct = false;
        this.active_temproduct = [];
        this.non_editable = false;
        this.err_discount = false;
        this.type = 'Standard Product';
        this.modalSave.emit(this.productInput);
        this.modal.hide();
        this.active = false;
    }
    selectProduct(data:any){
        this.productInput.productId = data.id;
        var index = this.products_dto.findIndex(x=> x.id==data.id);
        this.productInput.productCode = this.products_dto[index].productCode;        
        this.productInput.unitOfPrice = this.products_dto[index].price;
        this.productInput.discountable = this.products_dto[index].discount;
        this.getDiscounts(this.companyId);
        this.getTotalAmount(this.products_dto[index].price); 
    }
    clickProduct(data:any)
    {
        if(this.productCategoryId == -1)
        {
            this.productInput.productId = null;
            this.productInput.temporaryProductId = data.id;
            this.tempProductInput.id = data.id;
            this.productInput.locked = true;
            this.productInput.temporaryCode = data.productCode;  
            this.productInput.productCode = data.productCode;        
            this.productInput.unitOfPrice = data.price;
            this.productInput.discountable = false;
        }
        else{
            this.productInput.productId = data.id;
            this.productInput.productCode = data.productCode;        
            this.productInput.unitOfPrice = data.price;
            this.productInput.discountable = data.isDiscountable;
        }
        this.getDiscounts(this.companyId);
        this.getTotalAmount(data.price); 
    }
    selectSection(data:any){
        this.productInput.sectionId = data.id;
    }
    removeProduct(data:any){
        this.productInput.productId =null;
        this.productInput.unitOfPrice =0;
        this.productInput.discountable = false;
        this.getDiscounts(this.companyId);
        this.getTotalAmount(this.productInput.unitOfPrice);

    }
    removeSection(data:any){
        this.productInput.sectionId = null;
        this.productInput.productCode = null;
    }
    getDiscounts(companyId){
        this._select2Service.getCompanyDiscount(companyId).subscribe(result=>{
            if(result.select2data!=null){
                 this.discountInput = result.select2data[0];
                 this.discountInput.discountable = result.select2data[0].discountable;
                 this.discountInput.unDiscountable = result.select2data[0].unDiscountable;
            }
            if(this.productInput.discountable){
                this.discount_enter = this.discountInput.discountable;
            }else{
                this.discount_enter = this.discountInput.unDiscountable;
            }
        });
    }

    changeProductType(typeId):void{
         if(typeId== '1')
         {
            this.activeTempProduct = false;
            this.productInput.temporaryProductId = null;
            this.productInput.temporaryCode = null;
            this.productInput.productCode = null;
            this.tempProductInput.id = null;
            this.productInput.locked = false;
         }
         else{
            this.activeTempProduct = true;
            this.productInput.productId =null;
            this.productInput.unitOfPrice =0;
            this.productInput.discountable = false;
            this.getDiscounts(this.companyId);
            this.getTotalAmount(this.productInput.unitOfPrice);    
         }
        }
    
    check(event: KeyboardEvent) {
        // 31 and below are control keys, don't block them.
        if (event.keyCode > 31 && !this.allowedChars.has(event.keyCode)) {
          event.preventDefault();
        }
      }

    getTotalAmount(price:number){
        if(price<1 || this.productInput.quantity<1){
            this.productInput.totalAmount = 0;
            this.productInput.overAllPrice = 0;
            this.productInput.overAllDiscount = 0;

        }else{
            if(!this.productInput.discount){
                this.productInput.totalAmount = parseFloat((this.productInput.quantity*price).toFixed(2));
                this.productInput.overAllPrice =  parseFloat((this.productInput.quantity*price).toFixed(2));
                this.productInput.overAllDiscount = 0;
            }else{

                if(this.dis != this.productInput.discount)
                {
                    if(this.discount_enter<this.productInput.discount){
                        // alert('not App');
                        this.err_discount = true;
                        this.productInput.approval = false;
                    }else{
                        // alert('no plm');
                        this.productInput.approval = true;
                        this.err_discount = false;
                    }
                }
                this.productInput.overAllPrice =  parseFloat((this.productInput.quantity*price).toFixed(2));
                let percent_value = ((this.productInput.quantity*price)*this.productInput.discount/100);
                this.productInput.totalAmount = parseFloat(((this.productInput.quantity*price)-percent_value).toFixed(2));
                if(this.productInput.discount){
                    this.productInput.overAllDiscount = parseFloat((percent_value).toFixed(2));
                }else{
                    this.productInput.overAllDiscount = 0;
                }
            }
        }
    }

  public typed(value:any):void {
    this.getProducts(value);
  }
 
  public refreshValue(value:any):void {
    this.value = value;
  }
  changeSelect(data){
    if(data == 'Product'){
        this.activeTempProduct = true;
        this.productInput.productId = null;
    }
    else{
        this.activeTempProduct = false;
        this.productInput.temporaryCode = null;
    }
}


selectTempProduct(data:any){
    this.productInput.temporaryProductId = data.id;
   /*  this.productInput.temporaryCode = data.text;
    this.productInput.productCode = data.text; */
    this.tempProductInput.id = data.id;
    this.productInput.locked = true;
    var index = this.temporaryProductDto.findIndex(x=> x.id==data.id);
    this.productInput.temporaryCode = this.temporaryProductDto[index].productCode;  
    this.productInput.productCode = this.temporaryProductDto[index].productCode;        
    this.productInput.unitOfPrice = this.temporaryProductDto[index].price;
    this.productInput.discountable = this.temporaryProductDto[index].discount;
    this.getDiscounts(this.companyId);
    this.getTotalAmount(this.productInput.unitOfPrice); 
}
removeTempProduct(data:any){
    this.productInput.temporaryProductId = null;
    this.tempProductInput.id = null;
    this.productInput.locked = false;
    this.productInput.temporaryCode = null;
    this.productInput.productCode = null;
    this.productInput.unitOfPrice = 0;
    this.productInput.discountable = false;
    this.getDiscounts(this.companyId);
    this.getTotalAmount(this.productInput.unitOfPrice); 
}

refreshTempProduct(value:any):void {
    this.productInput.temporaryProductId = value.id;
    this.productInput.temporaryCode = value.text;
    this.productInput.productCode = value.text;
    this.tempProductInput.id = value.id;
    this.productInput.locked = true;
}
typedTempProduct(event):void{
    // console.log(event);
    this.productInput.temporaryCode = event;
    this.productInput.productCode = event;
    this.tempProductInput.id = 0;

    // this.active_temproduct =[{id: 0, text: event}];
    this.productInput.locked = true;
   
    this._select2Service.getTemporaryProducts(event).subscribe(result =>{
             if(result.select2data!=null){
            this.temporaryProductDto = result.select2data;
            this.temporaryProduct = [];
            this.temporaryProductDto.forEach((temp:{id: number,
                    productCode: string,
                    price: number,
                    imageUrl: string,
                    discount: boolean
               })=>{
                if(temp.imageUrl == null || temp.imageUrl ==''){	
                    temp.imageUrl = AppConsts.appBaseUrl+"assets/common/images/download.png"   
                 }
                 else{ 
                    temp.imageUrl= this.path+temp.imageUrl;
                 } 
                this.temporaryProduct.push({
                    id:temp.id,
                    /* text:`${temp.productCode}</br> Price:${temp.price} AED` */					
                    text:`<colorbox style="background:url('${temp.imageUrl}');background-size: contain;background-repeat: no-repeat;width:60px;height:60px;display:block;float:left;margin-right:5px;border: 1px dotted #444d58;border-radius: 10px;background-size: cover;background-clip: border-box;"></colorbox>${temp.productCode}</br><custom style="color:red;">Non Standard Product</custom></br> Price:${temp.price} AED`                });
               
            });
        }
   });
}
expandFilter(){
    this.showFilter = this.showFilter?false:true;
    if(this.showFilter){
        this._select2Service.getProductCategoryAll().subscribe(result=>{
            if(result.select2data!=null){
                this.categorydto = result.select2data;
                this.productCategory = [];
                this.categorydto.forEach((cat:{id:number,name:string,backgroundcolor:string})=>{
                  this.productCategory.push({
                      id:cat.id,
                      text:cat.name
                  });
                });

                this.productCategory.push({
                    id:-1,
                    text:`<custom style="color:red;">Non Standard Product</custom>`
                });
                this.productCategory.push({
                    id:-2,
                    text:`<custom style="color:red;">Custom Product</custom>`
                });
            }
        });
    }
}

searchProducts(event?: LazyLoadEvent)
 {    
    let data;
    if(this.primengDatatableHelper.getMaxResultCount(this.paginator, event)==0){
        data=10;
    }
    else{
        data=this.primengDatatableHelper.getMaxResultCount(this.paginator, event)
    }
    this.primengDatatableHelper.showLoadingIndicator();

     if(this.productCategoryId == -1){
 
        this._productService.getAdvancedTempProducts(
            this.productCategoryId,
            this.productSpecificationId,
            this.filterText,
            "",
            data,
            this.primengDatatableHelper.getSkipCount(this.paginator, event)
        ).subscribe(result => {
            this.primengDatatableHelper.totalRecordsCount = result.totalCount;
            this.primengDatatableHelper.records = result.items;
            // console.log(0,result.items);
            this.primengDatatableHelper.hideLoadingIndicator();
        });
    } else {
        this._productService.getAdvancedProducts(
            this.productCategoryId,
            this.productSpecificationId,
            this.filterText,
            "",
            data,
            this.primengDatatableHelper.getSkipCount(this.paginator, event)
        ).subscribe(result => {
            this.primengDatatableHelper.totalRecordsCount = result.totalCount;
            this.primengDatatableHelper.records = result.items;
            console.log(result.items);
            this.primengDatatableHelper.hideLoadingIndicator();
        });       }   
}

reloadPage(): void {
    this.paginator.changePage(this.paginator.getPage(),null);
}

selectCategory(data:any){
    this.productCategoryId = data.id;
    this.active_prodSpecification = [];
    this.productSpecification = [];
    this.productSpecificationId = 0;
    if(data.id > 0)
    {
    this._select2Service.getProductSpecificationCategoryBased(data.id).subscribe(result=>{
        if(result.select2data!=null){
            this.specificationDto = result.select2data;
            this.productSpecification = [];
              this.specificationDto.forEach((spec:{id:number,name:string})=>{
                this.productSpecification.push({
                    id:spec.id,
                    text:spec.name
                });
            });
            
        }
    });
   }
   this.searchProducts();
}
removeCategory(data:any){
    this.productCategoryId = 0;
    this.productSpecificationId = 0;
    this.active_prodSpecification = [];
    this.searchProducts();

}
selectSpecification(data:any){
    this.productSpecificationId = data.id;
    this.searchProducts();
}
removeSpecification(data:any){
    this.productSpecificationId = 0;
    this.searchProducts();
}

saveSelected(ProductId):void{
    //  console.log(ProductId,"save");
}
search_preview(data):void{
    if(data == 1)
    {
        this.advancedSearch = true;
        this.expandFilter();
    } else if(data == 2)
    {
        this.advancedSearch = false;
    }

}
}