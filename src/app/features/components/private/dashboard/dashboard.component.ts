import { Component, OnInit, TemplateRef } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { BsModalRef, ModalOptions, BsModalService } from 'ngx-bootstrap/modal';
import { AuthenticationService } from 'src/app/core/services/authentication/authentication.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  // Variable para referenciar los modals
  modalReference: BsModalRef;
  customConfig: ModalOptions = { ignoreBackdropClick: true, keyboard: false };
  // Variable para referenciar los modals
  // Objeto para mostrar la informacion del modal
  modalData = {
    modalTitle: null,
    modalIcon: null,
    modalDescription: null,
  };
  // Objeto para mostrar la informacion del modal
  // Variable para la data del usuario
  userData: any;
  // Variable para la data del usuario
  constructor(private router: Router, private modalService: BsModalService, private authService: AuthenticationService,
              private userAuth: AngularFireAuth) { }

  ngOnInit(): void {
    this.userAuth.onAuthStateChanged((userData) => {
      const userId = userData.uid;
      this.authService.returnUserData(userId).subscribe((userData) => {
        console.log(userData);
        this.userData = userData;
      });
    })
  }

  // Funcion para cerrar la sesion del usuario
  logOut(logOutModal: TemplateRef<any>): void {
    this.authService.logOut().then((returnedData) => {
      this.modalData.modalIcon = '../../../../../assets/ilustrations/undraw_Travel_mode_re_2lxo.svg';
      this.modalData.modalTitle = 'Cerrar sesión';
      this.modalData.modalDescription = 'Fue bueno tenerte por aquí, asi que esperamos que vuelvas pronto.';
      this.modalReference = this.modalService.show(logOutModal, this.customConfig);
    });
  }
  // Funcion para cerrar la sesion del usuario
  // Funcion para navegar al login
  goToLogin(): void {
    this.modalReference.hide();
    this.router.navigate(['/login']);
  }
  // Funcion para navegar al login
}
