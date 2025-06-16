import logoLight from "../assets/images/logo-light.svg";
import logo from "../assets/images/logo.svg";
import { NavLink } from "react-router";

export default () => {
  return (
    <main className="tw:h-full tw:w-full tw:flex tw:lg:flex-row tw:flex-col">
      <div className="tw:lg:h-full tw:h-1/2 tw:lg:w-1/2 tw:w-full tw:flex tw:flex-col tw:lg:items-baseline tw:items-center tw:lg:pl-32 tw:bg-rtoc-purple-200 tw:relative">
        <div className="tw:flex tw:absolute tw:top-8">
          <img className="tw:w-64" src={logoLight} alt="logo" />
        </div>
        <div className="tw:my-auto tw:text-center tw:lg:text-left">
          <h1 className="tw:mb-4">Lorem Ipsum</h1>
          <p>lorem ipsum dolor sit amet</p>
        </div>
      </div>
      <div className="tw:lg:h-full tw:h-1/2 tw:lg:w-1/2 tw:w-full tw:flex tw:flex-col tw:items-center tw:relative">
        <div className="tw:my-auto">
          <h1 className="tw:mb-4 tw:text-center">Get Started</h1>
          <div className="">
            <button className="btn tw:w-[183px] tw:mr-4">Register</button>
            <NavLink to="/login">
              <button className="btn tw:w-[183px]">Login</button>
            </NavLink>
          </div>
        </div>
        <div className="tw:flex tw:flex-col tw:items-center tw:text-[13px] tw:absolute tw:bottom-4">
          <img className="tw:mb-1 tw:h-8 tw:w-8" src={logo} alt="logo" />
          <div>
            <a href="">Terms of use</a>
            <span className="tw:mx-0.5">|</span>
            <a href="">Privacy Policy</a>
          </div>
        </div>
      </div>
    </main>
  );
};
