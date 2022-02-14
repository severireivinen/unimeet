import { atom } from "recoil";

export const registerModalState = atom({
  key: "registerModalState",
  default: false,
});

export const signInModalState = atom({
  key: "signInModalState",
  default: false,
});

export const profileInfoModalState = atom({
  key: "profileInfoModalState",
  default: false,
});
