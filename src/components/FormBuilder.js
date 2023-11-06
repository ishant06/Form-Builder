import React, { useState } from 'react';
import axios from 'axios';
import Question from './Question';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './FormBuilder.css';

const FormBuilder = () => {
  const [formName, setFormName] = useState('');
  const [questionType, setQuestionType] = useState('categorize');
  const [questionContent, setQuestionContent] = useState('');
  const [questions, setQuestions] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [description, setDescription] = useState('');
  const [feedback, setFeedback] = useState('');
  const [points, setPoints] = useState('');
  const [clozeSentence, setClozeSentence] = useState('');
  const [clozeOptions, setClozeOptions] = useState('');
  const [comprehensionInstructions, setComprehensionInstructions] = useState('');
  const [comprehensionPassage, setComprehensionPassage] = useState('');
  const [comprehensionMedia, setComprehensionMedia] = useState('');
  const [comprehensionPoints, setComprehensionPoints] = useState(0);
  const [comprehensionTimer, setComprehensionTimer] = useState(false);
  const [questionImage, setQuestionImage] = useState('');
  const [headerImage, setHeaderImage] = useState('');
  const [categories, setCategories] = useState(['Category 1', 'Category 2', 'Category 3']);
  const [answers, setAnswers] = useState([
    { id: 'answer1', content: 'Answer 1' },
    { id: 'answer2', content: 'Answer 2' },
    { id: 'answer3', content: 'Answer 3' },
    // Add more answers as needed
  ]);

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const updatedAnswers = Array.from(answers);
    const [movedAnswer] = updatedAnswers.splice(result.source.index, 1);
    updatedAnswers.splice(result.destination.index, 0, movedAnswer);

    setAnswers(updatedAnswers);
  };

  const addQuestion = () => {
    if (questionType === 'categorize') {
      if (questionContent.trim() === '') return;
    } else if (questionType === 'cloze') {
      if (clozeSentence.trim() === '' || clozeOptions.trim() === '') return;
    } else if (questionType === 'comprehension') {
      if (comprehensionInstructions.trim() === '' || comprehensionPassage.trim() === '') return;
    }

    const newQuestion = {
      type: questionType,
      content: questionType === 'categorize' ? questionContent : (questionType === 'cloze' ? clozeSentence : comprehensionInstructions),
      categories: selectedCategories,
      description,
      feedback,
      points: questionType === 'comprehension' ? comprehensionPoints : points,
      options: questionType === 'cloze' ? clozeOptions.split(',') : [],
      passage: questionType === 'comprehension' ? comprehensionPassage : '',
      media: questionType === 'comprehension' ? comprehensionMedia : '',
      timer: questionType === 'comprehension' ? comprehensionTimer : false,
      image: questionImage,
    };

    setQuestions([...questions, newQuestion]);
    setQuestionType('categorize');
    setQuestionContent('');
    setClozeSentence('');
    setSelectedCategories([]);
    setDescription('');
    setFeedback('');
    setPoints('');
    setClozeOptions('');
    setComprehensionInstructions('');
    setComprehensionPassage('');
    setComprehensionMedia('');
    setComprehensionPoints(0);
    setComprehensionTimer(false);
    setQuestionImage('');
  };

  const removeQuestion = (questionToRemove) => {
    const updatedQuestions = questions.filter((question) => question !== questionToRemove);
    setQuestions(updatedQuestions);
  };

  const handleCategoryChange = (event, index) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].categories = event.target.value;
    setQuestions(updatedQuestions);
  };

  const handleOptionChange = (event, index) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].options = event.target.value.split(',');
    setQuestions(updatedQuestions);
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const reorderedQuestions = [...questions];
    const [removed] = reorderedQuestions.splice(result.source.index, 1);
    reorderedQuestions.splice(result.destination.index, 0, removed);
    setQuestions(reorderedQuestions);
  };

  const saveForm = () => {
    const form = { name: formName, questions };
    axios.post('/api/forms', form)
      .then((response) => {
        console.log('Form saved:', response.data);
      })
      .catch((error) => {
        console.error('Error saving form:', error);
      });
  };

  return (
    <div>
      <h2>Create a Form</h2>
      <input
        type="text"
        placeholder="Form Name"
        value={formName}
        onChange={(e) => setFormName(e.target.value)}
      />
      <select value={questionType} onChange={(e) => setQuestionType(e.target.value)}>
        <option value="categorize">Categorize</option>
        <option value="cloze">Cloze</option>
        <option value="comprehension">Comprehension</option>
      </select>
      {questionType === 'categorize' && (
        <div>
          <input
            type="text"
            placeholder="Question Content"
            value={questionContent}
            onChange={(e) => setQuestionContent(e.target.value)}
          />
        </div>
      )}
      {questionType === 'cloze' && (
        <div>
          <label>Sentence:</label>
          <textarea
            placeholder="Type the full sentence or paragraph normally"
            value={clozeSentence}
            onChange={(e) => setClozeSentence(e.target.value)}
          />
          <label>Underline the words to be replaced by blanks:</label>
          <input
            type="text"
            placeholder="Comma-separated words to be replaced by blanks"
            value={clozeOptions}
            onChange={(e) => setClozeOptions(e.target.value)}
          />
        </div>
      )}
      {questionType === 'comprehension' && (
        <div>
          <label>Instructions:</label>
          <input
            type="text"
            placeholder="Enter Instructions"
            value={comprehensionInstructions}
            onChange={(e) => setComprehensionInstructions(e.target.value)}
          />
          <label>Passage:</label>
          <textarea
            placeholder="Enter Passage"
            value={comprehensionPassage}
            onChange={(e) => setComprehensionPassage(e.target.value)}
          />
          <label>Media:</label>
          <input
            type="text"
            placeholder="Enter Media (e.g., URL)"
            value={comprehensionMedia}
            onChange={(e) => setComprehensionMedia(e.target.value)}
          />
          <label>Points:</label>
          <input
            type="number"
            placeholder="Set Points for the right answer"
            value={comprehensionPoints}
            onChange={(e) => setComprehensionPoints(e.target.value)}
          />
          <label>Timer:</label>
          <input
            type="checkbox"
            checked={comprehensionTimer}
            onChange={(e) => setComprehensionTimer(e.target.checked)}
          />
        </div>
      )}
      <div>
        <label>Categories:</label>
        <h3>Categories</h3>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="categories" direction="horizontal">
            {(provided) => (
              <ul className="category-list" {...provided.droppableProps} ref={provided.innerRef}>
                {categories.map((category, index) => (
                  <Draggable key={category} draggableId={category} index={index}>
                    {(provided) => (
                    <li
                    className="category-item"
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                    >
                      {category}
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
      
      <h3>Answers</h3>
      <ul className="answer-list">
        {answers.map((answer) => (
          <li key={answer.id} className="answer-item">
            {answer.content}
          </li>
        ))}
      </ul>
        <input
          type="text"
          placeholder="Type categories separated by commas"
          value={selectedCategories}
          onChange={(e) => setSelectedCategories(e.target.value.split(','))}
        />
      </div>
      <div>
        <label>Description:</label>
        <input
          type="text"
          placeholder="Optional Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div>
        <label>Feedback:</label>
        <input
          type="text"
          placeholder="Optional Feedback"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
        />
      </div>
      <div>
        <label>Points:</label>
        <input
          type="number"
          placeholder="Optional Points"
          value={points}
          onChange={(e) => setPoints(e.target.value)}
        />
      </div>
      <div>
        <label>Question Image URL:</label>
        <input
          type="text"
          placeholder="Optional Question Image URL"
          value={questionImage}
          onChange={(e) => setQuestionImage(e.target.value)}
        />
      </div>
      <button onClick={addQuestion}>Add Question</button>
      <button onClick={saveForm}>Save Form</button>
      {questions.map((question, index) => (
        <Question
          key={index}
          question={question}
          index={index}
          onRemove={removeQuestion}
          onCategoryChange={handleCategoryChange}
          onOptionChange={handleOptionChange}
        />
      ))}
    </div>
  );
};

export default FormBuilder;
