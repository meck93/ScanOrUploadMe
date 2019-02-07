import { equal } from "assert";

describe("Array", function() {
  describe("#indexOf()", function() {
    it("should return -1 when the value is not present", function() {
      equal([1, 2, 3].indexOf(4), -1);
    });
  });

  describe("length", function() {
    it("should return +1 in length if item was added to array", function() {
      const list = [1, 2, 3];
      const length1 = list.length;
      list.push(1);
      equal(length1 + 1, list.length);
    });
  });
});
