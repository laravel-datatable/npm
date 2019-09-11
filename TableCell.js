export default {
    functional: true,

    props: ['column', 'row'],

    render(createElement, { props }) {
        const data = {};

        if (props.column.tdClass) {
            data.class = props.column.tdClass;
        }

        if (props.column.template) {
            return createElement('td', data, props.column.template(props.row.data));
        }

        var value = props.row.getValue(props.column.show);

        if (props.column.prepend) {
            value = props.column.prepend + value;
        }

        if (props.column.append) {
            value = value + props.column.append;
        }

        data.domProps = {};
        data.domProps.innerHTML = props.column.formatter(value, props.row.data);

        return createElement('td', data);
    },
};
