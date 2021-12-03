import { lokTystrcs, hometypes, questions } from './questions';
import { Component } from '@angular/core';
import { MatDialog, MatDialogRef, MatDialogConfig, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTabGroup } from '@angular/material/tabs';
// import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  questions: object[];
  lokTystrcs: object[];
  selectedCity: object;
  hometypes: object[];
  selectedHome: object;
  selectedPage = 0;
  page: any;
  listOfUnits: any;
  ngOnInit() {
    this.lokTystrcs = lokTystrcs;
    this.hometypes = hometypes;
    this.questions = questions;
    this.listOfUnits = [0, 1, 2, 3 ,4];
    window.addEventListener('load', () => {
      let x = 0;
      let verify = true;
      let element1: HTMLElement = document.getElementsByClassName(
        'ui-carousel-next'
      )[0] as HTMLElement;
      let element2: HTMLElement = document.getElementsByClassName(
        'ui-carousel-prev'
      )[0] as HTMLElement;
      let element5: HTMLElement = document.getElementById(
        'txtOthers4'
      ) as HTMLElement;
      let element7: HTMLElement = document.getElementById(
        'thirdButton'
      ) as HTMLElement;
      let element8: HTMLElement = document.getElementById(
        'firstButton'
      ) as HTMLElement;
      document
        .getElementsByClassName('ui-carousel-next')[0]
        .setAttribute('tabindex', '5');
      document
        .getElementsByClassName('ui-carousel-prev')[0]
        .setAttribute('tabindex', '6');
      let elementArray = document.getElementsByTagName('p-dropdown');
      for (let index = 0; index < elementArray.length; index++) {
        const element: any = elementArray[index];
        element.addEventListener('keyup', (event) => {
          if (event.key === 'Enter' && verify === false) {
            element.children[0].click();
            verify = true;
          } else if (event.key === 'Enter' && verify === true) {
            verify = false;
          }
        });
      }
      document.getElementById('conBtn').addEventListener('focusout', (event) => {
        if (x === 0) {
          element1.focus();
        } else {
          element2.focus();
        }
      });
      element5.addEventListener('focusout', (event) => {
        if (x === 0) {
          element1.focus();
        } else {
          element2.focus();
        }
        verify = true;
      });
      element7.addEventListener('focusout', (event) => {
        if (this.selectedPage === 1 && x === 0) {
          let TystrDropdown0 : any = document.getElementById('TystrDropdown0');
          TystrDropdown0.focus();
        }
        else if (this.selectedPage === 0  && x === 0) {
          let hometype0 : any = document.getElementById('conBtn');
          hometype0.focus();
        }
      })
      element2.addEventListener('focusout', (event) => {
        if (x === 0) {
          document.getElementById('firstButton').focus();
        }
      });
      element8.addEventListener('focusout', (event) => {
        console.log('first blur')
        if (x === 1) {
          element2.focus();
        }
      })
      window.addEventListener('keyup', (event) => {
        if (event.key === 'ArrowRight' && this.selectedPage < 2) {
          element1.click();
        } else if (event.key === 'ArrowLeft' && this.selectedPage > 0) {
          element2.click();
        }
      });
      window.addEventListener('keydown', (event) => {
        if (event.key === 'Shift') {
          x = 1;
          setTimeout(() => {
            x = 0;
          }, 300);
        }
      });
    });
  }
  setPage = (event) => {
    this.page = event;
    this.selectedPage = event.page;
    if (event.page === 1) {
        console.log(event.page)
        setTimeout(() => {
          let TystrDropdown0 : any = document.getElementById('TystrDropdown0');
          TystrDropdown0.focus();
        }, 300);
    }
    else if (event.page === 2) {
        console.log(event.page)
    }
  };
  getPage = () => {
    if(this.page !== null && this.page !== undefined)
      return this.page.page;
    return 0;
  };
  onUpdate = () => {
    console.log('update')
  }
  warn = (i:number) => {
    console.log('warning', i)
  }
}
