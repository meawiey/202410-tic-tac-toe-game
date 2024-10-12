import { Component, OnInit } from '@angular/core';
import { HelperToolsService } from '../services/helper-tools.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  
  constructor(
    public helperTools: HelperToolsService,
  ) {}

  ngOnInit() {
    this.helperTools.resizeElement();
  }

}
