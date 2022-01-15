import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

declare const gapi: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  public auth2: any

  public loginForm: FormGroup = this.fb.group({
    email:      [localStorage.getItem('email') || '', [Validators.required, Validators.email]],
    password:   ['123456', Validators.required],
    recuerdame: [false],
  });

  constructor(
              private router: Router,
              private fb: FormBuilder,
              private usuarioService: UsuarioService,
              private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.renderButton();
  }

  /* GUARDAMOS EL email, EN EL LOCALSTORAGE, cuando se selecciona el RECUERDAME,
     Se borra o quita del localstorage si en caso se desmarca */
  submitLogin() {
    this.usuarioService.loginNormal(this.loginForm.value)
                       .subscribe( (resp) => {
                            if (this.loginForm.get('recuerdame')?.value) {
                              localStorage.setItem('email', this.loginForm.get('email')?.value);
                            } else {
                              localStorage.removeItem('email');
                            }

                            this.ngZone.run(()=>{
                              //TODO: Navegamos al Dashboard
                              this.router.navigateByUrl('/')
                            })

                          }, (err) => {
                            Swal.fire('E R R O R', err.error.msg, 'error');
                          }
                        );
  }

  /*Las funciones para logearse con GOOGLE */
 renderButton() {
    gapi.signin2.render('btn-google', {
      'scope': 'profile email',
      'width': 360,
      'height': 50,
      'longtitle': true,
      'theme': 'dark',
    });

    this.startApp()
  }

  async startApp() {
    await this.usuarioService.googleInit();
    this.auth2 = this.usuarioService.auth2

    this.attachSignin(document.getElementById('btn-google'));
  };

  //Nos Autenticamos y generamos el token y navegamos al DASHBOARD
  attachSignin(element: any){
    this.auth2.attachClickHandler(element, {},
        (googleUser: any) =>{
          const id_token = googleUser.getAuthResponse().id_token;
          //console.log(id_token)
          this.usuarioService.loginGoogle(id_token)
                              .subscribe(resp =>{

                                //TODO: Navegamos al Dashboard
                                this.ngZone.run( () => {
                                  this.router.navigateByUrl('/');
                                })
                });
              }, (error: any) =>{
                alert(JSON.stringify(error, undefined, 2));
              });
  }

}
