import DataTable from './components/DataTable.vue';
import RenderlessDataTable from './components/RenderlessDataTable.vue';
import DataTableColumn from './components/DataTableColumn.vue';
import DataTableRow from './components/DataTableRow.vue';
import DataTableFilters from './components/DataTableFilters.vue';
import Pagination from 'laravel-vue-pagination';

export default {
    install (Vue, options = {}) {
        Vue.component('data-table', DataTable);
        Vue.component('renderless-data-table', RenderlessDataTable);
        Vue.component('data-table-column', DataTableColumn);
        Vue.component('data-table-row', DataTableRow);
        Vue.component('data-table-filters', DataTableFilters);
        Vue.component('pagination', Pagination);
    }
}

export { DataTable };
