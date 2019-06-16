import * as Yup from 'yup';
import { ErrorMessages } from './errors';

const USERNAME_MAX_LENGTH = 30;
const USERNAME_REGEX = /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/;
const PASSWORD_REGEX = /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/;

export const userLoginValidationSchema = Yup.object().shape({
  email: Yup.string()
    .trim()
    .email(ErrorMessages.email.invalid)
    .required(ErrorMessages.email.required),
  password: Yup.string()
    .trim()
    .matches(PASSWORD_REGEX, ErrorMessages.password.invalid)
    .min(6, ErrorMessages.password.invalid)
    .required(ErrorMessages.password.required),
});

export const userRegisterValidationSchema = Yup.object().shape({
  username: Yup.string()
    .trim()
    .matches(USERNAME_REGEX, ErrorMessages.userName.invalid)
    .min(4, ErrorMessages.userName.invalid)
    .max(USERNAME_MAX_LENGTH, ErrorMessages.userName.maxlength)
    .required(ErrorMessages.userName.required),
  email: Yup.string()
    .trim()
    .email(ErrorMessages.email.invalid)
    .required(ErrorMessages.email.required),
  password: Yup.string()
    .trim()
    .matches(PASSWORD_REGEX, ErrorMessages.password.invalid)
    .min(6, ErrorMessages.password.invalid)
    .required(ErrorMessages.password.required),
});

export const tripFormValidationSchema = Yup.object().shape({
  destination: Yup.string()
    .trim()
    .required(ErrorMessages.destination.required),
});
