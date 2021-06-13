import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  title = 'calculator-app';
  public display: string = "0";
  evaluateDisplay() {
    let nums = this.display.split("[+x/-]");
  }
  updateDisplay(func: string) {
    if (func === "del") {
      if (this.display.length > 1) {
        this.display = this.display.substring(0, this.display.length - 1);
      } else
        this.display = "0";
    } else if (func === "reset") {
      this.display = "0";
    } else if (func === "=") {
      this.evaluateDisplay();
    } else if (this.display.length != 14) {
      if (func === "+" || func === "-" || func === "x" || func === "/") {
        this.display = this.display + func;
      } else if (func === ".") {
        if (!this.display.includes(func)) {
          this.display = this.display + func;
        }
      } else {
        if (this.display === "0") {
          this.display = func
        } else {
          this.display = this.display + func;
        }
      }
    }
  }

}

