import { useForm } from "react-hook-form";
import TextInput from "~/components/FormElements/TextInput/TextInput";
import Button from "~/components/Button/Button";
import { useNavigate } from "react-router-dom";
import Checkbox from "~/components/FormElements/Checkbox/Checkbox";
import { Link } from "react-router-dom";
import { useLoginMutation } from "~/redux/api/auth/authApi";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setUser } from "~/redux/features/auth/authSlice";
import { EMAIL_PATTERN } from "~/utilities/regExpValidations";
import { setTokens } from "~/redux/features/auth/tokenSlice";

const Login = () => {
  const {
    control,
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({ mode: "all" });

  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();

  const handleLogin = (payload) => {
    // removing the rememberMe checkbox from payload cos it is not used
    const { uid, password } = payload;
    // making request using login() from RTK Query
    login({ uid, password })
      .unwrap()
      .then((data) => {
        dispatch(setUser(data));
        const { accessToken, refreshToken } = data;
        dispatch(setTokens({ accessToken, refreshToken }));
        toast.success("Login successful");
        const isGlobal = data.menu.some((x) => x.parent == "global-admin");
        navigate(isGlobal ? "/global-admin" : "/system-admin");
      })
      .catch((error) => toast.error(error));
  };

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Login to Portal</h2>
        <p className="text-sm text-gray-dark">Kindly login with credentials to access account</p>
      </div>
      <form onSubmit={handleSubmit(handleLogin)} className="grid grid-cols-1 gap-4">
        <div>
          <TextInput
            title="Email Address"
            label="uid"
            type="email"
            register={register}
            errors={errors}
            required
            placeholder="Enter email address"
            rules={{
              pattern: { value: EMAIL_PATTERN, message: "Invalid email address" },
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
        <div>
          <Checkbox
            label="rememberMe"
            control={control}
            register={register}
            activeText="Remember this user"
            inActiveText="Remember this user"
          />
        </div>
        <div className="grid gap-3">
          <Button label="Login" loading={isLoading} className="w-full" type="submit" />
          <Link to="/forgot-password" className="mx-auto text-primary font-medium text-sm hover:underline">
            Forgot Password?
          </Link>
        </div>
      </form>
    </div>
  );
};
export default Login;
