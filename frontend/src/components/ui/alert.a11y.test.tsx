"use client";

import { render } from "@testing-library/react";
import { axe } from "vitest-axe";

import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

describe("Alert accessibility", () => {
  it("has no obvious accessibility violations", async () => {
    const { container } = render(
      <Alert>
        <AlertTitle>Notice</AlertTitle>
        <AlertDescription>Something happened.</AlertDescription>
      </Alert>,
    );
    const results = await axe(container);
    expect(results.violations).toEqual([]);
  });
});

