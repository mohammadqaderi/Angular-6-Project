import { Component, OnInit } from '@angular/core';
import { EmployeeService} from '../employee.service';
import {IEmployee} from '../IEmployee';
import { Router} from '@angular/router';

@Component({
  selector: 'app-list-employee',
  templateUrl: './list-employee.component.html',
  styleUrls: ['./list-employee.component.css']
})
export class ListEmployeeComponent implements OnInit {
employees: IEmployee[];
  constructor(private employeeService: EmployeeService, private router: Router) {

  }

  ngOnInit() {
    this.employeeService.getEmployee().subscribe(
      (listEmployee) => this.employees = listEmployee ,
      (err) => console.log(err)
    );
}
onButtonEdit(id: number){
  this.router.navigate(['/employees/edit', id]);
}
}
