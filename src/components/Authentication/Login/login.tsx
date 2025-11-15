import styles from "./login.module.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import useLoginLogic from "./login.logic";

const Login: React.FC = ()=> {
  const { setEmail , setPassword , res , loading , error , eye , handleSubmit , toggleEye } = useLoginLogic();
  return (
    <section className={styles.login + " flex flex-col items-center h-screen justify-center bg-gradient-to-b from-teal-600 from-50% to-gray-100 to-50% space-y-6"}>
        <h2 className="font-Playwrite text-3xl text-white text-center">Employee Management System</h2>
        <div className="border shadow p-4 bg-white">
          <h2 className='text-2xl text-center font-bold mb-4'>Login</h2>
          {res && <p className="text-green-500 text-center mb-4">{res}</p>}
          <form onSubmit={handleSubmit}>

              <div className="mb-4">
                  <label htmlFor="email" className='block text-gray-700'>Email</label>
                  <input type="email" id='email' name='email' placeholder='Enter your email' className="w-full px-3 py-2 border" onChange={(e) => setEmail(e.target.value)} required/>
              </div>

              <div className="mb-4">
                  <label htmlFor="password" className='block text-gray-700'>password</label>
                  <span className={styles.passwordInput +  " flex items-center justify-between"}>
                      <input type={eye ? "text" : "password"} id='password' name='password' placeholder='Enter your password' className="w-full px-3 py-2 border" onChange={(e) => setPassword(e.target.value)} required/>
                      <span className={styles.eyeIcon} onClick={toggleEye}>
                          <FontAwesomeIcon icon={eye ?  faEyeSlash : faEye} />
                      </span>
                  </span>
              </div>

              <div className="mb-4 flex items-center justify-between">
                  <label className="inline-flex items-center">
                      <input type="checkbox" className={styles.checkBox + " form-checkbox" } required/>
                      <span className="ml-2 text-gray-700">Remember me</span>
                  </label>
                  <Link to='/login' className="text-sm text-teal-600 hover:underline ml-2">Forgot password?</Link>  
              </div>

              <div className="mb-4">
                  <button type="submit" className="w-full bg-teal-600 text-white py-2 hover:bg-teal-700" disabled={loading}>
                      {loading ? 
                        <span className={styles.loader}></span> 
                        : 
                        <span>Login</span>
                      }
                  </button>
              </div>

          </form>
          {error && <p className="text-red-500 text-center">{error}</p>}
        </div>
    </section>
  )
}

export default Login
