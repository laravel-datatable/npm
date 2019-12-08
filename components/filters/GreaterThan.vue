<template>
    <div>
        <slot :value="value" :change="change">
            <input type="text" v-model="value" v-on:input="change">
        </slot>
    </div>
</template>

<script>
    import DatatableFilterInputMixin from '../../mixins/DatatableFilterInputMixin';

    export default {
        mixins: [DatatableFilterInputMixin],
    }
</script>
