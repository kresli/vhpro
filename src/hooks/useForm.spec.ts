import { renderHook, act } from "@testing-library/react-hooks";
import { createField, useForm } from "./useForm/useForm";

test("setFieldValue", () => {
  const { result } = renderHook(() =>
    useForm(
      {
        name: createField<string, string>(),
      },
      {
        name: {
          defaultValue: "",
        },
      }
    )
  );
  act(() => {
    result.current.fields.name.setValue("Don");
  });
  expect(result.current.fields.name.value).toEqual("Don");
  act(() => {
    result.current.fields.name.setValue("John");
  });
  expect(result.current.fields.name.value).toEqual("John");
});

test("field validator with 0", () => {
  const { result } = renderHook(() =>
    useForm(
      {
        age: createField<number, number>(),
      },
      {
        age: {
          defaultValue: 0,
          validators: [
            (value) => {
              return value !== 0 && `value must be 0 but is ${value}`;
            },
          ],
        },
      }
    )
  );
  expect(result.current.fields.age.value).toBe(0);
  expect(result.current.fields.age.errorMessage).toBeUndefined();

  act(() => {
    result.current.fields.age.setValue(2);
  });

  expect(result.current.fields.age.value).toBe(2);
  expect(result.current.fields.age.errorMessage).toBe(
    "value must be 0 but is 2"
  );
});

test("form validator", () => {
  const { result } = renderHook(() =>
    useForm(
      {
        age: createField<number>(),
      },
      {
        age: {
          defaultValue: 0,
          validators: [
            (value) => value !== 0 && `value must be 0 but is ${value}`,
          ],
        },
      }
    )
  );
  expect(result.current.hasError).toBeFalsy();
  act(() => {
    result.current.fields.age.setValue(2);
  });
  expect(result.current.fields.age.hasError).toBe(true);
  expect(result.current.hasError).toBe(true);
});

test("values", () => {
  const { result } = renderHook(() =>
    useForm(
      {
        name: createField<string>(),
        age: createField<number>(),
      },
      {
        name: {
          defaultValue: "Joe",
        },
        age: {
          defaultValue: 43,
        },
      }
    )
  );
  const { values } = result.current;
  expect(values).toEqual({
    name: "Joe",
    age: 43,
  });
  act(() => {
    result.current.fields.age.setValue(20);
  });
  act(() => {
    result.current.fields.name.setValue("Bon");
  });
  expect(result.current.values).toEqual({
    name: "Bon",
    age: 20,
  });
  expect(result.current.values).not.toBe(values);
});

test("values", () => {
  const { result } = renderHook(() =>
    useForm(
      {
        name: createField<string>(),
        age: createField<number>(),
      },
      {
        name: {
          defaultValue: "Joe",
        },
        age: {
          defaultValue: 43,
        },
      }
    )
  );
  const { values } = result.current;
  expect(values).toEqual({
    name: "Joe",
    age: 43,
  });
});

test("field is by default", () => {
  const { result } = renderHook(() =>
    useForm(
      {
        name: createField<string | undefined>(),
      },
      {
        name: {
          defaultValue: undefined,
        },
      }
    )
  );
  expect(result.current.values).toEqual({
    name: undefined,
  });
});

test("FormField.SELECT", () => {
  const { result } = renderHook(() =>
    useForm(
      {
        age: createField<number>(),
        make: createField<string>(),
      },
      {
        age: {
          defaultValue: 12,
          validators: [(value) => !!value && value < 18 && "You can't drive!"],
        },
        make: {
          options: [
            { id: "VOLVO", title: "Volvo" },
            { id: "AUDI", title: "Audi" },
            { id: "BMW", title: "bmw" },
          ],
          defaultValue: "VOLVO",
          validators: [
            (value, form) => {
              return (
                !!form.age &&
                form.age > 90 &&
                value !== "VOLVO" &&
                "Must use VOLVO"
              );
            },
          ],
        },
      }
    )
  );
  expect(result.current.values).toEqual({
    age: 12,
    make: "VOLVO",
  });
  act(() => {
    result.current.fields.make.setValue("AUDI");
  });
  act(() => {
    result.current.fields.age.setValue(91);
  });
  expect(result.current.fields.make.config.options).toEqual([
    { id: "VOLVO", title: "Volvo" },
    { id: "AUDI", title: "Audi" },
    { id: "BMW", title: "bmw" },
  ]);
  expect(result.current.values).toEqual({
    age: 91,
    make: "AUDI",
  });
  expect(result.current.fields.make.errorMessage).toBe("Must use VOLVO");
});
test("FormField.CHECKBOX", () => {
  const { result } = renderHook(() =>
    useForm(
      {
        started: createField<boolean>(),
      },
      {
        started: {
          defaultValue: false,
        },
      }
    )
  );
  expect(result.current.values.started).toBe(false);
  act(() => {
    result.current.fields.started.setValue(true);
  });
  expect(result.current.values.started).toBe(true);
});

