  <template>
    <div class="container">

      <div class="q-pa-md">
        <q-carousel animated v-model="slide" arrows navigation infinite class="carousel">
          <q-carousel-slide :name="1"
            img-src="https://cdnb.artstation.com/p/assets/images/images/077/911/955/large/wlop-4se.jpg?1720679230" />
          <q-carousel-slide :name="2"
            img-src="https://cdna.artstation.com/p/assets/images/images/077/097/020/large/wlop-6se.jpg?1718603887" />
          <q-carousel-slide :name="3"
            img-src="https://cdnb.artstation.com/p/assets/images/images/047/969/347/large/wlop-46se.jpg?1648879300" />
          <q-carousel-slide :name="4"
            img-src="https://cdna.artstation.com/p/assets/images/images/017/609/282/large/wl-op-3s.jpg?1556677761" />
        </q-carousel>
      </div>


      <div class="q-pa-md icons">
        <div class="div">
          <div class="icon-container">
            <q-icon name="badge" class="icon"></q-icon>
          </div>
        </div>
        <div class="div">
          <div class="icon-container">
            <q-icon name="apps" class="icon"></q-icon>
          </div>
        </div>
        <div class="div">
          <div class="icon-container">
            <q-icon name="terminal" class="icon"></q-icon>
          </div>
        </div>
        <div class="div">
          <div class="icon-container">
            <q-icon name="rocket_launch" class="icon"></q-icon>
          </div>
        </div>
        <div class="div">
          <div class="icon-container">
            <q-icon name="thunderstorm" class="icon"></q-icon>
          </div>
        </div>
        <div class="div">
          <div class="icon-container">
            <q-icon name="badge" class="icon"></q-icon>
          </div>
        </div>
      </div>
    </div>

  </template>


<script setup>
  import { ref } from 'vue';
  const slide = ref(1);

</script>

<style scoped>
  .container {
    background-color: #EDF2F4;
    min-height: 100vh;

  }

  .carousel {
    border-radius: 20px;
    height: 35vh;
  }

  .icons {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 10px;
    text-align: justify;
    background-color: white;
    width: 95%;
    margin: 0 auto;
    border-radius: 10px;
  }


  .div {
    width: 100%;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
  }


  .icon {
    width: 60px;
    height: 60px;
    font-size: 30px;
    color: white;
    display: flex;
    background-color: #D90429;
    border-radius: 10px;
    align-items: center;
    text-align: center;
  }

</style>