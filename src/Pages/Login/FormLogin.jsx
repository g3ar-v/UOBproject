import React from "react";
import useForm from "../../Hooks/useForm";
import validate from "../../Hooks/validateInfo";
import "./Form.css";

const FormLogin = ({ submitForm }) => {
  const { handleChange, values, handleSubmit, errors } = useForm(
    submitForm,
    validate
  );
  return (
    <div className="form-content-right">
      <form className="form" onSubmit={handleSubmit}>
        <h1>Login to trackAtt.</h1>
        <div className="form-inputs">
          <label htmlFor="username" className="form-label">
            username
          </label>
          <input
            id="username"
            type="text"
            name="username"
            className="form-input"
            placeholder="Enter your username"
            value={values.username}
            onChange={handleChange}
          />
          {errors.username && <p>{errors.username}</p>}
        </div>
        <div className="form-inputs">
          <label htmlFor="password" className="form-label">
            password
          </label>
          <input
            id="password"
            type="text"
            name="password"
            className="form-input"
            placeholder="Enter your password"
            value={values.password}
            onChange={handleChange}
          />
          {errors.password && <p>{errors.password}</p>}
        </div>
        <button></button>
        <span className="form-input-login"></span>
      </form>
    </div>
  );
};

export default FormLogin;
