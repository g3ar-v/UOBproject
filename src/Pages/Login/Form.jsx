import React, { useState } from "react";
import FormLogin from './FormLogin'
import FormSuccess from './FormSuccess'
import './Form.css'


const Form = () => {
  const [isSubmitted, setIsSubmitted] = useState(false)

  function submitForm() {
    setIsSubmitted(true)
  }
  return (
    <div>
      {!isSubmitted ? <FormLogin submitForm={submitForm} /> : <FormSuccess />}
    </div>
  )
}

export default Form; 