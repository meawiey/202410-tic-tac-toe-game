import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HelperToolsService } from '../services/helper-tools.service';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.page.html',
  styleUrls: ['./loading.page.scss'],
})
export class LoadingPage implements OnInit {
  public countLoading: number = 0;

  constructor(
    public helperTools: HelperToolsService,
    public router: Router
  ) { }

  ngOnInit() {
    this.helperTools.resizeElement();
    this.animationLoading(1000);
  }

  // count down game
  animationLoading(delay: number) {
    setTimeout(() => {
      this.countLoading++;
      const icon = document.getElementById('h' + this.countLoading);

      if (!icon) {
        this.router.navigate(['/home']);
      } else {
        icon.style.visibility = 'visible';
        this.animationLoading(300);
      }
    }, delay);
  }

}
