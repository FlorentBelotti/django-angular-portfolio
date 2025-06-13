// Angular routes
import { Routes } from '@angular/router';

// Main components
import { HomeComponent } from './pages/home/home.component';
import { ResumeComponent } from './pages/resume/resume.component';

// Admin components
import { AdminComponent } from './pages/admin/admin.component';
import { AdminDisclaimerComponent } from './pages/admin/admin-disclaimer/admin-disclaimer.component';
import { AdminConfigurationComponent } from './pages/admin/admin-configuration/admin-configuration.component';
import { AdminExperiencesComponent } from './pages/admin/admin-add-experiences/admin-experiences.component';

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
            { path: '', redirectTo: 'disclaimer', pathMatch: 'full'},
            { path: 'disclaimer', component: AdminDisclaimerComponent },
            { path: 'configuration', component: AdminConfigurationComponent },
            { path: 'add-experiences', component: AdminExperiencesComponent }
        ] 
    },

    // Default path
    { path: '**', redirectTo: ''}
];
