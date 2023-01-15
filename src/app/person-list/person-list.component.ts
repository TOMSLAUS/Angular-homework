import { Component, ElementRef, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatTable } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpParams } from '@angular/common/http';


@Component({
  selector: 'app-product-list',
  templateUrl: './person-list.component.html',
  styleUrls: ['./person-list.component.css']
})
export class PersonListComponent <PersonDto> {
  constructor(private http: HttpClient, public snackBar: MatSnackBar) { }


  personDto ={
  personalId : "",
  name : "",
  lastName : "",
  gender : "",
  dob : ""
  };

 persons: PersonDto[] = []
 
 @ViewChild(MatTable)
  table!: MatTable<any>;
 @ViewChild('input')
  inputRef!: ElementRef;

  displayedColumns: string[] = ['personalId', 'name', 'lastName', 'gender', 'dob'];


 getInputValue(){
  return this.inputRef.nativeElement.value;
}

  public onDateChange(event: MatDatepickerInputEvent<Date>): void {
    let formattedDate = (moment(event.value)).format('DD-MM-YYYY')
    this.personDto.dob = formattedDate;
  }


openSnackBar(message: string) {
  this.snackBar.open(message, "Close", {
    duration: 2000,
  });
}

  async getPerson(){

    if(this.getInputValue.length < 1 && this.personDto.dob.length < 1){
      this.openSnackBar("Please fill all of the fields.")
      return;
    }

    try {
      const url = "http://192.168.0.103:8080";
      let params = new HttpParams();
      params = params.append('personalId', this.getInputValue());
      params = params.append('dob', this.personDto.dob);
      
      const data =  await this.http.get(url + '/person/getPersons' , {params}).toPromise().catch((err: HttpErrorResponse) => {
        // Can be mapped to some kind of i18n to localize error messages.
        this.openSnackBar(err.error.message)
      });

      if(data){
        if(!this.persons.some(item => JSON.stringify(item) === JSON.stringify(data))){
      this.persons.push(data as PersonDto)
      this.table.renderRows()
      }
      else{
        this.openSnackBar("This user has been already querried")
      }
    }
  } catch (error) {
      console.error(error);
  }
  }
}