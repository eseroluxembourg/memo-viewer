<template>
  <h2 class="list-title" v-if="items.length > 0">
    <div
      class="badge"
      :class="getLinkStyle('badge-', badgeStatus)"
      v-if="withBadge"
    >
      {{ items.length }}
    </div>
    <span v-if="items.length <= 1">{{ nameSingular }}</span>
    <span v-if="items.length > 1">{{ namePlural }}</span>
  </h2>
</template>

<script>
export default {
  name: 'ListTitle',
  props: {
    nameSingular: String,
    namePlural: String,
    withBadge: { type: Boolean, default: true },
    badgeStatus: String,
    items: Object,
  },
  methods: {
    getLinkStyle(classPrefix, linkStatus) {
      return {
        [classPrefix + 'valid']: linkStatus === 'valid',
        [classPrefix + 'optional']: linkStatus === 'optional',
        [classPrefix + 'invalid']: linkStatus === 'invalid',
      };
    },
  },
};
</script>

<style scoped>
.list-title {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
}

.badge {
  color: #ffffff;
  background-color: #706f71;
  margin: 0 0.5rem;
  width: 2rem;
  height: 2rem;
  border-radius: 1rem;
  display: inline-block;
  font-size: 1.6rem;
  text-shadow: var(--secondary) 1px 1px;
  box-shadow: 1px 1px 0px #706f71;
}

.badge-valid {
  color: #ffffff;
  text-shadow: var(--secondary) 1px 1px;
  background-color: var(--primary);
  box-shadow: 1px 1px 0px #706f71;
}

.badge-optional {
  color: #ffffff;
  text-shadow: var(--primary) 1px 1px;
  background-color: rgb(255, 221, 103);
  box-shadow: 1px 1px 0px #706f71;
}

.badge-invalid {
  color: #ffffff;
  text-shadow: var(--primary) 1px 1px;
  background-color: var(--secondary);
  box-shadow: 1px 1px 0px #706f71;
}
</style>
