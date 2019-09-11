<template>
    <div class="data-table-container" :class="{'is-loading': loading}" ref="datatable">
        <!-- <div class="data-table-overlay" v-if="loading" v-cloak>
            <div class="data-table-loader">
                <div class="lds-ring"><div></div><div></div><div></div><div></div></div>
            </div>
        </div> -->

        <div class="py-4 px-3 row" v-if="searchable || pagination">
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

        <table class="table">
            <thead>
                <tr>
                    <th class="text-left" v-for="column in columns" :class="column.thClass" :width="column.thWidth">
                        <span v-if="sortable && isSortable(column)" @click="toggleSortForColumn(column.show)" class="cursor-pointer inline-flex items-center">
                            {{ column.label }}

                            <svg xmlns="http://www.w3.org/2000/svg" width="8" height="14" viewBox="0 0 8 14" class="ml-2"><g id="sortable-icon" fill="none" fill-rule="evenodd"><path id="Path-2-Copy-3" d="M1.70710678 4.70710678c-.39052429.39052429-1.02368927.39052429-1.41421356 0-.3905243-.39052429-.3905243-1.02368927 0-1.41421356l3-3c.39052429-.3905243 1.02368927-.3905243 1.41421356 0l3 3c.39052429.39052429.39052429 1.02368927 0 1.41421356-.39052429.39052429-1.02368927.39052429-1.41421356 0L4 2.41421356 1.70710678 4.70710678z" class="fill-60" :class="{'fill-80': (currentSorting.column === column.show && currentSorting.direction === 'asc')}"></path>

                            <path id="Combined-Shape-Copy-3" fill-rule="nonzero" d="M6.29289322 9.29289322c.39052429-.39052429 1.02368927-.39052429 1.41421356 0 .39052429.39052429.39052429 1.02368928 0 1.41421358l-3 3c-.39052429.3905243-1.02368927.3905243-1.41421356 0l-3-3c-.3905243-.3905243-.3905243-1.02368929 0-1.41421358.3905243-.39052429 1.02368927-.39052429 1.41421356 0L4 11.5857864l2.29289322-2.29289318z" class="fill-60" :class="{'fill-80': (currentSorting.column === column.show && currentSorting.direction === 'desc')}"></path></g></svg>
                        </span>

                        <span v-else>
                            {{ column.label }}
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

        <div class="container-fluid">
            <div class="row" v-if="pagination">
                <div v-if="getData().length" style="align-self: center;">
                    Displaying {{ this.resourceNameSingular }} {{ data.from }} to {{ data.to }} of total {{ data.total }} {{ this.resourceNamePlural }}.
                </div>

                <div v-if="getData().length === 0" style="align-self: center;">
                    No items to display.
                </div>

                <div class="ml-auto" v-if="getData().length > 0">
                    <pagination
                        style="margin: 0;"
                        :data="data"
                        @pagination-change-page="getResults"
                        :show-disabled="false"
                        :limit="3">
                    </pagination>
                </div>
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

<style lang="scss" src="../styles.scss"></style>

<script>
    import mixin from './DataTableMixin';

    export default {
        mixins: [mixin],
    }
</script>
