import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { CountryService, CountryInfo } from '../../services/country';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './map.html',
  styleUrl: './map.css',
})
export class MapComponent implements OnInit {
  private sanitizer = inject(DomSanitizer);
  private countryService = inject(CountryService);
  private cdr = inject(ChangeDetectorRef);

  svgContent: SafeHtml | null = null;
  selectedCountry: CountryInfo | null = null;

  async ngOnInit(): Promise<void> {
    try {

      const res = await fetch('/SVG/world.svg', { cache: 'no-store' });
      if (!res.ok) {
        throw new Error(`Fetch failed: ${res.status} ${res.statusText}`);
      }

      const svgText = await res.text();
      this.svgContent = this.sanitizer.bypassSecurityTrustHtml(svgText);
      this.cdr.detectChanges();
    } catch (err) {
      console.error('SVG load error:', err);
      this.svgContent = null;
      this.cdr.detectChanges();
    }
  }

  onSvgClick(event: MouseEvent): void {
    const el = event.target as HTMLElement;

    // Find nearest element in the SVG that has an id attribute
    const target = el.closest('[id]') as HTMLElement | null;
    if (!target) return;

    const code = (target.getAttribute('id') || '').trim().toUpperCase();

    // World Bank expects ISO2 codes (e.g., US, RU, KZ)
    if (!code || code.length !== 2) return;

    this.countryService.getCountryByCode(code).subscribe({
      next: (data) => {
        this.selectedCountry = data;
      },
      error: (err) => {
        console.error('Country API error:', err);
        this.selectedCountry = null;
      },
    });
  }
}