const faker = require('faker');
const fs = require('fs');
const PDFDocument = require('pdfkit');

const generateChats = (count = 5) => {
  return new Promise((resolve, reject) => {
    const chatTypes = ['Inbox', 'Drafts'];
    const chatNames = ['Notes', 'Packs', 'Screens', 'Fund as a Stock', 'Dashboards'];
    let chats = [];
    for (let id = 1; id <= count; id++) {
      chats.push({ id: id, name: chatNames[id - 1], type: chatTypes[0] });
    }
    fs.writeFile('./public/jsons/chats.json', JSON.stringify(chats), err => {
      if (err) {
        reject(err);
      } else {
        resolve(chats);
      }
    });
  });
};

const generatePDFDocument = (messageId, messageBody, fileName = 'FullNote') => {
  try {
    const doc = new PDFDocument();
    let filename = `${messageId}${fileName}`;
    filename = encodeURIComponent(filename) + '.pdf';
    doc.pipe(fs.createWriteStream('./public/pdfs/' + filename));
    doc.text(messageBody, 100, 100);
    doc.end();
    return '/pdfs/' + filename;
  } catch (error) {
    console.log(error);
    return '';
  }
};

const generateMessages = () => {
  return new Promise((resolve, reject) => {
    let messages = [];
    for (let id = 1; id <= 100; id++) {
      const messageBody = faker.lorem.paragraph();
      const attachment = generatePDFDocument(id, messageBody);
      messages.push({
        id: id,
        chat_id: faker.random.number({ max: 5 }),
        title: faker.lorem.sentence(),
        body: messageBody,
        created_at: faker.date.recent(1),
        user: {
          first_name: faker.name.firstName(),
          last_name: faker.name.lastName()
        },
        attachment: {
          name: 'Full Note',
          url: attachment
        }
      });
    }
    fs.writeFile('./public/jsons/messages.json', JSON.stringify(messages), (err) => {
      if (err) {
        reject(err);
      }
      resolve(messages);
    });
  });
};

const generateSearchResults = () => {
  return new Promise((resolve, reject) => {
    let results = [];
    for (let id = 1; id <= 37; id++) {
      results.push({
        id: id,
        published_at: faker.date.recent(1),
        entity: faker.company.companyName(),
        fil_ticker: faker.company.companySuffix(),
        author: faker.name.firstName() + ' ' + faker.name.lastName(),
        rating_f: faker.random.number({ max: 9 }),
        rating_p: faker.random.number({ max: 9 }),
        title: faker.lorem.sentence(),
        sector: faker.commerce.department(),
        esg: faker.random.boolean(),
        advisor: faker.hacker.abbreviation(),
        note_type: faker.company.catchPhraseDescriptor(),
        team: 'Team ' + faker.company.catchPhrase(),
        business: faker.address.city(),
        initiation: faker.random.boolean(),
        publish: faker.address.city(),
        comments_count: faker.random.number({ max: 20 })
      });
    }
    fs.writeFile('./public/jsons/searchResults.json', JSON.stringify(results), err => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

const getChats = () => {
  return new Promise((resolve, reject) => {
    fs.open('./public/jsons/chats.json', 'r', (err, fd) => {
      if (err) {
        generateChats().then(chats => {
          resolve(chats);
        }).catch(err => {
          reject(err);
        })
      } else {
        fs.readFile('./public/jsons/chats.json', (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve(JSON.parse(data));
          }
        });
      }
    });
  });
};

const getMessages = () => {
  return new Promise((resolve, reject) => {
    fs.open('./public/jsons/messages.json', 'r', (err, fd) => {
      if (err) {
        generateMessages().then(messages => {
          resolve(messages);
        }).catch(err => {
          reject(err);
        })
      } else {
        fs.readFile('./public/jsons/messages.json', (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve(JSON.parse(data));
          }
        });
      }
    });
  });
};

const getSearchResults = () => {
  return new Promise((resolve, reject) => {
    fs.open('./public/jsons/searchResults.json', 'r', (err, fd) => {
      if (err) {
        generateSearchResults().then(searchResults => {
          resolve(searchResults);
        }).catch(err => {
          reject(err);
        })
      } else {
        fs.readFile('./public/jsons/searchResults.json', (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve(JSON.parse(data));
          }
        });
      }
    });
  });
};

module.exports = { getChats, getMessages, getSearchResults };
