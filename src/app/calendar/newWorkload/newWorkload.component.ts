import {Component, OnInit, Inject, Output, EventEmitter} from '@angular/core';
import {MdDialog, MdDialogRef, MD_DIALOG_DATA} from '@angular/material';
import * as moment from 'moment';
import * as _ from 'lodash';

import {CalendarService} from '../../services/calendar.service';
import {UserService} from '../../services/user.service';
import {WorkloadService} from "../../services/workload.service";
import {ProjectService} from "../../services/project.service";

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
    selector: 'newWorkload',
    templateUrl: './newWorkload.html',
    styleUrls: ['./newWorkload.css']
})

export class newWorkloadComponent {

    @Output() onAdded = new EventEmitter<workload>();

    constructor(public dialog: MdDialog) {
    }

    ngOnInit(): void {

    }

    openDialog() {
        const dialogRef = this.dialog.open(newWorkloadDialog, {});

        dialogRef.afterClosed().subscribe((load:workload) => {
            if (load) {
                this.onAdded.emit(load);
            }
        });
    }
}

@Component({
    selector: 'newWorkloadDialog',
    templateUrl: 'newWorkloadDialog.html',
})
export class newWorkloadDialog {
    users: user[];
    projects: project[];
    newWorkload: workload;

    constructor(public dialogRef: MdDialogRef<newWorkloadDialog>, @Inject(MD_DIALOG_DATA) public data: any,
                private calendarS: CalendarService, private userS: UserService,
                private workloadS: WorkloadService, private projectS: ProjectService,) {
    }

    ngOnInit(): void {
        this.resetWorkload();
        this.users = this.userS.getUsers();
        this.projects = this.projectS.getProjects();
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    private resetWorkload(): void {
        this.newWorkload = {
            id: "",
            userId: "",
            projectId: "",
            hours: 0,
            from: "",
            to: ""
        };
    }

    saveNewWorkload(): void {
        if (this.newWorkload.projectId && this.newWorkload.userId
            && this.newWorkload.from && this.newWorkload.from
            && this.newWorkload.hours) {

            let newLoad: workload = Object.assign({}, this.newWorkload);
            newLoad.id = "wl" + moment.now();
            newLoad.from = moment(newLoad.from).format('YYYY/MM/DD');
            newLoad.to = moment(newLoad.to).format('YYYY/MM/DD');
            this.workloadS.addWorkload(newLoad);
            this.resetWorkload();
            this.dialogRef.close(newLoad);
        }
    }
}
