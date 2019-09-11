<script>
    import Popper from 'vue-popperjs';
    import 'vue-popperjs/dist/vue-popper.css';
    export default {
        props: {
            query: { type: String, required: true },
            inject: { type: Object },
            resourceNameSingular: { type: String, default: 'item', },
            resourceNamePlural: { type: String, default: 'items', },
            itemsPerPage: { type: Number, default: 10, },
            itemsPerPageOptions: { type: Array, default: () => [10, 25, 50, 100], },
            params: { type: Object },
            hideItemsPerPage: { type: Boolean, default: false, },

            // data
            loading: { type: Boolean, default: false, },
        },

        components: {
            'popper': Popper
        },

        // data () {
        //     return {
        //         columns: [],
        //         rows: [],
        //         loading: false,
        //         data: {},
        //         sortings: [],
        //         searchString: null,
        //         isTyping: false,
        //         perPage: 10,
        //         pagination: false,
        //         searchable: false,

        //         requiresSearch: false,
        //         requiresSearchLength: 1,

        //         selectedFilters: {},

        //         // Sorting
        //         sortable: false,
        //         sortableColumns: [],
        //         currentSorting: {column: null, direction: null},
        //     }
        // },

        render () {
            return this.$scopedSlots.default({
                query: this.query,
                inject: this.inject,
                resourceNameSingular: this.resourceNameSingular,
                resourceNamePlural: this.resourceNamePlural,
                itemsPerPage: this.itemsPerPage,
                itemsPerPageOptions: this.itemsPerPageOptions,
                params: this.params,
                hideItemsPerPage: this.hideItemsPerPage,

                // data
                loading: this.loading,
            });
        }
    }
</script>
