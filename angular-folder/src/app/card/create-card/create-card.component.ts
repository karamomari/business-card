import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BusinessCardService } from '../../service/business-card.service';
import { NavbarComponent } from "../../shared/navbar/navbar.component";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-create-card',
  standalone: true,
  imports: [FormsModule, CommonModule, NavbarComponent,RouterLink],
  templateUrl: './create-card.component.html',
  styleUrl: './create-card.component.css'
})
export class CreateCardComponent implements OnInit {

  ngOnInit(): void {
    
  }
  
  constructor(private service:BusinessCardService,private cdr: ChangeDetectorRef) {
    
  }

  businessCard = {
    Fname: '',
    Lname: '',
    Email: '',
    Phone: '',
    Phone2: '',
    Gender:'',
    Image: null as File | null,

  };

  preview = false;





  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          if (img.width <= 800 && img.height <= 525) {
            this.businessCard.Image = file;
            console.log('Image loaded successfully:', e.target?.result);
          } else {
            alert('Image dimensions must be 800x525 pixels or less.');
            input.value = '';
          }
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }
  


  onSubmit() {
    if(this.businessCard.Phone==this.businessCard.Phone2){
      alert("It is not allowed to enter the same number, and if you have one number, you can suffice with just one.")
    }
    else{
    this.preview = true;  
    setTimeout(() => {
      const target = document.getElementById("Preview");
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 10);
    }
  }



  getImageUrl() {
    if (this.businessCard.Image) {
      return URL.createObjectURL(this.businessCard.Image);
    }
    return '';
  }

 
  async create() {
    try {
      
      this.businessCard.Gender = 'male';
      
      const res: any = await this.service.create(this.businessCard).toPromise();
      
      alert(res.message);
      
      window.location.reload();
    } catch (error:any) {
      console.error(error);
      
      const errorMessage = error.error?.message || "An error occurred while creating the card.";
      alert(errorMessage);
    }
  }
  



}
