const axios = require("axios");
const core = require("@actions/core");
const shell = require("shelljs");

const fs = require("fs");
const path = require("path");

async function run() {
  const testFilePath = "test-output.json";
  const testOutputFilePath = path.join(process.cwd(), testFilePath);
  const testFolder = path.join(process.cwd(), "src/__test__/");

  const user_id = core.getInput("user_id") || "fuck";
  const tha_no = core.getInput("tha_no") || "fuck";

  const curr_dir_length = fs.readdirSync(path.join(process.cwd(), "/")).length;

  console.log(user_id, tha_no);
  axios
    .post("https://h3cv9k.sse.codesandbox.io/users", {
      data: { userDetails: { user_id, tha_no } },
    })
    .then((res) => {
      console.log(`Status: ${res.status}`);
      console.log("Body: ", res.data);
    })
    .catch((err) => {
      console.error(err);
    });

  // if (curr_dir_length < 3) {
  //   try {
  //     const response = axios.get(
  //       `https://h3cv9k.sse.codesandbox.io/users?user_id=${user_id}&tha_no=${tha_no}`
  //     );
  //     const { data } = await response;
  //     const { test_file: testFile } = data;
  //
  //     shell.exec("npm ci");
  //
  //     if (!fs.existsSync(testFolder)) {
  //       fs.mkdirSync(testFolder, {
  //         recursive: true,
  //       });
  //     }
  //
  //     fs.writeFileSync(
  //       path.join(process.cwd(), testFile.path),
  //       testFile.content,
  //       (err) => {
  //         if (err) {
  //           console.error(err);
  //         }
  //         console.log("file added");
  //       }
  //     );
  //
  //     shell.exec("npm run test-out");
  //
  //     fs.readFile(testOutputFilePath, (err, data) => {
  //       if (err) throw err;
  //       let testFile = JSON.parse(data);
  //       console.log(testFile);
  //       if (testFile) {
  //         axios
  //           .post("https://h3cv9k.sse.codesandbox.io/users", {
  //             data: { test_result: testFile, userDetails: { user_id, tha_no } },
  //           })
  //           .then((res) => {
  //             console.log(`Status: ${res.status}`);
  //             console.log("Body: ", res.data);
  //           })
  //           .catch((err) => {
  //             console.error(err);
  //           });
  //       }
  //     });
  //   } catch (err) {
  //     console.log(err);
  //   }
  // } else {
  //   console.log("package.json not detect");
  // }
}

run();
