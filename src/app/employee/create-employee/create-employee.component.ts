import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, ValidationErrors, AbstractControl, FormArray } from '@angular/forms';
import { CustomValidators } from 'src/app/shared/custom.validators';
import { EmployeeService} from '../employee.service';
import { ISkill } from '../ISkill';
import { IEmployee } from '../IEmployee';
import {ActivatedRoute, Router} from '@angular/router';
@Component({
  selector: 'app-create-employee',
  templateUrl: './create-employee.component.html',
  styleUrls: ['./create-employee.component.css']
})
export class CreateEmployeeComponent implements OnInit {
  employeeForm: FormGroup;
  employee: IEmployee;
  actionState: boolean;
  actionTitle: string;
  constructor(private formBuilder: FormBuilder, private activatedRoute: ActivatedRoute,
              private empService: EmployeeService, private router: Router ) { }


  // get fullName() {
  //   return this.employeeForm.get('fullName');
  // }
  // get email() {
  //   return this.employeeForm.get('email');
  // }
  // get province() {
  //   return this.employeeForm.get('province');
  // }

  // Connect the form errors values with logValidatioErrors() method
  formErrors = {
    
  };

   // Specifying The ErrorMessages of each FormControl
  validationMessages = {
    fullName: {
      required: 'Full Name is required',
      minlength: 'Full Name must be at least 5 characters',
      maxlength: 'Full Name must be at  most 15 characters'
    },
    email: {
      required: 'Email is required',
      emailDomain: 'Email domain should be dell.com'
    },
    confirmEmail: {
      required: 'Email Conformation is required'
    },
    emailGroup: {
      'EmailMissMatch': 'Email and ConfirmEmail does not matches..'
    },
    phone: {
      required: 'Phone is required'
    }

  };


  ngOnInit() {
    // this.employeeForm = new FormGroup({
    //   fullName: new FormControl(),
    //   email: new FormControl(),
    //   skills: new FormGroup({
    //     skillName: new FormControl(),
    //     experienceInYears: new FormControl(),
    //     proficiency: new FormControl()
    //   })
    // });

    // Setting up the FormGroup and the FormControls and thiers Validatros
    this.employeeForm = this.formBuilder.group({
      fullName: ['', [Validators.required, Validators.maxLength(15), Validators
        .minLength(5)]],
       contactPreference: ['email'],
       emailGroup: this.formBuilder.group({
      email: ['', [Validators.required, CustomValidators.emailDomain('dell.com')]],
      confirmEmail: ['',Validators.required] 
       }, {validators: CustomValidators.checkEmailMatches}),
      phone: ['', Validators.required],
      skills: this.formBuilder.array([
       this.addSkillFormGroup()
      ])
        
    });
    // this.employeeForm.get('fullName').valueChanges.subscribe((value: string) => {
    //   console.log(value);
    // });
    // this.employeeForm.get('skills').valueChanges.subscribe(value => {
    //   console.log(JSON.stringify(value));
    // });

    this.employeeForm.valueChanges.subscribe((value) => {
      this.logValidatioErrors(this.employeeForm);
    });

    this.employeeForm.get('contactPreference').valueChanges.subscribe((data: string) => {
      this.onContactPreferenceChange(data);
    });

    this.activatedRoute.paramMap.subscribe(params => {
      let empID: any  = params.get('id');
      if(empID){
        this.actionTitle = 'Edit Employee';
        this.getEmployee(empID);
      }
      else {
        this.actionTitle = 'Create Employee';
        this.employee = {
          id: null,
          fullName: '',
          contactPreference: '',
          email: '',
          phone: null,
          skills: []
        }
      }
    });
   
  }
getEmployee(id: number){
this.empService.getEmployeeId(id).subscribe(
  (employee: IEmployee) => {
    this.editEmployee(employee);
    this.employee = employee;
  },
  (err: any) => console.log(err)  
);
}

editEmployee(employee: IEmployee){
  this.employeeForm.patchValue({
    fullName: employee.fullName,
    contactPreference: employee.contactPreference,
    emailGroup: {
      email: employee.email,
      confirmEmail: employee.email
    },
    phone: employee.phone
  });
  this.employeeForm.setControl('skills', this.setExistingSkill(employee.skills));
}
  
setExistingSkill(skillSets: ISkill[]): FormArray {
    const formArray = new FormArray([]);
    skillSets.forEach(s => {
      formArray.push(this.formBuilder.group({
        skillName: s.skillName,
        experienceInYears: s.experienceInYears,
        proficiency: s.proficiency

      }));
    });
    return formArray;
}
    addSkillFormGroup(): FormGroup{
      return this.formBuilder.group({
        skillName: ['', Validators.required],
        experienceInYears: ['', Validators.required],
        proficiency: ['', Validators.required]
      })
    }
    
