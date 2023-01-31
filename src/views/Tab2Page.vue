<script>
import { decodeCredential } from 'vue3-google-login'
import { GoogleLogin } from 'vue3-google-login'
import { googleLogout } from "vue3-google-login"
import router from '@/router'

export default {
  components: {
    GoogleLogin
  },
  data() {
    return {
      callback: (response) => {
        const userData = decodeCredential(response.credential)
        console.log("Handle the userData", userData)
        router.push('/tabs/tab3')
      }
    }
  }
}
</script>
<template>
  <GoogleLogin :callback="callback" />
</template>