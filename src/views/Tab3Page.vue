<script>
import { decodeCredential } from 'vue3-google-login'
import { GoogleLogin } from 'vue3-google-login'
import { googleLogout } from "vue3-google-login"
import router from '@/router'

export default {

  data() {
    return {
      logout() {
        googleLogout()
        console.log("deconnecté")
        router.push('/tabs/tab2')
      }
    }
  }

}
</script>
<template>
  <h1 @click="logout">Se déconnecter</h1>
</template>