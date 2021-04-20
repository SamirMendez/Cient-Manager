import { AngularFireDatabase } from '@angular/fire/database';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { ClientData, ClientReturns, ClientUpdate } from '../../models/clientModels';
import { UserData } from '../../models/authModels';
import { Observable } from 'rxjs';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  constructor(private realtimeDatabase: AngularFireDatabase, private userAuth: AngularFireAuth) {}
  
  // Metodo publico para crear clientes en el sistema
  public async createClients(clientData: ClientData): Promise<ClientReturns> {
    const clientCode = Date.now();
    const userId = (await this.userAuth.currentUser).uid;
    return await this.realtimeDatabase.database.ref(`clientManagerPlatform/platformBasicData/clients/${clientCode}/`).set({
      name: clientData.name,
      email: clientData.email,
      birthDay:clientData.birthDay,
      addressList: clientData.addressList,
      businessId: userId,
      code: clientCode
    }).then((data) => {
      return {status: 'success', data: data};
    });
  }
  // Metodo publico para crear clientes en el sistema
  // Metodo public para filtrar los clientes por empresa
  public getFilteredClients(userId): Observable<any> {
    return this.realtimeDatabase.list(`clientManagerPlatform/platformBasicData/clients/`, filteredData => filteredData.orderByChild('businessId').equalTo(userId)).valueChanges();
  }
  // Metodo public para filtrar los clientes por empresa
  // Metodo publico para eliminar un cliente
  public async deleteClient(clientData): Promise<any> {
    const clientCode = clientData.code
    return this.realtimeDatabase.database.ref(`clientManagerPlatform/platformBasicData/clients/${clientCode}/`).remove().then((deletedData) => {
      return {status: 'success', data: deletedData};
    })
  }
  // Metodo publico para eliminar un cliente
  // Metodo publico para actualizar clientes en el sistema
  public async updateClients(clientData: ClientUpdate): Promise<ClientReturns> {
    const clientCode = clientData.code;
    return await this.realtimeDatabase.database.ref(`clientManagerPlatform/platformBasicData/clients/${clientCode}/`).update({
      name: clientData.name,
      email: clientData.email,
      birthDay:clientData.birthDay,
      addressList: clientData.addressList,
    }).then((data) => {
      return {status: 'success', data: data};
    });
  }
  // Metodo publico para actualizar clientes en el sistema
}
