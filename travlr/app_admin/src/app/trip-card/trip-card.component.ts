import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-trip-card',
  standalone: true,
  templateUrl: './trip-card.component.html',
  styleUrls: ['./trip-card.component.css'],
  imports: [CommonModule]
})
export class TripCardComponent {
  @Input() trip: any; 

  constructor(private authService: AuthenticationService) {}

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  editTrip(trip: any): void {
    console.log('Editing trip:', trip);
  }
}
