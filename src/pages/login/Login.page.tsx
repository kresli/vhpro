import { Transition } from "@headlessui/react";
import {
  Fragment,
  FunctionComponent,
  useCallback,
  useMemo,
  useState,
} from "react";
import { Button, FieldText, Page } from "src/components";
import { createField, UseForm, useForm, useMount } from "src/hooks";
import logo from "src/components/logo.svg";
import { useAuth } from "src/contexts";

const Animate: FunctionComponent = ({ children }) => (
  <Transition
    as={Fragment}
    enter="transition ease-out duration-100"
    enterFrom="transform opacity-0 scale-95"
    enterTo="transform opacity-100 scale-100"
    leave="transition ease-in duration-75"
    leaveFrom="transform opacity-100 scale-100"
    leaveTo="transform opacity-0 scale-95"
  >
    {children}
  </Transition>
);

const SubmitButton = <T extends { values: any }>({
  form,
  onSubmit,
  label = "Submit",
}: {
  onSubmit: (values: any) => Promise<any> | void;
  form: T;
  label?: string;
}) => {
  const [loading, setLoading] = useState(false);
  const isMounted = useMount();
  const handleSubmit = useCallback(async () => {
    setLoading(true);
    await onSubmit(form.values);
    if (isMounted.current) setLoading(false);
  }, [form.values, isMounted, onSubmit]);
  return (
    <Button
      loading={loading}
      disabled={loading}
      label={label}
      onClick={handleSubmit}
    />
  );
};

export const LoginPage = () => {
  const { signIn } = useAuth();
  const form = useForm(
    {
      email: createField<string>(),
      password: createField<string>(),
    },
    {
      email: {
        type: "email",
        label: "Email",
        defaultValue: "",
      },
      password: {
        type: "password",
        label: "Password",
        defaultValue: "",
      },
    }
  );

  const handleLogin = useCallback(() => {}, []);

  return (
    <Page>
      <div className="flex justify-center items-center h-full">
        <div className="w-96 space-y-4 flex flex-col items-center">
          <img src={logo} alt="logo" className="w-24 h-24" />
          <span>VinehealthPRO</span>
          <FieldText field={form.fields.email} />
          <FieldText field={form.fields.password} />
          <div className="pt-4 flex w-full">
            <SubmitButton label="Sign in" form={form} onSubmit={signIn} />
          </div>
        </div>
      </div>
    </Page>
  );
};
