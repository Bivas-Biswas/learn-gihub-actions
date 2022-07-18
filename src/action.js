const axios = require("axios");
const core = require("@actions/core");
const shell = require("shelljs");

const fs = require("fs");
const path = require("path");
const testFilePath = "test-output.json";
const testData = {
  path: "src/__test__/App.test.js",
  content: `import { render, screen } from "@testing-library/react";
import React from "react";
import App from "../App";

describe("Element test in the page", () => {
  it("should contains the heading 1", () => {
    render(<App />);
    const heading = screen.getByText(/Hello Ddd! I am using React/i);
    expect(heading).toBeInTheDocument();
  });

  it("should contains a button", () => {
    render(<App />);
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
  });

  it("button name is create", () => {
    render(<App />);
    const button = screen.getByRole("button");
    expect(button).toHaveTextContent("Home");
  });
});
`,
};

async function run() {
  const testOutputFilePath = path.join(process.cwd(), testFilePath);
  const testFolder = path.join(process.cwd(), "src/__test__/");

  shell.exec("npm ci");
  if (!fs.existsSync(testFolder)) {
    fs.mkdirSync(testFolder, {
      recursive: true,
    });
  }

  fs.writeFile(
    path.join(process.cwd(), testData.path),
    testData.content,
    (err) => {
      if (err) {
        console.error(err);
      }
      console.log("file added");
    }
  );

  shell.exec("npm run test-output");

  fs.readFile(testOutputFilePath, (err, data) => {
    if (err) throw err;
    let testFile = JSON.parse(data);
    console.log(testFile);
    if (testFile) {
      axios
        .post("https://h3cv9k.sse.codesandbox.io/users", {
          data: { test_result: testFile },
        })
        .then((res) => {
          console.log(`Status: ${res.status}`);
          console.log("Body: ", res.data);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  });
}

run();
