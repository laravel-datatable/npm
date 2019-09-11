export const filter = {
    data () {
        return {
            filterable: false,
            filters: [],
            selectedFilters: {},
            focusingFilter: null,
            searchingFilterOptions: [],
        }
    },

    methods: {
        onFilterSearchFocus (column) {
            this.focusingFilter = column;
        },

        onFilterSearchSelect (value) {
            //
        },

        applyFilters () {
            this.getResults();
        },

        resetFilters () {
            this.selectedFilters = {};
            this.focusingFilter = null;
            this.searchingFilterOptions = [];

            this.applyFilters();
        },

        onFilterSearch (search, loading) {
            loading(true);
            this.searchFilter(loading, search, this);
        },

        searchFilter: _.debounce((loading, search, vm) => {
            axios.post(`/api/querify/resolveFilter`, {filter: vm.filters[vm.focusingFilter].filter, search: escape(search)}).then(response => {
                vm.searchingFilterOptions = response.data;
                loading(false);
            }).catch(error => {});
        }, 350)
    }
}
