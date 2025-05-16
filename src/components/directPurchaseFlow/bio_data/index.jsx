import {getSettingsData, updateSettings} from '@/api/Settings';
import {useMutation, useQuery} from 'react-query';
import {useFormik} from 'formik';
import {useToast} from '@chakra-ui/react';
import {formatDateStringDayFirst, isValidDate} from '@/realtors_portal/utils/formatDate';
import {BioDataView} from './view';

export const BioData = ({settingsPage = false, nextStep = () => {}}) => {
  const toast = useToast();

  const profileQuery = useQuery(['getSettingsData'], () => getSettingsData({profile: true}), {
    onSuccess: res => {
      const [y, m, d] = res?.data?.data?.date_of_birth
        ? res?.data?.data?.date_of_birth?.split('-')
        : [``, ``, ``];
      console.log({res});

      formik.setValues({
        avatar: res.data?.data?.avatar,
        first_name: res.data?.data?.first_name || '',
        last_name: res.data?.data?.last_name || '',
        date_of_birth: res.data?.data?.date_of_birth ? `${d}/${m}/${y}` : '',
        gender: res.data?.data?.gender || '',
        email: res.data?.data?.email || '',
        marital_status: res.data?.data?.marital_status || '',
        phone: res.data?.data?.phone || '',
        highest_education: res.data?.data?.highest_education || '',
        employment_status: res.data?.data?.employment_status || '',
        company_name: res.data?.data?.company_name || '',
        occupation: res.data?.data?.occupation || '',
        monthly_income: res.data?.data?.monthly_income || '',
        bvn: res.data?.data?.bvn || '',
        address: res.data?.data?.address || '',
        company_address: res.data?.data?.company_address || '',
        country: res.data?.data?.country_name || '',
        currency: res.data?.data?.currency || '',
        fund_source: res.data?.data?.fund_source || '',
      });
    },
  });

  const mutation = useMutation(formData => updateSettings(formData), {
    onSuccess: async res => {
      toast({
        title: settingsPage ? `Success!` : 'Profile updated successfully',
        description: settingsPage ? `Your profile data has been saved` : ``,
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
      nextStep();
      return await profileQuery?.refetch();
    },
    onError: err => {
      toast({
        title: err?.message === 'Network Error' ? 'Network Error' : 'Oops something went wrong',
        description: `${err?.response?.data?.message ?? 'please check your network connection'}`,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
    },
  });

  const validateForm = values => {
    const errors = {};
    let hasChanged = false; // Initialize a flag
    const date = new Date();
    const [d, m, y] = values?.date_of_birth?.split('/');
    // const inputDate = new Date(`${m}-${d}-${y?.padStart(4, '0')}`);
    const inputDate = new Date(`${y?.padStart(4, '0')}-${m}-${d}`);

    // Validate date_of_birth
    if (isNaN(inputDate?.getTime()) && formik.touched.date_of_birth) {
      errors.date_of_birth = 'Invalid Date format';
    } else if (inputDate > date) {
      errors.date_of_birth = "Hmm, date selected can't be in the future";
    }

    // Check if any other value has changed
    for (const [key, value] of Object.entries(values)) {
      if (['first_name', 'last_name', 'phone', 'avatar', 'country', 'email'].includes(key)) {
        continue; // Skip these keys
      }
      const initialValue = formik.initialValues[key];
      const currentValue = values[key];
      if (initialValue !== currentValue) {
        hasChanged = true; // Set the flag if any value has changed
      }
    }

    if (!hasChanged) {
      errors._error = 'At least one value must be changed.';
    }

    return errors;
  };

  const handleDate = e => {
    const inputValue = e.target.value;
    const numericValue = inputValue.replace(/\D/g, '');

    const formattedValue = formatDateStringDayFirst(numericValue);

    if (!inputValue.trim()) {
      formik.setValues({
        ...formik.values,
        date_of_birth: '', // Set to empty string when input is cleared
      });
    } else {
      formik.setValues({
        ...formik.values,
        date_of_birth: formattedValue,
      });

      // Validate the formatted date
      const [d, m, y] = formattedValue.split('/');
      if (!isValidDate(d, m, y)) {
        formik.setErrors({
          ...formik.errors,
          date_of_birth: 'Please enter a valid date',
        });
      } else {
        formik.setErrors({
          ...formik.errors,
          date_of_birth: '',
        });
      }
    }

    formik.setFieldTouched('date_of_birth');
  };

  const handleAmount = e => {
    const inputValue = e.target.value;
    const numericValue = inputValue.replace(/\D/g, '');
    if (!inputValue.trim()) {
      formik.setValues({
        ...formik.values,
        monthly_income: '', // Set to empty string when input is cleared
      });
    } else {
      formik.setValues({
        ...formik.values,
        monthly_income: numericValue * 1,
      });
    }

    formik.setFieldTouched('monthly_income');
  };

  const handleBlur = e => {
    const inputValue = e.target.value;
    const numericValue = inputValue.replace(/\D/g, '');
    const month = numericValue.substr(0, 2);
    const day = numericValue.substr(2, 2);
    const year = numericValue.substr(4);

    if (numericValue.length === 10 && !isValidDate(day, month, year)) {
      formik.setErrors({
        ...formik.errors,
        date_sold: 'Please enter a valid date',
      });
    } else {
      formik.setErrors({
        ...formik.errors,
        date_sold: '',
      });
    }

    formik.setFieldTouched('date_sold');
  };

  const formik = useFormik({
    initialValues: {
      avatar: '',
      first_name: '',
      last_name: '',
      date_of_birth: '',
      gender: '',
      email: '',
      marital_status: '',
      phone: '',
      highest_education: '',
      employment_status: '',
      company_name: '',
      occupation: '',
      monthly_income: '',
      bvn: '',
      address: '',
      company_address: '',
      currency: '',
    },
    onSubmit: values => {
      let exp = {};
      const [d, m, y] = values?.date_of_birth?.split('/');

      for (const [key, value] of Object.entries(values)) {
        let val = value?.toString();
        if (val.trim() !== '') {
          exp[key] = value;
        }
      }
      exp = {
        profile_details: true,
        ...exp,
        date_of_birth: formik.touched.date_of_birth ? `${y}-${m}-${d}` : undefined,
      };
      delete exp.avatar;
      mutation.mutate(exp);
    },
    validateOnChange: true,
    // validateOnMount: true,
    validate: validateForm,
  });

  return (
    <BioDataView
      formik={formik}
      profileQuery={profileQuery}
      handleBlur={handleBlur}
      handleAmount={handleAmount}
      mutation={mutation}
      handleDate={handleDate}
      settingsPage={settingsPage}
    />
  );
};
