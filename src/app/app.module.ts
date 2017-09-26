import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MdButtonModule, MdCardModule, MdInputModule, MdTableModule, MdToolbarModule} from '@angular/material';
import {FormsModule, NgModel} from '@angular/forms';
import {InfiniteScrollModule} from 'ngx-infinite-scroll';

import {AppComponent} from './app.component';
import {calendarComponent} from "./calendar/calendar.component";
import {projectComponent} from "./projects/projects.component";
import {userComponent} from "./users/users.component";

import {CalendarService} from './services/calendar.service';
import {UserService} from './services/user.service';
import {ProjectService} from './services/project.service';
import {WorkloadService} from './services/workload.service';


let routes = [
    {
        path: '',
        redirectTo: '/calendar',
        pathMatch: 'full'
    },
    {
        path: 'calendar',
        component: calendarComponent
    },
    {
        path: 'projects',
        component: projectComponent
    },
    {
        path: 'users',
        component: userComponent
    }
];

let imports = [
    BrowserModule,
    BrowserAnimationsModule,
    MdButtonModule,
    MdCardModule,
    MdInputModule,
    MdTableModule,
    MdToolbarModule,
    FormsModule,
    InfiniteScrollModule,
    RouterModule.forRoot(routes)
];

@NgModule({
    declarations: [
        AppComponent,
        calendarComponent,
        projectComponent,
        userComponent
    ],
    imports: imports,
    providers: [
        CalendarService,
        UserService,
        WorkloadService,
        ProjectService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
