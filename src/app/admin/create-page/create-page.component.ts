import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IPost } from 'src/app/shared/interfaces';
import { PostsService } from 'src/app/shared/posts.service';
import { AlertService } from '../shared/services/alert.service';

@Component({
  selector: 'app-create-page',
  templateUrl: './create-page.component.html',
  styleUrls: ['./create-page.component.scss'],
})
export class CreatePageComponent implements OnInit, OnDestroy {
  private createSub!: Subscription;
  form!: FormGroup;

  constructor(
    private postsService: PostsService,
    private alertService: AlertService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      title: new FormControl(null, Validators.required),
      text: new FormControl(null, Validators.required),
      author: new FormControl(null, Validators.required),
    });
  }

  submit() {
    if (this.form.invalid) {
      return;
    }

    const post: IPost = {
      ...this.form.value,
      date: new Date(),
    };

    this.createSub = this.postsService.create(post).subscribe(() => {
      this.form.reset();
      this.alertService.success('Пост создан успешно');
      this.router.navigate(['admin', 'dashboard']);
    });
  }

  ngOnDestroy(): void {
    this.createSub ? this.createSub.unsubscribe() : null;
  }
}
