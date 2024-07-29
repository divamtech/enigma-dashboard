<template>
  <div class="container top-0 position-sticky z-index-sticky">
    <div class="row">
      <div class="col-12">
        <navbar isBlur="blur  border-radius-lg my-3 py-2 start-0 end-0 mx-4 shadow" v-bind:darkMode="true" isBtn="bg-gradient-success" />
      </div>
    </div>
  </div>
  <main class="mt-0 main-content">
    <section>
      <div class="page-header min-vh-100">
        <div class="container">
          <div class="row">
            <div class="mx-auto col-xl-4 col-lg-5 col-md-7 d-flex flex-column mx-lg-0">
              <div class="card card-plain">
                <div class="pb-0 card-header text-start">
                  <h4 class="font-weight-bolder">Sign In</h4>
                  <p class="mb-0">Enter your email and password to sign in</p>
                </div>
                <div class="card-body">
                  <form role="form" @submit="handleSubmit">
                    <div class="mb-3">
                      <argon-input v-model="formData.email.value" id="email" type="email" placeholder="Email" name="email" size="lg" />
                    </div>
                    <div class="mb-3">
                      <argon-input v-model="formData.password.value" id="password" type="password" placeholder="Password" name="password" size="lg" />
                    </div>
                    <argon-switch v-model="formData.rememberMe" id="rememberMe" name="remember-me">Remember me</argon-switch>

                    <div class="text-center">
                      <argon-button type="submit" class="mt-4" variant="gradient" color="success" fullWidth size="lg">Sign in</argon-button>
                    </div>
                  </form>
                </div>
                <!-- Display success message -->
                <div v-if="successMessage" class="success-message">
                  {{ successMessage }}
                </div>

                <!-- Display error message -->
                <div v-if="errorMessage" class="error-message">
                  {{ errorMessage }}
                </div>
                <div class="px-1 pt-0 text-center card-footer px-lg-2">
                  <p class="mx-auto mb-4 text-sm">
                    Don't have an account?
                    <a href="./Signup.vue" class="text-success text-gradient font-weight-bold">Sign up</a>
                  </p>
                </div>
              </div>
            </div>
            <div class="top-0 my-auto text-center col-6 d-lg-flex d-none h-100 pe-0 position-absolute end-0 justify-content-center flex-column">
              <div
                class="position-relative bg-gradient-primary h-100 m-3 px-7 border-radius-lg d-flex flex-column justify-content-center overflow-hidden"
                style="
                  background-image: url('https://raw.githubusercontent.com/creativetimofficial/public-assets/master/argon-dashboard-pro/assets/img/signin-ill.jpg');
                  background-size: cover;
                "
              >
                <span class="mask bg-gradient-success opacity-6"></span>
                <h4 class="mt-5 text-white font-weight-bolder position-relative">"Attention is the new currency"</h4>
                <p class="text-white position-relative">
                  The more effortless the writing looks, the more effort the writer actually put into the process.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
<script setup>
import { onBeforeUnmount, onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import Navbar from '@/examples/PageLayout/Navbar.vue'
import ArgonInput from '@/components/ArgonInput.vue'
import ArgonSwitch from '@/components/ArgonSwitch.vue'
import ArgonButton from '@/components/ArgonButton.vue'
import axios from 'axios'
import { ref } from 'vue'

const body = document.getElementsByTagName('body')[0]

const router = useRouter()
const store = useStore()
onBeforeMount(() => {
  store.state.hideConfigButton = true
  store.state.showNavbar = false
  store.state.showSidenav = false
  store.state.showFooter = false
  body.classList.remove('bg-gray-100')
})
onBeforeUnmount(() => {
  store.state.hideConfigButton = false
  store.state.showNavbar = true
  store.state.showSidenav = true
  store.state.showFooter = true
  body.classList.add('bg-gray-100')
})

const formData = {
  email: ref(''),
  password: ref(''),
  rememberMe: ref(false),
}
const successMessage = ref('')
const errorMessage = ref('')

// Function to handle form submission
const handleSubmit = async (event) => {
  event.preventDefault() // Prevent default form submission
  console.log('data :', formData)

  try {
    const response = await axios.post(
      '/api/auth/signin',
      {
        email: formData.email.value,
        password: formData.password.value,
        // rememberMe: formData.rememberMe.value
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      },
    )

    console.log('Response from backend:', response.data)
    if (response.data) {
      successMessage.value = 'Successfully signed in!'
      await store.dispatch('setAuth', true)
      router.push({ name: 'Dashboard' })
    }

    // sessionStorage.authToken = response.data.accessToken
  } catch (error) {
    await store.dispatch('setAuth', false)

    errorMessage.value = 'An error occurred during sign in. Please try again.'
    console.error('Error while signing in:', error)
    // Optionally, you can handle error response here
    // e.g., show an error message to the user
  }
}
</script>

<style lang="scss" scoped>
.success-message {
  color: green;
}

.error-message {
  color: red;
}
</style>
