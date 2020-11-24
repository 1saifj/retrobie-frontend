import qs from 'qs';

export const logger = store => next => action => {
    /* eslint-disable no-console */
    console.group(action.type);
    console.info('dispatching', action);
    const result = next(action);
    console.log('next state', store.getState());
    console.groupEnd(action.type);
    /* eslint-enable no-console */
    return result;
};

export const filters = state => {
    if (!Object.keys(state.filter.appliedFilters).length) return '';
    return qs.stringify({
        appliedFilters: state.filter.appliedFilters
    });
};

export function hashURLFromState(state) {
    window.location.hash = `#!/?${filters(state)}`;
}

export const getStateFromHash = () => {
    const filterString = window.location.hash.replace('#!/?', '');
    return qs.parse(filterString);
};

export const urlhash = store => next => action => {

    // call next action
    const nextResult = next(action);

    // build url out of current state
    const state = store.getState();

    hashURLFromState(state);

    return nextResult;
};
