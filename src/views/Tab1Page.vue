<template>
  <ion-page>
    <ion-header>
      <ion-toolbar style="background-color: #191414; color: #1DB954">
        <ion-title>Connexion</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-text-center" style="background-color: #191414; color: #fff">
      <ion-header collapse="condense">
        <ion-toolbar style="background-color: #191414; color: #1DB954">
          <ion-title size="large">Connexion</ion-title>
        </ion-toolbar>
      </ion-header>
      <form>
        <ion-list>
          <ion-item>
            <ion-label position="floating">Email</ion-label>
            <ion-input type="email" required></ion-input>
          </ion-item>
          <ion-item>
            <ion-label position="floating">Mot de passe</ion-label>
            <ion-input type="password" required></ion-input>
          </ion-item>
        </ion-list>
        <ion-button style="background-color: #1DB954; margin-top: 20px" type="submit">Se connecter</ion-button>
      </form>
    </ion-content>
  </ion-page>
</template>
<style>
  form {
    width: 80%;
    margin: 20px auto;
    text-align: center;
  }

  ion-input {
    background-color: #fff;
    color: #191414;
  }
</style>
<script>
  import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonInput, IonButton } from '@ionic/vue';

  export default {
    components: {
      IonPage,
      IonHeader,
      IonToolbar,
      IonTitle,
      IonContent,
      IonList,
      IonItem,
      IonLabel,
      IonInput,
      IonButton
    }
  }
</script>