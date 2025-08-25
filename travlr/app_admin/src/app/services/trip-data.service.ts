import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Trip } from '../models/trip'
import { User } from '../models/user';
import { AuthResponse } from '../models/auth-response';
import { BROWSER_STORAGE } from '../storage';

@Injectable({
  providedIn: 'root'
})
export class TripData {
  
  constructor(private http: HttpClient, @Inject (BROWSER_STORAGE) private storage: Storage) { }
     baseUrl = 'http://localhost:3001/api/trips';

  getTrips() : Observable<Trip[]> {
    return this.http.get<Trip[]>(this.baseUrl);
  }
  addTrip(formData:'Trip') : Observable<Trip> {
    return this.http.post<Trip>(this.baseUrl, formData); 
  }
  getTrip(tripCode: string) : Observable<Trip[]> {
    return this.http.get<Trip[]>(this.baseUrl + '/' + tripCode);
  }
  updateTrip(formData: Trip) : Observable<Trip>{
    return this.http.put<Trip>(this.baseUrl +'/' + formData.code, formData);
  }

// Call to our /login endpoint, returns JWT
login(user: User, passwd: string) : Observable<AuthResponse> {
return this.handleAuthAPICall('login', user, passwd);
}
// Call to our /register endpoint, creates user and returns JWT
register(user: User, passwd: string) : Observable<AuthResponse> {
return this.handleAuthAPICall('register', user, passwd);
}
handleAuthAPICall(endpoint: string, user: User, passwd: string) :
Observable<AuthResponse> {
let formData = {
name: user.name,
email: user.email,
password: passwd
};
return this.http.post<AuthResponse>(this.baseUrl + '/' + endpoint,
formData);
}}