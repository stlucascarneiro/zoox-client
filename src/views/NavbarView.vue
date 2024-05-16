<template>
  <header>
    <nav class="container">
      <img src="https://zooxsmart.com/wp-content/uploads/2022/10/logo2.png" />
      <div class="action">
        <router-link to="/">
          <Button link>
            Clientes
          </Button>
        </router-link>
        <router-link to="/history">
          <Button link>
            Histórico
          </Button>
        </router-link>
      </div>
    </nav>
  </header>
</template>

<script>
import Button from 'primevue/button'
export default {
  components: {
    Button
  }
}
</script>

<style scoped>
  header {
    display: flex;
    justify-content: center;
    box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.1);
  }

  nav {
    height: 108px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  img {
    width: 86px;
    height: 27px;
  }

  button {
    font-weight: 500;
    margin-left: 2rem;
    border-radius: 0;
  }
  
  button:hover{
    border-bottom: 2px solid var(--cyan-400);
  }

  @media (max-width: 1025px){
    nav {
      padding: 0 1rem;
    }

    button {
      margin-left: 4px;
    }
  }

</style>
