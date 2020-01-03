import {Component, OnInit} from '@angular/core';
import {Country, WebService} from './shared/web.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'currency2';
  countries: Array<Country> = new Array<Country>();

  selected1: Country = undefined;
  selected2: Country = undefined;

  amount1 = 0;

  loading = true;

  constructor(private webService: WebService) {
  }

  ngOnInit(): void {
    this.webService.getCountries().subscribe(data => {
      for (const key in data) {
        this.countries.push({key: key.toString(), viewValue: data[key]});
      }
      this.selected1 = this.countries[0];
      this.selected2 = this.countries[1];
      this.loading = false;
    });
  }

  converted(): number {
    console.log(this.selected1);
    return this.webService.convert(this.amount1, this.selected1, this.selected2, this.loading);
  }

  swapCountries() {
    const previous = this.selected1;
    this.selected1 = this.selected2;
    this.selected2 = previous;
  }
}
