import * as Yup from 'yup';

export const NewUserCheckoutValidationSchema = Yup.object().shape({
  customer: Yup.object().shape({
    email: Yup.string()
      .email('Please enter a valid email')
      .required('This field is required'),
    firstName: Yup.string().required('This field is required'),
    lastName: Yup.string().required('This field is required'),
    phoneNumber: Yup.string()
      .required('This field is required')
      // 10 digits for a phone number + 2 hyphens for formatting
      .length(12, 'Please enter a valid phone number'),
    password: Yup.string()
      .required('This field is required')
      .min(8, 'Your password should be at least 8 characters long')
      .max(128, 'That\'s too long. Try something shorter.')
      .matches(/.*[0-9].*/, 'Please include at least one number')
      .matches(/.*[A-Z].*/, 'Please include at least one uppercase letter')
      .matches(/.*[a-z].*/, 'Please include at least one lowercase letter'),
  }),
});
