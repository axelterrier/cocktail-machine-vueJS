import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import TabsPage from '../views/TabsPage.vue'
import RegisterView from '../views/RegisterView.vue'
import LoginView from '../views/LoginView.vue'

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: RegisterView
    },
    {
      path: '/login',
      component: LoginView
    },
    {
      path: '/cocktail/:id',
      component: () => import('@/views/CocktailView.vue'),
      name: 'CocktailView'
    },
    {
      path: '/settings/stats',
      component: () => import('@/views/StatsView.vue'),
      name: 'StatsView'
    },
    {
      path: '/tabs/',
      component: TabsPage,
      children: [
        {
          path: '',
          redirect: '/tabs/tab2'
        },
        {
          path: 'tab1',
          component: () => import('@/views/IngredientsView.vue'),
          name: 'IngredientView'
        },
        {
          path: 'tab2',
          component: () => import('@/views/CocktailsView.vue')
        },
        {
          path: 'tab3',
          component: () => import('@/views/SettingsView.vue')
        }
      ],
      beforeEnter: (to, from, next) => {
        const token = localStorage.getItem("token");
        if (token) {
          next();
        } else {
          next({
            path: "/login",
          });
        }
      }
    }
  ]
})

export default router