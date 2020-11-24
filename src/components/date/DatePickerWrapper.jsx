import React from 'react';
import omit from 'lodash/omit';

import {DateRangePicker} from 'react-dates';

class DateRangePickerWrapper extends React.Component {
    constructor(props) {
        super(props);


        this.state = {
            startDate: props.initialStartDate,
            endDate: props.initialEndDate,
        };

        this.onDatesChange = this.onDatesChange.bind(this);
        this.onFocusChange = this.onFocusChange.bind(this);
    }

    onDatesChange({startDate, endDate}) {
        const {stateDateWrapper} = this.props;
        this.setState({
            startDate: startDate && stateDateWrapper(startDate),
            endDate: endDate && stateDateWrapper(endDate),
        });
    }

    onFocusChange(focusedInput) {
        this.setState({focusedInput});
    }

    render() {
        const {focusedInput, startDate, endDate} = this.state;

        // autoFocus, autoFocusEndDate, initialStartDate and initialEndDate are helper props for the
        // example wrapper but are not props on the SingleDatePicker itself and
        // thus, have to be omitted.
        const props = omit(this.props, [
            'autoFocus',
            'autoFocusEndDate',
            'initialStartDate',
            'initialEndDate',
            'stateDateWrapper',
        ]);

        return (
            <div>
                <DateRangePicker
                    {...props}
                    onDatesChange={this.onDatesChange}
                    onFocusChange={this.onFocusChange}
                    focusedInput={focusedInput}
                    startDate={startDate}
                    endDate={endDate}
                />
            </div>
        );
    }
}

export default DateRangePickerWrapper;
