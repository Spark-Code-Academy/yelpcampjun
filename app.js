const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const Campground = require('./models/campground');
// const campground = require('./models/campground');
// const { checkPrimeSync } = require('crypto');

const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const { campgroundSchema } = require('./schemas')

// Connection string to MongoDB Atlas

mongoose.connect('mongodb+srv://jun:F40SItAr5VSqebxJ@sparkcodeacademy.xxtvoj7.mongodb.net/junDB?retryWrites=true&w=majority')

// mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Database connected');
});

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));


const validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if(error) {
    const msg = error.details.map(el => el.message).join(',');
    throw new ExpressError(msg, 400);
  } else {
      next();
  }
};


app.get('/', (req, res) => {
  res.render('home')
});

// app.get('/makecampground', async (req, res) => {
//     const camp = new Campground({ title: 'MayBackyard', description: 'cheap camping!'});
//     await camp.save();
//     res.send(camp)
// })

app.get('/campgrounds', catchAsync(async (req, res, next) => {
  const campgrounds = await Campground.find({});
  res.render('campgrounds/index', { campgrounds })
}));

app.get('/campgrounds/new', (req, res) => {
  res.render('campgrounds/new')
});
app.post('/campgrounds', validateCampground, catchAsync(async (req, res, next) => {
    // if(!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
    // const campgroundSchema = Joi.object({
    //   campground: Joi.object({
    //     title: Joi.string().required(),
    //     price: Joi.number().required().min(0),
    //     image: Joi.string().required,
    //     location: Joi.string().required(),
    //     description: Joi.string().required()
    //   }).required()
    // })
    // const { error } = campgroundSchema.validate(req.body);
    // if(error) {
    //   const msg = error.details.map(el => el.message).join(',')
    //   throw new ExpressError(msg, 400)
    // }
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}));


app.get('/campgrounds/:id', catchAsync(async (req, res, next) => {
  const campground = await Campground.findById(req.params.id);
  res.render('campgrounds/show', { campground })
}));

app.get('/campgrounds/:id/edit', catchAsync(async (req, res, next) => {
  const campground = await Campground.findById(req.params.id);
  res.render('campgrounds/edit', { campground });
}));

app.put('/campgrounds/:id', validateCampground, catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
  res.redirect(`/campgrounds/${campground._id}`)
}));

app.delete('/campgrounds/:id', catchAsync(async (req, res, next) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  res.redirect(`/campgrounds`)
}));

app.all('*', (req, res, next) => {
  // res.send('404!!!')
  next(new ExpressError('Page Not Found', 404))
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if(!err.message) err.message = 'Oh No, Something Went Wrong!';
  // res.status(statusCode).send(message)
  // res.send('OH BOY, SOMETHING WENT WROING!')
  res.status(statusCode).render('error', { err })
})

app.listen(3000, () => {
  console.log("Serving on port 3000")
})