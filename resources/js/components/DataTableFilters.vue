<template>
    <div>
        <popper
            trigger="click"
            :visible-arrow="false"
            :options="{placement: 'bottom-end'}">

            <div class="popper">
                <div class="filter-container" v-for="(filter, column) in filterStatuses">
                    <div class="filter-title">
                        {{ filter.label }}

                        <span v-if="filter.type === 'greater_than'"> greater than</span>
                    </div>

                    <div class="filter-body">
                        <!-- Options filter field -->
                        <multiselect
                            v-if="filter.type === 'options'"
                            :multiple="true"
                            :options="filter.options"
                            v-model="filterStatuses[column].value"
                            v-on:input="onFilterSearchSelect">
                        </multiselect>
                        <!-- <v-select
                            multiple
                            v-if="filter.type === 'options'"
                            :options="filter.options"
                            v-model="filterStatuses[column].value"
                            v-on:input="onFilterSearchSelect">
                        </v-select> -->
                        <!-- <data-table-options-filter
                            v-if="filter.type === 'options'"
                            :filter="filter"
                            :column="column"
                            v-model="filterStatuses[column].value"
                            v-on:input="onFilterSearchSelect">
                        </data-table-options-filter> -->

                        <!-- Relation filter field -->
                        <!-- <data-table-relation-filter
                            v-if="filter.type === 'relation'"
                            :filter="filter"
                            :selected-filters="selectedFilters"
                            :column="column"
                            v-model="filterStatuses[column].value">
                        </data-table-relation-filter> -->

                        <!-- Greater than filter field -->
                        <input v-if="filter.type === 'greater_than'" type="text" class="filter-input" v-model="selectedFilters[column]">

                        <!-- From date filter field -->
                        <input v-if="filter.type === 'from_date'" type="text" class="filter-input" v-model="selectedFilters[column]">

                        <!-- Search filter field -->
                        <multiselect
                            v-if="filter.type === 'search' || filter.type === 'relation'"
                            :options="resolvedSearchOptions[column]"
                            :searchable="true"
                            :loading="filter.loading"
                            :internal-search="false"
                            :clear-on-select="true"
                            v-on:search-change="onFilterSearchMultiselect"
                            v-on:open="onFilterSearchFocus(column)"
                            label="name"
                            v-model="filterStatuses[column].value"
                            v-on:input="onFilterSearchSelect">
                        </multiselect>

                        <!-- Relation filter field -->
                        <!-- <multiselect
                            v-if="filter.type === 'relation'"
                            :options="resolvedSearchOptions[column]"
                            :searchable="true"
                            :loading="filter.loading"
                            :internal-search="false"
                            :clear-on-select="false"
                            v-on:search-change="onFilterSearchMultiselect"
                            v-on:open="onFilterSearchFocus(column)"
                            label="name"
                            v-model="filterStatuses[column].value"
                            v-on:input="onFilterSearchSelect">
                        </multiselect> -->

                        <!-- <v-select label="name" v-if="filter.type === 'search'" :filterable="false" :options="searchingFilterOptions" v-on:search:focus="onFilterSearchFocus(column)" @search="onFilterSearch" @input="onFilterSearchSelect" v-model="selectedFilters[column]" index="name">
                            <template slot="no-options">
                                type to search...
                            </template>

                            <template slot="option" slot-scope="option">
                                <div class="d-center">
                                    {{ option.name }}
                                </div>
                            </template>

                            <template slot="selected-option" slot-scope="option">
                                <div class="selected d-center">
                                    {{ option.name }}
                                </div>
                            </template>
                        </v-select> -->
                    </div>
                </div>

                <div class="px-3 pb-3">
                    <a href="javascript:void(0)" class="btn btn-primary btn-xs" @click="applyFilters">
                        Filter
                    </a>

                    <a href="javascript:void(0)" class="btn btn-secondary btn-xs" @click="resetFilters">
                        Reset
                    </a>
                </div>
            </div>

            <a slot="reference" href="#" class="btn btn-primary btn-sm">
                <i class="fas fa-filter"></i>
            </a>
        </popper>
    </div>
</template>

<script type="text/javascript">
    import { filter } from './filters.js';
    import Popper from 'vue-popperjs';
    import 'vue-popperjs/dist/vue-popper.css';

    import DataTableOptionsFilter from './filters/Options.vue';
    import DataTableRelationFilter from './filters/Relation.vue';

    export default {
        props: ['attachedFilters'],

        components: {
            'popper': Popper,
            DataTableOptionsFilter,
            DataTableRelationFilter,
        },

        data () {
            return {
                filterable: false,
                selectedFilters: {},
                focusingFilter: null,
                searchingFilterOptions: [],

                resolvedSearchOptions: {},
                filterStatuses: {},
            }
        },

        mounted () {
            var availableFilters = _.pickBy(this.attachedFilters, ['can', true]);

            collect(availableFilters).each((settings, column) => {
                this.$set(this.resolvedSearchOptions, column, []);

                this.$set(this.filterStatuses, column, {
                    loading: false,
                    options: settings.options,
                    type: settings.type,
                    relation: settings.relation,
                    label: settings.label,
                    value: null,
                    can: settings.can,
                });
            });
        },

        methods: {
            onFilterSearchFocus (column) {
                this.focusingFilter = column;
            },

            onFilterSearchSelect (value) {
                this.$emit('datatable:input');
            },

            applyFilters () {
                this.$emit('datatable:apply-filters');
            },

            getFilterStatuses () {
                return this.filterStatuses;
            },

            resetFilters () {
                this.selectedFilters = {};
                this.focusingFilter = null;
                // this.searchingFilterOptions = [];

                collect(this.filterStatuses).each((item, column) => {
                    item.value = null;
                });

                this.$emit('datatable:reset-filters');
            },

            // onFilterSearch (search, loading) {
            //     loading(true);
            //     this.searchFilter(loading, search, this);
            // },

            // searchFilter: _.debounce((loading, search, vm) => {
            //     axios.post(`/api/querify/resolveFilter`, {filter: vm.attachedFilters[vm.focusingFilter].filter, search: escape(search)}).then(response => {
            //         vm.searchingFilterOptions = response.data;
            //         loading(false);
            //     }).catch(error => {});
            // }, 350),

            onFilterSearchMultiselect (query) {
                if (query) {
                    this.filterStatuses[this.focusingFilter].loading = true;

                    this.searchFilterMultiselect(query, this);
                }
            },

            searchFilterMultiselect: _.debounce((query, vm) => {
                var data = {filter: vm.attachedFilters[vm.focusingFilter].filter, search: escape(query)};

                axios.post(`/api/querify/resolveFilter`, data).then(response => {
                    vm.searchingFilterOptions = response.data;

                    vm.resolvedSearchOptions[vm.focusingFilter] = response.data;

                    vm.filterStatuses[vm.focusingFilter].loading = false;
                }).catch(error => {});
            }, 350),
        }
    }
</script>
