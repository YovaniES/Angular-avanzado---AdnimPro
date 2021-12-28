import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private linkTema = document.querySelector('#TEMA') ; //traemos el ID del tema, desde el INDEX.HTML

  constructor() {
    const url = localStorage.getItem('nuevoTema') || './assets/css/colors/green.css';
    this.linkTema?.setAttribute('href',url)
   }

  cambiarTema(nuevotema: string) {
    const url = `./assets/css/colors/${nuevotema}.css`
    this.linkTema?.setAttribute('href', url);
    localStorage.setItem('nuevoTema', url);

    this.checkTemaActual();
  }

  checkTemaActual() {
    const links = document.querySelectorAll('.selector');

    links.forEach((elem) => {
      elem.classList.remove('working');

      const btnTema = elem.getAttribute('data-theme');
      const btnUrl = `./assets/css/colors/${btnTema}.css`;
      const temaActual = this.linkTema?.getAttribute('href');

      if (btnUrl === temaActual) {
        elem.classList.add('working');
      }
    });
  }


}
