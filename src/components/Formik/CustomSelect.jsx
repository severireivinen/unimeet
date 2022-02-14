import React from "react";
import Select from "react-select";

const CustomSelect = ({ field, form, options, isMulti = false }) => {
  const onChange = (option) => {
    form.setFieldValue(
      field.name,
      isMulti ? option.map((item) => item.value) : option.value
    );
  };

  const getValue = () => {
    if (options) {
      return isMulti
        ? options.filter((option) => field.value.indexOf(option.value) >= 0)
        : options.find((option) => option.value === field.value);
    } else {
      return isMulti ? [] : "";
    }
  };

  return (
    <div>
      <Select
        placeholder="Valitse"
        name={field.name}
        value={getValue()}
        onChange={onChange}
        options={options}
        isMulti={isMulti}
      />
    </div>
  );
};

export default CustomSelect;
