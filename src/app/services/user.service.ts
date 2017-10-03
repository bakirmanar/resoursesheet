import {Injectable} from '@angular/core';

interface user {
    name: string,
    id: string
}

@Injectable()
export class UserService {
    private users: user[] = [
        {
            name: "Manar",
            id: "us1"
        },
        {
            name: "Sergei",
            id: "us2"
        },
        {
            name: "Ura",
            id: "us3"
        },
        {
            name: "Alexey2",
            id: "us4"
        }
    ];

    getUsers(): user[] {
        return this.users;
    }


    addUser(us: user): void {
        this.users.push(us);
    }

    saveUser(us: user): void {
        let index: number = this.getIndex(us.id);

        if (index !== -1) {
            this.users[index] = Object.assign({}, us);
        }
    }

    deleteUser(id: string): void {
        let index: number = this.getIndex(id);

        if (index !== -1) {
            this.users.splice(index, 1);
        }
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
