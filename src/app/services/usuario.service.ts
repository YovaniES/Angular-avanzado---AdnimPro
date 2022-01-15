import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoginForms } from '../interfaces/login-form';
import { RegisterForm } from '../interfaces/register-form';

const base_url = environment.base_url;
declare const gapi: any

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  public auth2: any

  constructor(private http  : HttpClient,
              private route : Router,
              private ngZone: NgZone
              ) {
              //inicializamos el googleInit, en el constructor
              this.googleInit();
              }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get headers() {
    return { headers: {'x-token': this.token}}
  }

  guardarLocalStorage(token: string) {
    localStorage.setItem('token', token)
  }

  googleInit(){
    return new Promise<void> (resolve => {
      gapi.load('auth2', () => {
        this.auth2 = gapi.auth2.init({
          client_id: '194488633459-56qlhjihi44i4lukasq28plcqnparj01.apps.googleusercontent.com',
          cookiepolicy: 'single_host_origin',
        });
        resolve()
      });
    })

  }

  logout(){
    localStorage.removeItem('token')

    this.auth2.signOut().then(()=>{
      this.ngZone.run(()=> {
        this.route.navigateByUrl('/login')
      })
    })
  }


  /* obtenemos el token del localstarage si lo hubiese y luego lo actualizamos
     localhost:3000/api/login/renovarTOKEN; luego nuestro TOKEN string con el
     OPERADOR MAP, lo convertimos a un BOLEANO
     http://localhost:3000/api/login/renovarTOKEN*/
  validarToken(): Observable<boolean> {
    const url = `${base_url}/login/renovarTOKEN`

  return this.http.get( url, {headers:{'x-token': this.token}})
                  .pipe(
                    map((resp: any) =>{
                    this.guardarLocalStorage(resp.token);
                    return true;

                  }),
                  catchError(error => of(false)))
  }



  /* app.use('/api/usuarios', require('./routes/usuarios')) */
  crearUsuario(formData: RegisterForm) {
    const url = `${base_url}/usuarios`

    return this.http.post(url , formData)
                    .pipe(
                      tap((resp:any) =>{
                         this.guardarLocalStorage(resp.token)
                    }))
  }

  /* app.use('/api/login', require('./routes/auth')) */
  loginNormal(formData: LoginForms) {
    const url = `${base_url}/login`

    return this.http.post(url , formData)
                    .pipe(
                      tap((resp: any) => {
                        this.guardarLocalStorage(resp.token)
      })
    );
  }

  /* Login de google, enviamos el token como objeto*/
  loginGoogle(token: string) {
    const url = `${base_url}/login/google`

    return this.http.post(url, {token})
                    .pipe(
                      tap((resp: any) => {
                        this.guardarLocalStorage(resp.token)
                      })
    );
  }
}
