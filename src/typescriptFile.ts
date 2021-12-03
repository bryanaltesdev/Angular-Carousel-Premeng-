import { Component, OnInit, Inject, AfterViewInit, ViewChild, ElementRef, Renderer2, Output, EventEmitter } from '@angular/core';
import { Router } from "@angular/router";
import { LocationStrategy } from '@angular/common';
import { StateService } from '../data-services/state-service';
import { DialogBodyComponent } from '../dialog-body/dialog-body.component';
import { MatDialog, MatDialogRef, MatDialogConfig, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { environment } from 'src/environments/environment';
import * as $ from 'jquery';
import { MatTabGroup } from '@angular/material/tabs';
// import {CatchError, }  from 'rxjs/add/operator/pluck';
import { RespondentComponent } from '../respondent/respondent.component';
import { RespondentService } from '../shared/respondent.service';
import { Observable } from 'rxjs';
import { subscribeOn } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import moment from 'moment';
import { default as _rollupMoment, Moment } from 'moment';
import { InterviewQuestionService } from '../shared/interview-question.service';
import { Question } from './question';


//-----------------------Functionality for triggering full screen without user action starts here----------------------//
interface FsDocument extends HTMLDocument {
  webkitFullscreenElement?: Element;
  mozFullScreenElement?: Element;
  msFullscreenElement?: Element;
  webkitExitFullscreen?: () => void;
  msExitFullscreen?: () => void;
  mozCancelFullScreen?: () => void;
}

export function isFullScreen(): boolean {
  const fsDoc = <FsDocument>document;

  return !!(fsDoc.fullscreenElement || fsDoc.mozFullScreenElement || fsDoc.webkitFullscreenElement || fsDoc.msFullscreenElement);
}

interface FsDocumentElement extends HTMLElement {
  webkitRequestFullscreen?: () => void;
  msRequestFullscreen?: () => void;
  mozRequestFullScreen?: () => void;
}

export function toggleFullScreen(): void {
  const fsDoc = <FsDocument>document;

  if (!isFullScreen()) {
    const fsDocElem = <FsDocumentElement>document.documentElement;

    if (fsDocElem.requestFullscreen)
      fsDocElem.requestFullscreen();
    else if (fsDocElem.msRequestFullscreen)
      fsDocElem.msRequestFullscreen();
    else if (fsDocElem.mozRequestFullScreen)
      fsDocElem.mozRequestFullScreen();
    else if (fsDocElem.webkitRequestFullscreen)
      fsDocElem.webkitRequestFullscreen();
  }
  else if (fsDoc.exitFullscreen)
    fsDoc.exitFullscreen();
  else if (fsDoc.msExitFullscreen)
    fsDoc.msExitFullscreen();
  else if (fsDoc.mozCancelFullScreen)
    fsDoc.mozCancelFullScreen();
  else if (fsDoc.webkitExitFullscreen)
    fsDoc.webkitExitFullscreen();
}

export function setFullScreen(full: boolean): void {
  if (full !== isFullScreen())
    toggleFullScreen();
}
//-----------------------Functionality for triggering full screen without user action ends here------------------------//

export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-group-interview',
  templateUrl: './group-interview.component.html',
  styleUrls: ['./group-interview.component.css'],
  //date picker format for Move in date 
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ]
})

export class GroupInterviewComponent implements OnInit {
  @ViewChild('moveNext', { static: false }) surveyButtonReference: ElementRef;
  @ViewChild('tabRef', { static: false }) tabRef: MatTabGroup;
  public userrole: UserRole[];
  public checkRole: string;
  public IsUserLogged: boolean;
  public interviewInProgress: string;
  public firstFormGroup: FormGroup;
  public stringVariable: string;
  public selectedUnit: any;
  public networkModeBeforeChange: string;
  public OfoUser: string;
  public listOfUnits: any;
  public unitHeight: number;
  questions: Question[];
  responsiveOptions;
  public tystrcId;
  public lokTystrcs: any;
  public tystrcsp;
  public selectedAnswerElevator;
  public selectedAnswerBedrooms;
  public selectedAnswerFullBathRooms;
  public selectedAnswerHalfBathRooms;
  public selectedAnswerOtherRooms;
  public lokNoOfRooms: any;
  public totalNumberofRooms;
  public selectedAnswerBuiltDecadeId;//: string;
  public selectedAnswerBuiltYear;//: string;
  public lokBuiltDecades: any;
  public builtYears;
  public isYearBuiltValid;//: boolean = true;
  public selectedAnswerMoveInDate;
  answers = [
    { key: 'Y', value: 'Yes' },
    { key: 'N', value: 'No' },
    { key: 'D', value: 'Don\'t Know' }
  ];
  minDate: Moment;
  maxDate: Moment;
  CurrentDate = moment([moment().year(), moment().month(), moment().date()]);
  public date;
  tabIndex = 0;
  isTabVisible: boolean = false;
  isContactInfoActive = false;
  isUnitInfoActive = false;
  isMessageActive = false;
  public iscurrentRespondent: boolean;
  public isTenant: boolean;
  public rowIndexId: any;
  rightArrow: any;
  leftArrow: any;
  page: any;


