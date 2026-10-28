import {
  useState,
} from "react";

import type {
  Patient,
} from "../../types/patient.types";

import type {
  PatientFormValues,
} from "../../types/patient-dashboard.type";

interface PatientFormProps {
  patient?: Patient;

  isSubmitting: boolean;

  onSubmit: (
    values: PatientFormValues,
  ) => Promise<void>;

  onCancel: () => void;
}

const initialValues: PatientFormValues = {
  name: "",
  birthDate: "",
  gender: "FEMALE",
  email: "",
  phone: "",
  identificationNumber: "",

  address: {
    street: "",
    city: "",
    postalCode: "",
    country: "Portugal",
  },

  emergencyContact: {
    name: "",
    phone: "",
    relationship: "",
  },
};

export function PatientForm({
  patient,
  isSubmitting,
  onSubmit,
  onCancel,
}: PatientFormProps) {
  const [values, setValues] =
    useState<PatientFormValues>(
      patient
        ? {
            name: patient.name,

            birthDate:
              patient.birthDate,

            gender:
              patient.gender,

            email:
              patient.email,

            phone:
              patient.phone,

            identificationNumber:
              patient.identificationNumber ??
              "",

            address: {
              street:
                patient.address
                  ?.street ?? "",

              city:
                patient.address
                  ?.city ?? "",

              postalCode:
                patient.address
                  ?.postalCode ?? "",

              country:
                patient.address
                  ?.country ??
                "Portugal",
            },

            emergencyContact: {
              name:
                patient
                  .emergencyContact
                  ?.name ?? "",

              phone:
                patient
                  .emergencyContact
                  ?.phone ?? "",

              relationship:
                patient
                  .emergencyContact
                  ?.relationship ?? "",
            },
          }
        : initialValues,
    );

  function updateField(
    field:
      | "name"
      | "birthDate"
      | "email"
      | "phone"
      | "identificationNumber",
    value: string,
  ) {
    setValues(
      (current) => ({
        ...current,
        [field]: value,
      }),
    );
  }

  async function handleSubmit(
    event:
      React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    await onSubmit(values);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <section className="grid gap-4 md:grid-cols-2">
        <FormField
          label="Nome completo"
          required
        >
          <input
            required
            value={values.name}
            onChange={(event) =>
              updateField(
                "name",
                event.target.value,
              )
            }
            className={inputClass}
          />
        </FormField>

        <FormField
          label="Data de nascimento"
          required
        >
          <input
            required
            type="date"
            value={
              values.birthDate
            }
            onChange={(event) =>
              updateField(
                "birthDate",
                event.target.value,
              )
            }
            className={inputClass}
          />
        </FormField>

        <FormField
          label="Género"
          required
        >
          <select
            value={values.gender}
            onChange={(event) =>
              setValues(
                (current) => ({
                  ...current,

                  gender:
                    event.target
                      .value as PatientFormValues["gender"],
                }),
              )
            }
            className={inputClass}
          >
            <option value="FEMALE">
              Feminino
            </option>

            <option value="MALE">
              Masculino
            </option>

            <option value="OTHER">
              Outro
            </option>
          </select>
        </FormField>

        <FormField
          label="Número de identificação"
          required
        >
          <input
            required
            value={
              values.identificationNumber
            }
            onChange={(event) =>
              updateField(
                "identificationNumber",
                event.target.value,
              )
            }
            className={inputClass}
          />
        </FormField>

        <FormField
          label="Email"
          required
        >
          <input
            required
            type="email"
            value={values.email}
            onChange={(event) =>
              updateField(
                "email",
                event.target.value,
              )
            }
            className={inputClass}
          />
        </FormField>

        <FormField
          label="Telefone"
          required
        >
          <input
            required
            type="tel"
            value={values.phone}
            onChange={(event) =>
              updateField(
                "phone",
                event.target.value,
              )
            }
            className={inputClass}
          />
        </FormField>
      </section>

      <section>
        <h3 className="mb-4 font-semibold text-slate-900">
          Morada
        </h3>

        <div className="grid gap-4 md:grid-cols-2">
          <FormField label="Rua">
            <input
              value={
                values.address.street
              }
              onChange={(event) =>
                setValues(
                  (current) => ({
                    ...current,

                    address: {
                      ...current.address,

                      street:
                        event.target
                          .value,
                    },
                  }),
                )
              }
              className={inputClass}
            />
          </FormField>

          <FormField label="Cidade">
            <input
              value={
                values.address.city
              }
              onChange={(event) =>
                setValues(
                  (current) => ({
                    ...current,

                    address: {
                      ...current.address,

                      city:
                        event.target
                          .value,
                    },
                  }),
                )
              }
              className={inputClass}
            />
          </FormField>

          <FormField label="Código postal">
            <input
              value={
                values.address
                  .postalCode
              }
              onChange={(event) =>
                setValues(
                  (current) => ({
                    ...current,

                    address: {
                      ...current.address,

                      postalCode:
                        event.target
                          .value,
                    },
                  }),
                )
              }
              className={inputClass}
            />
          </FormField>

          <FormField label="País">
            <input
              value={
                values.address.country
              }
              onChange={(event) =>
                setValues(
                  (current) => ({
                    ...current,

                    address: {
                      ...current.address,

                      country:
                        event.target
                          .value,
                    },
                  }),
                )
              }
              className={inputClass}
            />
          </FormField>
        </div>
      </section>

      <section>
        <h3 className="mb-4 font-semibold text-slate-900">
          Contacto de emergência
        </h3>

        <div className="grid gap-4 md:grid-cols-3">
          <FormField label="Nome">
            <input
              value={
                values
                  .emergencyContact
                  .name
              }
              onChange={(event) =>
                setValues(
                  (current) => ({
                    ...current,

                    emergencyContact: {
                      ...current
                        .emergencyContact,

                      name:
                        event.target
                          .value,
                    },
                  }),
                )
              }
              className={inputClass}
            />
          </FormField>

          <FormField label="Telefone">
            <input
              value={
                values
                  .emergencyContact
                  .phone
              }
              onChange={(event) =>
                setValues(
                  (current) => ({
                    ...current,

                    emergencyContact: {
                      ...current
                        .emergencyContact,

                      phone:
                        event.target
                          .value,
                    },
                  }),
                )
              }
              className={inputClass}
            />
          </FormField>

          <FormField label="Relação">
            <input
              placeholder="Ex: Esposa, Pai..."
              value={
                values
                  .emergencyContact
                  .relationship
              }
              onChange={(event) =>
                setValues(
                  (current) => ({
                    ...current,

                    emergencyContact: {
                      ...current
                        .emergencyContact,

                      relationship:
                        event.target
                          .value,
                    },
                  }),
                )
              }
              className={inputClass}
            />
          </FormField>
        </div>
      </section>

      <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700"
        >
          Cancelar
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
        >
          {isSubmitting
            ? "A guardar..."
            : patient
              ? "Guardar alterações"
              : "Cadastrar paciente"}
        </button>
      </div>
    </form>
  );
}

const inputClass = `
  h-11
  w-full
  rounded-xl
  border
  border-slate-200
  bg-white
  px-3
  text-sm
  text-slate-900
  outline-none
  transition
  focus:border-slate-400
  focus:ring-2
  focus:ring-slate-100
`;

interface FormFieldProps {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}

function FormField({
  label,
  required,
  children,
}: FormFieldProps) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}

        {required && (
          <span className="text-red-500">
            {" "}
            *
          </span>
        )}
      </span>

      {children}
    </label>
  );
}