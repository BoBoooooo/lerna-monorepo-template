/**
 * @jest-environment jsdom
 */
import React from "react";
import { mount } from "enzyme";
import Demo from "../packages/examples/src/demo";

const add = (a: number, b: number) => a + b;

describe("dom test", () => {
  it("check wrapper dom", () => {
    const wrapper = mount(<Demo></Demo>);
    expect(wrapper.find(".examples-wrapper").exists()).toBe(true);
  });

  it("test add function", () => {
    expect(add(1, 2)).toBe(3);
  });
});
