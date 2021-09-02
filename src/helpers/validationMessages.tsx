const MIN = length => `This field should be at least ${length} chars long`,
  MAX = length => `This field should contain a max of ${length} chars`,
  MIN_MAX = (min, max) => `This field should be between ${min} and ${max} chars long.`,
  REQUIRED = 'This field cannot be empty',
  INVALID_URL = 'Please provide a valid url';

export {REQUIRED, MIN, MAX, MIN_MAX, INVALID_URL};
