const axios = require("axios");
const core = require("@actions/core");
const shell = require("shelljs");

const fs = require("fs");
const path = require("path");

async function run() {
  const testFilePath = "test-output.json";
  const testOutputFilePath = path.join(process.cwd(), testFilePath);
  const testFolder = path.join(process.cwd(), "src/__test__/");

  const user_id_secret = core.getInput("user_id") || "no user id";
  const tha_no_secret = core.getInput("tha_no") || "no tha no";

  if (fs.existsSync(path.join(process.cwd(), "Day01"))) {
    try {
      const response = axios.get(
        `https://h3cv9k.sse.codesandbox.io/users/user_id=${user_id_secret}&tha_no=${tha_no_secret}`
      );
      const { data } = await response;
      const { test_file: testFile, tha_no } = data;

      shell.exec(`cd Day${tha_no}`);
      shell.exec("npm ci");

      if (!fs.existsSync(testFolder)) {
        fs.mkdirSync(testFolder, {
          recursive: true,
        });
      }

      fs.writeFileSync(
        path.join(process.cwd(), testFile.path),
        testFile.content,
        (err) => {
          if (err) {
            console.error(err);
          }
          console.log("file added");
        }
      );

      shell.exec("npm run test-out");

      fs.readFile(testOutputFilePath, (err, data) => {
        if (err) throw err;
        let testFile = JSON.parse(data);
        console.log(testFile);
        if (testFile) {
          axios
            .post("https://h3cv9k.sse.codesandbox.io/users", {
              data: {
                test_result: testFile,
                userDetails: { user_id_secret, tha_no },
              },
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
    } catch (err) {
      console.log(err);
    }
  } else {
    console.log("Day1 folder not added yet");
  }
}

run();
