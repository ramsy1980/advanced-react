import { useState, useRef } from 'react';

export default function useForm(initial = {}) {
  const [inputs, setInputs] = useState(initial);

  // Use a separate ref to be able to clear the input file
  // Changing the value like a normal input does not do this
  const fileInputRef = useRef();

  function handleChange(e) {
    let { value, name, type } = e.target;

    if (type === 'number') {
      value = parseInt(value);
    }

    if (type === 'file') {
      [value] = e.target.files;
    }

    setInputs((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }

  function resetForm() {
    setInputs(initial);
  }

  function clearForm() {
    const blankState = Object.fromEntries(
      Object.entries(inputs).map(([key]) => [key, ''])
    );
    fileInputRef.current.value = '';
    setInputs(blankState);
  }

  return {
    inputs,
    handleChange,
    resetForm,
    clearForm,
    fileInputRef,
  };
}
