const express = require('express');
const router = express.Router();
const axios = require('axios');
const mongoose = require('mongoose');
const { ObjectID } = require('mongodb');
var DBCONFIG = require('../env.json')['DBCONFIG'];
var url = `mongodb://${DBCONFIG.user}:${DBCONFIG.password}@${DBCONFIG.host}:${DBCONFIG.port}/${DBCONFIG.database}`;

const customerSchema = new mongoose.Schema({ name: String, email: String });
const songSchema = new mongoose.Schema({ id: String, song_id: Number, title: String, artist: String, url: String, status: Number });
const Customer = mongoose.model('Customer', customerSchema);
const Song = mongoose.model('Song', songSchema);

router.get('/getData', async function(req, res) {
  const result = await axios.get('http://www.songsterr.com/a/ra/songs.json?pattern=Avicii');
  return res.send(result.data);
})

router.post('/search', async (req, res) => {
  const result = await axios.get(`http://www.songsterr.com/a/ra/songs.json?pattern=${req.body.query}`);
  return res.send(result.data);
})

router.get('/showTabs/:id', async (req, res) => {
  return res.send(new URL(`http://www.songsterr.com/a/wa/song?id=${req.params.id}`));
})

router.post('/register', async (req, res) => {
  mongoose.connect(url, async function(err, db) {
    if (err) throw err;

   const isAvai = await Customer.find({email: req.body.email});
   if (isAvai.length > 0) {
      db.close();
      return res.send({success: false, message: 'Email is taken. Please select another email'})
   } else {
      await Customer.create({ name: req.body.name, email: req.body.email }).then(() => {
        db.close();
      });
      return res.send({success: true, message: 'Registered successfully'});
   }
  });
})

router.post('/login', async (req, res) => {
  mongoose.connect(url, async function(err, db) {
    if (err) throw err;

    const isAvai = await Customer.find({email: req.body.email});
    // const isAvai = await Customer.find({_id: ObjectID(req.body.id)});
    if (isAvai.length > 0) {
      db.close();
      return res.send({success: true, message: 'Login successfully', id: isAvai[0]._id, name: isAvai[0].name, email: isAvai[0].email});
    } else {
      db.close();
      return res.send({success: false, message: 'Email not found'});
    }
  });
})

router.get('/getSongs/:id', async (req, res) => {
  mongoose.connect(url, async function(err, db) {
    if (err) throw err;

    const id = ObjectID(req.params.id);
    
    const getList = await Song.find({id: id});

    db.close();
    return res.send({success: true, liked_songs: getList});
  
  });
});

router.post('/likeSongs', async (req, res) => {
  mongoose.connect(url, async function(err, db) {
    if (err) throw err;

    const id = ObjectID(req.body.id);
    
    const isAvai = await Song.find({id: id, song_id: req.body.song_id});

    if (isAvai.length > 0) {
      db.close();
      return res.send({success: false, message: 'You have already liked this song'});
    } else {
      await Song.create({ id: id, song_id: req.body.song_id, title: req.body.title, artist: req.body.artist, url: req.body.url, status: 1 }).then(() => {
        db.close();
      });
      return res.send({success: true, message: 'You have successfully liked this song'});
    }
  });
})

router.post('/unlikeSongs', async (req, res) => {
  mongoose.connect(url, async function(err, db) {
    if (err) throw err;
    
    const isAvai = await Song.find({id: req.body.id, song_id: req.body.song_id});

    if (isAvai.length > 0) {
      await Song.remove({ id: req.body.id, song_id: req.body.song_id}).then(() => {
        db.close();
      });
      return res.send({success: true, message: 'You have already unliked this song'});
    } else {
      db.close();
      return res.send({success: false, message: 'You do not have this song liked'});
    }
  });
})

router.get('/getShibePics', async (req, res) => {
  const result = await axios.get(`http://shibe.online/api/shibes?count=1&urls=true&httpsUrls=false`);
  return res.send({image: result.data[0]});
})

module.exports = router;