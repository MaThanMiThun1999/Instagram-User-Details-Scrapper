const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const app = express();

app.use(express.static('public')); // Serves static files from 'public' directory

app.get('/scrape', (req, res) => {
 const username = req.query.username;
 axios.get(`https://www.instagram.com/${username}/?__a=1`)
  .then(response => {
    const html = response.data;

    // Log the raw HTML response data
    console.log('Raw HTML:', html);

    const $ = cheerio.load(html);
    const profileImage = $('meta[property="og:image"]').attr('content');
    const fullName = $('meta[property="og:description"]').attr('content').split(',')[0];
    const followersCount = $('meta[property="og:description"]').attr('content').split(',')[1];
    const followingCount = $('meta[property="og:description"]').attr('content').split(',')[2];
    const postCount = $('meta[property="og:description"]').attr('content').split(',')[3];

    // Log the metadata
    console.log('Profile Image:', profileImage);
    console.log('Full Name:', fullName);
    console.log('Followers Count:', followersCount);
    console.log('Following Count:', followingCount);
    console.log('Post Count:', postCount);

    // Send metadata as JSON response
    res.json({ profileImage, fullName, followersCount, followingCount, postCount });
  })
  .catch(error => {
    console.error(error);
    res.status(500).send('An error occurred while trying to scrape the website.');
  });
});

app.get('/', (req, res) => {
 res.sendFile(__dirname + "/index.html");
});

app.listen(3000, () => console.log('Server started on port 3000'));
