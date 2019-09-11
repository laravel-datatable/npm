<template>
    <v-select
        multiple
        :options="filter.options"
        v-model="selectedFilters[column]">
    </v-select>
</template>

<script>
    export default {
        props: ['filter', 'selectedFilters', 'column'],
    }
</script>
