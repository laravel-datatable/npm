import Multiselect from 'vue-multiselect';
import { filter } from '../filters.js';
import Popper from 'vue-popperjs';
import 'vue-popperjs/dist/vue-popper.css';

export default {
     props: ['attachedFilters'],

    components: {
        Popper, Multiselect
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

        for (var column in availableFilters) {
            var settings = availableFilters[column];

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
        }

        // collect(availableFilters).each((settings, column) => {
        //     this.$set(this.resolvedSearchOptions, column, []);

        //     this.$set(this.filterStatuses, column, {
        //         loading: false,
        //         options: settings.options,
        //         type: settings.type,
        //         relation: settings.relation,
        //         label: settings.label,
        //         value: null,
        //         can: settings.can,
        //     });
        // });
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
