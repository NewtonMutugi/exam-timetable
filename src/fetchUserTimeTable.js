const cheerio = require('cheerio');

async function fetchUserTimeTable(token) {
  try {
    const response = await fetch(
      'https://student.daystar.ac.ke/Course/StudentTimetable',
      {
        method: 'GET',
        headers: {
          Cookie: token,
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
        },
      }
    );
    // console.log(`Token: ${token}`);
    // console.log(response);

    if (response.status !== 200) {
      throw new Error(
        `Something went wrong while fetching data. Error code: ${response.status}`
      );
    }
    // console.log(response);

    const html = await response.text();
    // console.log(html);
    const $ = cheerio.load(html);
    const table = $('table.table.table-hover');
    const tbody = table.find('tbody');
    const rows = tbody.find('tr');

    const dataList = [];
    rows.each((index, row) => {
      if (index === 0) return; // Skip the header row
      const cells = $(row).find('td');
      const unit = $(cells[0]).text().trim();
      const section = $(cells[1]).text().trim();
      const dayOfWeek = $(cells[2]).text().trim();
      const period = $(cells[3]).text().trim();
      const campus = $(cells[4]).text().trim();
      const lectureRoom = $(cells[5]).text().trim();
      const lecturer = $(cells[6]).text().trim();

      dataList.push({
        unit,
        section,
        day_of_the_week: dayOfWeek,
        period,
        campus,
        room: lectureRoom,
        lecturer,
      });
    });
    console.log(dataList);
    return dataList;
  } catch (error) {
    throw new Error(error.message);
  }
}

module.exports = fetchUserTimeTable;
