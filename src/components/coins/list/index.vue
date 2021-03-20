<template>
  <div class="List">
    <table>
      <thead>
        <tr>
          <td>Asset</td>
          <td>Price ({{currencyHumanized}})</td>
          <td>Market Cap</td>
          <td>Circulating Supply</td>
          <td>Total Supply</td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in list" :key="item.id">
          <ListItem :item="item" />
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { computed, onMounted, ref } from 'vue';
import ListItem from './ListItem.vue';
export default {
  name: 'List',
  components: {
    ListItem
  },
  setup() {
    const list = ref([]);
    const currencyCode = ref('usd');
    const currencyHumanized = computed(() => currencyCode.value.toUpperCase());

    onMounted(async () => {
      const perPage = 10;
      const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currencyCode.value}&order=market_cap_desc&per_page=${perPage}&page=1&sparkline=false`;

      try {
        const res = await fetch(url);
        list.value = await res.json();
        console.log(list.value);
      } catch (err) {
        console.error(err);
      }
    });

    return {
      list,
      currencyCode,
      currencyHumanized,
    }
  }
}
</script>

<style scoped>
</style>
