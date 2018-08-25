export const getErrorString = errorMessage =>
  Object.entries(errorMessage).reduce((prev, entry) => {
    const [field, msg] = entry;
    return `${prev} ${field}: ${msg} \n`;
  }, " Failed to save task: \n");

export const isFilled = str => !!str.length;

export const validateForm = (validators, formData) => {
  const areAllFieldsValid = Object.entries(formData).every(entry => {
    const [field, value] = entry;
    const validationFn = validators[field];
    return validationFn(value);
  });

  return areAllFieldsValid;
};

export const fixedEncodeURIComponent =  (str) => {
  return encodeURIComponent(str).replace(/[!'()*]/g, function(c) {
    return '%' + c.charCodeAt(0).toString(16);
  });
}
