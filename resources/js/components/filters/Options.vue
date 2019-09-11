<template>
    <v-select
        multiple
        :options="filter.options"
        v-on:input="$emit('input')">
    </v-select>
</template>

<script>
    export default {
        props: ['filter', 'selectedFilters', 'column'],

        mounted () {

        }
    }
</script>
