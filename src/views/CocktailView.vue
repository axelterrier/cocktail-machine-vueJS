<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-back-button defaultHref="/" />
                </ion-buttons>
                <ion-title>
                    Détails du cocktail {{ totalAlcoholVolume }}
                </ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content>
            <ion-card>
                <ion-card-header>
                    <ion-card-title>{{ cocktail.Nom_Cocktail }}</ion-card-title>
                </ion-card-header>
                <ion-card-content>
                    <p>{{ cocktail.Description_Cocktail }}</p>
                    <p>Quantité: {{ totalVolume }}cl</p>
                    <p>Taux d'alcool du cocktail : {{ totalAlcoholVolume }}%</p>
                    <p v-if="cocktail.Est_Disponible === 0">Non disponible</p>
                    <p v-if="cocktail.Est_Disponible === 1">Disponible</p>
                    <img :src="toBase64(cocktail.Image_Cocktail)" />
                </ion-card-content>
            </ion-card>
            <h2>Ingrédients</h2>
            <ion-list>
                <ion-item v-for="ingredient in ingredients" :key="ingredient.Ingredient_ID">
                    <ion-label>
                        <h3>{{ ingredient.Ingredient_Name }}</h3>
                        <p>Viscosité: {{ ingredient.Viscosite }}</p>
                        <p>Taux d'alcool: {{ ingredient.Taux_Alcool }}%</p>
                        <p>Quantité : {{ ingredient.Quantite }}cl</p>
                        <p v-if="ingredient.Est_Disponible === 0">Non disponible</p>
                        <p v-if="ingredient.Est_Disponible === 1">Disponible</p>
                    </ion-label>
                    <img :src="toBase64(ingredient.Image_Url)" />
                </ion-item>
            </ion-list>
            <ion-button @click="serveCocktail">Me servir un verre</ion-button>
        </ion-content>
    </ion-page>
</template>

<script>
import { useRouter } from 'vue-router';
import axios from 'axios'
import {
    IonPage
} from '@ionic/vue';

export default {
    components: {
        IonPage,
    },
    data() {
        return {
            cocktail: [],
            ingredients: [],
            loading: true,
            history: [],
        };
    },
    setup() {
        const router = useRouter();
        return { router };
    },
    methods: {
        toBase64(arrayBuffer) {
            if (!arrayBuffer || !arrayBuffer.data) {
                return '';
            }

            return 'data:image/jpeg;base64,' + btoa(
                new Uint8Array(arrayBuffer.data)
                    .reduce((data, byte) => data + String.fromCharCode(byte), '')
            );
        },
        async fetchData() {
            try {
                const response = await axios.get(`http://localhost:8888/api/V1/cocktail/${this.router.currentRoute.value.params.id}`);
                this.cocktail = response.data;

                const ingredientComposition = await axios.get(`http://localhost:8888/api/V1/cocktailcomposition/${this.router.currentRoute.value.params.id}`)
                console.log(ingredientComposition)
                this.ingredients = ingredientComposition.data;

                for (let i = 0; i < this.ingredients.length; i++) {
                    const ingredientResponse = await axios.get(`http://localhost:8888/api/V1/ingredient/${this.ingredients[i].Ingredient_ID}`);
                    const ingredient = ingredientResponse.data[0];
                    ingredient.Quantite = ingredientComposition.data[i].Quantite;
                    this.ingredients[i] = ingredient;

                    const cocktailId = this.cocktail.Cocktail_ID;
                    const ingredientId = ingredient.ID_Ingredient;
                    const quantite = ingredientComposition.data[i].Quantite;
                    const tauxAlcool = ingredient.Taux_Alcool;

                    this.history.push({
                        cocktailId,
                        ingredientId,
                        quantite,
                        tauxAlcool,
                    })

                }
                this.loading = false;
            } catch (error) {
                console.log(error)
            }
        },
        async serveCocktail() {
            try {
                const token = localStorage.getItem("token");
                for (let i = 0; i < this.history.length; i++) {
                    const response = await axios.post(`http://localhost:8888/api/V1/historique/`, {
                        history: this.history[i],
                    }, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                }
                console.log(this.history)
            } catch (error) {
                console.error(error);
            }
        }



    },
    mounted() {
        this.fetchData()
    },
    computed: {
        totalVolume() {
            let total = 0;
            for (let i = 0; i < this.ingredients.length; i++) {
                total += this.ingredients[i].Quantite;
            }
            return total;
        },
        totalAlcoholVolume() {
            let total = 0;
            for (let i = 0; i < this.ingredients.length; i++) {
                total += (this.ingredients[i].Quantite * this.ingredients[i].Taux_Alcool);
            }
            return total / this.totalVolume;
        }
    }

};
</script>
