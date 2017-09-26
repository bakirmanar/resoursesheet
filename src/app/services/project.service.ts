import {Injectable} from '@angular/core';

interface project {
    id: string,
    name: string,
    color: string,
    shortName: string
}

@Injectable()
export class ProjectService {
    projects: project[] = [
        {
            id: "p1",
            name: "YayFon",
            color: "#aad",
            shortName: "YF"
        },
        {
            id: "p2",
            name: "NorthStar",
            color: "#fdd",
            shortName: "NS"
        },
        {
            id: "p3",
            name: "Bazilinga",
            color: "#cad",
            shortName: "BZ"
        },
        {
            id: "p4",
            name: "Fuse",
            color: "#ada",
            shortName: "FU"
        },
        {
            id: "p5",
            name: "ServUp",
            color: "#faa",
            shortName: "SU"
        }
    ];

    getProjects(): project[] {
        return this.projects;
    }

    addProject(proj: project): void {
        this.projects.push(proj);
    }

    saveProject(proj: project): void {
        let index: number = this.getById(proj.id);

        if (index !== -1) {
            this.projects[index] = Object.assign({}, proj);
        }
    }

    deleteProject(id: string): void {
        let index: number = this.getById(id);

        if (index !== -1) {
            this.projects.splice(index, 1);
        }
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
