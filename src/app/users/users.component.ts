import {Component, OnInit, ViewEncapsulation, DoCheck } from '@angular/core';
import * as _ from 'lodash';
import * as moment from 'moment';


import {UserService} from "../services/user.service";

interface user {
    name: string,
    id: string
}

@Component({
    selector: 'users',
    templateUrl: './users.html',
    styleUrls: ['./users.css'],
    encapsulation: ViewEncapsulation.None
})

export class userComponent implements DoCheck{
    users: user[];
    editMode: boolean;
    editingUser: user;

    constructor (private userS: UserService) {

    }

    ngOnInit(): void {

    }

    ngDoCheck(): void {
        this.users = this.userS.getUsers();
        this.sortUsers();
    }

    sortUsers(): void {
        this.users = _.sortBy(this.users, (us: user) => {
            return us.name;
        });
    }

    editUser(index: number): void {
        let project = this.users[index];
        if (project) {
            this.editMode = true;
            this.editingUser = Object.assign({}, project);
        }
    }

    cancelEdit(): void {
        this.editMode = false;
        this.editingUser = null;
    }

    saveUser(us: user): void {
        this.userS.saveUser(us);
        this.cancelEdit();
    }

    deleteUser(id: string): void {
        this.userS.deleteUser(id);
        this.cancelEdit();

    }

    addUser(): void {
        let emptyUser: user = {
            id: "us" + moment.now(),
            name: "New user"
        };

        this.userS.addUser(emptyUser);
    }
}
