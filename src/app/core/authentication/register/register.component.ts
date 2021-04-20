import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AuthenticationService } from '../../services/authentication/authentication.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  
  // Formulario de registro
  registerForm: FormGroup;
  // Formulario de registro
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
  // Variable para validar el registro
  registerSuccess = false;
  // Variable para validar el registro
  constructor(private router: Router, private formBuilder: FormBuilder, private modalService: BsModalService,
              private authService: AuthenticationService) { }

  ngOnInit(): void {
    // Inicializando formulario
    this.registerForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(35)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$')]],
    });
    // Inicializando formulario
  }
  // Funcion para navegar al login
  goToLogin(): void {
    this.router.navigate(['/login']);
  }
  // Funcion para navegar al login
  // Funcion para registrar usuarios administrativos
  createUser(registerModal: TemplateRef<any>): void {
    // Enviando datos al servicio
    const registerData = {
      name: this.registerForm.value.name,
      email: this.registerForm.value.email,
      password: this.registerForm.value.password,
    };
    this.authService.createUser(registerData).then((returnedData: any) => {
      if (returnedData.status === 'success') {
        this.registerSuccess = true;
        // Alerntado a los usuarios del registro exitoso
        this.modalData.modalIcon = '../../../../assets/ilustrations/undraw_done_a34v.svg';
        this.modalData.modalTitle = '¡Registro exitoso!';
        this.modalData.modalDescription = 'Gracias por registrarte, accede a tu cuenta y disfruta de nuestras herramientas';
        this.modalReference = this.modalService.show(registerModal);
        // Alerntado a los usuarios del registro exitoso
      } else {
      const errorCodes = returnedData.data.code;
      switch (errorCodes) {
        case 'auth/invalid-email':
          this.modalData.modalIcon = '../../../../assets/ilustrations/undraw_cancel_u1it.svg',
          this.modalData.modalTitle = 'Error de autenticación',
          this.modalData.modalDescription = 'Dirección de correo invalida',
          this.modalReference = this.modalService.show(registerModal);
          break;
        case 'auth/email-already-in-use':
          this.modalData.modalIcon = '../../../../assets/ilustrations/undraw_cancel_u1it.svg',
          this.modalData.modalTitle = 'Error de autenticación',
          this.modalData.modalDescription = 'La direccion de correo especificada esta vinculada a otra cuenta',
          this.modalReference = this.modalService.show(registerModal);
          break;
        case 'auth/operation-not-allowed':
          this.modalData.modalIcon = '../../../../assets/ilustrations/undraw_cancel_u1it.svg',
          this.modalData.modalTitle = 'Error de autenticación',
          this.modalData.modalDescription = 'La operacion de registro ha sido deshabilitada',
          this.modalReference = this.modalService.show(registerModal);
          break;
        case 'auth/weak-password':
          this.modalData.modalIcon = '../../../../assets/ilustrations/undraw_cancel_u1it.svg',
          this.modalData.modalTitle = 'Error de autenticación',
          this.modalData.modalDescription = 'Contraseña débil',
          this.modalReference = this.modalService.show(registerModal);
          break;
        }
      }
    });
    // Enviando datos al servicio
  }
  // Funcion para registrar usuarios administrativos
  // Funcion para ir al login
  continuousFunction(): void {
    if (this.registerSuccess === true) {
      this.modalReference.hide();
      this.router.navigate(['/login']);
    } else {
      this.modalReference.hide();
    }
  }
  // Funcion para ir al login
}
