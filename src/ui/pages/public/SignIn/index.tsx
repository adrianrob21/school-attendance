import { useTranslation } from "react-i18next";
import type { Control } from "react-hook-form";
import { useNavigate, useLocation } from "react-router";
import type { Location, NavigateFunction } from "react-router";

import { Input } from "Components";
import { useValidatedForm } from "Hooks";
import { PRIVATE_PATHS } from "Constants";
import { signInSchema } from "ValidationSchemas";

import useSignInState from "./state";
import type { SignInValues, SignInInput } from "./types";

const INPUTS: SignInInput[] = [
  {
    key: "username",
    label: "forms:username.label",
    placeholder: "forms:username.placeholder",
  },
  {
    key: "password",
    label: "forms:password.label",
    placeholder: "forms:password.placeholder",
    type: "password",
  },
];

type TranslateFn = (key: string) => string;

const translateFormError = (translate: TranslateFn, key: string) =>
  translate(`errors:form.${key}`);

const submitSignIn = (
  updateSignInForm: (values: SignInValues) => void,
  logIn: () => void,
  navigate: NavigateFunction,
  from: Location | undefined,
  data: SignInValues,
) => {
  updateSignInForm(data);
  logIn();
  navigate(from ?? PRIVATE_PATHS.DASHBOARD, { replace: true });
};

const renderInput = (
  control: Control<SignInValues>,
  translateError: TranslateFn,
  translate: TranslateFn,
  input: SignInInput,
) => (
  <Input
    control={control}
    key={input.key}
    label={translate(input.label)}
    name={input.key}
    placeholder={translate(input.placeholder)}
    translateError={translateError}
    type={input.type}
  />
);

const SignIn = () => {
  const { t: translate } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { actions, state } = useSignInState();
  const { logIn, updateSignInForm } = actions;

  const from = (location.state as { from?: Location } | null)?.from;

  const { handleSubmit, control } = useValidatedForm<SignInValues>({
    defaultValues: {
      password: state?.password ?? "",
      username: state?.username ?? "",
    },
    onPersist: updateSignInForm,
    schema: signInSchema,
  });
  const onSubmit = handleSubmit(
    submitSignIn.bind(null, updateSignInForm, logIn, navigate, from),
  );

  const translateError = translateFormError.bind(null, translate);

  return (
    <div className="flex flex-col mt-4 w-full items-center">
      <h1 className="text-center text-2xl">Sign In</h1>
      <div className="flex flex-col gap-4 w-1/3">
        {INPUTS.map(renderInput.bind(null, control, translateError, translate))}
        <button onClick={onSubmit} type="button">
          Submit
        </button>
      </div>
    </div>
  );
};

export default SignIn;
