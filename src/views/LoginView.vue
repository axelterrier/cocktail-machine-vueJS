<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-title>
                    Connexion
                </ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
            <ion-list>
                <ion-item>
                    <ion-icon :icon="mailOutline" slot="start" style="vertical-align: middle;"></ion-icon>
                    <ion-label position="floating">Adresse email</ion-label>
                    <ion-input type="email" v-model="email" @input="email = $event.target.value"></ion-input>
                </ion-item>
                <ion-item>
                    <ion-icon :icon="lockOpenOutline" slot="start" style="vertical-align: middle;"></ion-icon>
                    <ion-label position="floating">Mot de passe</ion-label>
                    <ion-input v-model="password" @input="password = $event.target.value"
                        :type="showPassword ? 'text' : 'password'"></ion-input>
                    <ion-icon :icon="showPassword ? eye : eyeOff" slot="end"
                        @click="showPassword = !showPassword"></ion-icon>

                </ion-item>
            </ion-list>
            <ion-button expand="block" @click="login">Se connecter</ion-button>
            <ion-label class="ion-text-center" style="margin-top: 1em">ou</ion-label>
            <ion-button expand="block" @click="goToRegister">S'inscrire</ion-button>
        </ion-content>
    </ion-page>
</template>

<script>
import axios from 'axios';
import { useRouter } from 'vue-router';

import {
    alertController,
    IonPage,
    IonIcon,
} from '@ionic/vue';

import {
    mailOutline,
    eye,
    eyeOff,
    lockOpenOutline,
} from "ionicons/icons"

export default {
    components: {
        IonPage,
        IonIcon,
    },
    setup() {
        const router = useRouter();
        return { router };
    },
    data() {
        return {
            email: '',
            password: '',
            lockOpenOutline,
            mailOutline,
            eye,
            eyeOff,
            showPassword: false,
            showConfirmPassword: false
        }
    },
    methods: {

        async login() {

            console.log("email : " + this.email)
            console.log("mpd : " + this.password)

            if (!this.email || !this.password) {
                const presentAlert = async () => {
                    const alert = await alertController.create({
                        header: 'Champs non remplis',
                        subHeader: 'Important message',
                        message: 'Tous les champs sont necessaires',
                        buttons: ['OK'],
                    });

                    await alert.present();
                };
                presentAlert()
                return
            }

            const response = await axios.post('http://localhost:8888/api/V1/login', {
                email: this.email,
                password: this.password,
            });

            const emailCheckResponse = await axios.get(`http://localhost:8888/api/V1/utilisateurs/${this.email}`);

            const { token, error } = response.data;
            console.log(response)
            if (error) {
                if (error === "Mot de passe incorrect.") {
                    const presentAlert = async () => {
                        const alert = await alertController.create({
                            header: 'Erreur',
                            subHeader: 'Important message',
                            message: 'Le mot de passe est incorrect',
                            buttons: ['OK'],
                        });
                        await alert.present();
                    };
                    presentAlert();
                } else if (emailCheckResponse.data.error === "Aucun utilisateur trouvé avec cet email.") {
                    const presentAlert = async () => {
                        const alert = await alertController.create({
                            header: 'Erreur',
                            subHeader: 'Important message',
                            message: 'Aucun utilisateur trouvé avec cet email',
                            buttons: ['OK'],
                        });
                        await alert.present();
                    };
                    presentAlert();
                }
            }else{
                console.log(`Token : ${token}`);
                    // Stocker le token dans le localStorage pour une utilisation ultérieure
                    localStorage.setItem('token', token);
                    //REDIRECT
                    this.router.push({ path: '/tabs/tab2' });
            }
        },
        goToRegister() {
            this.router.push({ path: '/' });
        }
    }
}
</script>