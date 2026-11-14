"use client";

import { useState } from "react";
import { CheckCircleIcon, SendIcon } from "@/components/icons";

const FIELD_CLASS =
  "w-full rounded-none border border-chalk/20 bg-ink px-4 py-3.5 font-sans text-body-md text-chalk placeholder:text-chalk/25 outline-none transition-colors focus:border-primary";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <form
      className="space-y-6"
      id="contact-form"
      onSubmit={(event) => {
        event.preventDefault();
        // TODO: POST these details to the real intake endpoint.
        setSubmitted(true);
        event.currentTarget.reset();
      }}
    >
      <div className="space-y-2">
        <label
          className="block font-display text-label-sm uppercase tracking-wider text-chalk/70"
          htmlFor="caller-name"
        >
          <span className="mr-1 text-primary">[ 01 ]</span> Naam (Name)
        </label>
        <input
          autoComplete="name"
          className={FIELD_CLASS}
          id="caller-name"
          name="name"
          placeholder="Aapka Poora Naam"
          required
          type="text"
        />
      </div>

      <div className="space-y-2">
        <label
          className="block font-display text-label-sm uppercase tracking-wider text-chalk/70"
          htmlFor="caller-phone"
        >
          <span className="mr-1 text-primary">[ 02 ]</span> Phone Number
        </label>
        <input
          autoComplete="tel"
          className={FIELD_CLASS}
          id="caller-phone"
          name="phone"
          placeholder="0300 0000000"
          required
          type="tel"
        />
      </div>

      <div className="space-y-2">
        <label
          className="block font-display text-label-sm uppercase tracking-wider text-chalk/70"
          htmlFor="caller-message"
        >
          <span className="mr-1 text-primary">[ 03 ]</span> Paigham (Message)
        </label>
        <textarea
          className={`${FIELD_CLASS} resize-none p-4`}
          id="caller-message"
          name="message"
          placeholder="Required parts, electrical specifications, ya koi sawaal..."
          required
          rows={4}
        />
      </div>

      <div className="flex items-center gap-3 pt-2">
        <input
          className="h-4 w-4 cursor-pointer rounded-none border border-chalk/30 bg-ink accent-primary"
          id="hardware-ack"
          name="acknowledgement"
          required
          type="checkbox"
        />
        <label
          className="cursor-pointer select-none font-sans text-body-sm text-chalk/60"
          htmlFor="hardware-ack"
        >
          Mey taa-yyeed karta hoon ke details darust hain
        </label>
      </div>

      <button
        className="flex w-full items-center justify-center gap-3 rounded-none bg-primary px-6 py-4 font-display text-label-md uppercase tracking-wider text-chalk transition-colors duration-150 hover:bg-primary-deep"
        type="submit"
      >
        <span>Bhejein</span>
        <SendIcon className="h-[18px] w-[18px]" />
      </button>

      {submitted ? (
        <div
          className="border border-primary bg-ink p-4 text-chalk transition-all"
          role="status"
        >
          <p className="flex items-center gap-2 font-display text-label-sm font-bold uppercase text-primary">
            <CheckCircleIcon className="h-4 w-4" />
            Murasla Mosool Hua
          </p>
          <p className="mt-1 font-sans text-body-sm text-chalk/70">
            Aapka paigham darj ho chuka hai. Hamara numainda jald rabta karega.
          </p>
        </div>
      ) : null}
    </form>
  );
}
