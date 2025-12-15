import React from "react";
import { Provider } from "react-redux";
import { render, screen } from "@testing-library/react";
import { Layer } from "mobility-toolbox-js/ol";
import DataLinkBase from "./DataLink";
import { getNetzkarteLayers } from "../../config/ch.sbb.netzkarte";

const passagierfrequenzen = getNetzkarteLayers().find(
  (layer) => layer.key === "ch.sbb.bahnhoffrequenzen",
);

function DataLink(props) {
  return (
    <Provider store={global.store}>
      <DataLinkBase {...props} />
    </Provider>
  );
}

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
