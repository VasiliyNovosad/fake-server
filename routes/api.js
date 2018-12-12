const express = require('express');
const router = express.Router();
const faker = require('faker');
const fs = require('fs');
const PDFDocument = require('pdfkit');

const generateChats = (count = 5) => {
  return new Promise((resolve, reject) => {
    let chats = [];
    for (let id = 1; id <= count; id++) {
      chats.push({ id: id, name: 'Investment Conversation', title: faker.commerce.department() });
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

const generatePDFDocument = (messageId, messageBody, fileName = 'full_note') => {
  try {
    const doc = new PDFDocument();
    let filename = `${messageId}_${fileName}`;
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
        chat_id: Math.floor(Math.random() * 5) + 1,
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

router.get('/chats', function (req, res) {
  getChats().then(chats => {
    res.json({ status: 'ok', chats: chats });
  }).catch(err => {
    res.json({ status: 'error', chats: [], error: err.message });
  });
});

router.get('/chats/:chat_id/messages', function (req, res) {
  getMessages().then(messages => {
    res.json({ status: 'ok', messages: messages.filter(element => element.chat_id == req.params.chat_id) });
  }).catch(err => {
    res.json({ status: 'error', messages: [], error: err.message });
  });
});

router.get('/chats/:chat_id/messages/:id', function (req, res) {
  getMessages().then(messages => {
    const filtered = messages.filter(element => {
      return element.chat_id == req.params.chat_id && element.id == req.params.id
    });
    if (filtered.length === 0) {
      res.json({ status: 'error', message: {}, error: 'Message not found' });
    } else {
      res.json({ status: 'ok', message: filtered[0] });
    }
  }).catch(err => {
    res.json({ status: 'error', message: {}, error: err.message });
  });
});

module.exports = router;
