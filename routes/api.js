const express = require('express');
const router = express.Router();
const faker = require('faker');
const fs = require('fs');
const { getChats, getMessages, getSearchResults } = require('../lib/utils');

router.get('/chats', function (req, res) {
  getChats().then(chats => {
    res.json({ status: 'ok', chats: chats });
  }).catch(err => {
    res.json({ status: 'error', chats: [], error: err.message });
  });
});

router.get('/chats/:id', function (req, res) {
  getChats().then(chats => {
    const chat = chats.find(chat => chat.id == req.params.id);
    if (typeof chat === 'undefined') {
      res.json({ status: 'error', chat: {}, error: 'Chat not found' });
    } else {
      res.json({ status: 'ok', chat: chat });
    }
  }).catch(err => {
    res.json({ status: 'error', chat: {}, error: err.message });
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

router.get('/chats/:chat_id/messages/:id/attachment', function (req, res) {
  fs.open(`./public/pdfs/${req.params.id}FullNote.pdf`, 'r', (err, fd) => {
    if (err) {
      res.json({ status: 'error', message: {}, error: 'Attacment not found' });
    } else {
      res.download(`./public/pdfs/${req.params.id}FullNote.pdf`);
    }
  });
});

router.get('/search', function (req, res) {
  getSearchResults().then(results => {
    res.json({ status: 'ok', data: results });
  }).catch(err => {
    res.json({ status: 'error', data: {}, error: err.message });
  });
});

router.get('/messages', function (req, res) {
  res.json({ status: 'ok', messages_count: faker.random.number({ min: 200, max: 250 }) });
});

router.post('/*', function (req, res, next) {
  res.json({ status: 'ok'});
});

router.get('/*', function (req, res, next) {
  res.json({ status: 'ok'});
});

module.exports = router;
