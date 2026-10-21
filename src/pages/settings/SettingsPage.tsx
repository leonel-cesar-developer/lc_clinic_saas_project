/* import PageContainer from "../../components/PageContainer";

export default function SettingsPage() {
  return (
    <PageContainer
      title="Definições"
      description="Configure as preferências da aplicação."
    >
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-slate-900">
          Preferências gerais
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Aqui poderás configurar idioma, tema,
          notificações e dados da clínica.
        </p>
      </div>
    </PageContainer>
  );
} */

import {
  Bell,
  Building2,
  CalendarDays,
  Check,
  Clock3,
  LockKeyhole,
  Save,
  ShieldCheck,
} from "lucide-react";
import { useState, type FormEvent } from "react";

type SettingsSection = "clinic" | "appointments" | "notifications" | "security";

interface ClinicSettings {
  clinicName: string;
  email: string;
  phone: string;
  taxNumber: string;
  address: string;
  city: string;
  postalCode: string;
}

interface AppointmentSettings {
  defaultDuration: number;
  openingTime: string;
  closingTime: string;
  cancellationHours: number;
}

interface NotificationSettings {
  appointmentConfirmation: boolean;
  appointmentReminder: boolean;
  cancellationNotification: boolean;
  emailNotifications: boolean;
}

const sections = [
  {
    id: "clinic",
    label: "Clínica",
    description: "Informações gerais",
    icon: Building2,
  },
  {
    id: "appointments",
    label: "Marcações",
    description: "Horários e consultas",
    icon: CalendarDays,
  },
  {
    id: "notifications",
    label: "Notificações",
    description: "Alertas e lembretes",
    icon: Bell,
  },
  {
    id: "security",
    label: "Segurança",
    description: "Acesso e proteção",
    icon: ShieldCheck,
  },
] satisfies Array<{
  id: SettingsSection;
  label: string;
  description: string;
  icon: typeof Building2;
}>;

const initialClinicSettings: ClinicSettings = {
  clinicName: "LC Clinic",
  email: "geral@lcclinic.pt",
  phone: "+351 210 000 000",
  taxNumber: "",
  address: "",
  city: "",
  postalCode: "",
};

const initialAppointmentSettings: AppointmentSettings = {
  defaultDuration: 30,
  openingTime: "08:00",
  closingTime: "18:00",
  cancellationHours: 24,
};

const initialNotificationSettings: NotificationSettings = {
  appointmentConfirmation: true,
  appointmentReminder: true,
  cancellationNotification: true,
  emailNotifications: false,
};

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState<SettingsSection>("clinic");

  const [clinicSettings, setClinicSettings] = useState<ClinicSettings>(
    initialClinicSettings,
  );

  const [appointmentSettings, setAppointmentSettings] =
    useState<AppointmentSettings>(initialAppointmentSettings);

  const [notificationSettings, setNotificationSettings] =
    useState<NotificationSettings>(initialNotificationSettings);

  const [saved, setSaved] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    /*
     * Por enquanto estamos apenas a manter
     * as configurações no estado local.
     *
     * Mais tarde esta função chamará:
     *
     * settingsService.update(...)
     */

    setSaved(true);

    window.setTimeout(() => {
      setSaved(false);
    }, 2000);
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}

      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">Administração</p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950">
            Definições
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-slate-500">
            Configure as informações da clínica, marcações, notificações e
            segurança da aplicação.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50">
            <Check className="h-4 w-4 text-emerald-600" />
          </div>

          <div>
            <p className="text-xs text-slate-400">Estado</p>

            <p className="text-sm font-semibold text-slate-700">
              Sistema configurado
            </p>
          </div>
        </div>
      </header>

      {/* SETTINGS */}

      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        {/* INTERNAL NAVIGATION */}

        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
          <nav className="space-y-1">
            {sections.map(({ id, label, description, icon: Icon }) => {
              const isActive = activeSection === id;

              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setActiveSection(id)}
                  className={[
                    "flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition",
                    isActive
                      ? "bg-slate-950 text-white"
                      : "text-slate-600 hover:bg-slate-50",
                  ].join(" ")}
                >
                  <div
                    className={[
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                      isActive ? "bg-white/10" : "bg-slate-100",
                    ].join(" ")}
                  >
                    <Icon
                      className={[
                        "h-4 w-4",
                        isActive ? "text-white" : "text-slate-600",
                      ].join(" ")}
                    />
                  </div>

                  <div>
                    <p className="text-sm font-semibold">{label}</p>

                    <p
                      className={[
                        "mt-0.5 text-xs",
                        isActive ? "text-slate-300" : "text-slate-400",
                      ].join(" ")}
                    >
                      {description}
                    </p>
                  </div>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* CONTENT */}

        <form
          onSubmit={handleSubmit}
          className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
        >
          {activeSection === "clinic" && (
            <ClinicSection
              settings={clinicSettings}
              onChange={setClinicSettings}
            />
          )}

          {activeSection === "appointments" && (
            <AppointmentsSection
              settings={appointmentSettings}
              onChange={setAppointmentSettings}
            />
          )}

          {activeSection === "notifications" && (
            <NotificationsSection
              settings={notificationSettings}
              onChange={setNotificationSettings}
            />
          )}

          {activeSection === "security" && <SecuritySection />}

          {/* FOOTER */}

          {activeSection !== "security" && (
            <footer className="flex items-center justify-between border-t border-slate-100 bg-slate-50/70 px-6 py-4">
              <p className="text-xs text-slate-400">
                {saved
                  ? "Alterações guardadas com sucesso."
                  : "Guarde as alterações antes de sair."}
              </p>

              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                {saved ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Save className="h-4 w-4" />
                )}

                {saved ? "Guardado" : "Guardar alterações"}
              </button>
            </footer>
          )}
        </form>
      </div>
    </div>
  );
}

