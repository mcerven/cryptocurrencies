<template>
  <div class="pagination">
      <a v-if="page > minPage" :href="`${url}${page - 1}`">
        &#60;
      </a>

      <a v-if="page > minPage" :href="`${url}${minPage}`">
        &nbsp;{{minPage}}&nbsp;
      </a>
      
      <div v-if="page - nextLinksCount - 1 > minPage" class="inline-block">
        ...
      </div>

      <a
        v-for="previousPageLink in previousPageLinks"
        :key="previousPageLink"
        :href="`${url}${previousPageLink}`"
      >
        &nbsp;{{previousPageLink}}&nbsp;
      </a>

      <div class="inline-block">
        &nbsp;{{page}}&nbsp;
      </div>

      <a
        v-for="nextPageLink in nextPageLinks"
        :key="nextPageLink"
        :href="`${url}${nextPageLink}`"
      >
        &nbsp;{{nextPageLink}}&nbsp;
      </a>

      <div v-if="page + nextLinksCount + 1 < maxPage" class="inline-block">
        ...
      </div>

      <a v-if="page < maxPage" :href="`${url}${maxPage}`">
        &nbsp;{{maxPage}}&nbsp;
      </a>

      <a v-if="page < maxPage" :href="`${url}${page + 1}`">
        &#62;
      </a>
    </div>
</template>

<script>
import { computed } from 'vue';

export default {
  name: 'Pagination',
  props: {
    url: {
      type: String,
      required: true,
    },
    page: {
      type: Number,
      required: true,
    },
    minPage: {
      type: Number,
      default: 1,
    },
    maxPage: {
      type: Number,
      required: true,
    },
    nextLinksCount: {
      type: Number,
      default: 2,
    },
  },
  setup(props) {
    const previousPageLinks = computed(() => {
      const result = [];

      for (let i = -props.nextLinksCount; i <= -1; i++) {
        const value = props.page + i;
        if (value > props.minPage) {
          result.push(value);
        }
      }
      return result;
    });

    const nextPageLinks = computed(() => {
      const result = [];

      for (let i = 1; i <= props.nextLinksCount; i++) {
        const value = props.page + i;
        if (value < props.maxPage) {
          result.push(value);
        }
      }
      return result;
    });

    return {
      previousPageLinks,
      nextPageLinks,
    }
  }
}
</script>

<style scoped>
  .inline-block {
    display: inline-block;
  }
</style>