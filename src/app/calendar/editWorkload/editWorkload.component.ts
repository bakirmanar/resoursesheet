import {Component, OnInit, Inject, Output, EventEmitter} from '@angular/core';
import {MdDialog, MdDialogRef, MD_DIALOG_DATA} from '@angular/material';
import * as moment from 'moment';

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

@Component({
    selector: 'editWorkloadDialog',
    templateUrl: 'editWorkloadDialog.html',
})
export class editWorkloadDialog {
    projects: project[];
    load: workload;
    loadTo: any;
    loadFrom: any;
    userName: string;

    constructor(public dialogRef: MdDialogRef<editWorkloadDialog>, @Inject(MD_DIALOG_DATA) public data: any,
                private userS: UserService, private workloadS: WorkloadService, private projectS: ProjectService,) {

    }

    ngOnInit(): void {
        this.initWorkload();
        this.userName = this.userS.getById(this.load.userId).name;
        this.projects = this.projectS.getProjects();
    }

    saveWorkload(): void {
        if (this.load.projectId && this.load.userId && this.loadFrom && this.loadTo && this.load.hours) {
            this.load.from = moment(this.loadFrom).format('YYYY/MM/DD');
            this.load.to = moment(this.loadTo).format('YYYY/MM/DD');
            this.workloadS.saveWorkload(this.load);
            this.dialogRef.close({
                load: this.load
            });
        }
    }

    deleteWorkload(): void {
        this.workloadS.deleteWorkload(this.load.id);
        this.dialogRef.close({
            load: this.load,
            isDeleted: true
        });
    }

    private initWorkload(): void {
        this.load = Object.assign({}, this.data.load);
        this.loadFrom = moment(this.load.from).toDate();
        this.loadTo = moment(this.load.to).toDate();
    }
}
