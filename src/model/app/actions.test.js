import { act } from "react-dom/test-utils";
import fetchMock from "fetch-mock";
import { setSearchService, updateDrawEditLink } from "./actions";

describe("actions", () => {
  describe("updateDrawEditLink", () => {
    test("creates a new shorten url using the draw admin id then displays result in an input", async () => {
      const spy = jest.fn();
      await act(async () => {
        // Updating an existing shoreten url fails
        fetchMock.once(
          "http://shortenfoo.ch/edit/foo/?target=http%3A%2F%2Flocalhost%2F%3Fdraw.id%3Dfoo%26draw.redirect%3Dtrue",
          { error: "Not found" },
        );
        // Creating an existing shorten url succeeds
        fetchMock.once(
          "http://shortenfoo.ch/?url=http%3A%2F%2Flocalhost%2F%3Fdraw.id%3Dfoo%26draw.redirect%3Dtrue&word=foo",
          { url: "http://shortqux.ch/qur" },
        );

        updateDrawEditLink()(spy, () => ({
          map: {},
          app: {
            mapsetUrl: "http://mapsetbar.ch",
            shortenerUrl: "http://shortenfoo.ch",
            drawIds: { admin_id: "foo" },
          },
        }));
      });
      expect(spy.mock.calls.length).toBe(3);
      expect(spy.mock.calls[0][0]).toEqual({
        data: true,
        type: "SET_DRAW_EDIT_LINK_LOADING",
      });
      expect(spy.mock.calls[1][0]).toEqual({
        data: false,
        type: "SET_DRAW_EDIT_LINK_LOADING",
      });
      expect(spy.mock.calls[2][0]).toEqual({
        data: "http://shortqux.ch/qur",
        type: "SET_DRAW_EDIT_LINK",
      });
      fetchMock.restore();

      // Don't make twice the same request
      await act(async () => {
        updateDrawEditLink()(spy, () => ({
          map: {},
          app: {
            mapsetUrl: "http://mapsetbar.ch",
            shortenerUrl: "http://shortenfoo.ch",
            drawIds: { admin_id: "foo" },
          },
        }));
      });
      expect(spy.mock.calls.length).toBe(3);
      fetchMock.restore();
    });

    test("updates an existing shorten url using the draw admin id and displays result in an input", async () => {
      const spy = jest.fn();
      await act(async () => {
        // Updating an existing shoreten url succeeds
        fetchMock.once(
          "http://shortenfoo.ch/edit/fooch/?target=http%3A%2F%2Flocalhost%2F%3Fdraw.id%3Dfooch%26draw.redirect%3Dtrue",
          { url: "http://shortqux.ch/qur" },
        );

        updateDrawEditLink()(spy, () => ({
          map: {},
          app: {
            mapsetUrl: "http://mapsetbar.ch",
            shortenerUrl: "http://shortenfoo.ch",
            drawIds: { admin_id: "fooch" },
          },
        }));
      });
      expect(spy.mock.calls.length).toBe(3);
      expect(spy.mock.calls[0][0]).toEqual({
        data: true,
        type: "SET_DRAW_EDIT_LINK_LOADING",
      });
      expect(spy.mock.calls[1][0]).toEqual({
        data: false,
        type: "SET_DRAW_EDIT_LINK_LOADING",
      });
      expect(spy.mock.calls[2][0]).toEqual({
        data: "http://shortqux.ch/qur",
        type: "SET_DRAW_EDIT_LINK",
      });
      fetchMock.restore();
    });

    test("fails to fetch the shorten url and displays the url unshortened in an input", async () => {
      const spy = jest.fn();
      await act(async () => {
        // Updating an existing shoreten url fails
        fetchMock.once(
          "http://shortenfoo.ch/edit/foo/?target=http%3A%2F%2Flocalhost%2F%3Fdraw.id%3Dfoo%26draw.redirect%3Dtrue",
          { error: "Not found" },
        );
        // Creating an existing shorten url fails too
        fetchMock.once(
          "http://shortenfoo.ch/?url=http%3A%2F%2Flocalhost%2F%3Fdraw.id%3Dfoo%26draw.redirect%3Dtrue&word=foo",
          { error: "Bad parameter" },
        );

        updateDrawEditLink()(spy, () => ({
          map: {},
          app: {
            mapsetUrl: "http://mapsetbar.ch",
            shortenerUrl: "http://shortenfoo.ch",
            drawIds: { admin_id: "foo" },
          },
        }));
      });
      expect(spy.mock.calls.length).toBe(3);
      expect(spy.mock.calls[0][0]).toEqual({
        data: true,
        type: "SET_DRAW_EDIT_LINK_LOADING",
      });
      expect(spy.mock.calls[1][0]).toEqual({
        data: false,
        type: "SET_DRAW_EDIT_LINK_LOADING",
      });
      expect(spy.mock.calls[2][0]).toEqual({
        data: "http://localhost/?draw.id=foo&draw.redirect=true",
        type: "SET_DRAW_EDIT_LINK",
      });
      fetchMock.restore();
    });

    test("clears highlight of previous search service", () => {
      const dispatch = jest.fn();
      const searchService = {
        clearHighlight: jest.fn(),
        clearSelect: jest.fn(),
      };
      const getState = jest.fn(() => ({ app: { searchService } }));
      const searchService1 = {
        clearHighlight: jest.fn(),
        clearSelect: jest.fn(),
      };
      setSearchService(searchService)(dispatch, getState);
      expect(searchService.clearHighlight).toHaveBeenCalledTimes(0);
      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledWith({
        data: searchService,
        type: "SET_SEARCH_SERVICE",
      });
      dispatch.mockReset();
      setSearchService(searchService)(dispatch, getState);
      expect(searchService.clearHighlight).toHaveBeenCalledTimes(0);
      expect(searchService.clearSelect).toHaveBeenCalledTimes(0);
      expect(dispatch).toHaveBeenCalledWith({
        data: searchService,
        type: "SET_SEARCH_SERVICE",
      });
      dispatch.mockReset();
      setSearchService(searchService1)(dispatch, getState);
      expect(searchService.clearHighlight).toHaveBeenCalledTimes(1);
      expect(searchService.clearSelect).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledWith({
        data: searchService1,
        type: "SET_SEARCH_SERVICE",
      });
    });
  });
});
