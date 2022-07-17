const axios = require("axios");
const core = require("@actions/core");

const DEFAULT_CHARCTER = "dr-zoidberg";

// const AVAILABEL_CHARCTER = ["bender", "fry", "leela", "dr-zoidberg"];

const fs = require("fs");
const path = require("path");

async function run() {
  const character = core.getInput("character") || DEFAULT_CHARCTER;
  const packagePath = path.join(process.cwd(), "package.json");
  fs.readFile(packagePath, (err, data) => {
    if (err) throw err;
    let student = JSON.parse(data);

    axios
      .post("https://pz4k9u-3000.sse.codesandbox.io/api/users", {
        user: { ...student },
      })
      .then((res) => {
        console.log(`Status: ${res.status}`);
        console.log("Body: ", res.data);
      })
      .catch((err) => {
        console.error(err);
      });

    // core.setOutput(JSON.stringify(student));
  });
  //
  // core.debug(`[Futurama] Input Character: ${character}`);

  // if (!AVAILABEL_CHARCTER.includes(character)) {
  //   core.setFailed(`Unknown character: ${character}`);
  //   return;
  // }
  //
  // // core.debug(`[Futurama] Retrieving quote for: ${character}`);
  //
  // const res = await axios.get(
  //   `https://futuramaapi.herokuapp.com/api/characters/${character}/1`
  // );
  //
  // // core.debug(`[Futurama] Successfully retrieved quote for: ${character}`);
  //
  // const { data } = res;
  //
  // // core.debug(`[Futurama] Data: ${JSON.stringify(data)}`);
  //
  // const firstEntry = data[0];
  // console.log(`${firstEntry.character}: ${firstEntry.quote}`);
  //
  // core.setOutput("quote", firstEntry);
}

run();
