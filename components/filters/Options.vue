<template>
    <div>
        <slot :value="value" :change="change">
            <select v-model="value" v-on:change="change" multiple>
                <option :value="option" v-for="option in filter.options">{{ option }}</option>
            </select>
        </slot>
    </div>
</template>

<script>
    import DatatableFilterInputMixin from '../../mixins/DatatableFilterInputMixin';

    export default {
        mixins: [DatatableFilterInputMixin],

        data () {
            return {
                defaultValue: []
            }
        }
    }
</script>
