import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BusinessCardService } from '../../service/business-card.service';
import {  HttpClientModule } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { NavbarComponent } from "../../shared/navbar/navbar.component";
@Component({
  selector: 'app-list-card',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, NavbarComponent],
  templateUrl: './list-card.component.html',
  styleUrl: './list-card.component.css'
})

export class ListCardComponent implements OnInit {

  ngOnInit(): void {
    this.cards()
  }
  
 searchCard:boolean=false
 searchEmailCard:boolean=false
 searchCards:any[]=[]
 searchEmailCards:any


 selectedFilter: string = '';
 Filtername:boolean=false
 Filteremail:boolean=false
 Filterphone:boolean=false

 card:Boolean=false
 tables:Boolean=true
 private debounceTimer: any;

 businessCards:any[]=[]

 name={
  fname:'',
  lname:''
 }

 email:string=''

 phone:any=''

 constructor(private service:BusinessCardService,private sanitizer: DomSanitizer){

 }



  swith(){
    this.card = !this.card;
     this.tables = !this.card; 
  }


    cards(){
    this.service.cards().subscribe((res:any)=>{
     this.businessCards=res.$values
     console.log(res.$values)
    })
    }



    delete(id:any){
    const confirmed = window.confirm("Are you sure you want to delete this card?");
      if (confirmed) {
          this.service.delete(id).subscribe((res:any)=>{
            alert("Card deleted successfully!");
            // window.location.reload();
            this.businessCards = this.businessCards.filter(card => card.id !== id);
          },
          (error: any) => {
            alert("An error occurred while deleting the card.");
        })
      }
    }



     onFilterChange() {
      if(this.selectedFilter=="name"){
       this.Filtername=true
       this.Filteremail=false 
       this.Filterphone=false
      }
     else if(this.selectedFilter=="phone"){
       this.Filtername=false
       this.Filteremail=false 
       this.Filterphone=true
     }
      else{
       this.Filtername=false
       this.Filteremail=true
       this.Filterphone=false 
      }
   
     }




     onInputChange() {
       this.searchCard = false;
       if (this.name.fname.length > 3 || this.name.lname.length > 3) {
           clearTimeout(this.debounceTimer);
           this.debounceTimer = setTimeout(() => {
               this.searchCards = this.businessCards.filter(card => 
                   card.fname && card.lname && 
                   card.fname.toLowerCase().includes(this.name.fname.toLowerCase()) &&
                   card.lname.toLowerCase().includes(this.name.lname.toLowerCase())
               );
               
               this.searchCard = this.searchCards.length > 0;
               console.log(this.searchCards);
           }, 300); 
       }
     }






    onInputChangeEmail() {
      this.searchCard = false; 
      console.log(this.email); 
      
      if (this.email && this.email.includes('@')) {
          clearTimeout(this.debounceTimer); 
          this.debounceTimer = setTimeout(() => {
              this.searchEmailCards = this.businessCards.filter(card => 
                  card.email && card.email.toLowerCase().includes(this.email.toLowerCase())
              );
              
              this.searchEmailCard = this.searchEmailCards.length > 0; 
              console.log(this.searchEmailCards); 
          }, 300);
      }
    }




   onInputChangePhone() {
     this.searchCard = false;
     console.log(this.phone); 
   
     if (this.phone && this.phone.length > 3) {
         clearTimeout(this.debounceTimer);
         this.debounceTimer = setTimeout(() => {
             this.searchCards = this.businessCards.filter(card => 
                 card.cardPhones && 
                 card.cardPhones.$values.some((phoneObj:any) => 
                     phoneObj.phone && 
                     phoneObj.phone.includes(this.phone) 
                 )
             );
   
             this.searchCard = this.searchCards.length > 0; 
             console.log(this.searchCards);
         }, 300); 
     }
   }



    ExportCard(){
      this.service.ExportCard().subscribe((res:any) => {
        const blob = new Blob([res], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'business_cards.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        }, error => {
        console.error('Export failed:', error);
    });
    }
    

}
