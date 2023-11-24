const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');

mongoose.connect('mongodb+srv://jun:F40SItAr5VSqebxJ@sparkcodeacademy.xxtvoj7.mongodb.net/junDB?retryWrites=true&w=majority')


// mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');


const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Database connected');
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      image: 'https://source.unsplash.com/random',
      description: 'Lorem ipsum dolor sit amet consectetur adioisici iure sed labore ipsam a cum nihil atque molestiae deserunt!',
      price
    });
    //const c = new Campground({title: New York}) // to see is it working 
    await camp.save();
  }
}
//seedDB() to run the mongo database to randomly create 50 camp names

seedDB().then(() => {
  mongoose.connection.close();
})
//to close the mongo connection
