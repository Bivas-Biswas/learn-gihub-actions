const axios = require("axios");
const core = require("@actions/core");
const shell = require("shelljs");

const fs = require("fs");
const path = require("path");

async function run() {
  const testOutputFilePath = "test-output.json";
  const testFolder = "src/__test__/";

  const user_id_secret = core.getInput("user_id") || "no user id";
  const tha_no_secret = core.getInput("tha_no") || "no tha no";

  if (fs.existsSync(path.join(process.cwd(), "Day01"))) {
    try {
      const response = axios.get(
        `https://h3cv9k.sse.codesandbox.io/users?user_id=${user_id_secret}&tha_no=${tha_no_secret}`
      );
      const { data } = await response;
      const { test_file: testFile, tha_no } = data;

      let workingDir = "";

      if (parseInt(tha_no) < 10) {
        workingDir = `Day0${tha_no}`;
      } else {
        workingDir = `Day${tha_no}`;
      }

      shell.exec(`cd ${workingDir} && npm ci`);

      if (!fs.existsSync(testFolder)) {
        fs.mkdirSync(path.join(process.cwd(), workingDir, testFolder), {
          recursive: true,
        });
      }

      fs.writeFileSync(
        path.join(process.cwd(), workingDir, testFile.path),
        testFile.content,
        (err) => {
          if (err) {
            core.error(err);
          }
          console.log(`Day${tha_no} folder test file added successfully`);
        }
      );

      shell.exec(`cd Day${tha_no} && npm run test-out`);

      fs.readFile(
        path.join(process.cwd(), workingDir, testOutputFilePath),
        (err, data) => {
          if (err) throw err;
          const testFile = JSON.parse(data);
          console.log(testFile);
          if (testFile) {
            axios
              .post("https://h3cv9k.sse.codesandbox.io/users", {
                data: {
                  test_result: testFile,
                  userDetails: { user_id: user_id_secret, tha_no },
                  send_at: new Date(Date.now()),
                },
              })
              .then((res) => {
                console.log(`Status: ${res.status}`);
                console.log(`${workingDir} -->> Body: `, res.data);
              })
              .catch((err) => {
                core.error(err);
              });
          }
        }
      );
    } catch (err) {
      console.log(err);
    }
  } else {
    core.error("No THA added by Devsnest ");
  }
}

run();