/* ======================================================
   CLINIC
====================================================== */

interface ClinicSectionProps {
  settings: ClinicSettings;

  onChange: (settings: ClinicSettings) => void;
}

function ClinicSection({ settings, onChange }: ClinicSectionProps) {
  return (
    <>
      <SectionHeader
        icon={Building2}
        title="Informações da clínica"
        description="Dados utilizados na identificação e comunicação da clínica."
      />

      <div className="grid gap-5 p-6 md:grid-cols-2">
        <Field
          label="Nome da clínica"
          value={settings.clinicName}
          onChange={(value) =>
            onChange({
              ...settings,
              clinicName: value,
            })
          }
        />

        <Field
          label="NIF"
          value={settings.taxNumber}
          placeholder="Número fiscal"
          onChange={(value) =>
            onChange({
              ...settings,
              taxNumber: value,
            })
          }
        />

        <Field
          label="Email"
          type="email"
          value={settings.email}
          onChange={(value) =>
            onChange({
              ...settings,
              email: value,
            })
          }
        />

        <Field
          label="Telefone"
          value={settings.phone}
          onChange={(value) =>
            onChange({
              ...settings,
              phone: value,
            })
          }
        />

        <div className="md:col-span-2">
          <Field
            label="Morada"
            value={settings.address}
            placeholder="Rua, número..."
            onChange={(value) =>
              onChange({
                ...settings,
                address: value,
              })
            }
          />
        </div>

        <Field
          label="Cidade"
          value={settings.city}
          onChange={(value) =>
            onChange({
              ...settings,
              city: value,
            })
          }
        />

        <Field
          label="Código postal"
          value={settings.postalCode}
          placeholder="0000-000"
          onChange={(value) =>
            onChange({
              ...settings,
              postalCode: value,
            })
          }
        />
      </div>
    </>
  );
}

/* APPOINTMENTS*/

interface AppointmentsSectionProps {
  settings: AppointmentSettings;

  onChange: (settings: AppointmentSettings) => void;
}

function AppointmentsSection({ settings, onChange }: AppointmentsSectionProps) {
  return (
    <>
      <SectionHeader
        icon={CalendarDays}
        title="Configuração de marcações"
        description="Defina regras gerais para consultas e horários."
      />

      <div className="grid gap-5 p-6 md:grid-cols-2">
        <Field
          label="Abertura"
          type="time"
          value={settings.openingTime}
          onChange={(value) =>
            onChange({
              ...settings,
              openingTime: value,
            })
          }
        />

        <Field
          label="Encerramento"
          type="time"
          value={settings.closingTime}
          onChange={(value) =>
            onChange({
              ...settings,
              closingTime: value,
            })
          }
        />

        <NumberField
          label="Duração padrão da consulta"
          value={settings.defaultDuration}
          suffix="min"
          onChange={(value) =>
            onChange({
              ...settings,
              defaultDuration: value,
            })
          }
        />

        <NumberField
          label="Antecedência para cancelamento"
          value={settings.cancellationHours}
          suffix="horas"
          onChange={(value) =>
            onChange({
              ...settings,
              cancellationHours: value,
            })
          }
        />
      </div>

      <div className="mx-6 mb-6 flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <Clock3 className="mt-0.5 h-5 w-5 shrink-0 text-slate-500" />

        <div>
          <p className="text-sm font-semibold text-slate-700">
            Horário operacional
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Estas definições representam o funcionamento geral da clínica. Os
            médicos continuam a ter os seus próprios horários individuais.
          </p>
        </div>
      </div>
    </>
  );
}

/* NOTIFICATIONS */

interface NotificationsSectionProps {
  settings: NotificationSettings;

