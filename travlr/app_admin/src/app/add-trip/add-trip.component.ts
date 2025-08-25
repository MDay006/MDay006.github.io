import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { TripData } from '../services/trip-data.service';
import { Trip } from '../models/trip';

@Component({
  selector: 'app-add-trip.',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-trip.component.html',
  styleUrl: './add-trip.component.css'
})


export class AddTrip implements OnInit {
  addForm!: FormGroup;
  submitted = false;
constructor(
  private formBuilder: FormBuilder,
  private router: Router,
  private tripData: TripData
) { }
ngOnInit() {
this.addForm = this.formBuilder.group({
  _id: [],
  code: ['', Validators.required],
  name: ['', Validators.required],
  length: ['', Validators.required],
  start: ['', Validators.required],
  resort: ['', Validators.required],
  perPerson: ['', Validators.required],
  image: ['', Validators.required],
  description: ['', Validators.required],
})
}
public onSubmit() {
this.submitted = true;
if(this.addForm.valid){
  this.tripData.addTrip(this.addForm.value).subscribe( {
  next: (data: any) => {
  console.log(data);
  this.router.navigate(['']);
},
  error: (error: any) => {
  console.log('Error: ' + error);
}});
}
}
  get f() { return this.addForm.controls; }
}
