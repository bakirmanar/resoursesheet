import {Component, OnInit, ViewEncapsulation, DoCheck } from '@angular/core';
import * as _ from 'lodash';
import * as moment from 'moment';


import {ProjectService} from "../services/project.service";

interface project {
    id: string,
    name: string,
    color: string,
    shortName: string
}

@Component({
    selector: 'projects',
    templateUrl: './projects.html',
    styleUrls: ['./projects.css'],
    encapsulation: ViewEncapsulation.None
})

export class projectComponent implements DoCheck{
    projects: project[];
    editMode: boolean;
    editingProject: project;

    constructor (private projectS: ProjectService) {

    }

    ngOnInit(): void {

    }

    ngDoCheck(): void {
        this.projects = this.projectS.getProjects();
        this.sortProjects();
    }

    sortProjects(): void {
        this.projects = _.sortBy(this.projects, (proj: project) => {
            return proj.name;
        });
    }

    editProject(index: number): void {
        let project = this.projects[index];
        if (project) {
            this.editMode = true;
            this.editingProject = Object.assign({}, project);
        }
    }

    cancelEdit(): void {
        this.editMode = false;
        this.editingProject = null;
    }

    saveProject(proj: project): void {
        this.projectS.saveProject(proj);
        this.cancelEdit();
    }

    deleteProject(id: string): void {
        this.projectS.deleteProject(id);
        this.cancelEdit();
    }

    addProject(): void {
        let emptyProject: project = {
            id: "pr" + moment.now(),
            name: "New project",
            color: "#f1f1f1",
            shortName: ""
        };

        this.projectS.addProject(emptyProject);
    }
}
