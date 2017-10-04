import {Injectable} from '@angular/core';

import {StorageService} from './storage.service';

interface user {
    name: string,
    id: string
}

@Injectable()
export class UserService {
    private users: user[];

    getUsers(): user[] {
        if (!this.users) {
            this.users = StorageService.get('users') || [];
        }
        return this.users;
    }


    addUser(us: user): void {
        this.users.push(us);
        StorageService.set('users', this.users)
    }

    saveUser(us: user): void {
        let index: number = this.getIndex(us.id);

        if (index !== -1) {
            this.users[index] = Object.assign({}, us);
        }
        StorageService.set('users', this.users)
    }

    deleteUser(id: string): void {
        let index: number = this.getIndex(id);

        if (index !== -1) {
            this.users.splice(index, 1);
        }
        StorageService.set('users', this.users)
    }

    private getIndex(id: string): number {
        let res: number = -1;

        this.users.some((item: user, i) => {
            if (item.id === id) {
                res = i;
                return true;
            }

            return false
        });

        return res;
    }

    getById(id: string): user {
        for (let user of this.users) {
            if (user.id == id) {
                return user;
            }
        }
    }
}
