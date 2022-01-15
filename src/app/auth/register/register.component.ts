import { Component } from '@angular/core';
import {
  AbstractControl,
  AbstractControlOptions,
  FormBuilder,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  public formPosteado = false;

  public registerForm = this.fb.group(
    {
      nombre:     ['Yovani ES', [Validators.required, Validators.minLength(3)]],
      email:      ['yovany.21sg@gmail.com', [Validators.required, Validators.email]],
      password:   ['123456', [Validators.required, Validators.minLength(6)]],
      password2:  ['123456', Validators.required],
      terminos:   [false, Validators.requiredTrue],
    },
    {
      validators: this.passwordsIguales('password', 'password2'),
    } as AbstractControlOptions
  );

  constructor(private router:Router,
              private fb: FormBuilder,
              private usuarioService:UsuarioService) {}

  usuarioSubmit() {
    this.formPosteado = true;
    console.log(this.registerForm.value);

    if (this.registerForm.invalid) {
      return
    }

    //Realizar el posteo
    this.usuarioService.crearUsuario(this.registerForm.value)
                       .subscribe(resp=>{
                        //Navegamos al Dashboard
                        this.router.navigateByUrl('/')

                      }, err=>{
                         /* si sucede un error  */
                         Swal.fire('E R R O R', err.error.msg, 'error');
                        });

  }

  campoNoValido(campo: string): boolean {
    if (
      this.registerForm.get(campo)?.invalid &&
      this.registerForm.get(campo)?.touched
    ) {
      return true;
    } else {
      return false;
    }
  }

  aceptasTerminos() {
    return !this.registerForm.get('terminos')?.value && this.formPosteado;
  }

  passwordsIguales(campo1: string, campo2: string) {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const pass1 = formGroup.get(campo1)?.value;
      const pass2 = formGroup.get(campo2)?.value;

      if (pass1 !== pass2) {
        formGroup.get(campo2)?.setErrors({ noIguales: true });
        return { noIguales: true };
      } else {
        formGroup.get(campo2)?.setErrors(null);

        return null;
      }
    };
  }
}
