import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],  
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';

  constructor(private authService: AuthenticationService, private router: Router) {}

  onSubmit() {
    const user = { name: this.name, email: this.email, password: this.password };
    this.authService.register(user).subscribe({
      next: () => {
        console.log('Registration successful');
        this.router.navigate(['/login']); // redirect after register
      },
      error: (err) => {
        console.error('Registration failed', err);
      }
    });
  }
}
