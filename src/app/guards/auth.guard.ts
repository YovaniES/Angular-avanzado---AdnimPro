import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { tap } from 'rxjs';
import { UsuarioService } from '../services/usuario.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private usuarioService: UsuarioService) {}

  canActivate(next: ActivatedRouteSnapshot,
              state: RouterStateSnapshot) {

    return this.usuarioService.validarToken()
    .pipe(
      tap((estaAutenticado) => {
        if (!estaAutenticado) {
          this.router.navigateByUrl('/login');
        }
      })
    );
  }
}
