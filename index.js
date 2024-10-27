const https = require("https");

(function () {
  return new Promise((resolve, reject) => {
    https
      .get(
        "https://coderbyte.com/api/challenges/json/json-cleaning",
        (resp) => {
          let data = "";

          // parse json data here...

          resp.on("data", (chunk) => {
            data += chunk;
          });

          resp.on("end", () => {
            try {
              const parsedData = JSON.parse(data);
              resolve(parsedData);
            } catch (error) {
              reject(new Error("Error parsing JSON"));
            }
          });
        },
      )
      .on("error", (error) => {
        reject(error);
      });
  });
})()
  .then((data) => {
    cleanObject(data);
  })
  .catch((error) => {
    console.error(error.message);
  });

function cleanObject(obj) {
  let items_removed = 0;

  function clean(obj) {
    if (typeof obj === "object" && obj !== null) {
      for (let key in obj) {
        const value = obj[key];

        if (Array.isArray(value)) {
          obj[key] = value.filter((item) => !["-", "N/A", ""].includes(item));
          const removedCount = value.length - obj[key].length;
          items_removed += removedCount;

          if (obj[key].length === 0) {
            delete obj[key];
            items_removed++;
          }
        } else if (typeof value === "object" && value !== null) {
          clean(value);
          if (Object.keys(value).length === 0) {
            delete obj[key];
            items_removed++;
          }
        } else if (value === "N/A" || value === "-" || value === "") {
          delete obj[key];
          items_removed++;
        }
      }
    }
  }
  clean(obj);

  obj["items_removed"] = items_removed;

  console.log(JSON.stringify(obj));
  return JSON.stringify(obj);
}
