<template>
    <div>
        <div v-for="item in items">
            <slot :item="item"></slot>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['query'],

        data () {
            return {
                 items: []
            }
        },

        mounted () {
            axios.post(`/api/querify`, {query: this.query}).then(response => {
                this.items = response.data.items;
            });
        }
    }
</script>
