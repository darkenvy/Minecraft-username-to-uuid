const axios = require('axios');
const path = require('path');
const fs = require('fs-extra');
const _ = require('lodash');
const LineByLineReader = require('line-by-line');
const lr = new LineByLineReader(path.join(__dirname, 'names.txt'));

const nameList = [];

fs.mkdirpSync(path.join(__dirname, 'out'));

// -------------------------------------------------------------------------- //

function formatUUID(rawUUID) {
  return rawUUID.replace(/(.{8})(.{4})(.{4})(.{4})(.+)/, (m,a,b,c,d,e) => {
    return `${a}-${b}-${c}-${d}-${e}`;
  });
}

async function getUUID(username) {
  let response;
  try {
    console.log('Looking up', username, '...');
    response = await axios.get(`https://api.mojang.com/users/profiles/minecraft/${username}`);
  } catch (error) {
    response = null;
    console.error('error on AJAX request:', error);
  }

  if (!response) return null;

  console.log(' - Got response');

  const rawUUID = _.get(response, 'data.id');

  if (!rawUUID) {
    console.log(' + Could not get UUID from', username, 'from the API');
    return null;
  }

  const formattedUUID = formatUUID(rawUUID);

  return formattedUUID;
}

function writeFile(username, uuid) {
  let data = '';
  /* go look at how your desired files look like. This is the template.
  Be careful not to break yaml formatting */
  data += `uuid: ${uuid}\n`;
  data += `name: ${username}\n`;
  data += 'primary-group: member\n';
  data += 'parents:\n';
  data += '- member\n';
  data += '- veteran\n';

  console.log(' - Saving file', uuid);
  fs.writeFileSync(path.join(__dirname, 'out', `${uuid}.yml`), data, 'utf8');
}

// -------------------------------------------------------------------------- //

lr.on('line', function (line) {
  console.log('reading name from file:', line);
  nameList.push(line);
});

lr.on('error', (err) => console.log('lineReader; error adding name to array: ', err));
lr.on('end', async () => {
  console.log('done reading file. Now starting async requests to Mojang server');
  console.log('namelist size', nameList.length);
  console.log('\n');

  for (let i in nameList) {
    const username = nameList[i];
    const uuid = await getUUID(username);
    if (!uuid) continue;
    writeFile(username, uuid);
  }

  console.log('Done! :)')
});
