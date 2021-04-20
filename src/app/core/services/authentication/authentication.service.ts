import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { RegisterData } from '../../models/authModels';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private userAuth: AngularFireAuth, private realtimeDatabase: AngularFireDatabase) { }

  // Metodo publico para crear un nuevo usuario
  public async createUser(userData: RegisterData): Promise<any> {
    return await this.userAuth.createUserWithEmailAndPassword(userData.email, userData.password).then((returnedData) => {
      // Actualizando el objeto del usuario
      this.userAuth.onAuthStateChanged((authData) => {
        authData.updateProfile({
          displayName: userData.name
        });
      });
      // Actualizando el objeto del usuario
      // Creando registro en la basse de datos
      const userId = returnedData.user.uid;
      this.realtimeDatabase.database.ref(`clientManagerPlatform/users/adminUsers/${userId}/`).set({
        name: userData.name,
        email: userData.email,
        uid: returnedData.user.uid,
        timeStamp: Date.now(),
        type: 'administrator'
      });
      return {status: 'success', data: returnedData};
      // Creando registro en la basse de datos
    }).catch((error) => {
      return {status: 'error', data: error};
    });
  }
  // Metodo publico para crear un nuevo usuario
  // Metodo publico para crear iniciar la sesion de un usuario
  public async loginUser(userData: any): Promise<any> {
    return await this.userAuth.signInWithEmailAndPassword(userData.email, userData.password).then((returnedData) => {
      return {status: 'success', data: returnedData};
    }).catch((error) => {
      return {status: 'error', data: error};
    });
  }
  // Metodo publico para crear iniciar la sesion de un usuario
  // Extrayendo datos del usuario
  public returnUserData(userData: any): Observable<ClientData> {
    return this.realtimeDatabase.object<ClientData>(`clientManagerPlatform/users/adminUsers/${userData}/`).valueChanges();
  }
  // Extrayendo datos del usuario
  // Funcion para recuperar las cuentas del usuario
  public async recoverUser(email): Promise<any> {
    return await this.userAuth.sendPasswordResetEmail(email).then((returnedData: any) => {
      return returnedData;
    }).catch((error) => {
      return error;
    });
  }
  // Funcion para recuperar las cuentas del usuario
  // Funcion para cerrar la sesion del usuario
  public async logOut(): Promise<any> {
    return await this.userAuth.signOut().then((returnedData) => {
      return returnedData;
    });
  }
  // Funcion para cerrar la sesion del usuario
}
