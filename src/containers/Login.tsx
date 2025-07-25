import logo from '../assets/images/logo-rtoc.png';
import { NavLink } from 'react-router';
import { authUser } from '../utilities/data';
import { useState, type ChangeEvent } from 'react';
import { useNavigate } from 'react-router';

import TextInput from '../components/TextInput';
const Login = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const navigate = useNavigate();

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePaswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleLogin = async () => {
    const auth = await authUser(email, password);

    if (auth) {
      navigate('/profile');
    }
  };

  return (
    <div className="tw:lg:w-[400px] tw:w-full tw:flex tw:flex-col tw:items-center tw:lg:p-0 tw:p-3 tw:mx-auto tw:absolute tw:top-1/2 tw:-translate-y-1/2 tw:left-0 tw:right-0">
      <img className="tw:w-20 tw:mb-1" src={logo} alt="logo" />
      <h2 className="tw:text-center">Login to RTO Complete</h2>
      <p className="tw:text-center">lorem ipsum dolor sit amet</p>

      <div className="tw:w-full tw:flex tw:flex-col tw:mt-10">
        <TextInput classes="tw:mb-4" label="Email Address" placeholder="Enter your email" onChange={handleEmailChange} />
        <TextInput classes="tw:mb-4" label="Password" placeholder="Enter password" isPassword onChange={handlePaswordChange} />

        {/* Comment out remember me for security reasons and forgot password as no backend functionality exists for it yet */}
        {/* <div className="tw:flex tw:justify-between tw:mt-2 tw:mb-8">
          <label className="input__checkbox-container">
            <input type="checkbox"/>
            <span className="input__checkmark"></span>
            <span className="tw:ml-1.5">Remember me</span>
          </label>
          <a className="tw:text-rtoc-purple-500" href="">Forgot Password?</a>
        </div> */}

        <div className="tw:flex tw:flex-col tw:items-center">
          <button className="btn tw:w-full tw:mb-10" onClick={handleLogin}>Sign In</button>
          <span className="">Don't have an account? <NavLink className="tw:text-rtoc-purple-500 tw:underline" to="/create-profile">Sign Up</NavLink></span>
        </div>
      </div>
    </div>
  );
};

export default Login;
