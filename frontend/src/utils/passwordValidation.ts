
// Password validation
export const passwordSchema = {
  type: 'string',
  minLength: 8,
  maxLength: 128,
  pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@%*?&])[A-Za-z\d@%*?&]'
};
