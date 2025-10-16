import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { Productsrvc } from '../productsrvc.service';

@Component({
  selector: 'app-viewproduct',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './viewproduct.component.html',
  styleUrls: ['./viewproduct.component.scss']
})
export class ViewProductComponent implements OnInit {
  product: any = null;
  slides: string[] = [];
  loading = false;
  error = '';
  currentIndex = 0;

  constructor(private route: ActivatedRoute, private srvc: Productsrvc) {}

  ngOnInit(): void {
    this.loading = true;
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error = 'No product id provided.';
      this.loading = false;
      return;
    }

    this.srvc.getProduct(id).subscribe({
      next: (data: any) => {
        this.product = data;
        const img = data?.image ? String(data.image) : '';
        this.slides = img ? [img, img] : [];
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load product.';
        this.loading = false;
      }
    });
  }

  prevSlide() {
    if (!this.slides.length) return;
    this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
  }

  nextSlide() {
    if (!this.slides.length) return;
    this.currentIndex = (this.currentIndex + 1) % this.slides.length;
  }
}
