import * as Yup from 'yup';

export const userLoginValidationSchema = Yup.object().shape({
  email: Yup.string('Enter your email')
    .email('Enter a valid email')
    .required('Email is required'),
  password: Yup.string('')
    .min(6, 'Password must contain at least 6 characters')
    .required('Password is required'),
});

export const userRegisterValidationSchema = Yup.object().shape({
  username: Yup.string('Enter your username')
    .min(4, 'Password must contain at least 4 characters')
    .required('Username is required'),
  email: Yup.string('Enter your email')
    .email('Enter a valid email')
    .required('Email is required'),
  password: Yup.string('')
    .min(6, 'Password must contain at least 6 characters')
    .required('Password is required'),
});

export const tripFormValidationSchema = Yup.object().shape({
  destination: Yup.string('Enter trip destination')
    .min(4, 'Trip destination must contain at least 4 characters')
    .required('Trip destination is required'),
  start_date: Yup.string('Enter trip start date').required('Start date is required'),
  end_date: Yup.string('Enter trip end date').required('End date is required'),
});

export const tripDayFormValidationSchema = Yup.object().shape({
  trip_date: Yup.string('Enter trip date').required('Trip date is required'),
});
