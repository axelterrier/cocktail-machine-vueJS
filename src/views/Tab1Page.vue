<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Tab 1 {{ loading }} // {{ activeCount }} ingrédients sélectionnés</ion-title>
        <ion-searchbar v-model="searchQuery" @input="searchQuery = $event.target.value"></ion-searchbar>
        <ion-skeleton-text :animated="true" style="width: 80px"></ion-skeleton-text>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-list v-if="loading">
        <ion-card v-for="i in 10" :key="i">
          <ion-card-header>
            <ion-skeleton-text :animated="true"></ion-skeleton-text>
          </ion-card-header>
          <ion-card-content>
            <ion-skeleton-text :animated="true" style="width: 50%"></ion-skeleton-text>
            <ion-skeleton-text :animated="true" style="width: 55%"></ion-skeleton-text>
            <ion-skeleton-text :animated="true" style="width: 45%"></ion-skeleton-text>
          </ion-card-content>
        </ion-card>
      </ion-list>
      <ion-list v-else>
        <ion-card v-for="ingredient in filteredIngredients" :key="ingredient.ID_Ingredient">
          <ion-card-header>
            <ion-card-subtitle>ID: {{ ingredient.ID_Ingredient }}</ion-card-subtitle>
            <ion-card-title>{{ ingredient.Ingredient_Name }}</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <p>Taux d'alcool: {{ ingredient.Taux_Alcool }}</p>
            <p>Disponibilité: {{ ingredient.Est_Disponible }}
              <ion-toggle v-if="ingredient.Est_Disponible === 1" v-model="ingredient.Est_Disponible" :checked="true"
                @click="updateAvailability(ingredient)"></ion-toggle>
              <ion-toggle v-else v-model="ingredient.Est_Disponible" :checked="false"
                :disabled="activeCount === 10 && ingredient.Est_Disponible === 0"
                @click="updateAvailability(ingredient)"></ion-toggle>
            </p>
            <img :src="toBase64(ingredient.Image_Url)" />
          </ion-card-content>
        </ion-card>
      </ion-list>
    </ion-content>
  </ion-page>
</template>
<script>
import { defineComponent } from 'vue';
import { btoa } from 'Base64';
import { useRouter } from 'vue-router';
import axios from 'axios'
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
  IonPage,
  alertController
} from '@ionic/vue';

export default defineComponent({
  components: {
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
  },
  data() {
    return {
      ingredients: [],
      loading: true,
      searchQuery: '',
      activeCount: 0,
    };
  },
  setup() {
    const router = useRouter()
    return { router }
  },
  async created() {
    try {
      const response = await axios.get('http://localhost:8888/api/V1/ingredients')
      this.ingredients = response.data
      this.loading = false;
      this.activeCount = this.ingredients.reduce((count, ingredient) => count + (ingredient.Est_Disponible ? 1 : 0), 0);
    } catch (error) {
      console.error(error)
    }

  },
  methods: {
    toBase64(arrayBuffer) {
      return 'data:image/jpeg;base64,' + btoa(
        new Uint8Array(arrayBuffer.data)
          .reduce((data, byte) => data + String.fromCharCode(byte), '')
      );
    },
    async updateAvailability(ingredient) {
      ingredient.Est_Disponible = ingredient.Est_Disponible === 1 ? 0 : 1;
      this.activeCount += ingredient.Est_Disponible === 1 ? 1 : -1;
      if (this.activeCount >= 10) {
        const alert = await alertController.create({
          header: 'Alerte',
          message: 'Le nombre maximal d\'ingrédients sélectionnés est atteint !',
          buttons: ['OK']
        });
        await alert.present();
        return;
      }

      console.log("Nb d'ingrédient : " + this.activeCount)
      await this.saveChanges(ingredient);
      await this.updateCocktails()
    },
    async saveChanges(ingredient) {
      try {
        const response = await axios.put(`http://localhost:8888/api/V1/ingredients/${ingredient.ID_Ingredient}`, {
          Est_Disponible: ingredient.Est_Disponible
        });
        console.log("Données mises à jour : ", response.data)
        // mettre à jour les données localement
        //this.ingredients = this.ingredients.map(i => i.ID_Ingredient === ingredient.ID_Ingredient ? { ...i, Est_Disponible: response.data.Est_Disponible } : i)
        //console.log("ingredients : " + this.ingredients)
      } catch (error) {
        console.error("error :" + error)
      }
    },
    async updateCocktails() {
      const response = await axios.get('http://localhost:8888/api/V1/cocktailcomposition')
      this.cocktails = response.data
      //AJOUTER UPDATE COCKTAIL
    }


  },
  computed: {
    filteredIngredients() {
      return this.ingredients.filter(ingredient => ingredient.Ingredient_Name.toLowerCase().indexOf(this.searchQuery.toLowerCase()) > -1)
    }
  }
});
</script>

<style>
ion-skeleton-text {
  border-radius: 50px;
}
</style>