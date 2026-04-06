import { Component } from '@angular/core';
import HomePage from "./components/home-page/home-page.component";
import {RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [RouterOutlet]
})
export class AppComponent {
  constructor() {}
}
