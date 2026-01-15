"use client";

import * as React from "react";

import { FormError } from "@/components/forms/FormError";
import { FormHelperText } from "@/components/forms/FormHelperText";
import { FormLabel } from "@/components/forms/FormLabel";

export function FormField({
  label,
  htmlFor,
  required,
  helperText,
  error,
  children,
}: {
  label: React.ReactNode;
  htmlFor?: string;
  required?: boolean;
  helperText?: React.ReactNode;
  error?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <FormLabel htmlFor={htmlFor} required={required}>
        {label}
      </FormLabel>
      {children}
      {error ? <FormError>{error}</FormError> : helperText ? <FormHelperText>{helperText}</FormHelperText> : null}
    </div>
  );
}

