import { useForm } from "react-hook-form";
import TextInput from "~/components/Global/FormElements/TextInput/TextInput";
import Button from "~/components/Global/Button/Button";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useLoginMutation } from "~/redux/api/auth/authApi";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setUser } from "~/redux/features/auth/authSlice";
import { EMAIL_PATTERN } from "~/utilities/regExpValidations";
import { setTokens } from "~/redux/features/auth/tokenSlice";

const Login = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({ mode: "all" });

  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();

  const handleLogin = (payload) => {
    login(payload)
      .unwrap()
      .then((data) => {
        console.log("DATA ", data);
        // dispatch(setUser(data));
        // const { accessToken, refreshToken } = data;
        // dispatch(setTokens({ accessToken, refreshToken }));
        // toast.success("Login successful");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div>
      <div className="mb-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold">Welcome Back</h2>
        <p className="text-gray-dark mt-2">Login to your account</p>
      </div>
      <form onSubmit={handleSubmit(handleLogin)} className="grid grid-cols-1 gap-4">
        <div>
          <TextInput
            label="email"
            type="email"
            register={register}
            errors={errors}
            required
            placeholder="Enter email address"
            rules={{
              pattern: { value: EMAIL_PATTERN, message: "Enter a valid email address" },
            }}
          />
        </div>
        <div>
          <TextInput
            type="password"
            label="password"
            required={true}
            register={register}
            errors={errors}
            placeholder="Enter password"
          />
        </div>

        {/* forgot password */}
        <div className="ml-auto -mt-1">
          <Link to="/forgot-password" className=" text-primary font-semibold text-sm hover:underline">
            Forgot Password?
          </Link>
        </div>

        <div className="grid gap-6">
          <Button large label="Login" loading={isLoading} className="w-full" type="submit" />
          <div className="text-center font-bold text-black ">
            Don&apos;t have an account?
            <Link to="/signup" className="ml-2 text-primary font-medium text-sm hover:underline">
              Sign Up
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
};
export default Login;
