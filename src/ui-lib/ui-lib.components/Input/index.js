export {Input} from './input';
export {FormInput} from './formInput';
export {PhoneInput} from './PhoneInput';
export {TitleInput} from './TitleInput';
export {CurrencyInput} from './CurrencyInput';
export {EditableInput} from './editable';
export {FormTextarea} from './formTextarea';
export {FormSelect} from './formSelect';

export const placeholder_style = {
  fontSize: `13px`,
  letterSpacing: '0.52px',
  color: 'text',
  opacity: 0.8,
  fontWeight: 500,
};

export const getFormInputStyles = (error, rest) => {
  const height = rest?.h || rest?.height || `44px`;
  const background =
    rest?.background ||
    rest?.bg ||
    rest?.backgroundColor ||
    rest?.bgColor ||
    `matador_background.100`;

  return {
    position: 'relative',
    fontSize: `13px`,
    letterSpacing: '0.52px',
    color: rest?.color || 'text',
    fontWeight: `500`,
    borderRadius: `0px`,
    borderRadius: rest?.borderRadius || `0px`,
    rounded: rest?.rounded,
    border: !error && rest?.border ? rest?.border : `1px solid !important`,
    borderColor: error
      ? `#FF3636 !important`
      : rest?.borderColor || `matador_border_color.100 !important`,
    // background: `transparent`,
    background: background,
    height: height,
    _placeholder: {opacity: 0.8},
    _active: {
      border: !error && rest?.border ? rest?.border : `1px solid !important`,
      borderColor: error
        ? `#FF3636 !important`
        : rest?.borderColor || `matador_border_color.100 !important`,
    },
    _focus: {
      border: !error && rest?.border ? rest?.border : `1px solid !important`,
      borderColor: error
        ? `#FF3636 !important`
        : rest?.borderColor || `matador_border_color.100 !important`,
    },
    _focusVisible: {
      border: !error && rest?.border ? rest?.border : `1px solid !important`,
      borderColor: error
        ? `#FF3636 !important`
        : rest?.borderColor || `matador_border_color.100 !important`,
    },
  };
};

export const defaultLabelStyling = {
  fontSize: '13px',
  color: 'matador_text.500',
  fontWeight: 500,
  mb: `4px`,
};

export const getInputDropDownStyle = rest => {
  const height = rest?.h || rest?.height || `44px`;

  return {
    overflowX: 'hidden',
    opacity: '0',
    zIndex: '2',
    position: 'absolute',
    p: '0px !important',
    cursor: 'pointer',
    left: '10px',
    top: '0px',
    border: 'none',
    lineHeight: '18px ',
    fontSize: '14px',
    height: height,
    fontWeight: '300',
    _focus: {border: 'none'},
    _active: {
      border: 'none',
    },
    _disabled: {color: `transparent`},
    sx: {
      paddingInlineStart: '0.05rem',
    },
  };
};
