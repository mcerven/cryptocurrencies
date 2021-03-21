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
    <div class="pagination">
      <a v-if="page > minPage" :href="`/?page=${page - 1}`">&#60;</a>
      <a v-if="page > minPage" :href="`/?page=${minPage}`">&nbsp;{{minPage}}&nbsp;</a>
      <div v-if="page - nextLinksCount - 1 > minPage" class="currentPageLink" style="display: inline-block;">
        ...
      </div>
      <a
        v-for="previousPageLink in previousPageLinks"
        :key="previousPageLink"
        :href="`/?page=${previousPageLink}`"
      >
        &nbsp;{{previousPageLink}}&nbsp;
      </a>
      <div class="currentPageLink" style="display: inline-block;">
        &nbsp;{{page}}&nbsp;
      </div>
      <a
        v-for="nextPageLink in nextPageLinks"
        :key="nextPageLink"
        :href="`/?page=${nextPageLink}`"
      >
        &nbsp;{{nextPageLink}}&nbsp;
      </a>
      <div v-if="page + nextLinksCount + 1 < maxPage" class="currentPageLink" style="display: inline-block;">
        ...
      </div>
      <a v-if="page < maxPage" :href="`/?page=${maxPage}`">&nbsp;{{maxPage}}&nbsp;</a>
      <a v-if="page < maxPage" :href="`/?page=${page + 1}`">&#62;</a>
    </div>
  </div>
</template>

<script>
import { computed, ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import ListItem from './ListItem.vue';

export default {
  name: 'List',
  components: {
    ListItem
  },
  setup() {
    const listLength = 1000;
    const perPage = 20;
    const minPage = 1;
    const maxPage = Math.ceil(listLength / perPage);
    const nextLinksCount = 2;

    const list = ref([]);
    const page = ref(minPage);

    const previousPageLinks = computed(() => {
      const result = [];

      for (let i = -nextLinksCount; i <= -1; i++) {
        const value = page.value + i;
        if (value > minPage)
          result.push(value);
      }
      return result;
    });

    const nextPageLinks = computed(() => {
      const result = [];

      for (let i = 1; i <= nextLinksCount; i++) {
        const value = page.value + i;
        if (value < maxPage)
          result.push(value);
      }
      return result;
    });

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
      previousPageLinks,
      nextPageLinks,
      nextLinksCount,
    };
  }
}
</script>

<style scoped>
</style>