  constructor(
    @Inject('BASE_URL') private baseUrl: string,
    private router: Router,
    private location: LocationStrategy,
    private state: StateService,
    private dialog: MatDialog,
    private _formBuilder: FormBuilder,
    private http: HttpClient,
    private questionService: InterviewQuestionService,
    private dbService: NgxIndexedDBService,
    public service: RespondentService
  ) {
    this.state.changeGrpIntrvwInProgressState('yes');
    if (localStorage.getItem('networkModeBeforeChange') !== undefined) {
      this.networkModeBeforeChange = localStorage.getItem('networkModeBeforeChange');
    }
    this.responsiveOptions = [
      {
        breakpoint: '1024px',
        numVisible: 3,
        numScroll: 3
      },
      {
        breakpoint: '768px',
        numVisible: 2,
        numScroll: 2
      },
      {
        breakpoint: '560px',
        numVisible: 1,
        numScroll: 1
      }
    ];

    this.dbService.getAll('LokTystrc').then(
      lokTystrcs => {
        if (lokTystrcs.length > 0) {
          this.lokTystrcs = lokTystrcs;
        } else {
          console.log('LokTystrc is not ready');
        }
      },
      error => {
        console.log(error);
      }
    );

    this.dbService.getAll('LokGetNoOfRooms').then(
      resultNoRooms => {
        if (resultNoRooms.length > 0) {
          this.lokNoOfRooms = resultNoRooms;
        } else {
          console.log('LokGetNoOfRooms is not ready');
        }
      },
      error => {
        console.log(error);
      }
    );

    this.dbService.getAll('LokGetBuiltDecades').then(
      result => {
        if (result.length > 0) {
          this.lokBuiltDecades = result;
        } else {
          console.log('LokGetBuiltDecades is not ready');
        }
      },
      error => {
        console.log(error);
      }
    );

  }// End of constructor



  ngOnInit() {

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
        'state4'
      ) as HTMLElement;
      let element6: HTMLElement = document.getElementsByClassName(
        'igSelect'
      )[4] as HTMLElement;
      document
        .getElementsByClassName('ui-carousel-next')[0]
        .setAttribute('tabindex', '4');

      document
        .getElementsByClassName('ui-carousel-prev')[0]
        .setAttribute('tabindex', '3');


