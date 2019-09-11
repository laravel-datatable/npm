<template>
    <div>
        <popper
            trigger="click"
            :visible-arrow="false"
            :options="{placement: 'bottom-end'}">

            <div class="popper">
                <div class="" v-for="(filter, column) in filterStatuses">
                    <div class="filter-title p-3 text-uppercase">
                        {{ filter.label }}

                        <span v-if="filter.type === 'greater_than'"> greater than</span>
                    </div>

                    <div class="filter-body p-3">
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
                    <a href="javascript:void(0)" class="btn btn-primary btn-sm" @click="applyFilters">
                        Filter
                    </a>

                    <a href="javascript:void(0)" class="btn btn-secondary btn-sm" @click="resetFilters">
                        Reset
                    </a>
                </div>
            </div>

            <a slot="reference" href="javascript:void(0)" class="btn btn-primary btn-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-filter"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
            </a>
        </popper>
    </div>
</template>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

<script type="text/javascript">
    import mixin from './DataTableFiltersMixin';

    // import DataTableOptionsFilter from './filters/Options.vue';
    // import DataTableRelationFilter from './filters/Relation.vue';

    export default {
        mixins: [mixin],
    }
</script>
