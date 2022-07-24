import { inject, TestBed } from '@angular/core/testing';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services';

import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [RouterModule],
            providers: [AuthGuard, AuthService, Router]
        });
    });

    it('should ...', inject([AuthGuard], (guard: AuthGuard) => {
        expect(guard).toBeTruthy();
    }));
});
