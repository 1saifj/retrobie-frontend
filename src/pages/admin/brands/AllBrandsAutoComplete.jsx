import Autosuggest from 'react-autosuggest';
import React, {useState} from 'react';
import '../../../components/editor/autocomplete.css'
import {Input} from "bloomer";

const languages = [
    {
        name: 'C',
        year: 1972
    },
    {
        name: 'C#',
        year: 2000
    },
    {
        name: 'C++',
        year: 1983
    },
    {
        name: 'Clojure',
        year: 2007
    },
    {
        name: 'Elm',
        year: 2012
    },
    {
        name: 'Go',
        year: 2009
    },
    {
        name: 'Haskell',
        year: 1990
    },
    {
        name: 'Java',
        year: 1995
    },
    {
        name: 'Javascript',
        year: 1995
    },
    {
        name: 'Perl',
        year: 1987
    },
    {
        name: 'PHP',
        year: 1995
    },
    {
        name: 'Python',
        year: 1991
    },
    {
        name: 'Ruby',
        year: 1995
    },
    {
        name: 'Scala',
        year: 2003
    }
];

// Teach Autosuggest how to calculate suggestions for any given input value.
const getSuggestions = value => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;

    return inputLength === 0 ? [] : languages.filter(lang =>
        lang.name.toLowerCase().slice(0, inputLength) === inputValue
    );
};

// When suggestion is clicked, Autosuggest needs to populate the input
// based on the clicked suggestion. Teach Autosuggest how to calculate the
// input value for every given suggestion.
const getSuggestionValue = suggestion => suggestion.name;

// Use your imagination to render suggestions.
const renderSuggestion = suggestion => {
    return (
        <div>
            {suggestion.name}
        </div>
    );
}
const renderInputComponent = inputProps => (
    <div>
        <Input {...inputProps} />
    </div>
);


function AllBrandsAutoComplete() {
    const [suggestions, setSuggestions] = useState(languages);
    const [autoCompleteValue, setAutoCompleteValue] = useState('');

    const onChange = (event, {newValue}) => {
        setAutoCompleteValue(newValue)
    };

    const onSuggestionsFetchRequested = ({value}) => {
        const isInputBlank = value.trim() === '';
        const suggested = getSuggestions(value);
        const noSuggestions = !isInputBlank && suggested.length === 0;

        if (noSuggestions) {
            setSuggestions([{name: "No results.", year: 0}])
        } else {
            if (isInputBlank) {
                setSuggestions(languages);
            } else
                setSuggestions(getSuggestions(value));
        }
    };

    const onSuggestionsClearRequested = () => {
        setSuggestions([]);
    };

    const inputProps = {
        label: 'Type a programming language',
        value: autoCompleteValue,
        onChange
    };

    return (
        <>
            <div>
                <div style={{marginBottom: '0.5em'}}>
                    <label style={{fontWeight: 'bold'}}>{inputProps.label}</label>
                </div>
                <Autosuggest
                    suggestions={suggestions}
                    onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                    onSuggestionsClearRequested={onSuggestionsClearRequested}
                    getSuggestionValue={getSuggestionValue}
                    renderSuggestion={renderSuggestion}
                    renderInputComponent={renderInputComponent}
                    inputProps={inputProps}
                />
            </div>
        </>
    );


}

export default AllBrandsAutoComplete;

AllBrandsAutoComplete.propTypes = {}
