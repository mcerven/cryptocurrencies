<template>
  <td>
    <img width="30" :src="item.image" :alt="item.name" />
    <router-link :to="createUrl(item.id)">{{item.name}} {{item.symbol}}</router-link>
  </td>
  <td>{{formatNumber(item.current_price)}}</td>
  <td>{{formatNumber(item.market_cap)}}</td>
  <td>{{formatNumber(item.circulating_supply)}}</td>
  <td>{{formatNumber(item.total_supply)}}</td>
</template>

<script>
export default {
  name: 'ListItem',
  props: {
    item: {
      type: Object,
      required: true,
    }
  },
  setup() {
    const createUrl = id => `/coin/${id}`;
    const formatNumber = num => num?.toLocaleString();

    return {
      createUrl,
      formatNumber,
    };
  }
}
</script>