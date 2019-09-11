function pick(object, properties) {
    return properties.reduce((pickedObject, property) => {
        pickedObject[property] = object[property];
        return pickedObject;
    }, {});
}

export default class Column {
    constructor(columnComponent) {
        const properties = pick(columnComponent, [
            'label', 'show', 'formatter', 'sortable', 'filterable', 'thClass', 'tdClass', 'thWidth', 'append', 'prepend',
        ]);

        for (const property in properties) {
            this[property] = columnComponent[property];
        }

        this.template = columnComponent.$scopedSlots.default;
    }

    isFilterable () {
        return this.filterable;
    }
}
