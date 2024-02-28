import { Duration } from "../../lib/duration";
import { Calendar } from "./calendar";

export class StandardCalendar implements Calendar {
  constructor(
    private readonly weekend: number[] = [0, 6],
    private readonly start: [number, number] = [9, 30],
    private readonly end: [number, number] = [18, 0],
    private readonly startRest: [number, number] = [13, 30],
    private readonly endRest: [number, number] = [14, 0]
  ) {}

  forward(start: Date | number | string, duration: Duration): Date {
    const date = new Date(start);
    const days = duration.getDays() + duration.getWeeks() * 5;
    for (let i = 0; i < days; i++) {
      date.setDate(date.getDate() + 1);
      while (this.weekend.includes(date.getDay())) {
        date.setDate(date.getDate() + 1);
      }
    }

    const minutes = duration.getMinutes() + duration.getHours() * 60;
    for (let i = 0; i < minutes; i++) {
      date.setMinutes(date.getMinutes() + 1);
      if (
        date.getHours() === this.end[0] &&
        date.getMinutes() === this.end[1]
      ) {
        date.setDate(date.getDate() + 1);
        date.setHours(this.start[0], this.start[1]);
      }

      if (
        date.getHours() === this.startRest[0] &&
        date.getMinutes() === this.startRest[1]
      ) {
        date.setHours(this.endRest[0], this.endRest[1]);
      }

      while (this.weekend.includes(date.getDay())) {
        date.setDate(date.getDate() + 1);
      }
    }
    return date;
  }
}
