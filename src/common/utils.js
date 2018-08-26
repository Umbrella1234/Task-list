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

export const objToFormData = formDataObj => {
  const formData = new FormData();

  Object.entries(formDataObj).forEach(entry => {
    const [field, value] = entry;
    formData.append(field, value);
  });

  return formData;
};

export const objToParamsString = data => {
  const entries = Object.entries(data);
  let paramsString = "";

  entries.forEach((entry, i) => {
    const [field, value] = entry;
    const isLastItem = i === entries.length - 1;

    paramsString += `${field}=${value}${isLastItem ? "" : "&"}`;
  });

  return paramsString;
};
