const axios = require("axios");
const core = require("@actions/core");

const fs = require("fs");
const path = require("path");
const testFilePath = "test-output.json";

async function run() {
  const packagePath = path.join(process.cwd(), testFilePath);
  fs.readFile(packagePath, (err, data) => {
    if (err) throw err;
    let testFile = JSON.parse(data);

    if (testFile) {
      axios
        .post("https://pz4k9u-3000.sse.codesandbox.io/api/users", {
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
