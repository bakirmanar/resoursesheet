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
    from: string,
    to: string
}
interface day {
    year: number,
    date: number,
    month: string,
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

        this.loadMonth(curYear, curMonth);
        this.users = this.userS.getUsers();
        this.loads = this.workloadS.getWorkloads();
        this.projects = this.projectS.getProjects();

        this.putWorkloadsInDays();
        this.prepareDaysToShow();
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

    private putWorkloadsInDays(): void {
        let that = this;
        that.loads.forEach((load:workload) => {
            let fromMonth:string = load.from.substr(0,7),
                fromDay:number = Number.parseInt(load.from.substr(8,2)),
                toMonth:string = load.to.substr(0,7),
                toDay:number = Number.parseInt(load.to.substr(8,2));

            let fromMonthData = that.months[fromMonth];
            if (fromMonthData) {
                let last: number;

                if (fromMonth != toMonth){
                    last = fromMonthData.length;
                } else {
                    last = toDay;
                }

                for (let i = fromDay - 1; i < last; i++) {
                    if (!fromMonthData[i].workloads[load.userId]) {
                        fromMonthData[i].workloads[load.userId] = [];
                    }

                    fromMonthData[i].workloads[load.userId].push({
                        projectId: load.projectId
                    })
                }
                that.months[fromMonth] = fromMonthData;
            }
        })
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

    onScrollEnd() {
        if (!this.loadingOnEnd){
            let lastDay: day = this.daysToShow[this.daysToShow.length -1],
                lastDayMonth = Number.parseInt(lastDay.month),
                nextYear = lastDay.year,
                nextMonth = lastDayMonth + 1;

            if (nextMonth === 11) {
                nextMonth = 0;
                nextYear++;
            }

            this.loadMonth(nextYear, nextMonth);
            this.prepareDaysToShow();
            console.log(this.months);
        }
    }

    onScrollUp() {
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
            this.prepareDaysToShow();
            console.log(this.months);
        }
    }
}
