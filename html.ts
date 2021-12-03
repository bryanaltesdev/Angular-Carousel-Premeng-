<div class="container-fluid ci-interview-tab">
  <mat-tab-group #tabRef mat-align-tabs="center" class="w-100" (selectedTabChange)="onTabChanged($event);">
    <mat-tab>
      <ng-template mat-tab-label>
        Collection
      </ng-template>
    </mat-tab>
    <mat-tab>
      <ng-template mat-tab-label>
        Contact Information
      </ng-template>
      <app-contact-information *ngIf="isTabVisible" (btnBackChange)="setTabVisibility()" (currentRespondent)="getCurrentResp($event)" (currRespContactType)="getCurrRespContactType($event)"></app-contact-information>
    </mat-tab>
    <mat-tab>
      <ng-template mat-tab-label>
        Unit Information
      </ng-template>
      <app-unit-information *ngIf="isTabVisible" (btnBackChange)="setTabVisibility()"></app-unit-information>
    </mat-tab>
    <mat-tab>
      <ng-template mat-tab-label>
        Messages
      </ng-template>
      <app-messages *ngIf="isTabVisible" (btnBackChange)="setTabVisibility()"></app-messages>
    </mat-tab>
  </mat-tab-group>
</div>

<section class="container-fluid">
  <ng-container *ngIf="!isTabVisible">

    <p-carousel widgetVar="carouselVar" [value]="questions" [numVisible]="1" [numScroll]="1" [circular]="false" [responsiveOptions]="responsiveOptions"
                (onPage)="setPage($event)" [page] ="getPage()">
      <ng-template let-question pTemplate="item">
        <!--<div>
          <button #moveNext name="" (keydown)="onKeyDown($event)">LeftArrow</button>
        </div>-->
        <div class="question-item">
          <div class="question-item-content">
            <div>
              <h6 style="text-align:center;font-weight:bold;" class="p-mb-1">{{question.sentence}}</h6>
              <!-- #region Respondent Information for the group.-->
              <div *ngIf="question.control == 'respondentInfoForGroup'" id="dvRespondentInfo" class="odd" style="text-align:center; height:30rem;">
                <button id="conBtn" mat-raised-button class="btn-primary" style="font-weight:bold;font-size:larger;height:50px;width:420px;" (click)="onUpdate()">
                  Click to enter or update Respondent Information
                </button>
              </div>
              <!-- #endregion -->
              <!-- #region Questions -->
              <ng-container *ngIf="question.control != 'respondentInfoForGroup' && question.control != 'wrapUpScreen'">
                <div id="dvUnit" class="row" *ngFor="let unit of listOfUnits;let i=index;let o= odd; let e=even;" [ngStyle]="{'height': unitHeight+'rem'}" [ngClass]="{ odd: o, even: e }">
                  <div class="col-md-2">{{i+1}}). {{unit.address.split(',')[0]}}: </div>

                  <!-- #region Below controls will load according to the questions' control property -->
                  <!--**********************************************Type of Structure*****************************************************************-->
                  <div class="col-md-10" *ngIf="question.control == 'TystrDropdown'">
                    <div style="float:left; margin-right: 4em;">
                      <label for="TystrDropdown{{i}}" class="visuallyhidden">Select type of structure for unit{{i+1}} {{unit.address.split(',')[0]}}</label>
                      <select id="TystrDropdown{{i}}" style="font-weight:bold;font-size:larger" [(ngModel)]="tystrcId[i]" class="igSelect">
                        typstrcDesc
                        <option *ngFor="let lokTystrc of lokTystrcs" value={{lokTystrc.tystrc}}>
                          {{lokTystrc.typstrcDesc}}
                        </option>
                      </select>
                    </div>
                    <div style="float:left; margin-right:1em;" *ngIf="tystrcId[i] == 6"><label for="txtOthers{{i}}">Specify Structure Type:</label></div>
                    <div style="float:left;" *ngIf="tystrcId[i] == 6">
                      <input type="text" id="txtOthers{{i}}" [(ngModel)]="tystrcsp[i]" style="font-weight:bold;font-size:larger;height:40px" maxlength="64"
                             (input)="checkState(i)" (keyup)="noWarn(i)" (focusout)="warn(i);" class="igSelect" />
                      <!--<span class="req" role="alert" id="lblWarnTystrcSp{{i}}"></span>-->
                      &nbsp;<label role="alert" id="lblWarnTystrcSp{{i}}" style="color:red;"></label>
                    </div>
                  </div>


                  <!--**********************************************Elevator*****************************************************************-->
                  <div class="col-md-10" *ngIf="question.control == 'radAnswerElevator' && tystrcId[i] > 3">
                    <!--&& tystrcId[i] > 3-->
                    <label for="elevatorRdBtnGrp{{i}}" class="visuallyhidden">Does the unit{{i+1}} with address {{unit.address.split(',')[0]}} have an elevator?</label>
                    <mat-radio-group class="ans-radio-group" id="elevatorRdBtnGrp{{i}}" [(ngModel)]="selectedAnswerElevator[i]">
                      <mat-radio-button class="ans-radio-button" name="radAnswerElevator{{i}}" *ngFor="let answer of answers" [value]="answer.key" [disabled]="tystrcsp[i].length < 1 && tystrcId[i]==6 || tystrcId[i]==6 && tystrcsp[i].trim()==''">
                        {{ answer.value }}
                      </mat-radio-button>
                    </mat-radio-group>
                  </div>

                  <!--**********************************************Number of rooms*****************************************************************-->
                  <div class="col-md-10 row" *ngIf="question.control == 'numberOfRooms'">
                    <div style="float:left;margin-right:2em;">
                      <label for="ddlBedrooms{{i}}" class="visuallyhidden">
                        <span class="label label-default">Bedrooms</span>
                      </label>
                      <select id="ddlBedrooms{{i}}" style="font-weight:bold;font-size:larger;"
                              [(ngModel)]="selectedAnswerBedrooms[i]" (change)="getTotalNumberRooms(i)" class="igSelect">
                        <!--(blur)=""-->
                        <option [value]="-1">Bedrooms</option>
                        <option *ngFor="let lokNoOfRoom of lokNoOfRooms" value={{lokNoOfRoom.noOfRooms}}>
                          {{lokNoOfRoom.noOfRooms}}
                        </option>
                      </select>
                    </div>
                    <div style="float:left;margin-right:2em;">
                      <label for="ddlFullBaths{{i}}" class="visuallyhidden">
                        <span class="label label-default">Full Baths</span>
                      </label>
                      <select id="ddlFullBaths{{i}}" style="font-weight:bold;font-size:larger;"
                              [(ngModel)]="selectedAnswerFullBathRooms[i]" [disabled]="selectedAnswerBedrooms[i]< 0 || selectedAnswerBedrooms[i] =='' || selectedAnswerBedrooms[i] ==' '"
                              (change)="getTotalNumberRooms(i)" class="igSelect">
                        <!--(blur)=""-->
                        <option [value]="-1">Full Baths</option>
                        <option *ngFor="let lokNoOfRoom of lokNoOfRooms" value={{lokNoOfRoom.noOfRooms}}>
                          {{lokNoOfRoom.noOfRooms}}
                        </option>
                      </select>
                    </div>
                    <div style="float:left;margin-right:2em;">
                      <label for="ddlHalfBaths{{i}}" class="visuallyhidden">
                        <span class="label label-default">Half Baths</span>
                      </label>
                      <select id="ddlHalfBaths{{i}}" style="font-weight:bold;font-size:larger;"
                              [(ngModel)]="selectedAnswerHalfBathRooms[i]" [disabled]="selectedAnswerFullBathRooms[i] < 0 || selectedAnswerFullBathRooms[i] =='' || selectedAnswerFullBathRooms[i] ==' '"
                              (change)="getTotalNumberRooms(i)" class="igSelect">
                        <!--(blur)=""-->
                        <option [value]="-1">Half Baths</option>
                        <option *ngFor="let lokNoOfRoom of lokNoOfRooms" value={{lokNoOfRoom.noOfRooms}}>
                          {{lokNoOfRoom.noOfRooms}}
                        </option>
                      </select>
                    </div>
                    <div style="float:left;margin-right:2em;">
                      <label for="ddlOtherRooms{{i}}" class="visuallyhidden">
                        <span class="label label-default">Other Rooms</span>
                      </label>
                      <select id="ddlOtherRooms{{i}}" style="font-weight:bold;font-size:larger;"
                              [(ngModel)]="selectedAnswerOtherRooms[i]" [disabled]="selectedAnswerHalfBathRooms[i] < 0 || selectedAnswerHalfBathRooms[i] =='' || selectedAnswerHalfBathRooms[i] ==' '"
                              (change)=" getTotalNumberRooms(i)" class="igSelect">
                        <!--(blur)=""-->
                        <option [value]="-1">Other Rooms</option>
                        <option *ngFor="let lokNoOfRoom of lokNoOfRooms" value={{lokNoOfRoom.noOfRooms}}>
                          {{lokNoOfRoom.noOfRooms}}
                        </option>
                      </select>
                    </div>
                    <div style="float:left;">
                      <span class="label label-default" style="font-weight:bold;font-size:larger" tabindex="0">Total Rooms:&nbsp;</span>
                      <span class="label label-default" style="font-weight:bold;font-size:larger"
                            tabindex="0">{{totalNumberofRooms[i]}}</span>
                    </div>
                  </div>


                  <!--**********************************************When Built*****************************************************************-->
                  <div class="col-md-10 row" *ngIf="question.control == 'whenBuilt'">
                    <div style="float:left;margin-right:2em;">
                      <label for="drpDnDecade[i]" class="visuallyhidden">Select Decade</label>
                      <select id="drpDnDecade[i]" style="font-weight:bold;font-size:larger" [(ngModel)]="selectedAnswerBuiltDecadeId[i]" class="igSelect"
                              (change)="OnBuiltDecadeChange('true',i)">
                        <!--(blur)="OnBuiltDecadeBlur(i)"-->
                        <option [value]="-1">Select Decade</option>
                        <option *ngFor="let builtDecade of lokBuiltDecades" value={{builtDecade.decade}}>
                          {{builtDecade.decadeDesc}}
                        </option>
                      </select>
                    </div>
                    <div style="float:left;">
                      <label for="drpDnYear[i]" class="visuallyhidden">Select Year</label>
                      <select id="drpDnYear[i]" style="font-weight:bold;font-size:larger" [(ngModel)]="selectedAnswerBuiltYear[i]"
                              (change)="OnBuiltYearChange(i)" (blur)="OnBuiltYearBlur(i)" [hidden]="selectedAnswerBuiltDecadeId[i] == '01'" class="igSelect">
                        <option [value]="-1" selected="selected">Select Year--</option>
                        <option *ngFor="let year of builtYears[i]" value={{year}}>
                          {{year}}
                        </option>
                      </select>
                      <input type="text" id="txtYear[i]" style="font-weight:bold;font-size:larger; width:7.44em;line-height: normal;" class="igSelect"
                             placeholder="--Year--" [(ngModel)]="selectedAnswerBuiltYear[i]" (keypress)="TextYearKeyDown($event,i)" (keyup)="TextYearKeyUp($event,i)"
                             maxlength="4" (blur)="ValidateTxtYearInput(i)" [hidden]="selectedAnswerBuiltDecadeId[i] != '01'" />
                      <label for="txtYear[i]"><span [hidden]="selectedAnswerBuiltDecadeId[i] != '01'" style="padding-left: 0.3em">For Don’t Know please enter DK</span></label>
                    </div>
                    <div style="float:left; margin-left:1em" *ngIf="isYearBuiltValid[i]">
                      <mat-icon style="color: forestgreen !important" class="material-icons-round icon-image-preview">check_circle</mat-icon>
                    </div>
                  </div>



                  <!--**********************************************Movein Date*****************************************************************-->
                  <div class="row" role="group" *ngIf="question.control == 'longestMoveIn'">
                    <!--*ngIf--> <!--*ngIf="iscurrentRespondent"-->
                    <label for="txtMoveInDate[i]" class="visuallyhidden">Enter movein date for this unit in MM/YYYY format either manually or using calendar control</label>
                    <input type="text" name="moveInDate{{i}}" id="txtMoveInDate[i]"
                           [matDatepicker]="datePicker" [min]="minDate" [max]="maxDate" [formControl]="date[i]"
                           [(ngModel)]="selectedAnswerMoveInDate[i]" maxlength="7" placeholder="MM/YYYY"
                           style="font-weight:bold;font-size:larger; width:6.8em; height:2em;" readonly class="igSelect">
                    <mat-datepicker-toggle matSuffix [for]="datePicker"></mat-datepicker-toggle>
                    <mat-datepicker #datePicker startView="multi-year" (yearSelected)="chosenYearHandler($event,i)"
                                    (monthSelected)="chosenMonthHandler($event, datePicker,i)" panelClass="datepickerFont"
                                    (closed)="OnMoveInDateChange(i)">
                    </mat-datepicker>
                  </div>






                  <!-- #endregion -->
                </div>
              </ng-container>
              <!-- #endregion -->
              <!-- #region Wrap up screen for the group.-->
              <div *ngIf="question.control == 'wrapUpScreen'" id="dvWrapUpScreen" class="odd" style="text-align:center; height:30rem;">

              </div>
              <!-- #endregion -->
            </div>
          </div>
        </div>
      </ng-template>
    </p-carousel>
    <!--<p:commandButton value="next" type="button" onclick="caroselNext();" />
    <p:commandButton value="prev" type="button" onclick="carouselPrevious();" />-->
  </ng-container>
</section>