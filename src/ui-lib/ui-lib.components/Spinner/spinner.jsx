import {AbsoluteCenter, Center, resolveStyleConfig, useTheme} from '@chakra-ui/react';
import {Oval} from 'react-loader-spinner';
import {appCurrentTheme} from '../../../utils/localStorage';
import {LIGHT} from '../../../constants/names';
const primary = '#DDB057';
const primaryShade = '#DAB91F88';

export const Spinner = ({noAbsolute, absoluteStyle, size, ...rest}) => {
  const theme = useTheme();
  const primaryColor = theme?.colors?.custom_color?.color_pop;
  return noAbsolute ? (
    <RegularSpinner
      thickness="10px"
      speed="0.65s"
      emptyColor="gray.200"
      color={primaryColor}
      size={size || '300px'}
      {...resolveStyleConfig}
    />
  ) : (
    <OvalLoader absoluteStyle={absoluteStyle} {...rest} />
  );
};

export const OvalLoader = ({absoluteStyle, ...rest}) => {
  const theme = useTheme();
  const primaryColor = theme?.colors?.custom_color?.color_pop;

  return (
    <AbsoluteCenter color={`text`} {...absoluteStyle}>
      <Oval
        height={80}
        width={80}
        // color={primary}
        color={primaryColor}
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
        ariaLabel="oval-loading"
        // secondaryColor={primaryShade}
        secondaryColor={primaryColor}
        strokeWidth={2}
        strokeWidthSecondary={2}
        {...rest}
      />
    </AbsoluteCenter>
  );
};
export const RegularSpinner = () => {
  const theme = useTheme();
  const primaryColor = theme?.colors?.custom_color?.color_pop;
  return (
    <Center color="text">
      <Oval
        height={80}
        width={80}
        color={primaryColor}
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
        ariaLabel="oval-loading"
        secondaryColor={primaryColor}
        strokeWidth={2}
        strokeWidthSecondary={2}
      />
    </Center>
  );
};
