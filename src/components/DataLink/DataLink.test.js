import React from "react";
import { render, screen } from "@testing-library/react";
import { Layer } from "mobility-toolbox-js/ol";
import DataLink from "./DataLink";
import { passagierfrequenzen } from "../../config/ch.sbb.netzkarte";

describe("DataLink", () => {
  describe("should dislay data link with Open Data text", () => {
    test("using href prop", () => {
      const { container } = render(<DataLink href="https://example.com" />);
      expect(
        container.querySelector('a[href="https://example.com"]'),
      ).toBeInTheDocument();
      expect(
        screen.getByText("Diesen Datensatz einbinden (Open Data)"),
      ).toBeInTheDocument();
    });

    test("using layer", () => {
      const layer = new Layer({
        properties: {
          dataLink: "https://example.com",
        },
      });
      const { container } = render(<DataLink layer={layer} />);
      expect(
        container.querySelector('a[href="https://example.com"]'),
      ).toBeInTheDocument();
      expect(
        screen.getByText("Diesen Datensatz einbinden (Open Data)"),
      ).toBeInTheDocument();
    });
  });

  test("should dislay data link using dataLinkPortalName property", () => {
    const layer = new Layer({
      properties: {
        dataLink: "https://example.com",
        dataLinkPortalName: "test",
      },
    });
    render(<DataLink layer={layer} />);
    expect(
      screen.getByText("Diesen Datensatz einbinden (test)"),
    ).toBeInTheDocument();
  });

  test("should dislay statistik portal for passagierfrequenzen layer", () => {
    render(<DataLink layer={passagierfrequenzen} />);
    expect(
      screen.getByText("Diesen Datensatz einbinden (Statistikportal)"),
    ).toBeInTheDocument();
  });
});
