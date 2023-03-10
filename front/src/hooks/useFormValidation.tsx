import { useEffect } from "react";
import { useStateReducer } from "./useStateReducer";

export interface IValidateRule {
  isValid: (value) => boolean;
  errorMessage: string;
}

export type IRules<IInitFields> = Record<keyof IInitFields, IValidateRule[]>;

export const defaultValidateRules = {
  required: () => ({
    isValid: (value: any) => !!value,
    errorMessage: "Required field",
  }),
  setMinLength: (minLength: number) => ({
    isValid: (value: string) => new RegExp(`.{${minLength}}`, "g").test(value),
    errorMessage: `At least ${minLength} chars`,
  }),
} satisfies Record<string, (v) => IValidateRule>;

// eslint-disable-next-line import/no-anonymous-default-export
export default <F extends Record<string, any>>(
  initFields: F,
  rules: Record<keyof F, IValidateRule[]>
) => {
  const [errors, setErrors] = useStateReducer<Partial<Record<keyof F, string>>>(
    {}
  );
  const [fields, setFields] = useStateReducer(initFields);

  const validate = () => {
    Object.keys(fields).forEach((field) => {
      rules[field].find((rule) => {
        if (rule.isValid(fields[field])) {
          setErrors({ [field]: undefined } as any);
          return false;
        } else {
          setErrors({ [field]: rule.errorMessage } as any);
          return true;
        }
      });
    });
  };

	const setField = <T extends keyof F>(field: T) => (value: F[T]) => {setFields({[field]: value} as any)}

  const isValid = () => {
    return !!!Object.values(errors).find((el) => el && el.length);
  };

  useEffect(() => {
    validate();
  }, [fields]);

  return { fields, setField, setFields, errors, isValid };
};
