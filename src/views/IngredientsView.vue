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
      availableIngredients: [],
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
      this.availableIngredients = this.ingredients
      .filter(ingredient => ingredient.Est_Disponible)
      .map(ingredient => ingredient.ID_Ingredient)
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
      if (ingredient.Est_Disponible === 1) {
        this.availableIngredients.push(ingredient.ID_Ingredient)
      } else {
        const index = this.availableIngredients.indexOf(ingredient.ID_Ingredient)
        if (index > -1) {
          this.availableIngredients.splice(index, 1)
        }
      }
      console.log("Ingr Dispo" + this.availableIngredients)
      await this.saveChanges(ingredient);
      await this.updateCocktails()
    },
    async saveChanges(ingredient) {
      try {
        const response = await axios.put(`http://localhost:8888/api/V1/ingredients/${ingredient.ID_Ingredient}`, {
          Est_Disponible: ingredient.Est_Disponible
        });
        // mettre à jour les données localement
        //this.ingredients = this.ingredients.map(i => i.ID_Ingredient === ingredient.ID_Ingredient ? { ...i, Est_Disponible: response.data.Est_Disponible } : i)
        //console.log("ingredients : " + this.ingredients)
      } catch (error) {
        console.error("error :" + error)
      }
    },
    async updateCocktails() {
      try {
        const response = await axios.get('http://localhost:8888/api/V1/cocktailcomposition')
        this.cocktailcomposition = response.data
      
        const grouped = response.data.reduce((acc, curr) => {
          const { ID_Cocktail, Ingredient_ID, Quantite } = curr;
          if (!acc[ID_Cocktail]) {
            acc[ID_Cocktail] = [];
          }
          acc[ID_Cocktail].push({ Ingredient_ID, Quantite });
          return acc;
        }, {});

        const result = Object.keys(grouped).map(ID_Cocktail => ({
          ID_Cocktail,
          ingredients: grouped[ID_Cocktail]
        }));
        
        for (const cocktail of result) {
          let isAllIngredientsAvailable = true;
          for (const ingredient of cocktail.ingredients) {
            if (!this.availableIngredients.includes(ingredient.Ingredient_ID)) {
              isAllIngredientsAvailable = false;
              break;
            }
          }
          if (isAllIngredientsAvailable) {
            console.log(cocktail);
            try {
              const response = await axios.put(`http://localhost:8888/api/V1/cocktail/${cocktail.ID_Cocktail}`, {
                Est_Disponible: 1
              });
            } catch (error) {
              console.error("error :" + error)
            }
          }else{
            try {
              const response = await axios.put(`http://localhost:8888/api/V1/cocktail/${cocktail.ID_Cocktail}`, {
                Est_Disponible: 0
              });
            } catch (error) {
              console.error("error :" + error)
            }
          }
        }


        //AJOUTER UPDATE COCKTAIL
        //Laisser l'alerte à la toute fin d'execution
        if (this.activeCount >= 10) {
          const alert = await alertController.create({
            header: 'Oh doucement malheureux',
            message: 'Le nombre maximal d\'ingrédients sélectionnés est atteint !',
            buttons: ['OK']
          });
          await alert.present();
          return;
        }
      } catch (error) {
        console.error(error)
      }
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