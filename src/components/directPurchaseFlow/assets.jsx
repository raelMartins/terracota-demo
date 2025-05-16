import {Box, useTheme} from '@chakra-ui/react';

export const SelectAssetIcon = ({boxSize = {base: `48px`, lg: `84px`}, ...rest}) => {
  const theme = useTheme();
  const textColor = theme?.colors?.text;
  const primaryColor = theme?.colors?.custom_color?.color_pop;

  return (
    <Box boxSize={boxSize} {...rest}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 84 84"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="6" y="6" width="72" height="72" rx="36" fill={textColor} fillOpacity="0.06" />
        <rect
          x="6"
          y="6"
          width="72"
          height="72"
          rx="36"
          stroke={textColor}
          strokeOpacity="0.04"
          strokeWidth="12"
        />
        <path
          d="M43.5 57H31.5C28.5 57 27 55.5 27 52.5V40.5C27 37.5 28.5 36 31.5 36H39V52.5C39 55.5 40.5 57 43.5 57Z"
          stroke={primaryColor}
          strokeWidth="2.25"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M39.165 30C39.045 30.45 39 30.945 39 31.5V36H31.5V33C31.5 31.35 32.85 30 34.5 30H39.165Z"
          stroke={primaryColor}
          strokeWidth="2.25"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M45 36V43.5"
          stroke={primaryColor}
          strokeWidth="2.25"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M51 36V43.5"
          stroke={primaryColor}
          strokeWidth="2.25"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M49.5 49.5H46.5C45.675 49.5 45 50.175 45 51V57H51V51C51 50.175 50.325 49.5 49.5 49.5Z"
          stroke={primaryColor}
          strokeWidth="2.25"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M33 43.5V49.5"
          stroke={primaryColor}
          strokeWidth="2.25"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M39 52.5V31.5C39 28.5 40.5 27 43.5 27H52.5C55.5 27 57 28.5 57 31.5V52.5C57 55.5 55.5 57 52.5 57H43.5C40.5 57 39 55.5 39 52.5Z"
          stroke={primaryColor}
          strokeWidth="2.25"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Box>
  );
};

export const BioDataIcon = ({boxSize = {base: `48px`, lg: `84px`}, ...rest}) => {
  const theme = useTheme();
  const textColor = theme?.colors?.text;
  const primaryColor = theme?.colors?.custom_color?.color_pop;

  return (
    <Box boxSize={boxSize} {...rest}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 84 84"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="6" y="6" width="72" height="72" rx="36" fill={textColor} fillOpacity="0.06" />
        <rect
          x="6"
          y="6"
          width="72"
          height="72"
          rx="36"
          stroke={textColor}
          strokeOpacity="0.04"
          strokeWidth="12"
        />
        <path
          d="M36.5703 42L40.1853 45.63L47.4303 38.37"
          stroke={primaryColor}
          strokeWidth="2.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M40.1253 27.675C41.1603 26.79 42.8553 26.79 43.9053 27.675L46.2753 29.715C46.7253 30.105 47.5653 30.42 48.1653 30.42H50.7153C52.3053 30.42 53.6103 31.725 53.6103 33.315V35.865C53.6103 36.45 53.9253 37.305 54.3153 37.755L56.3553 40.125C57.2403 41.16 57.2403 42.855 56.3553 43.905L54.3153 46.275C53.9253 46.725 53.6103 47.565 53.6103 48.165V50.715C53.6103 52.305 52.3053 53.61 50.7153 53.61H48.1653C47.5803 53.61 46.7253 53.925 46.2753 54.315L43.9053 56.355C42.8703 57.24 41.1753 57.24 40.1253 56.355L37.7553 54.315C37.3053 53.925 36.4653 53.61 35.8653 53.61H33.2703C31.6803 53.61 30.3753 52.305 30.3753 50.715V48.15C30.3753 47.565 30.0603 46.725 29.6853 46.275L27.6603 43.89C26.7903 42.855 26.7903 41.175 27.6603 40.14L29.6853 37.755C30.0603 37.305 30.3753 36.465 30.3753 35.88V33.3C30.3753 31.71 31.6803 30.405 33.2703 30.405H35.8653C36.4503 30.405 37.3053 30.09 37.7553 29.7L40.1253 27.675Z"
          stroke={primaryColor}
          strokeWidth="2.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Box>
  );
};

