<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>
          Paramètres
        </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-list>
        <ion-item @click="goToEditProfilePage">
          <ion-label>Modifier mon profil</ion-label>
          <ion-icon :icon="personCircleOutline" slot="start"></ion-icon>
        </ion-item>
        <ion-item>
          <ion-label>Thème de l'application</ion-label>
          <ion-toggle v-model="darkTheme" @click="changeTheme" />
          <ion-icon :icon="contrast" slot="start"></ion-icon>
        </ion-item>
        <ion-item @click="changeLanguage">
          <ion-icon :icon="earthOutline" slot="start"></ion-icon>
          <ion-label>Langue de l'application</ion-label>

        </ion-item>
        <ion-item @click="goToStatisticsPage">
          <ion-icon :icon="statsChartOutline" slot="start"></ion-icon>
          <ion-label>Statistiques</ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script>
import { defineComponent } from 'vue';
import {
  IonPage,
  IonIcon,
} from '@ionic/vue';
import {
  earthOutline,
  contrast,
  personCircleOutline,
  statsChartOutline,
} from "ionicons/icons"


export default {
  components: {
    IonPage,
    IonIcon,
  },
  setup() {
    return {
      earthOutline,
      contrast,
      personCircleOutline,
      statsChartOutline,
    }
  },
  data() {
    return {
      darkTheme: false,
    };
  },
  computed: {
    themeClass() {
      return this.darkTheme ? 'dark-theme' : '';
    },
  },
  methods: {
    changeTheme() {
      this.darkTheme = !this.darkTheme;
      console.log(this.darkTheme)
      document.body.setAttribute('prefers-color-scheme', 'dark')
    },
  },
};
</script>
