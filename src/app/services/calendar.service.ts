import {Injectable} from '@angular/core';
import * as moment from 'moment';

@Injectable()
export class CalendarService {
    loadedMonths: object = {};

    getDaysArray(year, month): object[] {
        let days: object[] = [];
        let date = moment(new Date(year, month, 1));

        while (date.month() == month) {
            let day = date.date();
            days.push({
                year: date.year(),
                date: this.zeroBased(day),
                month: this.zeroBased(month),
                monthName: date.format('MMM'),
                day: date.day(),
                dayName: date.format('ddd'),
                workloads: []
            });
            date.date(day + 1);
        }

        this.loadedMonths[year + '/' + month] = days;

        return days;
    }

    zeroBased(num: number): string {
        return num < 10 ? "0" + num.toString() : num.toString();
    }
}
