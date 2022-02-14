import React, { Fragment, useRef, useState } from "react";
import { useRecoilState } from "recoil";
import { profileInfoModalState } from "../atoms/modals";
import { Dialog, Transition } from "@headlessui/react";
import { CameraIcon } from "@heroicons/react/solid";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import CustomSelect from "./Formik/CustomSelect";

import { db, storage } from "../firebase/firebase";
import { doc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { ref, getDownloadURL, uploadString } from "firebase/storage";

function ProfileInfoModal() {
  const [openUpdateProfile, setOpenUpdateProfile] = useRecoilState(
    profileInfoModalState
  );
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const filePickerRef = useRef(null);

  const updateUserProfile = async (values) => {
    // 1) Create new user adn add to firestore "users" colelction
    // 2) Get the user ID for the newly created user
    // 3) Upload the image to firebase stoage with the user ID
    // 4) get a dowload URL from the gb storage and update the original user with image

    if (isSubmitting) return;
    setIsSubmitting(true);

    await setDoc(doc(db, "users", session.user.email), {
      email: session.user.email,
      name: values.name,
      school: values.school,
      age: values.age,
      gender: values.gender,
      lookingForGender: values.lookingForGender,
      lookingForSchools: values.lookingForSchools,
      registeredAt: serverTimestamp(),
    });

    console.log("New doc added with ID ", session.user.email);

    const imageRef = ref(storage, `users/${session.user.email}/image`);

    await uploadString(imageRef, selectedFile, "data_url").then(
      async (snapshot) => {
        const dowloadURL = await getDownloadURL(imageRef);
        await updateDoc(doc(db, "users", session.user.email), {
          image: dowloadURL,
        });
      }
    );

    setOpenUpdateProfile(false);
    setIsSubmitting(false);
    setSelectedFile(null);
  };

  const schools = [
    { value: "metropolia", label: "Metropolia" },
    { value: "laurea", label: "Laurea" },
    { value: "univeristy-of-helsinki", label: "Helsingin yliopisto" },
    { value: "haaga-helia", label: "Haaga-Helia" },
    { value: "xamk", label: "XAMK" },
    { value: "school-of-life", label: "Elämämkoulu" },
  ];

  const genders = [
    { value: "male", label: "Mies" },
    { value: "female", label: "Nainen" },
    { value: "other", label: "Muu" },
  ];

  return (
    <Transition.Root show={openUpdateProfile} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-10 inset-0 overflow-y-auto"
        onClose={setOpenUpdateProfile}
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
                initialValues={{
                  name: "",
                  school: "",
                  age: "",
                  gender: "",
                  lookingForGender: "",
                  lookingForSchools: [],
                  image: "",
                }}
                validationSchema={Yup.object({
                  name: Yup.string().required("Nimi vaaditaan"),
                  school: Yup.string().required("Koulu vaaditaan"),
                  age: Yup.number()
                    .positive()
                    .integer()
                    .required("Ikä vaaditaan"),
                  gender: Yup.string().required("Sukupuoli vaaditaan"),
                  lookingForGender: Yup.string().required("Kerro ketä etsit"),
                  lookingForSchools: Yup.array()
                    .required("Vähintään yksi koulu valittava")
                    .min(1, "Vähintään yksi koulu valittava"),
                  image: Yup.string().required("Kuva vaaditaan"),
                })}
                onSubmit={(values) => {
                  updateUserProfile(values);
                }}
              >
                {(formik) => (
                  <form onSubmit={formik.handleSubmit}>
                    <div className="flex flex-col items-center justify-center">
                      <h1 className="text-xl font-semibold italic mb-5">
                        Viimeistele profiilisi
                      </h1>

                      {/**School */}
                      <div className="mb-4 w-full">
                        <label htmlFor="school">
                          Koulusi
                          <Field
                            name="school"
                            options={schools}
                            component={CustomSelect}
                          />
                        </label>
                        <div className="text-red-600 text-sm">
                          <ErrorMessage name="school" />
                        </div>
                      </div>

                      {/**Looking for schools */}
                      <div className="mb-4 w-full">
                        <label htmlFor="lookingForSchools">
                          Mitä kouluja haet
                          <Field
                            name="lookingForSchools"
                            options={schools}
                            isMulti={true}
                            component={CustomSelect}
                          />
                        </label>
                        <div className="text-red-600 text-sm">
                          <ErrorMessage name="lookingForSchools" />
                        </div>
                      </div>

                      {/**Gender */}
                      <div className="mb-4 w-full">
                        <label htmlFor="gender">
                          Sukupuolesi
                          <Field
                            name="gender"
                            options={genders}
                            component={CustomSelect}
                          />
                        </label>
                        <div className="text-red-600 text-sm">
                          <ErrorMessage name="gender" />
                        </div>
                      </div>

                      {/**Looking for gender */}
                      <div className="mb-4 w-full">
                        <label htmlFor="lookingForGender">
                          Mitä sukupuolta haet
                          <Field
                            name="lookingForGender"
                            options={genders}
                            component={CustomSelect}
                          />
                        </label>
                        <div className="text-red-600 text-sm">
                          <ErrorMessage name="lookingForGender" />
                        </div>
                      </div>

                      {/**Name */}
                      <div className="mb-4 w-full">
                        <label htmlFor="name">
                          Anna nimesi
                          <Field
                            name="name"
                            placeholder="Nimi jolla muut näkevät sinut"
                            type="text"
                            className="w-full border indent-2 border-gray-400 text-gray-900 p-1 rounded-sm focus:outline-none focus:shadow-outline"
                          />
                        </label>
                        <div className="text-red-600 text-sm">
                          <ErrorMessage name="name" />
                        </div>
                      </div>

                      {/**Age */}
                      <div className="mb-4 w-full">
                        <label htmlFor="age">
                          Anna ikäsi
                          <Field
                            name="age"
                            placeholder="Ikäsi"
                            type="number"
                            className="w-full border indent-2 border-gray-400 text-gray-900 p-1 rounded-sm focus:outline-none focus:shadow-outline"
                          />
                        </label>
                        <div className="text-red-600 text-sm">
                          <ErrorMessage name="age" />
                        </div>
                      </div>

                      {/**Image Ref */}
                      <div>
                        <input
                          name="image"
                          ref={filePickerRef}
                          type="file"
                          hidden
                          onChange={(e) => {
                            const reader = new FileReader();
                            if (e.target.files[0]) {
                              reader.readAsDataURL(e.target.files[0]);
                            }
                            reader.onload = (readerEvent) => {
                              setSelectedFile(readerEvent.target.result);
                              formik.setFieldValue(
                                "image",
                                readerEvent.target.result
                              );
                            };
                          }}
                        />
                        <div className="text-red-600 text-sm">
                          <ErrorMessage name="image" />
                        </div>
                      </div>
                      {/**Image */}
                      <div>
                        {selectedFile ? (
                          <img
                            src={selectedFile}
                            className="h-32 object-contain cursor-pointer border-2 border-purple-500 rounded-xl"
                            onClick={() => setSelectedFile(null)}
                            alt="image to upload"
                          />
                        ) : (
                          <div
                            onClick={() => filePickerRef.current.click()}
                            className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 cursor-pointer"
                          >
                            <CameraIcon
                              className="h-6 w-6 text-red-600"
                              aria-hidden="true"
                            />
                          </div>
                        )}
                      </div>

                      <button
                        type="submit"
                        className="uppercase mt-5 text-sm font-bold tracking-wide bg-gradient-to-r from-indigo-500 to-purple-500 text-gray-100 py-3 px-20 rounded-lg focus:outline-none focus:shadow-outline hover:shadow-xl active:scale-90 transition duration-150"
                      >
                        {isSubmitting ? "Hetki..." : "Jatka"}
                      </button>
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

export default ProfileInfoModal;
