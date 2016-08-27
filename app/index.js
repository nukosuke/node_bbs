'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var csrf = require('csurf');

var app = express();
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(csrf({ cookie: true }));
app.set('view engine', 'pug');
app.set('views', __dirname+'/views')

var models = require('./database');

/**
 * スレッド一覧ページ
 */
app.get('/', (req, res) => {
  models.Thread.find({}, (err, threads) => {
    if(err) {
      return res.status(500);
    }
    res.render('index', { threads });
  });
});

/**
 * 新規スレッド作成ページ
 */
app.get('/threads/new', (req, res) => {
  res.render('new', { csrfToken: req.csrfToken() });
});

/**
 * 新規スレッド作成
 */
app.post('/threads/new', (req, res) => {
  var form = {
    title: req.body.title,
    responses: []
  };

  models.Thread.create(form, (err, thread) => {
    if(err) {
      return res.status(500);
    }
    res.redirect('/');
  });
});

/**
 * スレッド閲覧ページ
 */
app.get('/threads/:id', (req, res) => {
  models.Thread.findById(req.params.id, (err, thread) => {
    if(err) {
      return res.status(500);
    }
    if(!thread) {
      return res.status(403);
    }
    res.render('show', { csrfToken: req.csrfToken(), thread });
  });
});

/**
 * レス投稿
 */
app.post('/threads/:id/new', (req, res) => {
  var form = {
    name: req.body.name,
    body: req.body.body
  };

  models.Thread.findByIdAndUpdate(
    req.params.id,
    { $push: { 'responses': form } },
    { safe: true, upsert: true },
    (err, response) => {
      if(err) {
        res.status(500);
      }
      res.redirect('/threads/' + req.params.id);
    }
  );
});

module.exports = app;