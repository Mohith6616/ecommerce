import { Component, OnInit } from '@angular/core';
import { Productsrvc } from '../productsrvc.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  listOfCategories: any[] = [];
  constructor(public srvc: Productsrvc) {}

  ngOnInit() {
    this.srvc.getAllCategories().subscribe(
      (data: any) => {
        this.listOfCategories = data || [];
      },
      (err: any) => {
        console.error('Failed to load categories', err);
        this.listOfCategories = [];
      }
    );
  }
}