export const PaymentMethodIcon = ({boxSize = {base: `48px`, lg: `84px`}, ...rest}) => {
  const theme = useTheme();
  const textColor = theme?.colors?.text;
  const primaryColor = theme?.colors?.custom_color?.color_pop;

  return (
    <Box boxSize={boxSize} {...rest}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 84 84"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="6" y="6" width="72" height="72" rx="36" fill={textColor} fillOpacity="0.06" />
        <rect
          x="6"
          y="6"
          width="72"
          height="72"
          rx="36"
          stroke={textColor}
          strokeOpacity="0.04"
          strokeWidth="12"
        />
        <path
          d="M27 40.5V37.5C27 32.25 30 30 34.5 30H49.5C54 30 57 32.25 57 37.5V46.5C57 51.75 54 54 49.5 54H42"
          stroke={primaryColor}
          strokeWidth="2.25"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M42 45.75C44.0711 45.75 45.75 44.0711 45.75 42C45.75 39.9289 44.0711 38.25 42 38.25C39.9289 38.25 38.25 39.9289 38.25 42C38.25 44.0711 39.9289 45.75 42 45.75Z"
          stroke={primaryColor}
          strokeWidth="2.25"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M51.75 38.25V45.75"
          stroke={primaryColor}
          strokeWidth="2.25"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M27 47.25H35.01C35.97 47.25 36.75 48.03 36.75 48.99V50.91"
          stroke={primaryColor}
          strokeWidth="2.25"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M28.83 45.42L27 47.25L28.83 49.08"
          stroke={primaryColor}
          strokeWidth="2.25"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M36.75 55.17H28.74C27.78 55.17 27 54.39 27 53.43V51.51"
          stroke={primaryColor}
          strokeWidth="2.25"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M34.9219 57.0005L36.7518 55.1705L34.9219 53.3405"
          stroke={primaryColor}
          strokeWidth="2.25"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Box>
  );
};

export const BankTransferIcon = ({boxSize = {base: `48px`, lg: `84px`}, ...rest}) => {
  const theme = useTheme();
  const textColor = theme?.colors?.text;
  const primaryColor = theme?.colors?.custom_color?.color_pop;

  return (
    <Box boxSize={boxSize} {...rest}>
      <svg
        width="84"
        height="84"
        viewBox="0 0 84 84"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="6" y="6" width="72" height="72" rx="36" fill={textColor} fillOpacity="0.06" />
        <rect
          x="6"
          y="6"
          width="72"
          height="72"
          rx="36"
          stroke={textColor}
          strokeOpacity="0.04"
          strokeWidth="12"
        />
        <path
          d="M42.555 27.225L56.055 32.625C56.58 32.835 57 33.465 57 34.02V39C57 39.825 56.325 40.5 55.5 40.5H28.5C27.675 40.5 27 39.825 27 39V34.02C27 33.465 27.42 32.835 27.945 32.625L41.445 27.225C41.745 27.105 42.255 27.105 42.555 27.225Z"
          stroke={primaryColor}
          strokeWidth="2.25"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M57 57H27V52.5C27 51.675 27.675 51 28.5 51H55.5C56.325 51 57 51.675 57 52.5V57Z"
          stroke={primaryColor}
          strokeWidth="2.25"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M30 51V40.5"
          stroke={primaryColor}
          strokeWidth="2.25"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M36 51V40.5"
          stroke={primaryColor}
          strokeWidth="2.25"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M42 51V40.5"
          stroke={primaryColor}
          strokeWidth="2.25"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M48 51V40.5"
          stroke={primaryColor}
          strokeWidth="2.25"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M54 51V40.5"
          stroke={primaryColor}
          strokeWidth="2.25"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M25.5 57H58.5"
          stroke="#292D32"
          strokeWidth="2.25"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M42 36.75C43.2426 36.75 44.25 35.7426 44.25 34.5C44.25 33.2574 43.2426 32.25 42 32.25C40.7574 32.25 39.75 33.2574 39.75 34.5C39.75 35.7426 40.7574 36.75 42 36.75Z"
          stroke="#292D32"
          strokeWidth="2.25"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Box>
  );
};
