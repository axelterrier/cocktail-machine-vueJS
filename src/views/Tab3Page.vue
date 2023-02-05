<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Profil</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding ion-text-center">
      <div class="profile-header">
        <img :src="userData.photo_url" class="profile- picture" />
        <h2 class="ion-text-uppercase">{{ userData.prenom }} {{ userData.nom }}</h2>
        <p>{{ userData.email }}</p>
      </div>
      <form>
        <ion-item>
          <ion-label position="stacked">Prénom</ion-label>
          <ion-input type="text" v-model="userData.prenom"></ion-input>
        </ion-item>
        <ion-item>
          <ion-label position="stacked">Nom</ion-label>
          <ion-input type="text" v-model="userData.nom"></ion-input>
        </ion-item>
        <ion-item>
          <ion-label position="stacked">Age</ion-label>
          <ion-input type="number" v-model="userData.age"></ion-input>
        </ion-item>
        <ion-item>
          <ion-label position="stacked">Poids (en kg)</ion-label>
          <ion-input type="number" v-model="userData.poids"></ion-input>
        </ion-item>
        <ion-item>
          <ion-label position="stacked">Taille (en cm)</ion-label>
          <ion-input type="number" v-model="userData.taille"></ion-input>
        </ion-item>
      </form>
      <ion-button @click="saveChanges" color="primary">Enregistrer les modifications</ion-button>
      <ion-button @click="logout" color="dark">Déconnexion</ion-button>
    </ion-content>
  </ion-page>
</template>


<script>
import { defineComponent } from 'vue';
import { mapState, mapActions } from 'vuex';
import { googleLogout } from 'vue3-google-login';
import { useRouter } from 'vue-router';
import axios from 'axios';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonInput,
  IonLabel,
  IonItem,
  IonButton
} from '@ionic/vue';

export default defineComponent({
  components: {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonInput,
    IonLabel,
    IonItem,
    IonButton,
  },
  async created() {
    try {
      const response = await axios.get(`http://localhost:8888/api/V1/utilisateurs/${this.userData.email}`)
      this.userData = response.data
      console.log("email : " + this.userData.email)
    } catch (error) {
      console.error(error)
    }
  },
  computed: {
    ...mapState({
      userData: state => state.userData
    })
  },
  methods: {
    ...mapActions({
      updateUserInfo: 'updateUserInfo'
    }),
    logout() {
      googleLogout()
      this.$router.push('/')
    },
    async saveChanges() {
      try {
        const response = await axios.put(`http://localhost:8888/api/V1/utilisateurs/${this.userData.email}`, this.userData)
        console.log("Données mises à jour : ", response.data)
      } catch (error) {
        console.error(error)
      }
    },
    async retrieveData() {
      if (this.$store.state.userData) {
        try {
          const response = await axios.get(`http://localhost:8888/api/V1/utilisateurs/${this.$store.state.userData.email}`)
          this.userData = response.data[0]
          this.updateUserInfo(this.userData)
          this.nom = response.data[0].nom
          this.prenom = response.data[0].prenom
          this.photo_url = response.data[0].photo_url
          this.age = response.data[0].age
          this.poids = response.data[0].poids
          this.taille = response.data[0].taille
          console.log("info récupérées : " + response.data[0].age)
        } catch (error) {
          console.error(error)
        }
      } else {
        console.log("pas dans le store")
      }
    }

  },
  setup() {
    const router = useRouter()
    return { router }
  }
});
</script>

<style scoped>
.profile-header {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.profile-picture {
  border-radius: 50%;
  width: 200px;
  height: 200px;
  margin-bottom: 20px;
  object-fit: cover;
}

h2 {
  font-weight: bold;
  margin-bottom: 10px;
  color: #333;
}

p {
  color: #333;
  font-size: 16px;
  text-align: left;
}
</style>
