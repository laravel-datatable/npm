import {EventBus} from '../event-bus';
import DatatableFilterMixin from './DatatableFilterMixin';

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
    },

    mixins: [DatatableFilterMixin],

    data () {
        return {
            // columns: [],
            rows: [],
            loading: false,
            data: {},
            sortings: [],
            searchString: null,
            isTyping: false,
            perPage: 10,
            pagination: false,
            searchable: false,

            requiresSearch: false,
            requiresSearchLength: 1,

            // filtering
            selectedFilters: {},

            // Sorting
            sortable: false,
            sortableColumns: [],
            currentSorting: {column: null, direction: null},

            // exp
            columnsNew: [],
        }
    },

    watch: {
        searchString: _.debounce(function() {
            this.isTyping = false;
        }, 350),

        isTyping: function(value) {
            if (!value) {
                this.search(this.searchString);
            }
        }
    },

    async mounted () {
        await this.getResults();

        this.perPage = this.itemsPerPage;

        EventBus.$on(['datatable:filters-applied'], () => {
            this.getResults();
        });

        EventBus.$on(['datatable:filter-input'], (filter, value) => {
            this.$set(this.selectedFilters, filter.name, value);
        });

        EventBus.$on(['datatable:filters-resetted'], () => {
            this.selectedFilters = {};
            this.getResults();
        });
    },

    methods: {
        /**
         * Retrive the columns.
         *
         * @return Array
         */
        columns () {
            return _.filter(this.columnsNew, column => column.label !== false);
        },


        /**
         * Determine if we are using pagination.
         *
         * @return Boolean
         */
        isUsingPagination () {
            return this.pagination;
        },


        /**
         * Determine if there is any rows to show.
         *
         * @return Boolean
         */
        hasRows () {
            return this.getData().length > 0;
        },


        /**
         * Execute when items per page value is changed.
         *
         * @return void
         */
        itemsPerPageChanged () {
            this.getResults();
        },


        /**
         * Determine if column is sorted given direction.
         *
         * @return Boolean
         */
        columnIsSorted (column, direction) {
            return this.currentSorting.column === column['column'] &&
                   this.currentSorting.direction === direction;
        },

        /**
         * Retrive the row-column value.
         *
         * @param  Object row
         * @param  Object column
         * @return mixed
         */
        rowColumnValue (row, column) {
            var value = row[column.column];

            // Filter the value with given vue filters.
            if (column.vue && column.vue.filters) {
                column.vue.filters.forEach((filter) => {
                    value = this.$options.filters[filter](value);
                });
            }

            return value;
        },




        // FIX BELOW
        isSortable (column) {
            return this.sortableColumns.includes(column.show);
        },

        toggleSortForColumn (column) {
            if (this.currentSorting.column !== column) {
                this.currentSorting.direction = null;
            }

            this.currentSorting.column = column;
            this.currentSorting.direction = (this.currentSorting.direction === 'asc') ? 'desc' : 'asc';

            this.getResults();
        },

        async getResults (page = 1) {
            if (this.loading) {
                return false;
            }

            this.loading = true;

            let params = {
                query: this.query,
                page: page,
                limit: Number(this.perPage),
                searchString: this.searchString,
                filters: this.selectedFilters,
                inject: this.inject ? this.inject : null,
                sort: this.currentSorting,
                params: this.params,
            };

            return axios.post(`/api/laravel-datatable`, params).then(response => {
                this.data = response.data.items;
                this.pagination = response.data.pagination;
                this.searchable = response.data.searchable;

                this.sortableColumns = response.data.sort.fields;
                this.sortable = response.data.sort.enabled;

                // this.filterable = response.data.filter.enabled;

                this.filters = response.data.filters;

                this.requiresSearch = response.data.requiresSearch;
                this.requiresSearchLength = response.data.requiresSearchLength;

                this.rows = response.data.items.data;

                this.columnsNew = response.data.columns;

                this.loading = false;
            });
        },

        getData () {
            return (this.data.data !== undefined && Array.isArray(this.data.data))
                ? this.data.data
                : this.data;
        },

        refresh () {
            this.getResults();
        },

        search: function(query) {
            this.getResults();
        }
    }
}
