const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost/form-builder', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

const QuestionSchema = new mongoose.Schema({
  type: String, // "categorize", "cloze", or "comprehension"
  content: String,
  // Add more fields as needed for each question type
});

const FormSchema = new mongoose.Schema({
  name: String,
  questions: [QuestionSchema],
});

const Form = mongoose.model('Form', FormSchema);

app.post('/api/forms', (req, res) => {
  const { name, questions } = req.body;
  const form = new Form({ name, questions });
  form.save((err) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).send(form);
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
