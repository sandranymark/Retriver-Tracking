import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import { TrainingSession } from '../../models/training.model';
import svLocale from '@fullcalendar/core/locales/sv';


@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, FullCalendarModule, FormsModule],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent {

  // Hantering av modaler
  selectedSession: TrainingSession | null = null;
  showAddTrainingModal = false;
  newTrainingTitle = "";
  newTrainingDetails = "";
  selectedDate = "";




  trainingSessions: TrainingSession[] = [
    { title: 'Vattenapportering', date: '2025-02-20', details: 'Övade apportering i sjö' },
    { title: 'Markeringsträning', date: '2025-02-22', details: 'Kastade dummy för markering' },
    { title: 'Dirigeringsträning', date: '2025-02-25', details: 'Övade signalstyrd dirigering' }
  ];

  recentSessions = [...this.trainingSessions].reverse().slice(0, 5);

  // Kalenderinställningar
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    selectable: true,
    longPressDelay: 0,
    eventLongPressDelay: 0,
    events: this.trainingSessions,
    contentHeight: 'auto',
    locale: svLocale,
    firstDay: 1,
    eventClick: this.handleEventClick.bind(this),
    dateClick: this.handleDateClick.bind(this)
  };


  handleEventClick(eventInfo: any) {
    this.selectedSession = {
      title: eventInfo.event.title,
      date: eventInfo.event.startStr,
      details: eventInfo.event.extendedProps['details']
    };
  }


  closeModal() {
    this.selectedSession = null;
  }


  handleDateClick(dateClickInfo: DateClickArg) {
    this.selectedDate = dateClickInfo.dateStr;
    this.showAddTrainingModal = true;
    this.newTrainingTitle = "";
    this.newTrainingDetails = "";
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

    this.trainingSessions = [...this.trainingSessions, newSession];
    this.recentSessions = [newSession, ...this.recentSessions].slice(0, 5);

    // Uppdatera kalendern
    this.calendarOptions = { ...this.calendarOptions, events: this.trainingSessions };

    this.closeAddTrainingModal();
  }
}
