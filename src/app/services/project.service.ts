import {Injectable} from '@angular/core';

import {StorageService} from './storage.service';

interface project {
    id: string,
    name: string,
    color: string,
    shortName: string
}

@Injectable()
export class ProjectService {
    projects: project[];

    getProjects(): project[] {
        if (!this.projects) {
            this.projects = StorageService.get('projects') || [];
        }
        return this.projects;
    }

    addProject(proj: project): void {
        this.projects.push(proj);
        StorageService.set('projects', this.projects)
    }

    saveProject(proj: project): void {
        let index: number = this.getById(proj.id);

        if (index !== -1) {
            this.projects[index] = Object.assign({}, proj);
        }
        StorageService.set('projects', this.projects)
    }

    deleteProject(id: string): void {
        let index: number = this.getById(id);

        if (index !== -1) {
            this.projects.splice(index, 1);
        }
        StorageService.set('projects', this.projects)
    }

    getById(id: string): number {
        let res: number = -1;

        this.projects.some((item: project, i) => {
            if (item.id === id) {
                res = i;
                return true;
            }

            return false
        });

        return res;
    }
}