test("form.fields.<key>.value must be the same as form.values.<key>", () => {
  const { result } = renderHook(() =>
    useForm(
      {
        name: createField<string>(),
      },
      {
        name: {
          defaultValue: "Hello",
        },
      }
    )
  );
  expect(result.current.values.name).toEqual("Hello");
  expect(result.current.fields.name.value).toEqual("Hello");
  act(() => {
    result.current.fields.name.setValue("Bye");
  });
  expect(result.current.values.name).toEqual("Bye");
  expect(result.current.fields.name.value).toEqual("Bye");
});

test("default FormField.TEXT = undefined", () => {
  const { result } = renderHook(() =>
    useForm(
      {
        foo: createField<string | undefined>(),
      },
      {
        foo: {
          defaultValue: undefined,
        },
      }
    )
  );
  expect(result.current.values.foo).toBeUndefined();
});

test("default FormField.NUMBER = empty undefined", () => {
  const { result } = renderHook(() =>
    useForm(
      {
        foo: createField<number | undefined>(),
      },
      {
        foo: {
          defaultValue: undefined,
        },
      }
    )
  );
  expect(result.current.values.foo).toBeUndefined();
});

test("default FormField.SELECT = undefined", () => {
  const { result } = renderHook(() =>
    useForm(
      {
        foo: createField<string | undefined>(),
      },
      {
        foo: {
          defaultValue: undefined,
          options: [{ id: "VALUE", title: "value" }],
        },
      }
    )
  );
  expect(result.current.values.foo).toBeUndefined();
});

test("default FormField.DATE = undefined", () => {
  const { result } = renderHook(() =>
    useForm(
      {
        foo: createField<Date | undefined>(),
      },
      {
        foo: {
          defaultValue: undefined,
        },
      }
    )
  );
  expect(result.current.values.foo).toBeUndefined();
});

// test("fieldVlidator accept array", () => {
//   const required = (value?: string) => {
//     return !value && "label required";
//   };
//   const minLength = (value?: string) =>
//     value && value.length < 3 && "label must be at least 3 characters long";
//   const { result } = renderHook(() =>
//     useForm(
//       {
//         label: createField<string | undefined>(),
//       },
//       {
//         label: {
//           defaultValue: undefined,
//           validators: [required, minLength],
//         },
//       }
//     )
//   );
//   expect(result.current.fields.label.errorMessage).toEqual("label required");
//   act(() => {
//     result.current.fields.label.setValue("no");
//   });
//   expect(result.current.fields.label.errorMessage).toEqual(
//     "label must be at least 3 characters long"
//   );
//   act(() => {
//     result.current.fields.label.setValue("yes");
//   });
//   expect(result.current.fields.label.errorMessage).toBeUndefined();
// });

// test("cancel form will reset to defaults", () => {
//   const required = (value?: string) => !value && "label required";
//   const { result } = renderHook(() =>
//     useForm(
//       {
//         label: createField<string | undefined>(),
//       },
//       {
//         label: {
//           defaultValue: undefined,
//           validators: [required],
//         },
//       }
//     )
//   );
//   expect(result.current.fields.label.errorMessage).toEqual("label required");
//   act(() => {
//     result.current.fields.label.setValue("hello");
//   });
//   expect(result.current.hasError).toBe(false);
//   expect(result.current.fields.label.errorMessage).toBeUndefined();
//   act(() => {
//     result.current.reset();
//   });
//   expect(result.current.fields.label.errorMessage).toEqual("label required");
//   expect(result.current.fields.label.value).toEqual(undefined);
// });

// test("don't generate new field objects if doesn't need to", () => {
//   const { result } = renderHook(() =>
//     useForm({
//       label: createField<string>(),
//       title: createField<string>(),
//     })
//   );

//   const title = result.current.fields.title;
//   // first time it will modify all the fields because "formTouched" will change
//   act(() => {
//     result.current.fields.title.setValue("first");
//   });
//   const label = result.current.fields.label;
//   act(() => {
//     result.current.fields.title.setValue("second");
//   });
//   expect(result.current.fields.title).not.toBe(title);
//   expect(result.current.fields.label).toBe(label);
// });

// test("set single field shouldn't intact other", () => {
//   const { result } = renderHook(() =>
//     useForm({
//       label: createField<string>(),
//       title: createField<string>(),
//     })
//   );
//   act(() => {
//     result.current.fields.title.setValue("modified");
//   });
//   act(() => {
//     result.current.fields.label.setValue("modified");
//   });
//   expect(result.current.fields.title.value).toBe("modified");
//   expect(result.current.fields.label.value).toBe("modified");
// });

// test("set single field shouldn't intact other - Date", () => {
//   const { result } = renderHook(() =>
//     useForm(
//       {
//         label: createField<string>(),
//         title: createField<Date>(),
//       },
//       {
//         label: { validators: [(value) => !value] },
//         title: { validators: [(value) => !value] },
//       }
//     )
//   );
//   act(() => {
//     result.current.fields.label.setValue("modified");
//   });
//   act(() => {
//     result.current.fields.title.setValue(new Date("2021-08-17T23:13:35.988Z"));
//   });
//   expect(result.current.fields.label.value).toBe("modified");
//   expect(result.current.fields.title.value?.toISOString()).toBe(
//     "2021-08-17T23:13:35.988Z"
//   );
// });

