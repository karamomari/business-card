import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { provideRouter } from '@angular/router';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent  {
  title = 'card-bussinss';

  onSubmit(){}
  onFileSelected(event:Event){}
}
