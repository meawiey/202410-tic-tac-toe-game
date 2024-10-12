import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { HelperToolsService } from '../services/helper-tools.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  public registerForm!: FormGroup;
  public submitted = false;

  constructor(
    public helperTools: HelperToolsService,
    public formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.helperTools.resizeElement();
    this.registerForm = this.formBuilder.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
      },
    );
  }

  ionViewWillLeave() {
    this.onCancel();
  }

  get f() {
    return this.registerForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    if (this.registerForm.invalid) {
      return;
    }

    // TODO
    this.helperTools.registerNewCustomer(
      this.registerForm.controls['email'].value,
      this.registerForm.controls['password'].value
    );
  }

  onCancel() {
    this.submitted = false;
    this.registerForm.reset();
  }

}
