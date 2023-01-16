import { Component, OnInit } from '@angular/core';
import { Loader } from '@googlemaps/js-api-loader';
import { ActivatedRoute } from '@angular/router';

import { FormBuilder, FormGroup } from '@angular/forms';
import { MainService } from '../../shared/main.service';
import { RequestResult } from '../../shared/models/request_result';
import { State } from '../../shared/models/state/state';
import { City } from '../../shared/models/city/city';
import { District } from '../../shared/models/district/district';
import { PropertyType } from '../../shared/models/property-type/property-type';
import { PropertyDeveloper } from '../../shared/models/property/property-developer';
import { RequestPropertyResult } from '../../shared/models/property/request-property-result';
import { Property } from '../../shared/models/property/property';

@Component({
  selector: 'app-search-property',
  templateUrl: './search-property.component.html',
  styleUrls: ['./search-property.component.css']
})
export class SearchPropertyComponent implements OnInit {
  
  propertySearchForm: FormGroup;
  
  states: State[] = [];
  cities: City[] = [];
  districts: District[] = [];
  propertyTypes: PropertyType[] = [];
  propertyDevelopers: PropertyDeveloper[] = [];

  gettingPropertiesList: boolean = false;

  propertiesList: Property[] = [];

  constructor(private currentRoute: ActivatedRoute, private formBuilder: FormBuilder, private mainService: MainService) {
    this.propertySearchForm = this.formBuilder.group({
      state: ['Rio de Janeiro'],
      city: ['Rio de Janeiro'],
      district: [''],
      typology: [''],
      price: [0],
      rooms: [0],
      parking_spot: [0],
      property_developer: [''],
    });
   }

  ngOnInit(): void {

    console.log(this.currentRoute.snapshot.params['property-parameters'])
    
    this.getProperties();

    this.loadMap();
    
  }

  getProperties() {
    this.getCities(this.propertySearchForm.get('state')?.value);
    this.getDistrict(this.propertySearchForm.get('city')?.value, this.propertySearchForm.get('state')?.value);
    this.getPropertyTypes();
    this.getPropertyDevelopers();

    this.getPropertiesList();
  }
   
  // GET ROUTINES

  getStates() {
    this.mainService.getStates()
    .subscribe((data: RequestResult) => {
      this.states = data.result;
    }).add(() => {

    });
  }

  getCities(state: string) {
    this.mainService.getCities(state)
    .subscribe((data: RequestResult) => {
      this.cities = data.result;
    }).add(() => {

    });
  }

  getDistrict(city: string, state: string) {
    this.mainService.getDistricts(city, state)
    .subscribe((data: RequestResult) => {
      this.districts = data.result;
    }).add(() => {

    });
  }

  getPropertyTypes() {
    this.mainService.getPropertyTypes()
    .subscribe((data: RequestResult) => {
      this.propertyTypes = data.result;
    }).add(() => {

    });
  }

  getPropertyDevelopers() {
    this.mainService.getPropertyDevelopers()
    .subscribe((data: RequestResult) => {
      this.propertyDevelopers = data.result;
    }).add(() => {

    });
  }

  getPropertiesList() {
    
    this.gettingPropertiesList = true;

    let params = {
      'limit': 20,
      'offset': 0,
      'area': 200,
      'state': this.propertySearchForm.get('state')?.value,
      'city': this.propertySearchForm.get('city')?.value,
      'district': this.propertySearchForm.get('district')?.value,
      'minimumPrice': parseFloat(this.propertySearchForm.get('price')?.value),
      'maximumPrice': parseFloat(this.propertySearchForm.get('price')?.value),
      'parkingSpots': parseInt(this.propertySearchForm.get('parking_spot')?.value),
      'propertyDeveloperId': parseInt(this.propertySearchForm.get('property_developer')?.value),
      'propertyStateId': parseInt(this.propertySearchForm.get('state')?.value),
      'propertyTypeId': parseInt(this.propertySearchForm.get('typology')?.value),
      'rooms': parseInt(this.propertySearchForm.get('rooms')?.value),
    }
    
    this.mainService.getPropertiesList(params)
    .subscribe((data: RequestPropertyResult) => {
      this.propertiesList = data.result.results;
    }).add(() => {
      this.gettingPropertiesList = false;
    });
  }

  // CHANGE ROUTINES

  stateChanged() {

    this.getCities(this.propertySearchForm.get('state')?.value);
    this.getDistrict(this.propertySearchForm.get('city')?.value, this.propertySearchForm.get('state')?.value);

    this.propertySearchForm.controls['city'].setValue('');
    this.propertySearchForm.controls['district'].setValue('');

    this.getPropertiesList();

  }

  cityChanged() {

    this.getDistrict(
      this.propertySearchForm.get('city')?.value, 
      this.propertySearchForm.get('state')?.value,
    );
    this.propertySearchForm.controls['district'].setValue('');
    
    this.getPropertiesList();

  }

  districtChanged() {
    this.getPropertiesList();
  }

  typologyChanged() {
    this.getPropertiesList();
  }

  priceChanged() {
    this.getPropertiesList();
  }

  roomChanged() {
    this.getPropertiesList();
  }

  parkingSpotChanged() {
    this.getPropertiesList();
  }

  propertyDeveloperChanged() {
    this.getPropertiesList();
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
