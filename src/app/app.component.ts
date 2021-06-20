import { Component } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import {
  trigger,
  state,
  style,
  transition,
  animate
} from '@angular/animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
  animations: [
    trigger('themeSelect', [
      state('theme-state-1', style({
        marginLeft: "0px"
      })),
      state('theme-state-2', style({
        marginLeft: "24px"
      })),
      state('theme-state-3', style({
        marginLeft: "48px"
      })),
      transition("theme-state-1 => theme-state-2, theme-state-2 => theme-state-1, theme-state-2 => theme-state-3, theme-state-3 => theme-state-2, theme-state-1 => theme-state-3, theme-state-3 => theme-state-1", [
        animate("0.2s ease-in-out")
      ])
    ])
  ]
})
export class AppComponent {
  title = 'calculator-app';
  public display: string = "0";
  public currNum: number = 0;
  public prevNum: number = 0;
  public prevDisplay: string = "";
  public prevFunc: string = "";
  public themeSelect: string = "theme-state-1";

  constructor(private decPipe: DecimalPipe) { }

  formatNum(func: string) {
    console.log(`currNum:${this.currNum} prevNum:${this.prevNum} prevDisplay:${this.prevDisplay}`);
    if (func === "+" || func === "-" || func === "x" || func === "/") {
      this.display = this.display + func;
      this.prevDisplay = this.display;
      this.prevNum = this.currNum;
      this.currNum = 0;
    } else if (func === ".") {
      if (this.prevFunc != "=")
        this.display = this.display + func;
      else
        this.display = "0.";
    } else if (func === "del") {
      if (!isNaN(+this.display.charAt(this.display.length - 1))) { // if prevFunc is a number _or_ (prevFunc is del and lastChar of display is a number)
        let numString = this.currNum.toString();
        this.currNum = +numString.substring(0, numString.length - 1);
        if (this.currNum === 0) {
          this.display = this.display.substring(0, this.display.length - 1);
          this.currNum = this.prevNum;
          this.prevNum = 0;
        } else {
          this.display = this.prevDisplay + (this.decPipe.transform(this.currNum) ?? "");
        }
      } else {  // if prevFunc is an operator _or_ (prevFunc is del and lastChar of display is an operator )
        this.currNum = this.prevNum;
        this.prevNum = 0;
        this.display = this.display.substring(0, this.display.length - 1);
        this.prevDisplay = this.display;
        while (this.prevDisplay != "" && !isNaN(+this.prevDisplay.charAt(this.prevDisplay.length - 1))) { // keep removing last char of prevDisplay until last char is NaN
          this.prevDisplay = this.prevDisplay.substring(0, this.prevDisplay.length - 1);
        }

      }
    }
    else if (this.currNum === 0 && this.prevFunc != ".") {
      this.currNum = +func;
      this.display = this.prevDisplay + this.currNum;
    } else { // if func is non-zero number
      if (this.prevFunc === ".") {
        this.currNum = +(this.currNum + "." + func);
        this.display = this.prevDisplay + (this.decPipe.transform(this.currNum) ?? "");
      } else {
        this.currNum = +(this.currNum + func);
        this.display = this.prevDisplay + (this.decPipe.transform(this.currNum) ?? "");
      }
    }
  }

  evaluateDisplay() {
    let nums: string[] = this.display.split(/[+x/-]/);
    let ops: string[] = this.display.split(/[0-9.,]+/).filter(i => i);
    if (nums.length === (ops.length + 1) && nums.length > 1) {
      let total: number = +nums[0].replace(',', '');
      console.log(total);
      nums.shift();
      for (let i = 0; i < nums.length; i++) {
        if (ops[i] === "+") {
          total = total + +nums[i].replace(",", "");
        } else if (ops[i] === "-") {
          total = total - +nums[i].replace(",", "");
        } else if (ops[i] === "x") {
          total = total * +nums[i].replace(",", "");
        } else if (ops[i] === "/") {
          total = total / +nums[i].replace(",", "");
        }
      }
      this.currNum = 0;
      this.prevDisplay = "";
      this.display = this.decPipe.transform(total) ?? "0";
    }
  }

  updateDisplay(func: string) {
    if (func === "del") {
      if (this.display.length > 1 && this.prevFunc != "=") {
        this.formatNum(func);
      } else {
        this.display = "0";
        this.currNum = 0;
        this.prevDisplay = "";
      }
    } else if (func === "reset") {
      this.display = "0";
      this.currNum = 0;
      this.prevNum = 0;
      this.prevDisplay = "";
    } else if (func === "=") {
      this.evaluateDisplay();
    } else if (func === "+" || func === "-" || func === "x" || func === "/") {
      if (this.prevFunc === "+" || this.prevFunc === "-" || this.prevFunc === "x" || this.prevFunc === "/") {
        this.display = this.display.substr(0, this.display.length - 1) + func;
        this.prevDisplay = this.display;
      }
    } if (this.display.length != 14) {
      if (func === "+" || func === "-" || func === "x" || func === "/") {
        if (this.prevFunc === "+" || this.prevFunc === "-" || this.prevFunc === "x" || this.prevFunc === "/") { this.display = this.display.substr(0, this.display.length - 1) + func }
        else { this.formatNum(func); }
      } else if (func === ".") {
        if (!this.display.includes(func)) {
          this.formatNum(func);
        }
      } else if (!(isNaN(+func))) { // if func is a number
        if (this.display === "0") {
          this.display = func;
          this.currNum = +func;
        } else {
          this.formatNum(func);
        }
      }
    }
    this.prevFunc = func;
  }

}

