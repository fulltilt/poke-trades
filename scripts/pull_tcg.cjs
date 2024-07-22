const fs = require("fs");

let out = [];

let promise = new Promise((resolve, reject) => {
  let count = 0;
  // Function to fetch data from API and save to a file
  async function fetchAndSaveData(apiUrl, page) {
    try {
      // Make GET request to API
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "X-Api-Key": "e5f992bc-7cb1-45ff-978c-8083c73a3fb8",
        },
      });

      const data = await response.json();
      out = out.concat(data.data);

      console.log(`Data for page ${page} retrieved`);
      ++count;
      if (count === 70) resolve(out);
    } catch (error) {
      console.error(`Error occurred: ${error.message}`);
      reject(error);
    }
  }

  // API URL to fetch data from
  for (let i = 3; i <= 72; ++i) {
    let apiUrl = `https://api.pokemontcg.io/v2/cards?select=id,tcgplayer&page=${i}`;

    // Call function to fetch data and save to file
    fetchAndSaveData(apiUrl, i);
  }
});

const outputFile = "data_output2.json";

promise.then(
  (res) => {
    console.log(res.length);
    fs.writeFileSync(outputFile, JSON.stringify(res, null, 4));
  },
  (err) => console.log(err),
);
