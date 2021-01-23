import React from 'react';
import { FieldRenderProps } from 'react-final-form';
import { FormFieldProps, Checkbox } from 'semantic-ui-react';

interface IProps extends FieldRenderProps<any, HTMLElement>, FormFieldProps {}
const FormCheckbox: React.FC<IProps> = ({
  input: { onChange, name, checked },
  label,
  input,
}) => {
  return (
    <Checkbox
      name={name}
      checked={checked}
      onChange={(evt, { checked }) => onChange(checked)}
      label={label}
    />
  );
};

export default FormCheckbox;
