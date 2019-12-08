import Pagination from 'laravel-vue-pagination';
import DatatableFilterOptions from './components/filters/Options.vue';
import DatatableFilterGreaterThan from './components/filters/GreaterThan.vue';
import DatatableFilterSearch from './components/filters/Search.vue';

export default {
    install (Vue, options = {}) {
        Vue.component('pagination', Pagination);
        Vue.component('datatable-filter-options', DatatableFilterOptions);
        Vue.component('datatable-filter-greater-than', DatatableFilterGreaterThan);
        Vue.component('datatable-filter-search', DatatableFilterSearch);
    }
}

