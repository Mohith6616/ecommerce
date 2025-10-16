import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Productsrvc } from '../productsrvc.service';
import { ActivatedRoute, Router } from '@angular/router';

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
  sortOrder: 'none' | 'low-high' | 'high-low' = 'none';
  ratingSortOrder: 'none' | 'low-high' | 'high-low' = 'none';
  private originalProducts: any[] = [];

  constructor(private srvc: Productsrvc, private location: Location, private route: ActivatedRoute, private router: Router) {}

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

  onSortChange(order: string) {
    const o = (order as 'none' | 'low-high' | 'high-low');
    this.sortOrder = o;
    // Apply combined sorting logic
    this.applySortIfNeeded();
  }

  onRatingSortChange(order: string) {
    const o = (order as 'none' | 'low-high' | 'high-low');
    this.ratingSortOrder = o;
    // Apply combined sorting logic
    this.applySortIfNeeded();
  }

  private parsePrice(value: any): number {
    if (value == null) return 0;
    if (typeof value === 'number') return value;
    // Remove anything that's not a digit, dot or minus sign
    const cleaned = String(value).replace(/[^0-9.-]+/g, '');
    const n = parseFloat(cleaned);
    return isNaN(n) ? 0 : n;
  }

  private applySortIfNeeded() {
    // If neither sort is active, restore original order
    const priceActive = this.sortOrder && this.sortOrder !== 'none';
    const ratingActive = this.ratingSortOrder && this.ratingSortOrder !== 'none';
    if (!priceActive && !ratingActive) {
      this.listofproducts = this.originalProducts.slice();
      return;
    }
    // If both filters are active, prefer showing the intersection of the two filtered groups
    // e.g. "low" price + "high" rating -> products that are both among the lowest-priced
    // and among the highest-rated. We'll use a percentile-based group (default 20%).
    const PERCENT = 0.2;
    if (priceActive && ratingActive) {
      // Use a normalized combined score to rank products by how well they match both criteria.
      // For price: lower is better when 'low-high' selected, higher is better when 'high-low' selected.
      // For rating: higher is better when 'high-low' selected, lower is better when 'low-high' selected.
      const priceAsc = this.sortOrder === 'low-high';
      const ratingAsc = this.ratingSortOrder === 'low-high';

      const scores = this.originalProducts.map(p => {
        const price = this.parsePrice(p.cost);
        const rating = Number(p.rating) || 0;
        return { p, price, rating };
      });

      // Normalize price and rating to 0..1 (0 worst, 1 best) according to the currently requested direction
      const prices = scores.map(s => s.price);
      const ratings = scores.map(s => s.rating);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      const minRating = Math.min(...ratings);
      const maxRating = Math.max(...ratings);

      const norm = (value: number, min: number, max: number) => (max === min ? 0.5 : (value - min) / (max - min));

      const ranked = scores.map(s => {
        // For price: if priceAsc (low selected), lower price should get higher score -> invert normalized price
        const nPrice = norm(s.price, minPrice, maxPrice);
        const scorePrice = priceAsc ? (1 - nPrice) : nPrice;
        // For rating: if ratingAsc (low selected), lower rating should get higher score -> invert normalized rating
        const nRating = norm(s.rating, minRating, maxRating);
        const scoreRating = ratingAsc ? (1 - nRating) : nRating;

        // Combine scores — equal weight for now. Higher combined score = better match.
        const combined = (scorePrice + scoreRating) / 2;
        return { p: s.p, combined };
      });

      // Sort descending by combined score (best match first)
      ranked.sort((a, b) => b.combined - a.combined);
      this.listofproducts = ranked.map(r => r.p);
      return;
    }

    // Apply multi-key sort: price (if active) as primary, rating (if active) as secondary
    this.listofproducts = this.originalProducts.slice().sort((a: any, b: any) => {
      // Price comparison
      if (priceActive) {
        const pa = this.parsePrice(a.cost);
        const pb = this.parsePrice(b.cost);
        const priceCmp = this.sortOrder === 'low-high' ? pa - pb : pb - pa;
        if (priceCmp !== 0) return priceCmp;
      }
      // Rating comparison
      if (ratingActive) {
        const ra = Number(a.rating) || 0;
        const rb = Number(b.rating) || 0;
        const ratingCmp = this.ratingSortOrder === 'low-high' ? ra - rb : rb - ra;
        if (ratingCmp !== 0) return ratingCmp;
      }
      return 0;
    });
  }

  private loadAll() {
    this.srvc.getAllProducts().subscribe({
      next: (data: any) => { this.originalProducts = (data || []).slice(); this.applySortIfNeeded(); },
      error: (err: any) => { console.error('Failed to load products', err); this.errorMessage = 'Failed to load products'; }
    });
  }

  private loadByCategory(catid: string) {
    this.srvc.getAllProductsByCategory(catid).subscribe({
      next: (data: any) => { this.originalProducts = (data || []).slice(); this.applySortIfNeeded(); },
      error: (err: any) => { console.error('Failed to load category products', err); this.errorMessage = 'Failed to load products for category'; }
    });
  }

  goBack() {
    this.location.back();
  }
  // Add this near the top of your class
