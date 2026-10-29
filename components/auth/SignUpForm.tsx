"use client";

import { useState } from "react";
import { t } from "@/lib/i18n/core";
import type { Lang } from "@/lib/types";

/**
 * Frontend only for now: the form validates, then explains that accounts open
 * with the next release. No data leaves the browser.
 */
export function SignUpForm({ lang }: { lang: Lang }) {
  const [notice, setNotice] = useState(false);
  const [mismatch, setMismatch] = useState(false);

  return (
    <form
      className="mt-6 flex flex-col gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const password = String(data.get("password") ?? "");
        const confirm = String(data.get("confirm") ?? "");
        if (password !== confirm) {
          setMismatch(true);
          return;
        }
        setMismatch(false);
        setNotice(true);
      }}
    >
      <div>
        <label htmlFor="name" className="tag mb-1.5 block text-ink-soft">
          {t(lang, "auth.fullName")}
        </label>
        <input id="name" name="name" type="text" required autoComplete="name" className="field" />
      </div>

      <div>
        <label htmlFor="signup-email" className="tag mb-1.5 block text-ink-soft">
          {t(lang, "auth.email")}
        </label>
        <input
          id="signup-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="field"
        />
      </div>

      <div>
        <label htmlFor="signup-password" className="tag mb-1.5 block text-ink-soft">
          {t(lang, "auth.password")}
        </label>
        <input
          id="signup-password"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className="field"
        />
      </div>

      <div>
        <label htmlFor="confirm" className="tag mb-1.5 block text-ink-soft">
          {t(lang, "auth.confirmPassword")}
        </label>
        <input
          id="confirm"
          name="confirm"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className="field"
          aria-invalid={mismatch || undefined}
          onChange={() => mismatch && setMismatch(false)}
        />
        {mismatch ? (
          <p role="alert" className="mt-1.5 text-sm text-no">
            {t(lang, "auth.passwordMismatch")}
          </p>
        ) : null}
      </div>

      <button type="submit" className="btn btn-primary mt-1 w-full">
        {t(lang, "auth.createAccount")}
      </button>

      {notice ? (
        <p
          role="status"
          className="rounded-control border border-signal/60 bg-signal-soft px-3.5 py-2.5 text-sm leading-relaxed text-partial"
        >
          {t(lang, "auth.notice")}
        </p>
      ) : null}
    </form>
  );
}