    // The code of adding skill button
    addSkillButton(): void{
        (this.employeeForm.get('skills') as FormArray).push(this.addSkillFormGroup());
   
    };
    
    removeSkillButton(index: number): void {
   
        const skillFormArray =  this.employeeForm.get('skills') as FormArray;
        skillFormArray.removeAt(index);
        skillFormArray.markAsDirty();
        skillFormArray.markAsTouched();
    }




    // The code of displaying the keys of the FormGroup

  onLoopThroughKeys(): void {
    this.logKeysValuePairs(this.employeeForm);
  }
  logKeysValuePairs(group: FormGroup): void {
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);
      if (abstractControl instanceof FormGroup) {
        this.logKeysValuePairs(abstractControl);
      } else {
        console.log(`Key => ${key}  Value =>  ${abstractControl.value}`);
      }
    });
  }

  // The code of displaying errorMessage of a particular FormControl of it invalid
  logValidatioErrors(group: FormGroup = this.employeeForm): void {
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);
      this.formErrors[key] = '';
      if (abstractControl && abstractControl.invalid
        && (abstractControl.touched || abstractControl.dirty || abstractControl.value !== '')) {
        const messages = this.validationMessages[key];
        for (const errorKey in abstractControl.errors) {
          if (errorKey) {
            this.formErrors[key] += messages[errorKey] + ' ';
          }
        }
      }
      if (abstractControl instanceof FormGroup) {
        this.logValidatioErrors(abstractControl);
      } 
    
    });
  }
  onSubmit() {
    this.mapFormValuesToEmployeeModel();
    if(this.employee.id != null) {
    this.empService.updateEmployee(this.employee).subscribe(
    () => this.router.navigate(['employees']),
    (err: any) => console.log(err) 
  );
}
else  {
      this.empService.addEmployee(this.employee).subscribe(
        () => this.router.navigate(['employees']),
        (err: any) => console.log(err)
      );
      }
  }
  mapFormValuesToEmployeeModel() {
    this.employee.fullName = this.employeeForm.value.fullName;
    this.employee.contactPreference = this.employeeForm.value.contactPreference;
    this.employee.email = this.employeeForm.value.emailGroup.email;
    this.employee.phone = this.employeeForm.value.phone;
    this.employee.skills = this.employeeForm.value.skills;
  }

// Switching between phone and email FormControl
  onContactPreferenceChange(value: string) {
    const phoneControlForm = this.employeeForm.get('phone');
    if (value === 'phone') {
      phoneControlForm.setValidators(Validators.required);

    } else {
      phoneControlForm.clearValidators();
    }
    phoneControlForm.updateValueAndValidity();
  }

 // Loading All Data using patchValue method

  onSetData(): void {
    // this.employeeForm.setValue({
    //   fullName: 'mohammad',
    //   email: 'mqader@gmail.com',
    //   skills: {
    //     skillName: 'C#',
    //     experienceInYears: 3,
    //     proficiency: 'advanced'
    //   }
    // });
    
    const formArray1 = this.formBuilder.array([
      new FormControl('Mohammad', Validators.required),
      new FormControl('IT', Validators.required),
      new FormControl('SE', Validators.required),
      
    ]);
    const formArray2 = this.formBuilder.group([
      new FormControl('Mohammad', Validators.required),
      new FormControl('IT', Validators.required),
      new FormControl('SE', Validators.required)
    ]);
    console.log(formArray1.value);
    console.log(formArray2.value);
    



  }

 // Loading Some Data using patchValue method
  onPatchData(): void {
    this.employeeForm.patchValue({
      fullName: 'ahmad',
      email: 'ahmad@hotmail.com'
    });
  }


}
