<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>
          Liste des cocktails {{ loading }}
        </ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <div v-if="loading">
        <ion-card v-for="i in 10" :key="i">
          <ion-card-header>
            <ion-skeleton-text animated style="width: 60%"></ion-skeleton-text>
          </ion-card-header>
          <ion-card-content>
            <ion-skeleton-text animated></ion-skeleton-text>
            <ion-skeleton-text animated></ion-skeleton-text>
            <ion-skeleton-text animated style="width: 70%"></ion-skeleton-text>
          </ion-card-content>
        </ion-card>
      </div>
      <ion-list v-else>
        <div v-if="cocktails.length === 0">
          Il n'y a aucun cocktail.
          <ion-button @click="goToAddIngredients">Ajoute des ingrédients !</ion-button>
        </div>
        <ion-item v-else v-for="cocktail in cocktails" :key="cocktail.Cocktail_ID">
          <ion-card @click="goToCocktail(cocktail.Cocktail_ID)">
            <ion-card-header>
              <ion-card-title>{{ cocktail.Nom_Cocktail }}</ion-card-title>
            </ion-card-header>
            <ion-card-content>
              <p>{{ cocktail.Description_Cocktail }}</p>
              <p v-if="cocktail.Est_Disponible === 0">Non disponible</p>
              <p v-if="cocktail.Est_Disponible === 1">Disponible</p>
              <img :src="toBase64(cocktail.Image_Cocktail)" />
            </ion-card-content>
          </ion-card>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>
<script>
import axios from 'axios'
import { useRouter } from 'vue-router';
import { mapState, mapActions } from 'vuex';
import { defineComponent } from 'vue';
import Vue from 'vue'


import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonList,
  IonSkeletonText,
  IonPage
} from '@ionic/vue';

export default defineComponent({
  components: {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
  },
  data() {
    return {
      cocktails: [],
      loading: true,
      previousData: [],
    };
  },
  setup() {
    const router = useRouter();
    return { router };
  },
  methods: {
    toBase64(arrayBuffer) {
      return 'data:image/jpeg;base64,' + btoa(
        new Uint8Array(arrayBuffer.data)
          .reduce((data, byte) => data + String.fromCharCode(byte), '')
      );
    },
    goToAddIngredients() {
      this.router.push({ name: 'IngredientView' });
    },
    async fetchData() {
      try {
        const response = await axios.get('http://localhost:8888/api/V1/cocktails');
        this.cocktails = response.data;
        this.loading = false
      } catch (error) {
        console.error(error);
      }
    },
    goToCocktail(cocktailId) {
      console.log(cocktailId)
      this.router.push({ path: `/cocktail/${cocktailId}` });
    },
  },
  mounted: function () {
    this.fetchData();
    setInterval(() => {
      this.previousData = this.cocktails;
      this.fetchData();
      if (this.previousData !== this.cocktails) {
        this.cocktails = this.fetchData();
      }
    }, 5000);
  }
});
</script>