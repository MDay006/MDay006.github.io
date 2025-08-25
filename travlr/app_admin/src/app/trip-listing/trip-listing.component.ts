import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthenticationService } from '../services/authentication.service';
import { TripCardComponent } from '../trip-card/trip-card.component';

@Component({
  selector: 'app-trip-listing',
  standalone: true,
  templateUrl: './trip-listing.component.html',
  styleUrls: ['./trip-listing.component.css'],
  imports: [CommonModule, TripCardComponent]
})
export class TripListingComponent implements OnInit {
  trips: any[] = []; 

  constructor(private authenticationService: AuthenticationService) {}

  ngOnInit() {
    // TODO: load trips from a service later
    
  }

  isLoggedIn(): boolean {
    return this.authenticationService.isLoggedIn();
  }

  addTrip() {
    alert('Add trip clicked!');
  }
}
