import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { useLogin } from "@/api/login/useLogin";

const validationSchema = Yup.object({
  username: Yup.string().required("نام کاربری الزامی است"),
  password: Yup.string().required("رمز عبور الزامی است"),
});

const Login: React.FC = () => {
  const { mutate: login, isLoading } = useLogin();
  const navigate = useNavigate();

  const handleSubmit = async (values: {
    username: string;
    password: string;
  }) => {
    login(values, {
      onSuccess: () => {
        navigate("/");
      },
    });
  };

  return (
    <div className="flex w-screen h-screen justify-center items-center px-10">
      <div className="flex flex-col justify-center items-center gap-14 border shadow rounded-[10px] px-8 py-10">
        <h1 className="text-2xl font-bold text-primary">ورود به حساب کاربری</h1>
        <Formik
          initialValues={{ username: "", password: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form>
            <div className="flex flex-col justify-center items-center w-full gap-10">
              <div className="flex flex-col justify-center items-center gap-6 w-80">
                <div className="w-full flex flex-col justify-start items-start gap-2">
                  <label
                    htmlFor="username"
                    className="block text-base font-semibold text-gray-700"
                  >
                    نام کاربری
                  </label>
                  <div className="flex justify-start items-start flex-col gap-1 w-full">
                    <div className="w-full" dir="ltr">
                      <Field
                        id="username"
                        name="username"
                        type="text"
                        placeholder="username"
                        className="block w-full font-medium px-3 py-2 border border-gray-300 rounded-[10px] shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                      />
                    </div>
                    <ErrorMessage
                      name="username"
                      component="div"
                      className="text-red-600 text-sm font-medium"
                    />
                  </div>
                </div>

                <div className="w-full flex flex-col justify-start items-start gap-2">
                  <label
                    htmlFor="password"
                    className="block text-base font-semibold text-gray-700"
                  >
                    رمز عبور
                  </label>
                  <div className="flex justify-start items-start flex-col gap-1 w-full">
                    <div className="w-full" dir="ltr">
                      <Field
                        id="password"
                        name="password"
                        type="password"
                        placeholder="******"
                        className="block w-full font-medium px-3 py-2 border border-gray-300 rounded-[10px] shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                      />
                    </div>

                    <ErrorMessage
                      name="password"
                      component="div"
                      className="text-red-600 text-sm font-medium"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full transition-all font-medium duration-300 bg-primary text-white py-2 px-4 rounded-[10px] shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="container after:!bg-white before:!bg-white">
                    <div className="dot !bg-white"></div>
                  </div>
                ) : (
                  "ورود"
                )}
              </button>
            </div>
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default Login;
