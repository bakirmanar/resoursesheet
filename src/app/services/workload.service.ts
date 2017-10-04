import {Injectable} from '@angular/core';

import {StorageService} from './storage.service';

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
    private loads: workload[];

    getWorkloads(): workload[] {
        if (!this.loads) {
            this.loads = StorageService.get('loads') || [];
        }
        return this.loads;
    }

    addWorkload(load: workload): void {
        this.loads.push(load);
        StorageService.set('loads', this.loads)
    }

    saveWorkload(wload: workload): void {
        for (let i = 0; i < this.loads.length; i++) {
            if (this.loads[i].id == wload.id) {
                this.loads[i] = wload;
                break;
            }
        }
        StorageService.set('loads', this.loads)
    }

    deleteWorkload(id: string): void {
        let index = this.getIndex(id);

        if (index !== -1) {
            this.loads.splice(index, 1);
        }
        StorageService.set('loads', this.loads)
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
