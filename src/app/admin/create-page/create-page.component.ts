import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IPost } from 'src/app/shared/interfaces';
import { PostsService } from 'src/app/shared/posts.service';

@Component({
  selector: 'app-create-page',
  templateUrl: './create-page.component.html',
  styleUrls: ['./create-page.component.scss'],
})
export class CreatePageComponent implements OnInit {
  form!: FormGroup;

  constructor(private postsService: PostsService) {}

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

    // const { title, text, author } = this.form.value;
    // const post: IPost = {
    //   text,
    //   title,
    //   author,
    //   date: new Date(),
    // };

    this.postsService.create(post).subscribe((res) => {
      this.form.reset();
    });

    this.postsService.getAll();
  }
}
