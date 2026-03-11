import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface CountryInfo {
  name: string;
  capital: string;
  region: string;
  incomeLevel: string;
  iso2code: string;
  latitude: string;
  longitude: string;
}

@Injectable({
  providedIn: 'root',
})
export class CountryService {
  private baseUrl = 'https://api.worldbank.org/v2/country';

  constructor(private http: HttpClient) {}

  getCountryByCode(code: string): Observable<CountryInfo> {
    const url = `${this.baseUrl}/${code}?format=json`;

    return this.http.get<any>(url).pipe(
      map((response) => {
        const country = response?.[1]?.[0];

        return {
          name: country?.name ?? '',
          capital: country?.capitalCity ?? '',
          region: country?.region?.value ?? '',
          incomeLevel: country?.incomeLevel?.value ?? '',
          iso2code: country?.iso2Code ?? code,
          latitude: country?.latitude ?? '',
          longitude: country?.longitude ?? '',
        };
      })
    );
  }
}