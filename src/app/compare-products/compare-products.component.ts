import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Productsrvc } from '../productsrvc.service';

@Component({
  selector: 'app-compare-products',
  imports: [CommonModule,RouterModule],
  templateUrl: './compare-products.component.html',
  styleUrls: ['./compare-products.component.scss']
})
export class CompareProductsComponent implements OnInit {
  products: any[] = [];

  constructor(private route: ActivatedRoute, private srvc: Productsrvc) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      const idsParam = params.get('ids');
      if (!idsParam) return;
      const ids = idsParam.split(',');
      // Fetch each product by id
      ids.forEach(id => {
        this.srvc.getProduct(id).subscribe(p => this.products.push(p));
      });
    });
  }
}