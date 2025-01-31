import {
  validateTradingDetails,
  ERROR_MESSAGES,
} from "@/lib/utils/guest-form-validation";

describe("validateTradingDetails", () => {
  it("returns an empty errors object for valid data", () => {
    const mockData = {
      tradingName: "example name",
      tradingAddress0: "123 Example Street",
      tradingAddress1: "Notown",
      postcode: "EC1A 1BB",
      urn: "123456789012",
      fullName: "Test Test",
      capacity: "Director",
      periodFrom: "01/10/2024",
      periodTo: "31/10/2024",
    };

    const errors = validateTradingDetails(mockData);
    expect(errors).toEqual({});
  });

  it("returns an error if tradingName is missing", () => {
    const mockData = {
      tradingName: "",
      tradingAddress0: "123 Example Street",
      tradingAddress1: "Notown",
      postcode: "EC1A 1BB",
      urn: "123456789012",
      fullName: "Test Test",
      capacity: "Director",
      periodFrom: "01/10/2024",
      periodTo: "31/10/2024",
    };

    const errors = validateTradingDetails(mockData);
    expect(errors.tradingName).toBe(ERROR_MESSAGES.tradingName.required);
  });
});
