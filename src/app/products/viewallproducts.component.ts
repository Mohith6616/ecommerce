import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Productsrvc } from '../productsrvc.service';
import { ActivatedRoute } from '@angular/router';

import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-viewallproducts',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './viewallproducts.component.html',
  styleUrls: ['./viewallproducts.component.scss']
})
export class ViewAllProductsComponent implements OnInit {
  listofproducts: any[] = [];
  errorMessage = '';

  constructor(private srvc: Productsrvc, private location: Location, private route: ActivatedRoute) {}

  ngOnInit(): void {
    // react to route param changes (category filtering)
    this.route.paramMap.subscribe(params => {
      const catid = params.get('catid');
      if (catid) {
        this.loadByCategory(catid);
      } else {
        this.loadAll();
      }
    });
  }

  private loadAll() {
    this.srvc.getAllProducts().subscribe({
      next: (data: any) => this.listofproducts = data || [],
      error: (err: any) => { console.error('Failed to load products', err); this.errorMessage = 'Failed to load products'; }
    });
  }

  private loadByCategory(catid: string) {
    this.srvc.getAllProductsByCategory(catid).subscribe({
      next: (data: any) => this.listofproducts = data || [],
      error: (err: any) => { console.error('Failed to load category products', err); this.errorMessage = 'Failed to load products for category'; }
    });
  }

  goBack() {
    this.location.back();
  }
}
