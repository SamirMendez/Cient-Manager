import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../../services/authentication/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  // Formulario de inicio de sesión
  loginForm: FormGroup;
  // Formulario de inicio de sesión
  // Formulario para la recuperacio de cuentas
  passwordForm: FormGroup;
  // Formulario para la recuperacio de cuentas
  // Variable para referenciar los modals
  modalReference: BsModalRef;
  // Variable para referenciar los modals
  // Objeto para mostrar la informacion del modal
  modalData = {
    modalTitle: null,
    modalIcon: null,
    modalDescription: null,
  };
  // Objeto para mostrar la informacion del modal
  // Variable para validar el inicio de sesión
  loginSuccess = false;
  // Variable para validar el inicio de sesión
  // Variable para validar el login
  authSubscription: Subscription;
  constructor(private router: Router, private formBuilder: FormBuilder, private modalService: BsModalService,
              private authService: AuthenticationService) { }

  ngOnInit(): void {
    // Inicializando formulario
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$')]],
    });
    // Inicializando formulario
  }
  // Funcion para navegar al registro
  goToRegister(): void {
    this.router.navigate(['/register']);
  }
  // Funcion para navegar al registro
  // Funcion para ejecutar el registro desde el servicio
  loginUser(loginModal: TemplateRef<any>): void {
    // Extrayendo datos del formulario
    const $email = this.loginForm.value.email;
    const $password = this.loginForm.value.password;
    // Extrayendo datos del formulario
    // Enviando datos al servicio
    const loginData = {
      email: $email,
      password: $password,
    };
    this.authService.loginUser(loginData).then((returnedData: any) => {
      const userId = returnedData.data.user.uid;
      this.authSubscription = this.authService.returnUserData(userId).subscribe((authData: any) => {
        if (authData != null || authData != undefined) {
          switch (returnedData.status) {
            case 'success':
              if (authData.type === 'administrator') {
                this.loginSuccess = true;
                // Avisando a los usuarios sobre le inicio de sesion exitoso
                this.modalData.modalIcon = '../../../../assets/ilustrations/undraw_done_a34v.svg';
                this.modalData.modalTitle = '¡Login exitoso!';
                this.modalData.modalDescription = 'Bienvenido@ ' + authData.name + ', esperamos que disfrutes de nuestras herramientas';
                this.modalReference = this.modalService.show(loginModal);
                // Avisando a los usuarios sobre le inicio de sesion exitoso
              } else {
                this.modalData.modalIcon = '../../../../assets/ilustrations/undraw_cancel_u1it.svg',
                this.modalData.modalTitle = 'Error de autenticación',
                this.modalData.modalDescription = 'Estimado usuario, no cuenta con los privilegios para acceder a esta parte el sistema';
                this.modalReference = this.modalService.show(loginModal);
              }
              break;
            case 'error':
              const errorCodes = returnedData.data.code;
              switch (errorCodes) {
                case 'auth/invalid-email':
                  this.modalData.modalIcon = '../../../../assets/ilustrations/undraw_cancel_u1it.svg',
                  this.modalData.modalTitle = 'Error de autenticación',
                  this.modalData.modalDescription = 'La direccón de correo introducida es invalida';
                  this.modalReference = this.modalService.show(loginModal);
                  break;
                case 'auth/user-disabled':
                  this.modalData.modalIcon = '../../../../assets/ilustrations/undraw_cancel_u1it.svg',
                  this.modalData.modalTitle = 'Error de autenticación',
                  this.modalData.modalDescription = 'Estimado usuario, la cuenta vinculada a la dirección de correo introducida ha sido inhabilitada';
                  this.modalReference = this.modalService.show(loginModal);
                  break;
                case 'auth/user-not-found':
                  this.modalData.modalIcon = '../../../../assets/ilustrations/undraw_cancel_u1it.svg',
                  this.modalData.modalTitle = 'Error de autenticación',
                  this.modalData.modalDescription = 'No existe cuenta alguna vinculada a la dirección de correo introducida';
                  this.modalReference = this.modalService.show(loginModal);
                  break;
                case 'auth/wrong-password':
                  this.modalData.modalIcon = '../../../../assets/ilustrations/undraw_cancel_u1it.svg',
                  this.modalData.modalTitle = 'Error de autenticación',
                  this.modalData.modalDescription = 'Contraseña incorrecta';
                  this.modalReference = this.modalService.show(loginModal);
                  break;
              }
              break;
          }
        } else {
          this.modalData.modalIcon = '../../../../assets/ilustrations/undraw_cancel_u1it.svg',
          this.modalData.modalTitle = 'Error de autenticación',
          this.modalData.modalDescription = 'Estimado usuario, no cuenta con los privilegios para acceder a esta parte el sistema';
          this.modalReference = this.modalService.show(loginModal);
        }
      });
    });
    // Enviando datos al servicio
  }
  // Funcion para ejecutar el login desde el servicio
  // Funcion para acceder dentro del panel
  goToPanel(): void {
    if (this.loginSuccess === true) {
      this.router.navigate(['/dashboard']);
      this.modalReference.hide();
    } else {
      this.modalReference.hide();
    }
  }
  // Funcion para acceder dentro del panel
  // Funcion para abrir el modal del password
  openPasswordModal(passwordModal: TemplateRef<any>): void {
    //  Inicializando formulario
    this.passwordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
    //  Inicializando formulario
    this.modalData.modalIcon = '../../../../assets/ilustrations/undraw_forgot_password_gi2d.svg',
    this.modalData.modalTitle = 'Recuperación de cuentas',
    this.modalData.modalDescription = 'Agregue la direccón de correo vinculada a la cuenta que desea recuperar, luego enviaremos un enlace de recuperación a dicha cuenta.';
    this.modalReference = this.modalService.show(passwordModal);
  }
  // Funcion para abrir el modal del password
  // Funcion para recuperar la cuenta desde el servicio
  recoverPassword(): void {
    // Extrayendo datos del formulario
    const email = this.passwordForm.value.email;
    // Extrayendo datos del formulario
    this.authService.recoverUser(email).then((returnedData) => {
      this.passwordForm.reset();
      this.modalReference.hide();
    });
  }
}
