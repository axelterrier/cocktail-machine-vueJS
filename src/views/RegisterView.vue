<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>
          Inscription
        </ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-list>
        <ion-item>
          <ion-icon :icon="mailOutline" slot="start" style="vertical-align: middle;"></ion-icon>
          <ion-label position="floating">Adresse email</ion-label>
          <ion-input type="email" v-model="email" @input="email = $event.target.value"></ion-input>
        </ion-item>
        <ion-item>
          <ion-icon :icon="person" slot="start" style="vertical-align: middle;"></ion-icon>
          <ion-label position="floating">Nom</ion-label>
          <ion-input type="text" v-model="nom" @input="nom = $event.target.value"></ion-input>
        </ion-item>
        <ion-item>
          <ion-icon :icon="person" slot="start" style="vertical-align: middle;"></ion-icon>
          <ion-label position="floating">Prénom</ion-label>
          <ion-input type="text" v-model="prenom" @input="prenom = $event.target.value"></ion-input>
        </ion-item>
        <ion-item>
          <ion-icon :icon="lockOpenOutline" slot="start" style="vertical-align: middle;"></ion-icon>
          <ion-label position="floating">Mot de passe</ion-label>
          <ion-input v-model="password" @input="password = $event.target.value"
            :type="showPassword ? 'text' : 'password'"></ion-input>
          <ion-icon :icon="showPassword ? eye : eyeOff" slot="end" @click="showPassword = !showPassword"></ion-icon>
        </ion-item>
        <ion-item>
          <ion-icon :icon="lockOpenOutline" slot="start" style="vertical-align: middle;"></ion-icon>
          <ion-label position="floating">Confirmer le mot de passe</ion-label>
          <ion-input v-model="passwordConfirmation" @input="passwordConfirmation = $event.target.value"
            :type="showPassword ? 'text' : 'password'"></ion-input>
          <ion-icon :icon="showPassword ? eye : eyeOff" slot="end" @click="showPassword = !showPassword"></ion-icon>
        </ion-item>
      </ion-list><ion-button expand="block" @click="register">S'inscrire</ion-button>
      <ion-button expand="block" @click="goToLogin">Se connecter</ion-button>

    </ion-content>
  </ion-page>
</template>
<script>
import { defineComponent } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

import {
  alertController,
  IonPage,
  IonIcon,
} from '@ionic/vue';

import {
  person,
  lockOpenOutline,
  mailOutline,
  eye,
  eyeOff,
} from "ionicons/icons"


export default defineComponent({
  components: {
    IonPage,
    IonIcon,
  },
  setup() {
        const router = useRouter();
        return { router };
    },
  data() {
    return {
      email: '',
      nom: '',
      prenom: '',
      password: '',
      passwordConfirmation: '',
      person,
      lockOpenOutline,
      mailOutline,
      eye,
      eyeOff,
      showPassword: false,
      showConfirmPassword: false
    };
  },
  methods: {
    async register() {
      if (!this.email || !this.nom || !this.prenom || !this.password) {
        const presentAlert = async () => {
          const alert = await alertController.create({
            header: 'Champs non remplis',
            subHeader: 'Important message',
            message: 'Tous les champs sont necessaires',
            buttons: ['OK'],
          });

          await alert.present();
        };
        presentAlert()
        return;
      }

      if (this.password !== this.passwordConfirmation) {
        const presentAlert = async () => {
          const alert = await alertController.create({
            header: 'Mots de passe',
            subHeader: 'Important message',
            message: 'Les mots de passe entrés ne sont pas identiques',
            buttons: ['OK'],
          });

          await alert.present();
        };
        presentAlert()

        return;
      }

      try {
        const emailCheckResponse = await axios.get(`http://localhost:8888/api/V1/utilisateurs/${this.email}`);
        if (emailCheckResponse.data.error === "Aucun utilisateur trouvé avec cet email.") {
          // continue with the registration process
        } else {
          const presentAlert = async () => {
            const alert = await alertController.create({
              header: 'Compte existant',
              subHeader: 'Important message',
              message: 'Cette adresse mail est déja utilisée',
              buttons: ['OK'],
            });

            await alert.present();
          };
          presentAlert()
          return;
        }
      } catch (error) {
        console.error(error);
        const presentAlert = async () => {
          const alert = await alertController.create({
            header: 'Erreur de vérification',
            subHeader: 'Important message',
            message: 'Erreur de vérification de l\'adresse mail',
            buttons: ['OK'],
          });

          await alert.present();
        };
        presentAlert()
        return;
      }

      try {
        const response = await axios.post('http://localhost:8888/api/V1/register', {
          email: this.email,
          nom: this.nom,
          prenom: this.prenom,
          password: this.password
        });
      } catch (error) {
        console.error(error);
        const presentAlert = async () => {
          const alert = await alertController.create({
            header: 'Alert',
            subHeader: 'Important message',
            message: 'Une erreur est survenue lors de l\'inscription, veuillez faire remonter l\'erreur',
            buttons: ['OK'],
          });

          await alert.present();
        };
        presentAlert()
      }
    },
    goToLogin(){
      this.router.push({ path: '/login' });
    },
  }
});
</script>