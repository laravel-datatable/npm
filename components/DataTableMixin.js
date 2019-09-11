import Popper from 'vue-popperjs';
import 'vue-popperjs/dist/vue-popper.css';
import { filter } from '../filters.js';
import Row from '../classes/Row';
import axios from 'axios';
import Column from '../classes/Column';

export default {
    mixins: ['filter'],

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

    components: {
        'popper': Popper
    },

    data () {
        return {
            columns: [],
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

            selectedFilters: {},

            // Sorting
            sortable: false,
            sortableColumns: [],
            currentSorting: {column: null, direction: null},
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

    computed: {
        canSeeFilters () {
            return Manjana.user.role.name === 'president' || Manjana.user.role.name === 'vice-president';
        }
    },

    async mounted () {
        await this.getResults();

        this.perPage = this.itemsPerPage;

        const columnComponents = this.$slots.default
            .filter(column => column.componentInstance)
            .map(column => column.componentInstance);

        this.columns = columnComponents.map(
            column => new Column(column)
        );

        // this.filterableColumns = collect(this.columns).filter(column => {
        //     return column.isFilterable();
        // }).toArray();

        // this.filters = collect(this.filterableColumns).mapWithKeys(column => {
        //     return [column.show, []];
        // }).all();

        columnComponents.forEach(columnCom => {
            Object.keys(columnCom.$options.props).forEach(
                prop => columnCom.$watch(prop, () => {
                    this.columns = columnComponents.map(
                        column => new Column(column)
                    );
                })
            );
        });

        this.mapDataToRows();

        if (this.$refs.dataTableFilters) {
            this.$refs.dataTableFilters.$on(['datatable:reset-filters', 'datatable:apply-filters'], () => {
                this.getResults();
            });

            this.$refs.dataTableFilters.$on('datatable:input', () => {
                this.selectedFilters = this.$refs.dataTableFilters.getFilterStatuses();
            });
        }
    },

    methods: {
        isSortable (column) {
            return this.sortableColumns.includes(column.show);
        },

        changeItemsPerPage () {
            this.getResults();
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

                this.filterable = response.data.filter.enabled;
                this.filters = response.data.filter.filters;

                this.requiresSearch = response.data.requiresSearch;
                this.requiresSearchLength = response.data.requiresSearchLength;

                this.mapDataToRows();

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

        mapDataToRows () {
            let rowId = 0;

            this.rows = this.getData().map(rowData => {
                rowData.vueTableComponentInternalRowId = rowId++;
                return rowData;
            }).map(rowData =>
                new Row(rowData, this.columns)
            );
        },

        search: function(query) {
            // if (this.requiresSearch && this.searchString.length < this.requiresSearchLength) {
            //     return false;
            // }

            this.getResults();
        }
    }
}
