import { ClientData, ClientUpdate } from './../../../../core/models/clientModels';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { AuthenticationService } from 'src/app/core/services/authentication/authentication.service';
import { ClientService } from 'src/app/core/services/clients/client.service';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css']
})
export class ClientsComponent implements OnInit {
  // Variable para extraer la data del perfil
  userData: any;
  // Variable para extraer la data del perfil
  // Variable para referenciar los modals
  modalReference: BsModalRef;
  modalConfig: ModalOptions = { class: 'modal-xl', ignoreBackdropClick: true, keyboard: false };
  modalConfig2: ModalOptions = { ignoreBackdropClick: true, keyboard: false };
  // Variable para referenciar los modals
  // Variable para el formulario de clientes
  clientsForm: FormGroup;
  editionForm: FormGroup;
  // Variable para el formulario de clientes
  // Arreglo para el listado de clientes
  clients = [];
  // Arreglo para el listado de clientes

  constructor(private userAuth: AngularFireAuth, private authService: AuthenticationService, private modalService: BsModalService,
              private formBuilder: FormBuilder, private clientService: ClientService) { }

  ngOnInit(): void {
    // Consumiendo datos del servicio
    this.userAuth.onAuthStateChanged((authData) => {
      const userId = authData.uid;
      this.authService.returnUserData(userId).subscribe((profileData) => {
        this.userData = profileData;
      });
      this.clientService.getFilteredClients(userId).subscribe((clientData: [ClientData]) => {
        this.clients = clientData;   
      });
    });
    // Consumiendo datos del servicio
  }
  // Funcion para mostrar el modal de clientes
  showClientModal(clientModal: TemplateRef<any>): void {
    // Inicializando formulario
    this.clientsForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(35)]],
      email: ['', [Validators.required, Validators.email]],
      birthDay: ['', [Validators.required]],
      address: this.formBuilder.array([]),
    });
    // Inicializando formulario
    this.modalReference = this.modalService.show(clientModal, this.modalConfig);
  }
  // Funcion para mostrar el modal de clientes
  // Configuraciones para el formulario reactivo
  get addressForms() {
    return this.clientsForm.get('address') as FormArray
  }
  addAddress(): void {
    const address = this.formBuilder.group({
      city: ['', [Validators.required]],
      street: ['', [Validators.required]],
      number: ['', [Validators.required]],
    });
    this.addressForms.push(address);
  }
  deleteAddress(addressPosition): void {
    this.addressForms.removeAt(addressPosition);
  }
  // Configuraciones para el formulario reactivo
  // Funcion para crear un cliente
  createClient(): void {
    let listOfAddress = [];
    for (let index = 0; index < this.addressForms.value.length; index++) {
      this.addressForms.value[index].code = index;
      listOfAddress.push(this.addressForms.value[index]);
    }
    const dataToSend: ClientData = {
      name: this.clientsForm.value.name,
      email: this.clientsForm.value.email,
      birthDay: this.clientsForm.value.birthDay,
      addressList: listOfAddress
    };
    this.clientService.createClients(dataToSend).then(() => {
      this.modalReference.hide();
    })
  }
  // Funcion para crear un cliente
  // Funcion para mostrar el modal de eliminar
  showDeleteModal(deleteModal: TemplateRef<any>): void {
    this.modalReference = this.modalService.show(deleteModal, this.modalConfig2);
  }
  // Funcion para mostrar el modal de eliminar
  // Funcion para mostrar el modal de edicion
  showEditionModal(editionModal: TemplateRef<any>, client): void {
    // Inicializando formulario
    this.editionForm = this.formBuilder.group({
      name: [client.name, [Validators.required, Validators.minLength(1), Validators.maxLength(35)]],
      email: [client.email, [Validators.required, Validators.email]],
      birthDay: [client.birthDay, [Validators.required]],
      address: this.formBuilder.array([]),
    });
    // Inicializando formulario
    // Precargando data dinamica del formulario
    if (client.addressList != null || client.addressList != null) {
      for (let index = 0; index < client.addressList.length; index++) {
        const element = client.addressList[index];
        const address = this.formBuilder.group({
          city: [element.city, [Validators.required]],
          street: [element.street, [Validators.required]],
          number: [element.number, [Validators.required]],
        });
        this.addressEditionForms.push(address);
      }
    }
    // Precargando data dinamica del formulario
    this.modalReference = this.modalService.show(editionModal, this.modalConfig);
  }
  // Funcion para mostrar el modal de edicion
  // Configuraciones para el formulario reactivo de edicion
  get addressEditionForms() {
    return this.editionForm.get('address') as FormArray
  }
  addEditionAddress(): void {
    const address = this.formBuilder.group({
      city: ['', [Validators.required]],
      street: ['', [Validators.required]],
      number: ['', [Validators.required]],
    });
    this.addressEditionForms.push(address);
  }
  deleteEditionAddress(addressPosition): void {
    this.addressEditionForms.removeAt(addressPosition);
  }
  // Configuraciones para el formulario reactivo de edicion
  // Funcion para eliminar una instruccion
  deleteClient(client): void {
    const clientData = {
      code: client.code
    };
    this.clientService.deleteClient(clientData).then(() => {
      this.modalReference.hide();
    });
  }
  // Funcion para eliminar una instruccion
  // Funcion para hacer el update al cliente
  updateClient(client): void {
    let listOfAddress = [];
    for (let index = 0; index < this.addressEditionForms.value.length; index++) {
      this.addressEditionForms.value[index].code = index;
      listOfAddress.push(this.addressEditionForms.value[index]);
    }
    const dataToSend: ClientUpdate = {
      name: this.editionForm.value.name,
      email: this.editionForm.value.email,
      birthDay: this.editionForm.value.birthDay,
      addressList: listOfAddress,
      code: client.code
    };
    this.clientService.updateClients(dataToSend).then(() => {
      this.modalReference.hide();
    })
  }
  // Funcion para hacer el update al cliente
}
