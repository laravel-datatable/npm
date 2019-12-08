import {EventBus} from '../event-bus';

export default {
    data () {
        return {
            filters: [],
            selectedFilters: {},
        }
    },

    methods: {
        /**
         * Apply all the filters.
         *
         * @return Void
         */
        applyFilters () {
            EventBus.$emit('datatable:filters-applied');
        },


        /**
         * Clear all the filters.
         *
         * @return Void
         */
        resetFilters () {
            EventBus.$emit('datatable:filters-resetted');
        }
    }
}
