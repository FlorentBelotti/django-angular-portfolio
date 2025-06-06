import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ResumeComponent } from './pages/resume/resume.component';
import { AdminComponent } from './pages/admin/admin.component';

export const routes: Routes = [

    // Default root view
    { path: '', component: HomeComponent },

    // App routes
    { path: 'resume', component: ResumeComponent },

    // Admin route
    { 
        path: 'admin', 
        component: AdminComponent,
        children: [
            { path: '', redirectTo: 'admin_index'},
        ] 
    },

    // Default path
    { path: '**', redirectTo: ''}
];
