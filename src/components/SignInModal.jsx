import React, { Fragment, useState } from "react";
import { useRecoilState } from "recoil";
import { signInModalState } from "../atoms/modals";
import { Dialog, Transition } from "@headlessui/react";
import * as Yup from "yup";
import { Formik, Field, ErrorMessage } from "formik";
import { signIn } from "next-auth/client";
import { useRouter } from "next/router";

function SignInModal() {
  const [openSignIn, setOpenSignIn] = useRecoilState(signInModalState);
  const [error, setError] = useState(null);
  const router = useRouter();

  return (
    <Transition.Root show={openSignIn} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-10 inset-0 overflow-y-auto"
        onClose={setOpenSignIn}
      >
        <div
          className="flex items-center justify-center min-h-[800px] sm:min-h-screen 
        pt-4 px-4 pb-20 text-center sm:block sm:p-0"
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>
          {/**This element tricks the browser into centering the modal contents */}
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div
              className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left 
            overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm 
            sm:w-full sm:p-6"
            >
              {/**Modal Content */}
              <Formik
                initialValues={{ email: "", password: "" }}
                validationSchema={Yup.object({
                  email: Yup.string()
                    .email("Virheellinen sähköpostiosoite")
                    .required("Sähköposti vaaditaan"),
                  password: Yup.string().required("Salasana vaaditaan"),
                })}
                onSubmit={async (values, { setSubmitting }) => {
                  const res = await signIn("Credentials", {
                    redirect: false,
                    email: values.email,
                    password: values.password,
                  });
                  if (res?.error) {
                    setError(res.error);
                  } else {
                    setError(null);
                  }
                  setSubmitting(false);
                }}
              >
                {(formik) => (
                  <form onSubmit={formik.handleSubmit}>
                    <div className="flex flex-col items-center justify-center py-2">
                      <h1 className="text-2xl italic font-bold">Kirjaudu</h1>
                      <div className="text-red-500 text-md text-center rounded p-2">
                        {error}
                      </div>
                      <div className="mb-4 w-full">
                        <label
                          htmlFor="email"
                          className="uppercase text-sm text-gray-600 font-bold"
                        >
                          Email
                          <Field
                            name="email"
                            aria-label="enter your email"
                            aria-required="true"
                            type="text"
                            className="w-full bg-gray-200 text-gray-900 mt-2 p-3 rounded-lg focus:outline-none focus:shadow-outline"
                          />
                        </label>

                        <div className="text-red-600 text-sm">
                          <ErrorMessage name="email" />
                        </div>
                      </div>
                      <div className="mb-6 w-full">
                        <label
                          htmlFor="password"
                          className="uppercase text-sm text-gray-600 font-bold"
                        >
                          password
                          <Field
                            name="password"
                            aria-label="enter your password"
                            aria-required="true"
                            type="password"
                            className="w-full bg-gray-200 text-gray-900 mt-2 p-3 rounded-lg focus:outline-none focus:shadow-outline"
                          />
                        </label>

                        <div className="text-red-600 text-sm">
                          <ErrorMessage name="password" />
                        </div>
                      </div>
                      <div className="flex items-center justify-center">
                        <button
                          type="submit"
                          className="uppercase text-sm font-bold tracking-wide bg-gradient-to-r from-indigo-500 to-purple-500 text-gray-100 p-3 rounded-lg w-full focus:outline-none focus:shadow-outline hover:shadow-xl active:scale-90 transition duration-150"
                        >
                          {formik.isSubmitting ? "Pieni hetki..." : "Kirjaudu"}
                        </button>
                      </div>
                    </div>
                  </form>
                )}
              </Formik>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

export default SignInModal;
