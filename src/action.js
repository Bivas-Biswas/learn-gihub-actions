const axios = require("axios");
const core = require("@actions/core");

const DEFAULT_CHARCTER = "dr-zoidberg";

async function run() {
  const character = core.getInput("character") || DEFAULT_CHARCTER;

  const res = await axios.get(
    `https://futuramaapi.herokuapp.com/api/characters/${character}/1`
  );
  const { data } = res;
  const firstEntry = data[0];
  console.log(`${firstEntry.character}: ${firstEntry.quote}`);
}

run();
