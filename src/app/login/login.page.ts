import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { HelperToolsService } from '../services/helper-tools.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public loginForm!: FormGroup;
  public submitted = false;

  constructor(
    public helperTools: HelperToolsService,
    public formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.helperTools.resizeElement();
    this.loginForm = this.formBuilder.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required],
      },
    );
  }

  ionViewWillLeave() {
    this.onCancel();
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    if (this.loginForm.invalid) {
      return;
    }

    // TODO
    this.helperTools.loginWithEmail(
      this.loginForm.controls['email'].value,
      this.loginForm.controls['password'].value
    );
  }

  onCancel() {
    this.submitted = false;
    this.loginForm.reset();
  }

}
