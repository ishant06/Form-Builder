// src/components/Question.js
import React from 'react';

const Question = ({ question, onRemove }) => {
  return (
    <div>
      <p>{question.type}</p>
      <p>{question.content}</p>
      <button onClick={() => onRemove(question)}>Remove</button>
    </div>
  );
};

export default Question;
