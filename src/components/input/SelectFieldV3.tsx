import React from 'react';
import AsyncSelect from 'react-select/async';
import Select from 'react-select';

type OptionType = {
  [key: string]: any
};



export default function(
  {
    isAsync,
    placeholder,
    onChange,
    isClearable,
    loadingMessage,
    disabled,
    getOptionValue,
    getOptionLabel,
    loadOptions,
    options,
    filterOption,
    error,
    onBlur,
    label
  }:
  {
    label?: string
    isAsync: boolean,
    placeholder: string,
    onChange: ({value, label}: OptionType)=> void,
    isClearable?: boolean,
    loadingMessage?: string,
    disabled?: boolean,
    getOptionValue?: (e: OptionType)=> string,
    getOptionLabel?: (e: OptionType)=> string,
    options?: Array<OptionType>,
    loadOptions?: (inputValue: string)=> Promise<any>,
    filterOption?: (option, rawInput)=> boolean,
    error?: string,
    onBlur?: (e: React.FocusEvent<HTMLInputElement>)=> void
  }
  ){

  const customStyles = {
    control: (provided) => ({
      ...provided,
      border: error && '2px solid var(--color-error)',
      borderWidth: '2px'
    }),
  }


  if (isAsync) {
    return (
      <div className={error && 'has-error'}>
        <label>{label}</label>
        <AsyncSelect
          onBlur={onBlur}
          styles={customStyles}
          filterOption={filterOption}
          getOptionLabel={getOptionLabel}
          getOptionValue={getOptionValue}
          isDisabled={disabled}
          isClearable={isClearable}
          loadingMessage={() => loadingMessage}
          placeholder={placeholder}
          loadOptions={loadOptions}
          onChange={onChange}
        />
        <div className={'error'}>
          <small>{error}</small>
        </div>
      </div>
    );
  }

  return (
    <div className={error &&'has-error'}>
      <label>{label}</label>
      <Select
        onBlur={onBlur}
        styles={customStyles}
        filterOption={filterOption}
        isDisabled={disabled}
        getOptionValue={getOptionValue}
        getOptionLabel={getOptionLabel}
        isClearable={isClearable}
        loadingMessage={() => loadingMessage}
        onChange={onChange}
        options={options}
        placeholder={placeholder}
      />
      <div className={'error'}>
        <small>{error}</small>
      </div>
    </div>
  );
}