const axios = require("axios");
const core = require("@actions/core");
const shell = require("shelljs");

const fs = require("fs");
const path = require("path");

async function run() {
  const user_id_secret = core.getInput("user_id") || "no user id";
  const tha_no_secret = core.getInput("tha_no") || "0";

  if (fs.existsSync(path.join(process.cwd(), "Day01"))) {
    try {
      const response = axios.get(
        `https://h3cv9k.sse.codesandbox.io/frontend_challeges?tha_no=${tha_no_secret}`
      );
      const { data } = await response;
      const { test_file, tha_no, folder_name } = data.data.attributes;

      console.log("test-cases -->", data);

      shell.exec(`cd ${folder_name} && npm ci`);

      if (!fs.existsSync("src/__test__/")) {
        fs.mkdirSync(path.join(process.cwd(), folder_name, "src/__test__/"), {
          recursive: true,
        });
      }

      fs.writeFileSync(
        path.join(process.cwd(), folder_name, test_file.path),
        test_file.content,
        (err) => {
          if (err) {
            core.error(err);
          }
          console.log(`${folder_name} folder test file added successfully`);
        }
      );

      shell.exec(`cd ${folder_name} && npm run test-out`);

      fs.readFile(
        path.join(process.cwd(), folder_name, "test-output.json"),
        (err, data) => {
          if (err) throw err;
          const test_result = JSON.parse(data);
          console.log(test_result);
          if (test_result) {
            const data = {
              type: "frontend_challeges",
              attributes: {
                tha_no: tha_no,
                user_id: user_id_secret,
                test_result: test_result,
              },
            };

            axios
              .post(
                `https://h3cv9k.sse.codesandbox.io/frontend_challeges?user_id=${user_id_secret}&tha_no=${tha_no}`,
                {
                  data,
                }
              )
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
