<template>
  <select v-model="targetCurrency" name="targetCurrency">
    <option v-for="currency in targetCurrencies"
      :key="currency"
      :value="currency"
    >
      {{ humanize(currency) }}
    </option>
  </select>
  <div class="List">
    <table>
      <thead>
        <tr>
          <td>#</td>
          <td>Asset</td>
          <td>Price ({{humanize(targetCurrency)}})</td>
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
      :url="paginationUrl"
      :page="page"
      :minPage="minPage"
      :maxPage="maxPage"
    />
  </div>
</template>

<script>
import { computed, ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
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
    const targetCurrencies = ['usd', 'eur', 'cny', 'czk', 'gbp', 'jpy', 'krw', 'rub'];

    const page = ref(minPage);
    const list = ref([]);
    const targetCurrency = ref(targetCurrencies[0]);

    const humanize = (value) => value.toUpperCase();
    const paginationUrl = computed(() => `/?targetCurrency=${targetCurrency.value}&page=`);

    const route = useRoute();
    const router = useRouter();

    onMounted(async () => {
      const { page: pageQueryParam, targetCurrency: currencyQueryParam } = route.query;
      
      if (pageQueryParam && !isNaN(pageQueryParam)) {
        page.value = Number(pageQueryParam);
      }

      const normalizedCurrencyQueryParam = currencyQueryParam?.toLowerCase();
      if (normalizedCurrencyQueryParam && targetCurrencies.includes(normalizedCurrencyQueryParam)) {
        targetCurrency.value = normalizedCurrencyQueryParam;
      }

      list.value = await fetchCurrencies(targetCurrency.value, perPage, page.value);
    });
    
    watch([targetCurrency, page], async () => {
      router.replace({ name: 'List',
        query: {
          targetCurrency: targetCurrency.value,
          page: page.value,
        }
      });

      list.value = await fetchCurrencies(targetCurrency.value, perPage, page.value);
    });
    
    return {
      page,
      minPage,
      maxPage,
      list,
      targetCurrencies,
      targetCurrency,
      humanize,
      paginationUrl,
    };
  }
}

async function fetchCurrencies(targetCurrency, perPage, page = 1) {
  const url=`https://api.coingecko.com/api/v3/coins/markets?vs_currency=${targetCurrency}&order=market_cap_desc&per_page=${perPage}&page=${page}&sparkline=false`;

  try {
    const res = await fetch(url);
    return await res.json();
  } catch(err) {
    console.error(err);
  }
}
</script>
