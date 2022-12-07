const xlsxFile = require("read-excel-file/node");

function output() {
  return new Promise((resolve, reject) => {
    const tables = [];
    xlsxFile("./data/Data_3.xlsx")
      .then((rows) => {
        rows.forEach((element) => {
          tables.push(element);
        });
      })
      .catch((err) => reject(err))
      .finally(() => resolve(tables));
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

async function getCourses(params) {
  const variables = await output();

  let variablesWithoutNull = [];
  variables.forEach((nonArr) => {
    variablesWithoutNull.push(nonArr.filter((elem) => elem !== null));
  });

  let firstWeekDays = variables[1]
    .map((eleme, index) => {
      return { eleme, index };
    })
    .filter((ele) => ele.eleme !== null);

  let secondWeekDays = variables[66]
    .map((eleme, index) => {
      return { eleme, index };
    })
    .filter((ele) => ele.eleme !== null);

  let foundItem = [];
  for (let i = 0; i < params.length; i++) {
    let searchString = params[i];
    variablesWithoutNull.forEach((element, index) => {
      if (element.some((arr) => arr.includes(searchString))) {
        let foundElement = element.find((arr) => arr.includes(searchString));
        foundItem.push({
          course_code: foundElement,
          // row: index,
          day:
            index >= 69
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
            index >= 69
              ? variables[67][variables[index].indexOf(foundElement)]
              : variables[2][variables[index].indexOf(foundElement)],
          // column: variables[index].indexOf(foundElement),
          room: element[0],
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

module.exports = { getCourses };
// (async () => {
//   const objects = await getCourses(
//     "ACS331",
//     "ACS332",
//     "ACS323",
//     "ACS441",
//     "ACS362",
//     "MAT322"
//   );
//   console.log(objects);
// })();