// test("errors shows when value reverts", () => {
//   const { result } = renderHook(() =>
//     useForm(
//       {
//         label: createField<string>(),
//       },
//       {
//         label: { validators: [(value) => !value] },
//       }
//     )
//   );
//   act(() => {
//     result.current.fields.label.setValue("modified");
//   });
//   expect(result.current.fields.label.hasError).toBe(false);
//   act(() => {
//     result.current.fields.label.setValue("");
//   });
//   expect(result.current.fields.label.hasError).toBe(true);
// });

// test("hasChanged", () => {
//   const { result } = renderHook(() =>
//     useForm(
//       {
//         label: createField<string>(),
//       },
//       {
//         label: { defaultValue: "" },
//       }
//     )
//   );
//   expect(result.current.isModified).toEqual(false);
//   act(() => {
//     result.current.fields.label.setValue("change");
//   });
//   expect(result.current.isModified).toEqual(true);
//   act(() => {
//     result.current.fields.label.setValue("");
//   });
//   expect(result.current.isModified).toEqual(false);
// });

// test("default values can be changed", () => {
//   const useWrapper = () => {
//     const [defaultValue, setDefaultValue] = useState("first");
//     const form = useForm(
//       {
//         label: createField<string>(),
//       },
//       {
//         label: { defaultValue },
//       }
//     );
//     return { form, setDefaultValue };
//   };
//   const { result } = renderHook(() => useWrapper());
//   expect(result.current.form.fields.label.value).toEqual("first");
//   act(() => {
//     result.current.form.fields.label.setValue("modified");
//   });
//   expect(result.current.form.fields.label.value).toEqual("modified");
//   act(() => {
//     result.current.form.reset();
//   });
//   expect(result.current.form.fields.label.value).toEqual("first");
//   act(() => {
//     result.current.setDefaultValue("second");
//   });
//   expect(result.current.form.fields.label.value).toEqual("second");
//   act(() => {
//     result.current.form.fields.label.setValue("modified");
//   });
//   expect(result.current.form.fields.label.value).toEqual("modified");
//   act(() => {
//     result.current.form.reset();
//   });
//   expect(result.current.form.fields.label.value).toEqual("second");
// });

// test("onSubmit", async () => {
//   const { result } = renderHook(() =>
//     useForm(
//       { label: createField<string>() },
//       { label: { defaultValue: "my label" } }
//     )
//   );
//   const onSubmit = jest.fn();
//   const submit = result.current.onSubmit(onSubmit);
//   await act(() => submit());
//   expect(onSubmit).toHaveBeenCalledWith({ label: "my label" });
// });

// test("setFormValues", () => {
//   const { result } = renderHook(() =>
//     useForm({
//       label: createField<string>(),
//       age: createField<number>(),
//       foo: createField<string>(),
//     })
//   );
//   act(() => {
//     result.current.setFormValues({ label: "my label", age: 23 });
//   });
//   expect(result.current.values).toEqual({
//     label: "my label",
//     age: 23,
//   });
// });

// test("multiselect has correct value", () => {
//   const { result } = renderHook(() =>
//     useForm(
//       {
//         outcomes: FormFieldType.MULTI_SELECT,
//       },
//       {
//         outcomes: {
//           options: [
//             { id: "a", title: "A" },
//             { id: "b", title: "B" },
//           ],
//           defaultValue: ["a"],
//         },
//       }
//     )
//   );
//   expect(result.current.fields.outcomes.value).toEqual(["a"]);
// });

// test("able to pass promise to onSubmit and wait", async () => {
//   const { result } = renderHook(() =>
//     useForm({
//       outcomes: createField<string>(),
//     })
//   );
//   let resolve: (value?: any) => void;
//   const submit = result.current.onSubmit(
//     () => new Promise((_resolve) => (resolve = _resolve))
//   );
//   expect(result.current.isLoading).toBe(false);
//   const submitFinish = act(() => submit());
//   expect(result.current.isLoading).toBe(true);
//   act(() => {
//     resolve();
//   });
//   await submitFinish;
//   expect(result.current.isLoading).toBe(false);
// });

// test("onPatchSubmit submits only modified values", async () => {
//   const { result } = renderHook(() =>
//     useForm(
//       {
//         label: createField<string>(),
//         age: createField<number>(),
//       },
//       {
//         label: { defaultValue: "my label" },
//         age: { defaultValue: 2 },
//       }
//     )
//   );
//   const onSubmit = jest.fn(() => Promise.resolve());
//   await act(() => result.current.onPatchSubmit(onSubmit)());
//   expect(onSubmit).lastCalledWith({});
//   act(() => result.current.fields.label.setValue("new value"));
//   await act(() => result.current.onPatchSubmit(onSubmit)());
//   expect(onSubmit).lastCalledWith({ label: "new value" });
// });
