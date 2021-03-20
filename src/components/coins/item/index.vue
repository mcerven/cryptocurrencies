<template>
  coin {{id}}
</template>

<script>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

export default {
  name: 'Coin',
  props: {
  },
  setup() {
    const coin = ref(null);

    const { id } = useRoute().params;
    const url = `https://api.coingecko.com/api/v3/coins/${id}`;

    onMounted(async () => {
      try {
        const res = await fetch(url);
        coin.value = await res.json();
        console.log(coin);
      } catch (err) {
        console.error(err);
      }
    });

    return {
      id
    };
  }
}
</script>