  onChange: (settings: NotificationSettings) => void;
}

function NotificationsSection({
  settings,
  onChange,
}: NotificationsSectionProps) {
  return (
    <>
      <SectionHeader
        icon={Bell}
        title="Notificações"
        description="Controle os eventos que devem gerar alertas."
      />

      <div className="divide-y divide-slate-100 px-6">
        <ToggleRow
          title="Confirmação de marcação"
          description="Gerar uma notificação quando uma nova consulta for confirmada."
          checked={settings.appointmentConfirmation}
          onChange={(checked) =>
            onChange({
              ...settings,
              appointmentConfirmation: checked,
            })
          }
        />

        <ToggleRow
          title="Lembretes de consultas"
          description="Ativar lembretes para consultas agendadas."
          checked={settings.appointmentReminder}
          onChange={(checked) =>
            onChange({
              ...settings,
              appointmentReminder: checked,
            })
          }
        />

        <ToggleRow
          title="Cancelamentos"
          description="Receber alertas quando uma marcação for cancelada."
          checked={settings.cancellationNotification}
          onChange={(checked) =>
            onChange({
              ...settings,
              cancellationNotification: checked,
            })
          }
        />

        <ToggleRow
          title="Notificações por email"
          description="Permitir o envio de notificações através de email."
          checked={settings.emailNotifications}
          onChange={(checked) =>
            onChange({
              ...settings,
              emailNotifications: checked,
            })
          }
        />
      </div>
    </>
  );
}

/* SECURITY */

function SecuritySection() {
  return (
    <>
      <SectionHeader
        icon={ShieldCheck}
        title="Segurança"
        description="Definições relacionadas com acesso e proteção da conta."
      />

      <div className="space-y-4 p-6">
        <div className="flex flex-col gap-4 rounded-xl border border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100">
              <LockKeyhole className="h-5 w-5 text-slate-600" />
            </div>

            <div>
              <p className="font-semibold text-slate-800">Palavra-passe</p>

              <p className="mt-1 text-sm text-slate-500">
                Altere periodicamente a sua palavra-passe para proteger a conta.
              </p>
            </div>
          </div>

          <button
            type="button"
            className="shrink-0 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Alterar palavra-passe
          </button>
        </div>

        <div className="flex flex-col gap-4 rounded-xl border border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold text-slate-800">Sessão atual</p>

            <p className="mt-1 text-sm text-slate-500">
              A sua sessão encontra-se autenticada e ativa neste dispositivo.
            </p>
          </div>

          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Ativa
          </span>
        </div>
      </div>
    </>
  );
}

/* REUSABLE COMPONENTS */

interface SectionHeaderProps {
  icon: typeof Building2;
  title: string;
  description: string;
}

function SectionHeader({ icon: Icon, title, description }: SectionHeaderProps) {
  return (
    <header className="border-b border-slate-100 px-6 py-5">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100">
          <Icon className="h-5 w-5 text-slate-600" />
        </div>

        <div>
          <h2 className="font-semibold text-slate-900">{title}</h2>

          <p className="mt-1 text-sm text-slate-500">{description}</p>
        </div>
      </div>
    </header>
  );
}

interface FieldProps {
  label: string;
  value: string;
  type?: string;
  placeholder?: string;
  onChange: (value: string) => void;
}

function Field({
  label,
  value,
  type = "text",
  placeholder,
  onChange,
}: FieldProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </span>

      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
      />
    </label>
  );
}

interface NumberFieldProps {
  label: string;
  value: number;
  suffix: string;
  onChange: (value: number) => void;
}

function NumberField({ label, value, suffix, onChange }: NumberFieldProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </span>

      <div className="flex overflow-hidden rounded-xl border border-slate-200 bg-white transition focus-within:border-slate-400 focus-within:ring-4 focus-within:ring-slate-100">
        <input
          type="number"
          min={0}
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
          className="min-w-0 flex-1 px-3.5 py-2.5 text-sm text-slate-900 outline-none"
        />

        <span className="flex items-center border-l border-slate-200 bg-slate-50 px-3 text-xs font-medium text-slate-500">
          {suffix}
        </span>
      </div>
    </label>
  );
}

interface ToggleRowProps {
  title: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

function ToggleRow({ title, description, checked, onChange }: ToggleRowProps) {
  return (
    <div className="flex items-center justify-between gap-6 py-5">
      <div>
        <p className="text-sm font-semibold text-slate-800">{title}</p>

        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={[
          "relative h-6 w-11 shrink-0 rounded-full transition",
          checked ? "bg-slate-950" : "bg-slate-200",
        ].join(" ")}
      >
        <span
          className={[
            "absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-all",
            checked ? "left-6" : "left-1",
          ].join(" ")}
        />
      </button>
    </div>
  );
}
