import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import * as moment from 'moment';
import * as _ from 'lodash';

import {CalendarService} from '../services/calendar.service';
import {UserService} from '../services/user.service';
import {WorkloadService} from "../services/workload.service";
import {ProjectService} from "../services/project.service";

interface project {
    id: string,
    name: string,
    color: string,
    shortName: string
}
interface user {
    name: string,
    id: string
}
interface workload {
    id: string,
    userId: string,
    projectId: string,
    hours: number,
    from: string,
    to: string
}
interface day {
    year: number,
    date: number,
    month: string,
    monthName: string,
    day: string,
    dayName: string,
    workloads: object[]
}

@Component({
    selector: 'calendar',
    templateUrl: './calendar.html',
    styleUrls: ['./calendar.css'],
    encapsulation: ViewEncapsulation.None
})

export class calendarComponent {
    daysToShow: day[] = [];
    months: object = {};
    projObj: object = {};
    users: user[];
    loads: workload[];
    projects: project[];
    calendarBody;
    loadingOnEnd: boolean;
    loadingOnStart: boolean;

    constructor(private calendarS: CalendarService, private userS: UserService,
                private workloadS: WorkloadService, private projectS: ProjectService) {
        this.calendarBody = document.getElementsByClassName("calendar-body");
    }

    ngOnInit(): void {
        let curYear: number = moment().year(),
            curMonth: number = moment().month();

        this.users = this.userS.getUsers();
        this.loads = this.workloadS.getWorkloads();
        this.projects = this.projectS.getProjects();
        this.loadMonth(curYear, curMonth);

        this.projObj = this.projectsToObject();

        console.log("MOTHS AFTER FORMAT", this.months);
        console.log("USERS", this.users);
        console.log("WORKLOADS", this.loads);
        console.log("PROJECTS", this.projects);
        console.log("DAYS TO SHOW", this.daysToShow);
    }

    private loadMonth(year:number, month:number): void {
        let monthStr = year + '/' + this.calendarS.zeroBased(month + 1);
        this.months[monthStr] = this.calendarS.getDaysArray(year, month);
        this.putWorkloads(monthStr);
        this.prepareDaysToShow();
    }

    private projectsToObject(): object {
        let that = this,
            result = {};
        that.projects.forEach((item: project) => {
           if (item.id) {
               result[item.id] = item;
           }
        });

        return result;
    }

    private putWorkloads(monthStr:string): void {
        let that = this;
        that.loads.forEach((load:workload) => {
            let fromMonth:string = load.from.substr(0,7),
                fromDay:number = Number.parseInt(load.from.substr(8,2)),
                toMonth:string = load.to.substr(0,7),
                toDay:number = Number.parseInt(load.to.substr(8,2));

            if (this.isMonthBetween(monthStr, fromMonth, toMonth)) {
                this.putWorkloadsInMonth(load, monthStr);
            }
        })
    }

    private isMonthBetween(month:string, from:string, to:string):boolean {
        /**
         * month, from, to are strings in 'yyyy/mm' format, for example '2017/09'
         */
        let monthArr = month.split('/'),
            fromArr = from.split('/'),
            toArr = to.split('/'),
            isFrom = false,
            isBetween = false;

        if (monthArr[0] > fromArr[0]) {
            isFrom = true;
        } else if (monthArr[0] == fromArr[0]) {
            if (monthArr[1] >= fromArr[1]) {
                isFrom = true;
            }
        }
        if (isFrom) {
            if (monthArr[0] < toArr[0]) {
                isBetween = true;
            } else if (monthArr[0] == toArr[0]) {
                if (monthArr[1] <= toArr[1]) {
                    isBetween = true;
                }
            }
        }
        return isBetween;
    }

    private putWorkloadsInMonth(load:workload, targetMonth: string) {
        let targetMonthData = this.months[targetMonth],
            start: number = this.getStartDay(load.from, targetMonth),
            end: number = this.getEndDay(load.to, targetMonth);

        for (let i = start - 1; i < end; i++) {
            if (!targetMonthData[i].workloads[load.userId]) {
                targetMonthData[i].workloads[load.userId] = [];
            }

            targetMonthData[i].workloads[load.userId].push({
                projectId: load.projectId,
                hours: load.hours
            })
        }
        this.months[targetMonth] = targetMonthData;
    }

    private getStartDay(fromStr:string, targetStr:string):number {
        let fromYear:string = fromStr.substr(0,4),
            fromMonth:string = fromStr.substr(5,2),
            fromDay:number = Number.parseInt(fromStr.substr(8,2)),
            targetYear:string = targetStr.substr(0,4),
            targetMonth:string = targetStr.substr(5,2);

        return (targetYear > fromYear || targetMonth > fromMonth) ? 1 : fromDay;
    }

    private getEndDay(toStr:string, targetStr:string):number {
        let toYear:string = toStr.substr(0,4),
            toMonth:string = toStr.substr(5,2),
            toDay:number = Number.parseInt(toStr.substr(8,2)),
            targetYear:string = targetStr.substr(0,4),
            targetMonth:string = targetStr.substr(5,2);

        return (targetYear < toYear || targetMonth < toMonth) ? this.months[targetStr].length : toDay;
    }

    private prepareDaysToShow(): void {
        let that = this,
            keys = _.keys(this.months).sort(),
            result = [];

        keys.forEach((item) => {
            result = result.concat(that.months[item]);
        });

        this.daysToShow =  result;
    }

    loadNextMonth() {
        if (!this.loadingOnEnd){
            let lastDay: day = this.daysToShow[this.daysToShow.length -1],
                lastDayMonth = Number.parseInt(lastDay.month),
                loadYear = lastDay.year,
                loadMonth = lastDayMonth + 1;

            if (loadMonth === 11) {
                loadMonth = 0;
                loadYear++;
            }

            this.loadMonth(loadYear, loadMonth);
            console.log(this.months);
        }
    }

    loadPrevMonth() {
        if (!this.loadingOnStart) {
            let lastDay: day = this.daysToShow[0],
                lastDayMonth = Number.parseInt(lastDay.month),
                loadYear = lastDay.year,
                loadMonth = lastDayMonth - 1;

            if (loadMonth === 0) {
                loadMonth = 11;
                loadYear--;
            }

            this.loadMonth(loadYear, loadMonth);
            console.log(this.months);
        }
    }
}