      document.getElementById('conBtn').addEventListener('focusout', (event) => {
        if (x === 0) {
          element1.focus();
        } else {
          element2.focus();
        }
      });

     
    });

    this.IsUserLogged = localStorage.getItem("test") === 'true';
    this.checkRole = environment.UserRole;
    this.OfoUser = environment.OfoUser;
    if (!this.IsUserLogged) {
      window.location.replace('/Login');
    }
    else {
      //disable back button//
      history.pushState(null, null, window.location.href);
      this.location.onPopState(() => {
        history.pushState(null, null, window.location.href);
      });

      //get the selected unit stringified and then parse it to get the unit array.
      this.state.currentSelectedUnit.subscribe(x => this.stringVariable = x);
      if (this.stringVariable === "" || this.stringVariable === undefined) {
        this.router.navigateByUrl("/home");  //because this pass may be happeneing consequent to refresh of screen and when selected unit information is not available..meaning no unit selected.
      }
      else {
        //setFullScreen(true);
        this.selectedUnit = JSON.parse(this.stringVariable);
        this.listOfUnits = JSON.parse(localStorage.getItem('listOfGroupInterviewUnits'));
        this.unitHeight = 30 / this.listOfUnits.length;
        const currentYear = moment().year();
        this.minDate = moment([1900, 0, 1]);
        this.maxDate = moment([currentYear, moment().month(), moment().date()]);

        this.firstFormGroup = this._formBuilder.group({
          address: ["(IG: " + this.selectedUnit.iG_DU + ", " + this.listOfUnits.length + " units) " + this.selectedUnit.address, Validators.required],
          collper: [this.selectedUnit.collper, Validators.required],
          lineid: [this.selectedUnit.lineid, Validators.required],
          segid: [this.selectedUnit.segid, Validators.required],
          psuix: [this.selectedUnit.psuix, Validators.required],
          version: [this.selectedUnit.version, Validators.required]

        });

        //Detect if the network mode changed from offline to online and vise versa
        this.state.appNetworkMode.subscribe(ChangedNetworkMode => {
          if ((this.networkModeBeforeChange === null || this.networkModeBeforeChange === "Offline" || this.networkModeBeforeChange === undefined || this.networkModeBeforeChange === "") && ChangedNetworkMode === "Online") {
            this.networkModeBeforeChange = ChangedNetworkMode;
            localStorage.setItem('networkModeBeforeChange', ChangedNetworkMode);
            //Call the functions to sync data into the database or anything to be done when application comes online


          }
          else if (this.networkModeBeforeChange === "Online" && ChangedNetworkMode === "Offline") {
            this.networkModeBeforeChange = ChangedNetworkMode;
            localStorage.setItem('networkModeBeforeChange', ChangedNetworkMode);
            //Anything to be done when application goes offline


          }
        });

        //----------------------------------------Core functionality of the group interview should fall here-------------------------------------------------//

        this.questionService.getQuestionsSmall().then(questions => {
          this.questions = questions;

          //create ngModels required for each question's input controls. Create as manay ngModels as are number of units in the group.
          this.questions.forEach((question) => {
            switch (question.control) {
              case 'TystrDropdown':
                this.tystrcId = [];
                this.tystrcsp = [];
                for (let i = 0; i < this.listOfUnits.length; i++) {
                  this.tystrcId.push(-1);
                  this.tystrcsp.push('');
                }
                break;
              case 'radAnswerElevator':
                this.selectedAnswerElevator = [];
                for (let i = 0; i < this.listOfUnits.length; i++) {
                  this.selectedAnswerElevator.push('');
                }
                break;
              case 'numberOfRooms':
                this.selectedAnswerBedrooms = [];
                this.selectedAnswerFullBathRooms = [];
                this.selectedAnswerHalfBathRooms = [];
                this.selectedAnswerOtherRooms = [];
                this.totalNumberofRooms = [];
                for (let i = 0; i < this.listOfUnits.length; i++) {
                  this.selectedAnswerBedrooms.push(-1);
                  this.selectedAnswerFullBathRooms.push(-1);
                  this.selectedAnswerHalfBathRooms.push(-1);
                  this.selectedAnswerOtherRooms.push(-1);
                  this.totalNumberofRooms.push("");
                }
                break;
              case 'whenBuilt':
                this.selectedAnswerBuiltDecadeId = [];
                this.selectedAnswerBuiltYear = [];
                this.isYearBuiltValid = [];
                this.builtYears = [];
                for (let i = 0; i < this.listOfUnits.length; i++) {
                  this.selectedAnswerBuiltDecadeId.push("-1");
                  this.selectedAnswerBuiltYear.push("-1");
                  this.isYearBuiltValid.push(false);
                  this.builtYears.push([]);// 2D array;
                }
                break;
              case 'longestMoveIn':
                this.selectedAnswerMoveInDate = [];
                this.date = [];
                //this.datePicker = [];
                for (let i = 0; i < this.listOfUnits.length; i++) {
                  this.selectedAnswerMoveInDate.push(null);
                  this.date.push(new FormControl(moment().format('MM/YYYY')));
                  //this.datePicker.push(null);
                }

              default:
                break;
            }
          });

        });

        //-------------------------------------Core functionality of the group interview should end here----------------------------------------------------//

        //ayano_t 05/20/2021
        //Get Respondent contact Info Data
        this.dbService.getAll('GetSchedulesContactInfoData').then(
          rowData => {
            if (rowData.length > 0) {
              this.iscurrentRespondent = false;
              this.isTenant = false;
              for (let row1 of rowData) {
                let row: ContactInformationModel;
                row = <ContactInformationModel>row1;
                //console.log(row);
                var tmp = row.indexeddbID;
                if (this.rowIndexId == tmp) {
                  if (row.current_Respondent == 'Y') {
                    this.iscurrentRespondent = true;
                    if (row.contact_Type == "Tenant") {
                      this.isTenant = true;
                    }
                  }
                }
              };
            }
          },
          error => {
            console.log(error);
          }
        );

        //document.getElementsByClassName('ui-carousel-prev ui-button ui-widget ui-state-default ui-corner-all')[0].onclick = function () { return writeLED(1, 1) };
        //document.getElementsByClassName('ui-carousel-next ui-button ui-widget ui-state-default ui-corner-all')[0].onclick = function () { return writeLED(1, 1) };


      }

    }
  } // end of ngOnInit

  returnToCI(): void {
    if (this.dialog.openDialogs.length > 0) { //Prevent executing this function when an instance of mat dialog is open..
      return;
    }
    localStorage.removeItem('listOfGroupInterviewUnits');
    this.listOfUnits = null;
    this.tystrcId = null;
    this.tystrcsp = null;
    this.lokTystrcs = null;
    this.selectedAnswerElevator = null;
    this.selectedAnswerBedrooms = null;
    this.state.changeGrpIntrvwInProgressState('no');
    setFullScreen(false);
    this.router.navigateByUrl("/CI");
  }

  //New popups (Confirmation, Notification, Save-DontSave-Cancel etc...) to open Dialog body
  openDialog(popupData): Observable<any> {
    if (this.dialog.openDialogs.length == 0) { //Prevent opening this dialog when already a dialog is open, other doalog are triggered to open through shortcut keys or link clicks
      var dataPieces = popupData.split(';')
      const dialogConfig = new MatDialogConfig();
      dialogConfig.width = '25em';
      dialogConfig.data = { title: dataPieces[0], message: dataPieces[1], type: dataPieces[2] };
      dialogConfig.panelClass = 'dialog-class';
      const dialogRef = this.dialog.open(DialogBodyComponent, dialogConfig)
      dialogRef.disableClose = true;
      return dialogRef.afterClosed();
    }
  }

  toggleScreenSize(): void {
    toggleFullScreen();
  }

  checkState(i) {
    if (this.tystrcsp[i].trim() == '')
      this.selectedAnswerElevator[i] = '';
  }

  warn(i) {
    if (this.tystrcsp[i].length < 1 || this.tystrcsp[i].trim() == '') {
      document.getElementById("txtOthers" + i).style.borderColor = "#FF0000";
      document.getElementById("lblWarnTystrcSp" + i).innerHTML = 'Required';
      document.getElementById("txtOthers" + i).focus();
    } else {
      document.getElementById("txtOthers" + i).style.borderColor = "black";
      document.getElementById("lblWarnTystrcSp" + i).innerHTML = '';
    }
    document.getElementById("TystrDropdown" + i).addEventListener("click", function () {
      document.getElementById("TystrDropdown" + i).focus();
    });
  }

  noWarn(i) {
    if (this.tystrcsp[i].trim.length > 0 || this.tystrcsp[i].trim() !== '') {
      document.getElementById("txtOthers" + i).style.borderColor = "black";
      document.getElementById("lblWarnTystrcSp" + i).innerHTML = '';
    }
  }

  getTotalNumberRooms(i) {
    if (this.selectedAnswerBedrooms[i] < 0) {
      this.totalNumberofRooms[i] = "";
      this.selectedAnswerFullBathRooms[i] = -1;
      this.selectedAnswerHalfBathRooms[i] = -1;
      this.selectedAnswerOtherRooms[i] = -1;
    }
    else if (this.selectedAnswerBedrooms[i] >= 0 && this.selectedAnswerFullBathRooms[i] >= 0 && this.selectedAnswerHalfBathRooms[i] >= 0 && this.selectedAnswerOtherRooms[i] >= 0) {
      this.totalNumberofRooms[i] = (+this.selectedAnswerBedrooms[i] + +this.selectedAnswerFullBathRooms[i] + +this.selectedAnswerHalfBathRooms[i] + +this.selectedAnswerOtherRooms[i]).toString();

      if (Number(this.totalNumberofRooms[i]) == 0) {
        this.openDialog('Cannot Proceed;The total number of rooms cannot be zero.;Error').subscribe(result => {
          document.getElementById('ddlBedrooms[' + i + "]").focus();
        });
      }

      if (Number(this.totalNumberofRooms[i]) == 1 && this.selectedAnswerBedrooms[i] == 1) {
        this.openDialog('NUMBER OF ROOMS PROCEDURE;You have entered 1 Bedroom and 0 Other Rooms for a total of 1 Rooms. Please note that a studio or efficiency is considered to have zero bedrooms per the Housing Data Collection Manual.;Close').subscribe(result => {
          document.getElementById('ddlOtherRooms[' + i + ']').focus()
        });
      }

    }
    else if (this.selectedAnswerBedrooms[i] >= 0 && this.selectedAnswerFullBathRooms[i] >= 0 && this.selectedAnswerHalfBathRooms[i] >= 0 && this.selectedAnswerOtherRooms[i] < 0) {
      this.totalNumberofRooms[i] = (+this.selectedAnswerBedrooms[i] + +this.selectedAnswerFullBathRooms[i] + +this.selectedAnswerHalfBathRooms[i]).toString();
    }
    else if (this.selectedAnswerBedrooms[i] >= 0 && this.selectedAnswerFullBathRooms[i] >= 0 && this.selectedAnswerHalfBathRooms[i] < 0) {
      this.totalNumberofRooms[i] = (+this.selectedAnswerBedrooms[i] + +this.selectedAnswerFullBathRooms[i]).toString();
      this.selectedAnswerOtherRooms[i] = -1;
    }
    else if (this.selectedAnswerBedrooms[i] >= 0 && this.selectedAnswerFullBathRooms[i] < 0) {
      this.totalNumberofRooms[i] = (this.selectedAnswerBedrooms[i]).toString();
      this.selectedAnswerHalfBathRooms[i] = -1;
      this.selectedAnswerOtherRooms[i] = -1;
    }

  }

  OnBuiltDecadeChange(change, i) {
    this.builtYears[i] = [];
    if (change == "true") {
      this.selectedAnswerBuiltYear[i] = '-1';
      this.isYearBuiltValid[i] = false;
    }
    switch (this.selectedAnswerBuiltDecadeId[i]) {
      case '-1':
        //No data in database then the questionnaire should stop here.
        this.isYearBuiltValid[i] = false;
        break;
      case 'DK':
        //Both the dropdowns should turn into 'dont know' and disable the year.
        this.builtYears[i].push('Don\'t know');
        this.selectedAnswerBuiltYear[i] = this.builtYears[0];

        //pop a message to user to go ahead collect the information from somewhere available if the call is coming from a dropdown change
        if (change == "true")
          this.openDialog('DON\'T KNOW PROCEDURE;Before transmitting a unit with a \'\'Don’t know\'\', attempt to locate the year built using a tax assessor\’s or similar website. Looking up the exact year is not required when the decade was provided by the respondent. If the tax assessor\’s website has the year built information, do the following: enter a Field Message to Washington describing the situation such as \'\'Year Built obtained from Mayberry County property tax website.\'\';Close').subscribe(result => {
            //if (result == 1) {
            document.getElementById('drpDnYear[' + i + ']').focus();
          });
        this.isYearBuiltValid[i] = true;
        break;
      case '01':
        //Before 1900
        if (change == "true" || this.selectedAnswerBuiltYear[i] == '') {
          this.selectedAnswerBuiltYear[i] = '';
          document.getElementById('txtYear[' + i + ']').focus();
          this.isYearBuiltValid[i] = false;
        }
        break;
      case '02':
      case '03':
      case '04':
      case '05':
      case '06':
      case '07':
      case '08':
      case '09':
      case '10':
      case '11':
        this.builtYears[i].push('Don\'t know');
        var startYr = 1900 + (Number(this.selectedAnswerBuiltDecadeId[i]) - 2) * 10;
        for (let j = startYr; j < (startYr + 10); j++) {
          this.builtYears[i].push(j.toString());
        }
        if (change == "true") document.getElementById("drpDnYear[" + i + "]").focus();
        else if (this.selectedAnswerBuiltYear[i].trim().length == 0) {
          this.selectedAnswerBuiltYear[i] = '-1';
          this.isYearBuiltValid[i] = false;
        }
        else if (this.selectedAnswerBuiltYear[i].trim() == 'DK') this.selectedAnswerBuiltYear[i] = this.builtYears[i][0];
        break;
      case '12':
      case '13':
      case '14':
        //case '15':
        //case '16':
        //case '17':
        //case '18':
        //case '19':
        this.builtYears[i].push('Don\'t know');
        var startYr = 2000 + (Number(this.selectedAnswerBuiltDecadeId[i]) - 12) * 10;
        var endYr;
        if (this.selectedAnswerBuiltDecadeId[i] == '14') {  //For the current decade id
          endYr = new Date().getFullYear() + 1;
        } else endYr = startYr + 10;
        for (let j = startYr; j < endYr; j++) {
          this.builtYears[i].push(j.toString());
        }
        if (change == "true") document.getElementById("drpDnYear[" + i + "]").focus();
        else if (this.selectedAnswerBuiltYear[i].trim().length == 0) {
          this.selectedAnswerBuiltYear[i] = '-1';
          this.isYearBuiltValid[i] = false;
        }
        else if (this.selectedAnswerBuiltYear[i].trim() == 'DK') this.selectedAnswerBuiltYear[i] = this.builtYears[i][0];
        break;
      default:
        break;
    }
  }


  OnBuiltYearChange(i) {
    switch (this.selectedAnswerBuiltYear[i]) {
      case 'Don\'t know':
        //pop a message to user to go ahead collect the information from somewhere available
        if (this.dialog.openDialogs.length == 0)
          this.openDialog('DON\'T KNOW PROCEDURE;Before transmitting a unit with a \'\'Don’t know\'\', attempt to locate the year built using a tax assessor\’s or similar website. Looking up the exact year is not required when the decade was provided by the respondent. If the tax assessor\’s website has the year built information, do the following: enter a Field Message to Washington describing the situation such as \'\'Year Built obtained from Mayberry County property tax website.\'\';Close').subscribe(result => {
            document.getElementById('drpDnYear[' + i + ']').focus();
          });
        this.isYearBuiltValid[i] = true;
        break;
      case '-1':
        this.isYearBuiltValid[i] = false;
        break;
      default:
        this.isYearBuiltValid[i] = true;
        break;
    }
  }

  ValidateTxtYearInput(i) {
    this.isYearBuiltValid[i] = false;
    if ((this.selectedAnswerBuiltYear[i].length == 4 && Number(this.selectedAnswerBuiltYear[i]) < 1900 && Number(this.selectedAnswerBuiltYear[i]) > 1491) || (this.selectedAnswerBuiltYear[i].length == 2 && this.selectedAnswerBuiltYear[i] == 'DK')) { //either entered in the format YYYY or entered 'DK' or not entered at all.
      //validated and proceed to save the data
      this.OnBuiltYearBlur(i);
      this.isYearBuiltValid[i] = true;
    }
    else {
      //data entered for year inut text is incomplete or incorrect
      this.isYearBuiltValid[i] = false;
      if (this.selectedAnswerBuiltYear[i].length == 4) {
        this.openDialog('INCORRECT YEAR ENTERED;For the decade you have selected, year should be later than 1491 and earlier than 1900 or enter exactly DK if you don\'t know the year;Error').subscribe(result => {
          document.getElementById('txtYear[' + i + ']').focus();
        });
        this.selectedAnswerBuiltYear[i] = '';
      }
      else if (this.selectedAnswerBuiltYear[i].length != 0) {
        this.openDialog('INCORRECT YEAR FORMAT;Enter a year (later than 1491 and earlier than 1900) in the format YYYY or enter exactly DK if you don\'t know the year.;Error').subscribe(result => {
          document.getElementById('txtYear[' + i + ']').focus();
        });
        this.selectedAnswerBuiltYear[i] = '';
      }
    }
  }


  OnBuiltYearBlur(i) {
    //Save the data based on criteria that selectedAnswerBuiltYear != '-1' and selectedAnswerBuiltYear.length >= 4  (It should be something like '2020' or 'Don't know' or 'DK')
    if (this.selectedAnswerBuiltYear[i] != '-1' && (this.selectedAnswerBuiltYear[i].length >= 4 || this.selectedAnswerBuiltYear[i].length == 2)) {
      this.isYearBuiltValid[i] = true;
      //this.saveToSchedule2(); // later
    }
    else this.isYearBuiltValid[i] = false;
  }

  TextYearKeyDown(e, i) {
    var keyCode = [48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 68, 75];
    this.isYearBuiltValid[i] = false;
    switch (keyCode.indexOf(e.keyCode)) {
      case -1:
        e.preventDefault();
        break;
      default:
        //return true;
        break;
    }
  }

  TextYearKeyUp(e, i) {
    this.isYearBuiltValid[i] = false;
    if ((this.selectedAnswerBuiltYear[i].length == 4 && Number(this.selectedAnswerBuiltYear[i]) < 1900 && Number(this.selectedAnswerBuiltYear[i]) > 1491) || (this.selectedAnswerBuiltYear[i].length == 2 && this.selectedAnswerBuiltYear[i] == 'DK')) { //either entered in the format YYYY or entered 'DK' or not entered at all.
      //Give out the "Don't Know" procedure message on a popup
      if (this.selectedAnswerBuiltYear[i] == 'DK' && this.dialog.openDialogs.length == 0 && e.keyCode == 75)
        this.openDialog('DON\'T KNOW PROCEDURE;Before transmitting a unit with a \'\'Don’t know\'\', attempt to locate the year built using a tax assessor\’s or similar website. Looking up the exact year is not required when the decade was provided by the respondent. If the tax assessor\’s website has the year built information, do the following: enter a Field Message to Washington describing the situation such as \'\'Year Built obtained from Mayberry County property tax website.\'\';Close').subscribe(result => {
          document.getElementById('txtYear[' + i + ']').focus();
        });
      this.isYearBuiltValid[i] = true;
    }
  }

  OnMoveInDateChange() {
    //this.saveToSchedule1();
  }

  chosenYearHandler(normalizedYear: Moment, i) {
    if (this.date[i].value == null) {
      this.date[i].setValue(this.CurrentDate);
    }
    const ctrlValue = this.date[i].value;
    ctrlValue.year(normalizedYear.year());
    this.date[i].setValue(ctrlValue);
    this.selectedAnswerMoveInDate[i] = moment([normalizedYear.year(), ctrlValue.month(), 1]);//.format("YYYY/MM/DD"); 
  }

  chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>, i) {
    //if (this.date.value == null) {
    //  this.date.setValue(this.CurrentDate);
    //}
    const ctrlValue = this.date[i].value;
    ctrlValue.month(normalizedMonth.month());
    this.date[i].setValue(ctrlValue);
    this.selectedAnswerMoveInDate[i] = moment([normalizedMonth.year(), normalizedMonth.month(), 1]);
    datepicker.close();
  }

  // Open up the Update Respondent information modal form
  onUpdate() {
    this.service.initializeFormGroup();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "70%";
    var dialogConfig1 = this.dialog.open(RespondentComponent, dialogConfig);

    // Get Respondent Info
    dialogConfig1.afterClosed().subscribe(result => {
      this.getRespondentInfo();
    });

  }

  //Get Respondent Info where current_Respondent == 'Y', contact_Name is not blank and contact_Type is not blank)
  getRespondentInfo() {
    this.state.currentSelectedUnit.subscribe(x => this.stringVariable = x);
    this.selectedUnit = JSON.parse(this.stringVariable);

    //ayano_t 05/20/2021
    this.dbService.getAll('GetSchedulesContactInfoData').then(
      rowData => {
        if (rowData.length > 0) {
          this.iscurrentRespondent = false;
          this.isTenant = false;
          for (let row1 of rowData) {
            let row: ContactInformationModel;
            row = <ContactInformationModel>row1;
            //console.log(row);
            var tmp = row.indexeddbID;
            if (this.rowIndexId == tmp) {
              if (row.current_Respondent == 'Y') {
                this.iscurrentRespondent = true;
                if (row.contact_Type == "Tenant") {
                  this.isTenant = true;
                }
              }
            }
          };
        }
      },
      error => {
        console.log(error);
      }
    );

  }

  onTabChanged(evnt: any) {
    this.isTabVisible = evnt.index > 0 ? true : false;
    this.isContactInfoActive = this.isUnitInfoActive = this.isMessageActive = false;
    switch (evnt.index) {
      case 1:
        this.isContactInfoActive = true;
        break;
      case 2:
        this.isUnitInfoActive = true;
        break;
      case 3:
        this.isMessageActive = true;
        break;

      default:
        break;
    }

  }

  setTabVisibility() {
    this.isTabVisible = false;
    this.tabIndex = 0;
    this.tabRef.selectedIndex = 0;
  }

  getCurrentResp(isCurrResp: boolean) {
    this.iscurrentRespondent = isCurrResp;
  }

  getCurrRespContactType(isTenantCurrResp: boolean) {
    this.isTenant = isTenantCurrResp;
  }

  onKeyDown(event) {
    if (event.key === "Tab") {
      //var rightArrowButtonList = document.getElementsByClassName('ui-carousel-next');
      //this.surveyButtonReference.nativeElement.focus();

      if (this.leftArrow == null || this.leftArrow == undefined) {
        this.leftArrow = document.getElementsByClassName('ui-carousel-prev ui-button ui-widget ui-state-default ui-corner-all')[0];
        this.leftArrow.setAttribute("accessKey", "<");
        this.leftArrow.setAttribute("aria-label", "Click enter key to go to the next screen in collection");
        this.leftArrow.innerText = "Prev"
        //this.leftArrow.setAttribute('onclick', 'leftArrowClick()');
        //this.leftArrow.onclick = function () { return this.leftArrowClick() };
      }

      if (this.rightArrow == null || this.rightArrow == undefined) {
        this.rightArrow = document.getElementsByClassName('ui-carousel-next ui-button ui-widget ui-state-default ui-corner-all')[0];
        this.rightArrow.setAttribute("accessKey", ">");
        this.rightArrow.setAttribute("aria-label", "Click enter key to go to the previous screen in collection");
        this.rightArrow.innerText = "Next"
        //this.rightArrow.setAttribute('onclick', 'rightArrowClick()');
        //this.rightArrow.onclick = function () { return this.rightArrowClick() };
      }
    }
  }



  rightArrowClick() {
    this.openDialog('Clickety click;You clicked to go to the next screen in collection.;Notification');
  }
  leftArrowClick() {
    this.openDialog('Clickety click;You clicked to go to the previous screen in collection.;Notification');
  }

  //This triggers when the carousel left right arrows arrows are clicked.
  //This does not trigger on the first page.... theres a primeNG bug as mentioned at https://forum.primefaces.org/viewtopic.php?t=62956
  //If this.page is null or unefined then its the first page(0 based counting) 
  setPage(page) {

    //Here you can detect whether the next arrow or the previous arrow is clicked and handle appropriate functionality
    //if (this.page === undefined || this.page.page < page.page) { //Then next arrow is clicked
    //  this.openDialog('Clickety click;You clicked to go to the next screen in collection.;Notification');
    //}
    //else { //previous arrow is clicked
    //  this.openDialog('Clickety click;You clicked to go to the previous screen in collection.;Notification');
    //}

    //Whatever the page object is after the arrow cick, capture it in the local variable this.page object.
    this.page = page;
  }

  //Wherever the active page was last time before moving out of collection tab to any other tab,
  //on moving into the collection tab again, that page has to be loaded. If that page is undefined or null then its the first page
  getPage() {
    if(this.page !== null && this.page !== undefined)
      return this.page.page;
    return 0;
  }


  //caroselNext() {
  //  this.carouselVar.nextButton.click();
  //}

  //carouselPrevious() {
  //  this.carouselVar.prevButton.click();
  ////}

} // ending of the class


interface UserRole {
  userrole: string;
}

interface ContactInformationModel {
  //ayano_t 4/30/2021 
  ofouser: string;
  //ofO_USERID: string;
  //ofo_user_name: string;
  psuix: string;
  segid: string;
  lineid: any;
  collper: string;
  version: any;
  indexeddbID: string;
  indexeddbIDContact: string;
  // end of ayano_t

  contactId: string;
  contact_Name: string;
  contact_Type: string;
  primary_Occupant: any;
  previous_Respondant: string;
  last_ContactDate: string;
  current_Respondent: string;
  vacant: string;
  updateContactInfo?: string;
  alt_Phone: string;
  alt_Phone_Ext: string;
  alt_Phone_Refused: boolean;
  appartment: string;
  city: string;
  contact_Method: string;
  contact_Num: string;
  contact_Time: string;
  email: string;
  fgmaxversion: number;
  phone: string;
  phone_Ext: string;
  phone_Refused: boolean;
  schedule_Usage_Type: string;
  state: string;
  street_Name: string;
  street_Number: string;
  zipcode: string;
  isChecked: boolean;
}





