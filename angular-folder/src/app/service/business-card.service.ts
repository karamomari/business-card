import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BusinessCardService {

  constructor(private http:HttpClient) { }
  cards(){
    return this.http.get('https://localhost:7220/api/Card/Cards')
  }



  create(card:any){
    
    const formData = new FormData();
    formData.append('Image', card.Image); 
    formData.append('Fname', card.Fname);
    formData.append('Lname', card.Lname);
    formData.append('Email', card.Email);
    formData.append('Gender', card.Gender);
    formData.append('Phone', card.Phone);
    formData.append('Phone2', card.Phone2);
  
    return this.http.post('https://localhost:7220/api/Card/CreateCard', formData);
  }

  
  
  delete(id:any){
    return this.http.delete('https://localhost:7220/api/Card/DeleteCard?id='+id)
  }

  ExportCard(){
    return this.http.get('https://localhost:7220/api/Card/ExportCard',{ responseType: 'blob' })
  }

  uploadcsv(file:any){
    const formData = new FormData();
  formData.append('file', file);
    return this.http.post('https://localhost:7220/api/Card/uploadcsv',formData)
  }


// "I have eliminated them and implemented the required tasks in the frontend without needing them."
  searchbyname(fname:string,lname:string){
    return this.http.get(`https://localhost:7220/api/Card/SeaechCardbyName?fname=${fname}&lanme=${lname}`)
 }

 searchbyEmail(email:string){
   return this.http.get(`https://localhost:7220/api/Card/SearchCard?email=${email}`)
 }
}
