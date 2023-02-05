<template>
    <ion-page>
      <ion-header>
        <ion-toolbar>
          <ion-title>Profil de l'utilisateur</ion-title>
        </ion-toolbar>
      </ion-header>
      
      <ion-content class="ion-padding">
        <h2>{{ user.name }}</h2>
        <p>{{ user.given_name }} {{ user.family_name }}</p>
        <p>{{ user.email }}</p>
        <img :src="user.picture" />
      </ion-content>
    </ion-page>
  </template>
  
  <script>
  import { defineComponent, mapState } from 'vue';
  import {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar
  } from '@ionic/vue';
  
  export default defineComponent({
    components: { IonContent, IonHeader, IonPage, IonTitle, IonToolbar },
    computed: {
      ...mapState(['user'])
    }
  });
  </script>
  