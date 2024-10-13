import { Component } from '@angular/core';
import { NavbarComponent } from "../shared/navbar/navbar.component";
import { BusinessCardService } from '../service/business-card.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [NavbarComponent,CommonModule,NavbarComponent],
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.css'
})
export class FileUploadComponent {

  businessCard = {
    Fname: '',
    Lname: '',
    Email: '',
    Phone: '',
    Phone2: '',
    Gender:'',
    Image: null as File | null,

  };
  selectedFile: File | null = null;
  fileContent: string | null = null;
  response: any=null;

  constructor(private service: BusinessCardService) { }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.selectedFile = input.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.fileContent = e.target.result; 
        console.log(this.fileContent)
        // حفظ محتوى الملف لعرضه
      };
      reader.readAsText(this.selectedFile); // قراءة محتوى الملف
    }
  }

  upload() {
    if (this.selectedFile) {
      this.service.uploadcsv(this.selectedFile).subscribe(
        (data:any) => {
          this.response = data;
        },
       ( error:any) => {
          console.error('Upload error:', error);
        }
      );
    }
  }

   
  async create(card:any) {
    try {
      
      this.businessCard.Fname=card.fname
      this.businessCard.Lname=card.lname
      this.businessCard.Gender=card.gender
      this.businessCard.Email=card.email
      this.businessCard.Phone=card.phone
      this.businessCard.Phone2=card.phone2
      
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
