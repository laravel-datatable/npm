import moment from 'moment';
// import { get } from '../../../helpers';

export default class Row {
    constructor(data, columns) {
        this.data = data;
        this.columns = columns;
    }

    getValue(columnName) {
        // return get(this.data, columnName);
        return this.data[columnName]
    }
}