priceRange: string = 'none';

// Predefined price ranges
priceRanges = [
  { label: '₹10,000 - ₹20,000', value: '10000-20000' },
  { label: '₹20,000 - ₹30,000', value: '20000-30000' },
  { label: '₹30,000 - ₹40,000', value: '30000-40000' },
  { label: '₹40,000 - ₹50,000', value: '40000-50000' },
  { label: '₹50,000 - ₹60,000', value: '50000-60000' },
  { label: '₹60,000 - ₹70,000', value: '60000-70000' },
  { label: '₹70,000 - ₹80,000', value: '70000-80000' },
  { label: '₹80,000 - ₹90,000', value: '80000-90000' },
  { label: '₹90,000 - ₹1L', value: '90000-100000' },
  { label: '₹1L - ₹2L', value: '100000-200000' },
  { label: '₹2L - ₹3L', value: '200000-300000' },
  { label: '₹3L - ₹4L', value: '300000-400000' }
];

onPriceRangeChange(value: string) {
  this.priceRange = value;
  this.updateFilteredAndSortedProducts();
}
private updateFilteredAndSortedProducts() {
  // Start with all products
  let list = [...this.originalProducts];

  // ✅ Step 1: Filter by selected price range
  if (this.priceRange && this.priceRange !== 'none') {
    const [min, max] = this.priceRange.split('-').map(v => parseFloat(v));
    list = list.filter(p => {
      const price = this.parsePrice(p.cost);
      return price >= min && price <= max;
    });
  }

  // ✅ Step 2: Apply sorting
  if (this.sortOrder === 'none' && this.ratingSortOrder === 'none') {
    this.listofproducts = list;
    return;
  }

  list.sort((a, b) => {
    const priceA = this.parsePrice(a.cost);
    const priceB = this.parsePrice(b.cost);
    const ratingA = Number(a.rating) || 0;
    const ratingB = Number(b.rating) || 0;

    let priceDiff = 0;
    if (this.sortOrder !== 'none') {
      priceDiff = this.sortOrder === 'low-high' ? priceA - priceB : priceB - priceA;
    }

    let ratingDiff = 0;
    if (this.ratingSortOrder !== 'none') {
      ratingDiff = this.ratingSortOrder === 'low-high' ? ratingA - ratingB : ratingB - ratingA;
    }

    // Combine price and rating if both active
    if (this.sortOrder !== 'none' && this.ratingSortOrder !== 'none') {
      const PRICE_WEIGHT = 0.6;
      const RATING_WEIGHT = 0.4;
      return PRICE_WEIGHT * priceDiff + RATING_WEIGHT * ratingDiff;
    }

    // Otherwise fall back to whichever is active
    return priceDiff || ratingDiff;
  });

  this.listofproducts = list;
}
selectedProducts: any[] = [];

toggleSelection(product: any, checked: boolean) {
  if (checked) {
    if (this.selectedProducts.length < 3) {
      this.selectedProducts.push(product);
    }
  } else {
    this.selectedProducts = this.selectedProducts.filter(p => p.id !== product.id);
    this.errorMessage = ''; // clear message when deselected
  }
}

goToComparePage() {
  if (this.selectedProducts.length < 2) return;
  // Send data to compare page
  const ids = this.selectedProducts.map(p => p.id);
  this.router.navigate(['/real', 'compare'], { queryParams: { ids: ids.join(',') } });
}

}
