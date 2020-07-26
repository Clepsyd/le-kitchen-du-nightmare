import { Component, OnInit, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-username',
  templateUrl: './username.component.html',
  styleUrls: ['./username.component.scss'],
})
export class UsernameComponent implements OnInit {
  @Output() nameSubmitted = new EventEmitter<string>();
  name: string;
  constructor() {}

  ngOnInit(): void {}

  onSubmit(form: NgForm) {
    if (form.valid) {
      let data = form.value;
      this.nameSubmitted.emit([data.first, data.last].join(' ').trim());
    }
  }
}
