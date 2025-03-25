import { Component, Input, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import { TrainingSession } from '../../models/training.model';
import svLocale from '@fullcalendar/core/locales/sv';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TrainingModalComponent } from '../training-modal/training-modal.component';
import { Dog } from '../../models/dog.model';


@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, FullCalendarModule, FormsModule, MatDialogModule],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})

export class CalendarComponent {

  @Input() recentSessions: TrainingSession[] = [];
  @Input() dogs: Dog[] = [];
  @Input() selectedDogId: string = '';

  selectedSession: TrainingSession | null = null;
  showAddTrainingModal = false;
  newTrainingTitle = "";
  newTrainingDetails = "";
  selectedDate = "";


  // Kalenderinställningar
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    selectable: true,
    longPressDelay: 0,
    eventLongPressDelay: 0,
    events: this.recentSessions,
    contentHeight: 'auto',
    locale: svLocale,
    firstDay: 1,
    eventClick: this.handleEventClick.bind(this),
    dateClick: this.handleDateClick.bind(this)
  };

  constructor(private dialog: MatDialog) { }


  ngOnChanges(changes: SimpleChanges) {
    if (changes['recentSessions']) {
      this.calendarOptions = {
        ...this.calendarOptions,
        events: this.recentSessions.map(session => ({
          title: session.title,
          start: session.date,
          extendedProps: { details: session.details, dogName: session.dogName }
        }))
      };
    }
  }


  handleEventClick(eventInfo: any) {
    this.selectedSession = {
      title: eventInfo.event.title,
      date: eventInfo.event.startStr,
      details: eventInfo.event.extendedProps['details'],
      dogName: eventInfo.event.extendedProps['dogName']
    };
  }

  closeModal() {
    this.selectedSession = null;
  }


  handleDateClick(dateClickInfo: DateClickArg) {
    const selectedDate = dateClickInfo.date;

    const dialogRef = this.dialog.open(TrainingModalComponent, {
      width: '600px',
      data: {
        date: selectedDate,
        dogs: this.dogs,
        dogId: this.selectedDogId
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Träningspass sparat via kalender:', result);
      }
    });
  }


  closeAddTrainingModal() {
    this.showAddTrainingModal = false;
  }

  addTraining() {
    if (!this.newTrainingTitle || !this.newTrainingDetails) {
      alert("Fyll i både titel och beskrivning!");
      return;
    }

    const newSession: TrainingSession = {
      title: this.newTrainingTitle,
      date: this.selectedDate,
      details: this.newTrainingDetails
    };


    this.recentSessions = [newSession, ...this.recentSessions].slice(0, 5);
    this.ngOnChanges({ recentSessions: { currentValue: this.recentSessions, previousValue: [], firstChange: false, isFirstChange: () => false } });
    this.closeAddTrainingModal();
  }

}

