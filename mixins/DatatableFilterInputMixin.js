import {EventBus} from '../event-bus';

export default {
    props: ['filter'],

    data () {
        return {
            value: null,
            defaultValue: null,
        }
    },

    created () {
        this.value = this.defaultValue;
    },

    mounted () {
        EventBus.$on(['datatable:filters-resetted'], () => {
            this.value = this.defaultValue;
        });
    },

    methods: {
        change (value = null) {
            // Set the value manually if it is sent in as argument.
            if (value !== null && !(value instanceof Event)) {
                this.value = value;
            }

            // Tell the datatable that we want to add this filter & its
            // value to the current list of filters.
            EventBus.$emit('datatable:filter-input', this.filter, this.value)
        }
    }
}
