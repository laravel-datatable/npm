<template>
    <div>
        <slot :value="value" :change="change">
            <input type="text" v-model="searchString" v-on:input="change(searchString)">

            <ul v-if="showOptions">
                <li v-for="option in options" v-on:click="select(option)">{{ option }}</li>
            </ul>
        </slot>
    </div>
</template>

<script>
    import {EventBus} from '../../event-bus';
    import DatatableFilterInputMixin from '../../mixins/DatatableFilterInputMixin';

    export default {
        mixins: [DatatableFilterInputMixin],

        data () {
            return {
                searchString: null,
                showOptions: false,
                options: [],
            }
        },

        mounted () {
            EventBus.$on(['datatable:filters-resetted'], () => {
                this.searchString = null;
            });
        },

        watch: {
            searchString: function (value) {
                this.getOptions();
            }
        },

        methods: {
            select (option) {
                this.value = option;
                this.searchString = option;
                this.change();
                this.showOptions = false;
            },

            getOptions () {
                axios.post(`/api/laravel-datatable/filters/search`, {
                    value: this.value,
                    filterName: this.filter.name,
                    query: this.filter.query
                })
                     .then(response => {
                        this.options = response.data;
                        this.showOptions = true;
                     })
                     .catch(errors => {});
            }
        }
    }
</script>
