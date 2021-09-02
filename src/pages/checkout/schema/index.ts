import * as Yup from 'yup';

export const NewUserCheckoutValidationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Please enter a valid email')
    .required('This field is required'),
  firstName: Yup.string().required('This field is required'),
  lastName: Yup.string().required('This field is required'),
  phoneNumber: Yup.string()
    .required('This field is required')
    .length(10, 'Please enter a valid phone number'),
  password: Yup.string()
    .required('This field is required')
    .min(8, 'Your password should be at least 8 characters long')
    .max(128, "That's too long. Try something shorter.")
    .matches(/.*[0-9].*/, 'Please include at least one number')
    .matches(/.*[A-Z].*/, 'Please include at least one uppercase letter'),
});
