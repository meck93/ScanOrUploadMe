import { uploadBase64, makeRequest } from "../../api/uploadImage";

describe("uploadImage API Test", () => {
  jest.useFakeTimers();

  describe("testing the image upload API", () => {
    beforeEach(() => {
      fetch.resetMocks();
    });

    it("call uploadBase64 with base64 string and returns data", () => {
      fetch.mockResponseOnce(JSON.stringify({ data: "test" }));

      const inputData = { base64: "test" };

      uploadBase64(inputData).then(res => {
        expect(res.body).toEqual({ data: "test" });
      });

      //assert on the times called and arguments given to fetch
      expect(fetch.mock.calls.length).toEqual(1);
      expect(fetch.mock.calls[0][0]).toEqual(
        "http://scanoruploadme.herokuapp.com/images"
      );
    });

    it("call uploadBase64 and reject", () => {
      fetch.mockRejectOnce(new Error("Request Rejected!"));

      const inputData = { base64: "test" };

      uploadBase64(inputData)
        .then(res => {})
        .catch(error => {
          expect(error).toEqual(new Error("Request Rejected!"));
        });

      //assert on the times called and arguments given to fetch
      expect(fetch.mock.calls.length).toEqual(1);
      expect(fetch.mock.calls[0][0]).toEqual(
        "http://scanoruploadme.herokuapp.com/images"
      );
    });

    it("call makeRequest and return a new Promise resolve object", () => {
      const response = { uploaded: true, success: true, calendarEvent: {} };

      fetch.mockResponseOnce(
        new Promise((resolve, reject) => {
          return resolve(response);
        })
      );

      const url = "http://scanoruploadme.herokuapp.com/images";
      let options = {
        method: "POST",
        body: JSON.stringify({ base64: "test" }),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      };

      makeRequest(url, options).then(res => {
        expect(res).toEqual(
          new Promise((resolve, reject) => {
            return resolve(response);
          })
        );
      });

      //assert on the times called and arguments given to fetch
      expect(fetch.mock.calls.length).toEqual(1);
      expect(fetch.mock.calls[0][0]).toEqual(
        "http://scanoruploadme.herokuapp.com/images"
      );
    });

    it("call makeRequest and return a new Promise reject object", () => {
      const response = { uploaded: true, success: false, calendarEvent: null };

      fetch.mockResponseOnce(
        new Promise((resolve, reject) => {
          return reject(response);
        })
      );

      const url = "http://scanoruploadme.herokuapp.com/images";
      let options = {
        method: "POST",
        body: JSON.stringify({ base64: "test" }),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      };

      makeRequest(url, options).then(res => {
        expect(res).toEqual(
          new Promise((resolve, reject) => {
            return reject(response);
          })
        );
      });

      //assert on the times called and arguments given to fetch
      expect(fetch.mock.calls.length).toEqual(1);
      expect(fetch.mock.calls[0][0]).toEqual(
        "http://scanoruploadme.herokuapp.com/images"
      );
    });

    it("call makeRequest and reject", () => {
      fetch.mockRejectOnce(new Error("Request Timed Out!"));

      const url = "http://scanoruploadme.herokuapp.com/images";
      let options = {
        method: "POST",
        body: JSON.stringify({ base64: "test" }),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      };

      makeRequest(url, options)
        .then(res => {})
        .catch(error => {
          expect(error).toEqual(new Error("Request Timed Out!"));
        });

      //assert on the times called and arguments given to fetch
      expect(fetch.mock.calls.length).toEqual(1);
      expect(fetch.mock.calls[0][0]).toEqual(
        "http://scanoruploadme.herokuapp.com/images"
      );
    });
  });
});
