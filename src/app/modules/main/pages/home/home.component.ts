import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { Loader } from '@googlemaps/js-api-loader';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import Swal from 'sweetalert2'
import { MainService } from '../../shared/main.service';
import { RequestResult } from '../../shared/models/request_result';
import { PropertyType } from '../../shared/models/property-type/property-type';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  
  propertySearchForm: FormGroup;

  propertyTypes: PropertyType[] = [];

  constructor(private formBuilder: FormBuilder, private myRoute: Router, private mainService: MainService) {

    this.propertySearchForm = this.formBuilder.group({
      address: ['', Validators.compose([Validators.required])],
      property_type: [0, Validators.compose([Validators.required])],
      price: ['', Validators.compose([Validators.required])],
      rooms: ['', Validators.compose([Validators.required])],
      parking_spot: [''],
    });

  }

  ngOnInit(): void {
    this.loadMap();
    this.getPropertyTypes();
  }

  getPropertyTypes() {
    this.mainService.getPropertyTypes()
    .subscribe((data: RequestResult) => {

      this.propertyTypes = data.result;

    }).add(() => {

    });
  }


  searchProperty() {
    if(this.propertySearchForm.invalid) {
      Swal.fire({
        title: 'Preencha todos campos do formulário',
        icon: 'warning',
        iconHtml: '',
        confirmButtonText: 'ok',
        confirmButtonColor: '#012942',
        showCloseButton: true,
      })
    } else {
      
      this.myRoute.navigate([`/home/search-property/${{
         "address": this.propertySearchForm.get('address')?.value,
         "property_type": this.propertySearchForm.get('property_type')?.value,
         "price": this.propertySearchForm.get('price')?.value,
         "rooms": this.propertySearchForm.get('rooms')?.value,
         "parking_spot": this.propertySearchForm.get('parking_spot')?.value,
       }}`
     ]);
    }
  }


  loadMap() {
    this.loader.loadCallback(e => {
      if (e) {
        console.log(e);
      } else {
        new google.maps.Map(document.getElementById("map") as HTMLAnchorElement, this.mapOptions);
      }
    });
  }

  loader = new Loader({
    apiKey: "",
    version: "weekly",
    libraries: ["places"]
  });
  
  mapOptions = {
    center: {
      lat: -22.983781298015188,
      lng: -43.3612144413545
    },
    zoom: 11
  };
}
