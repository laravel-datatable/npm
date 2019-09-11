<template>
    <div class="data-table-container" :class="{'is-loading': loading}" ref="datatable">
        <div class="data-table-overlay" v-if="loading" v-cloak>
            <div class="data-table-loader">
                <div class="lds-ring"><div></div><div></div><div></div><div></div></div>
            </div>
        </div>

        <div class="py-4 px-3 flex" v-if="searchable || pagination">
            <div class="self-center" v-if="pagination && !hideItemsPerPage">
                Show

                <select v-model="perPage" @change="changeItemsPerPage">
                    <option :value="option" v-for="option in itemsPerPageOptions">{{ option }}</option>
                </select>

                items per page.
            </div>

            <div class="ml-auto flex" v-if="searchable || filterable">
                <div class="relative inline-block" :class="{'mr-2': filterable}" v-if="searchable">
                    <input
                        type="search"
                        placeholder="Search"
                        class="border outline-none text-sm w-48"
                        style="background: rgb(250, 250, 250); border-radius: 8px; padding-left: .85rem; padding-top: .55rem; padding-bottom: .55rem;"
                        @input="isTyping = true"
                        v-model="searchString">
                </div>

                <data-table-filters
                    ref="dataTableFilters"
                    :attached-filters="filters">
                </data-table-filters>
            </div>
        </div>

        <table class="data-table">
            <thead>
                <tr>
                    <th class="text-left" v-for="column in columns" :class="column.thClass" :width="column.thWidth">
                        <span v-if="sortable && isSortable(column)" @click="toggleSortForColumn(column.show)" class="cursor-pointer inline-flex items-center">
                            {{ trans(column.label) }}

                            <svg xmlns="http://www.w3.org/2000/svg" width="8" height="14" viewBox="0 0 8 14" class="ml-2"><g id="sortable-icon" fill="none" fill-rule="evenodd"><path id="Path-2-Copy-3" d="M1.70710678 4.70710678c-.39052429.39052429-1.02368927.39052429-1.41421356 0-.3905243-.39052429-.3905243-1.02368927 0-1.41421356l3-3c.39052429-.3905243 1.02368927-.3905243 1.41421356 0l3 3c.39052429.39052429.39052429 1.02368927 0 1.41421356-.39052429.39052429-1.02368927.39052429-1.41421356 0L4 2.41421356 1.70710678 4.70710678z" class="fill-60" :class="{'fill-80': (currentSorting.column === column.show && currentSorting.direction === 'asc')}"></path>

                            <path id="Combined-Shape-Copy-3" fill-rule="nonzero" d="M6.29289322 9.29289322c.39052429-.39052429 1.02368927-.39052429 1.41421356 0 .39052429.39052429.39052429 1.02368928 0 1.41421358l-3 3c-.39052429.3905243-1.02368927.3905243-1.41421356 0l-3-3c-.3905243-.3905243-.3905243-1.02368929 0-1.41421358.3905243-.39052429 1.02368927-.39052429 1.41421356 0L4 11.5857864l2.29289322-2.29289318z" class="fill-60" :class="{'fill-80': (currentSorting.column === column.show && currentSorting.direction === 'desc')}"></path></g></svg>
                        </span>

                        <span v-else>
                            {{ trans(column.label) }}
                        </span>
                    </th>
                </tr>
            </thead>

            <tbody>
                <data-table-row
                    v-for="row in rows"
                    :key="row.vueTableComponentInternalRowId"
                    :row="row"
                    :columns="columns"
                ></data-table-row>
            </tbody>
        </table>

        <div class="flex p-4" v-if="pagination">
            <div class="self-center" v-if="getData().length">
                Displaying {{ this.resourceNameSingular }} {{ data.from }} to {{ data.to }} of total {{ data.total }} {{ this.resourceNamePlural }}.
            </div>

            <div class="self-center" v-if="getData().length === 0">
                No items to display.
            </div>

            <div class="ml-auto" v-if="getData().length > 0">
                <pagination
                    :data="data"
                    @pagination-change-page="getResults"
                    :show-disabled="false"
                    :limit="3">
                </pagination>
            </div>
        </div>

        <div class="p-4" v-if="getData().length === 0 && !pagination">
            No items to display.
        </div>

        <div style="display:none;">
            <slot></slot>
        </div>
    </div>
</template>

<style lang="scss" src="./styles.scss"></style>

<script>
    import Column from './classes/Column';
    import Row from './classes/Row';
    import Popper from 'vue-popperjs';
    import 'vue-popperjs/dist/vue-popper.css';
    import { filter } from './filters.js';

    export default {
        mixins: [filter],

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

                return axios.post(`/api/querify`, params).then(response => {
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
</script>
