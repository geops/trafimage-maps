import { render } from "@testing-library/react";
import StopFinder from "./StopFinder";

describe("StopFinder", () => {
  describe("#render()", () => {
    test("renders only the name", () => {
      const stopFinder = new StopFinder();
      const { getByText } = render(
        stopFinder.render({ properties: { name: "name" } }),
      );
      expect(getByText("name")).toBeDefined();
    });

    test("renders the name and the municipality", () => {
      const stopFinder = new StopFinder();
      const { getByText } = render(
        stopFinder.render({
          properties: { name: "name", municipality_name: "foo" },
        }),
      );
      expect(getByText("name")).toBeDefined();
      expect(getByText("foo")).toBeDefined();
    });

    test("renders the name and the country code", () => {
      const stopFinder = new StopFinder();
      const { getByText } = render(
        stopFinder.render({
          properties: { name: "name", country_code: "bar" },
        }),
      );
      expect(getByText("name")).toBeDefined();
      expect(getByText("bar")).toBeDefined();
    });

    test("renders the name and the municipality and the country code", () => {
      const stopFinder = new StopFinder();
      const { getByText } = render(
        stopFinder.render({
          properties: {
            name: "name",
            municipality_name: "foo",
            country_code: "bar",
          },
        }),
      );
      expect(getByText("name")).toBeDefined();
      expect(getByText("foo (bar)")).toBeDefined();
    });

    test("renders the international vehicle registration code instead of the ISO country code", () => {
      const stopFinder = new StopFinder();
      const { getByText } = render(
        stopFinder.render({
          properties: {
            name: "name",
            country_code: "DE",
          },
        }),
      );
      expect(getByText("name")).toBeDefined();
      expect(getByText("D")).toBeDefined();
    });
  });
});
