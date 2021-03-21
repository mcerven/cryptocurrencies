<template>
  <div>
    <router-link to="/">
      Back
    </router-link>
    <br />
    <br />
    {{id}}
    <CoinChart :v-if="prices.length > 0" :prices="prices" />
  </div>
</template>

<script>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import CoinChart from './CoinChart.vue';

export default {
  name: 'Coin',
  components: {
    CoinChart,
  },
  props: {
  },
  setup() {
    let prices = ref([]);

    const { id } = useRoute().params;
    const vsCurrency = 'usd';
    const days = 7;

    const url = `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=${vsCurrency}&days=${days}`;

    onMounted(async () => {
      try {
        const result = await fetch(url);
        const jsonResult = await result.json();
        
        prices.value = jsonResult.prices.map(([timestamp, price]) =>
          ({
            date: new Date(timestamp),
            price,
          })
        );
      } catch (err) {
        console.error(err);
      }
    });

    return {
      id,
      prices,
    };
  }
}
</script>