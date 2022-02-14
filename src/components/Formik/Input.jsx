import React from "react";
import { Field, ErrorMessage } from "formik";
import TextError from "./TextError";

const Input = (props) => {
  const { name, label, ...rest } = props;
  return (
    <div className="">
      <label className="block font-semibold mb-1" htmlFor={name}>
        {label}
      </label>
      <Field
        className="block border bg-slate-50 indent-2 border-gray-300 text-gray-900 p-1 rounded-sm focus:outline-none focus:shadow-outline w-full"
        id={name}
        name={name}
        {...rest}
      />
      <ErrorMessage name={name} component={TextError} />
    </div>
  );
};

export default Input;
