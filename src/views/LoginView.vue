<template>
  <div class="container">
    <h1 class="title">Connectez-vous avec votre compte Google</h1>
    <GoogleLogin :callback="callback" class="button" />
  </div>
</template>
<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.title {
  margin-bottom: 1rem;
  font-size: 18px;
  font-weight: bold;
}

.button {
  width: 200px;
  height: 40px;
  border-radius: 50px;
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-weight: bold;
  border: none;
  margin-top: 20px;
  cursor: pointer;
  box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.1);
  position: relative;
}

.button:before {
  content: "";
  background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MDAgNDAwIj48cGF0aCBmaWxsPSIjMjM5N2ZmIiBkPSJNMCAwaDQwMHY0MDBIMHoiLz48cGF0aCBkPSJNMTYwLjEgMjA1LjRjLTYuMiAwLTExLjQgNS4yLTExLjQgMTEuNHYxNy44YzAgNi4yIDUuMiAxMS40IDExLjQgMTEuNGgxNzIuNGM2LjIgMCAxMS40LTUuMiAxMS40LTExLjR2LTE3LjhjMC02LjItNS4yLTExLjQtMTEuNC0xMS40aC0xNzIuNHptMTYwLjEtODAuN2gtMzQ0LjJ2MTYxLjloMzQ0LjJ6IiBmaWxsPSIjMjM5N2ZmIi8+PC9zdmc+);
  background-repeat: no-repeat;
  background-size: contain;
  width: 24px;
  height: 24px;
  position: absolute;
  left: 12px;
  top: 8px;
}

.button span {
  color: #2397ff;
  margin-left: 36px;
}
</style>
<script>
import { decodeCredential } from 'vue3-google-login'
import { GoogleLogin } from 'vue3-google-login'
import router from '@/router'
import axios from 'axios';

export default {
  components: {
    GoogleLogin
  },
  data() {
    return {
      age: '',
      poids: '',
      taille: '',
      userData: {},
      callback: (response) => {
        const userData = decodeCredential(response.credential)
        console.log("Handle the userData : \n", userData)
        router.push('/tabs/tab3')
        this.$store.dispatch('setUserData', {
          prenom: userData.given_name,
          nom: userData.family_name,
          photo_url: userData.picture,
          email: userData.email
        });
        this.submitData().then(() => {
          this.retrieveData();
        });
      }
    }
  },

  methods: {
    async submitData() {
      const { prenom, nom, photo_url, email } = this.$store.state.userData;
      try {
        const response = await axios.post('http://localhost:8888/api/V1/utilisateurs', {
          prenom,
          nom,
          photo_url,
          email,
          age: this.age,
          poids: this.poids,
          taille: this.taille
        });
        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    },
    async retrieveData() {
  if (this.$store.state.userData) {
    try {
      const response = await axios.get(`http://localhost:8888/api/V1/utilisateurs/${this.$store.state.userData.email}`)
      console.log("email : " + this.$store.state.userData.email)
      this.userData = response.data
      this.nom = response.data.nom
      this.prenom = response.data.prenom
      this.photo_url = response.data.photo_url
      this.age = response.data.age
      this.poids = response.data.poids
      this.taille = response.data.taille
      this.$store.commit('setUserData', {
        prenom: this.prenom,
        nom: this.nom,
        photo_url: this.photo_url,
        age: this.age,
        poids: this.poids,
        taille: this.taille
      })
      console.log("info récupérées : " + this.age)
    } catch (error) {
      console.error(error)
    }
  } else {
    console.log("pas dans le store")
  }
}

  }
}
</script>