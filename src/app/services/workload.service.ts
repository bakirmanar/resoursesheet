import {Injectable} from '@angular/core';
import * as moment from 'moment';

interface workload {
    id: string,
    userId: string,
    hours: number,
    projectId: string,
    from: string,
    to: string
}

@Injectable()
export class WorkloadService {
    private loads: workload[] = [
        {
            id: "wl1",
            userId: "us1",
            projectId: "p1",
            hours: 8,
            from: "2017/09/12",
            to: "2017/09/18"
        },
        {
            id: "wl2",
            userId: "us2",
            projectId: "p1",
            hours: 4,
            from: "2017/09/12",
            to: "2017/09/18"
        },
        {
            id: "wl3",
            userId: "us2",
            projectId: "p2",
            hours: 2,
            from: "2017/08/01",
            to: "2017/10/05"
        },
        {
            id: "wl4",
            userId: "us2",
            projectId: "p3",
            hours: 2,
            from: "2017/09/01",
            to: "2017/10/05"
        },
        {
            id: "wl5",
            userId: "us3",
            projectId: "p4",
            hours: 8,
            from: "2017/09/01",
            to: "2017/10/05"
        },
        {
            id: "wl6",
            userId: "us4",
            projectId: "p5",
            hours: 8,
            from: "2017/09/01",
            to: "2017/10/05"
        }
    ];

    getWorkloads(): workload[] {
        return this.loads;
    }

    addWorkload(load: workload): void {
        this.loads.push(load);
    }

    saveWorkload(wload: workload): void {
        for (let i = 0; i < this.loads.length; i++) {
            if (this.loads[i].id == wload.id) {
                this.loads[i] = wload;
                break;
            }
        }
    }

    deleteWorkload(id: string): void {
        let index = this.getIndex(id);

        if (index !== -1) {
            this.loads.splice(index, 1);
        }
    }

    private getIndex(id: string): number {
        let res: number = -1;

        this.loads.some((load: workload, i) => {
            if (load.id === id) {
                res = i;
                return true;
            }

            return false
        });

        return res;
    }

    getById(id: string): workload {
        for (let load of this.loads) {
            if (load.id == id) {
                return load;
            }
        }
    }
}
