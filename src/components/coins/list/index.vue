<template>
  <div class="List">
    <table>
      <thead>
        <tr>
          <td>#</td>
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
    <Pagination
      url="\?page="
      :page="page"
      :minPage="minPage"
      :maxPage="maxPage"
    />
  </div>
</template>

<script>
import { computed, ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import ListItem from './ListItem.vue';
import Pagination from './Pagination.vue';

export default {
  name: 'List',
  components: {
    ListItem,
    Pagination,
  },
  setup() {
    const listLength = 1000;
    const perPage = 20;
    const minPage = 1;
    const maxPage = Math.ceil(listLength / perPage);

    const list = ref([]);
    const page = ref(minPage);

    const currencyCode = ref('usd');
    const currencyHumanized = computed(() => currencyCode.value.toUpperCase());

    onMounted(async () => {
      const { page: pageQueryParam } = useRoute().query;
      if (pageQueryParam && !isNaN(pageQueryParam)) {
        page.value = Number(pageQueryParam);
      }
      
      const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currencyCode.value}&order=market_cap_desc&per_page=${perPage}&page=${page.value}&sparkline=false`;

      try {
        const res = await fetch(url);
        list.value = await res.json();
      } catch (err) {
        console.error(err);
      }
    });
    
    return {
      page,
      minPage,
      maxPage,
      list,
      currencyCode,
      currencyHumanized,
    };
  }
}
</script>

<style scoped>
</style>
