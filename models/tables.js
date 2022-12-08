const xlsxFile = require("read-excel-file/node");

function output(sheetNumber) {
  return new Promise((resolve, reject) => {
    const tables = [];
    xlsxFile("./data/Data_3.xlsx", { sheet: sheetNumber || 1 })
      .then((rows) => {
        rows.forEach((element) => {
          tables.push(element);
        });
      })
      .catch((err) => reject(err))
      .finally(() =>
        resolve({
          variables: tables,
        })
      );
  });
}

function getInterval(objectList, V, i) {
  let newParams = objectList;

  if (V > objectList[objectList.length - 1].index) {
    return objectList[objectList.length - 1];
  }

  if (V == objectList[i].index) {
    return objectList[i];
  }

  if (V < objectList[i].index) return getInterval(newParams, V, i - 1);

  if (V > objectList[i].index) return objectList[i];
}

async function getCourses(params, sheetNumber) {
  const { variables } = await output(sheetNumber);

  let variablesWithoutNull = [];
  variables.forEach((nonArr) => {
    variablesWithoutNull.push(nonArr.filter((elem) => elem !== null));
  });

  let time = [];
  variables.forEach((timeElement, timeIndex) => {
    if (timeElement.find((str) => /00AM/.test(str))) {
      time.push(timeIndex);
    }
  });

  let firstWeekDays = variables[time[0] - 1]
    .map((eleme, index) => {
      return { eleme, index };
    })
    .filter((ele) => ele.eleme !== null);

  let secondWeekDays = variables[time[0] - 1]
    .map((eleme, index) => {
      return { eleme, index };
    })
    .filter((ele) => ele.eleme !== null);

  let foundItem = [];
  for (let i = 0; i < params.length; i++) {
    let searchString = params[i];
    variablesWithoutNull.forEach((element, index) => {
      if (
        element.some((arr, indexiis) =>
          arr.includes(" ")
            ? arr.split(" ").join("").includes(searchString) &&
              indexiis !== 0 &&
              !/CH||MON||TUE||WED||THUR||FRI||SAT||:+/.test(
                arr.split(" ").join("")
              )
            : arr.includes(searchString) &&
              indexiis !== 0 &&
              !/CH/.test(arr) &&
              !arr.includes(":")
        )
      ) {
        let elements = [];
        let regeSearch = `/${searchString}/`;
        elements.push(
          element.find((arr, ind) =>
            arr.includes(" ")
              ? new RegExp(`${searchString}`).test(arr.split(" ").join("")) &&
                ind !== 0 &&
                !/CH/.test(arr.split(" ").join(""))
              : new RegExp(`${searchString}`, "g").test(arr) &&
                ind !== 0 &&
                !/CH/.test(arr)
          )
        );
        elements.forEach((foundElement) => {
          foundItem.push({
            course_code: foundElement,
            // row: index,
            day:
              index >= time[1] + 2
                ? getInterval(
                    secondWeekDays,
                    variables[index].indexOf(foundElement),
                    secondWeekDays.length - 1
                  ).eleme
                : getInterval(
                    firstWeekDays,
                    variables[index].indexOf(foundElement),
                    firstWeekDays.length - 1
                  ).eleme,
            time:
              index >= time[1] + 2
                ? variables[time[1]][variables[index].indexOf(foundElement)]
                : variables[time[0]][variables[index].indexOf(foundElement)],
            // column: variables[index].indexOf(foundElement),
            room: element[0],
          });
        });
      }
    });
  }
  return foundItem.slice(0).sort(function (a, b) {
    var [x, y] = [
      a.day.split(" ")[1].split("/").reverse().join(),
      b.day.split(" ")[1].split("/").reverse().join(),
    ];

    return x < y ? -1 : x > y ? 1 : 0;
  });
}

async function getSheets() {
  let sheets = [];
  sheets = await xlsxFile.readSheetNames("./data/Data_3.xlsx");
  sheets.forEach((eleme, index, array) => {
    if (eleme.includes("NAI")) {
      array[index] = "NAIR " + eleme.split("NAIROBI")[1];
    }
  });
  return sheets;
}

module.exports = { getCourses, getSheets };
