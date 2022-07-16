const axios = require("axios");
const core = require("@actions/core");

const DEFAULT_CHARCTER = "dr-zoidberg";

const AVAILABEL_CHARCTER = ["bender", "fry", "leela", "dr-zoidberg"];

async function run() {
  const character = core.getInput("character") || DEFAULT_CHARCTER;

  core.debug(`[Futurama] Input Character: ${character}`);

  if (!AVAILABEL_CHARCTER.includes(character)) {
    core.setFailed(`Unknown character: ${character}`);
    return;
  }

  core.debug(`[Futurama] Retrieving quote for: ${character}`);

  const res = await axios.get(
    `https://futuramaapi.herokuapp.com/api/characters/${character}/1`
  );

  core.debug(`[Futurama] Successfully retrieved quote for: ${character}`);

  const { data } = res;

  core.debug(`[Futurama] Data: ${JSON.stringify(data)}`);

  const firstEntry = data[0];
  console.log(`${firstEntry.character}: ${firstEntry.quote}`);

  core.setOutput("quote", firstEntry);
}

run();
