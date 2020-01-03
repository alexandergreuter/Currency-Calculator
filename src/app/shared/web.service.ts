import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

export interface Country {
  key: string;
  viewValue: string;
}

@Injectable({
  providedIn: 'root'
})
export class WebService {
  countries: any;
  cacheTo: number;
  cacheFrom: number;
  lastBase: string;
  lastRate: string;

  constructor(private http: HttpClient) {
  }

  getCountries(): any {
    if (this.countries === undefined) {
      this.countries = this.http.get('https://openexchangerates.org/api/currencies.json');
    }
    return this.countries;
  }

  convert(input: number, convertFrom: Country, convertTo: Country, loading: boolean): number {
    if (convertFrom.key !== this.lastBase || convertTo.key !== this.lastRate) {

      loading = true;

      this.cacheTo = undefined;
      this.cacheFrom = undefined;

      this.lastBase = convertFrom.key;
      this.lastRate = convertTo.key;

      this.http.get(`https://openexchangerates.org/api/latest.json?app_id=90fdb63fe8d547b4ab37dfce8b0d7f25`)
        .subscribe((data: any) => {
          for (const key in data.rates) {
            if (key.toString() === convertTo.key) {
              this.cacheTo = data.rates[key];
            } else if (key.toString() === convertFrom.key) {
              this.cacheFrom = data.rates[key];
            } else {
              continue;
            }

            if (this.cacheTo !== undefined && this.cacheFrom !== undefined) {
              break;
            }
          }
          loading = false;
        });
    }

    return input * (this.cacheTo / this.cacheFrom);
  }
}
