import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IUser } from 'src/app/shared/interfaces';
import { AuthService } from '../shared/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent implements OnInit {
  form!: FormGroup;
  minLengthPassword: number = 6;
  submitted = false;

  constructor(public authService: AuthService, private router: Router) {} //private

  ngOnInit() {
    this.form = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(this.minLengthPassword),
      ]),
    });
  }

  submit() {
    if (this.form.invalid) {
      return;
    }

    this.submitted = true;
    const { email, password } = this.form.value;
    const user: IUser = {
      email,
      password,
    };

    this.authService.login(user).subscribe({
      next: () => {
        this.form.reset();
        this.router.navigate(['/admin', 'dashboard']);
        this.submitted = false;
      },
      error: () => {
        this.submitted = false;
      },
    });
  }
}
