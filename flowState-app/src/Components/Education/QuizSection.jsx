import React, { useMemo, useState } from 'react'
import '../../Style/Education.css'

const levelTitles = [
  'Water Beginner',
  'Hydration Learner',
  'Sanitation Advocate',
  'Hygiene Expert',
  'Water Guardian',
]

const quizLevels = [
  {
    level: 1,
    questions: [
      {
        question:
          'How much water should adults drink daily?',

        options: [
          '500ml',
          '1 Liter',
          '2–4 Liters',
          '10 Liters',
        ],

        answer: '2–4 Liters',
      },

      {
        question:
          'Which is a sign of dehydration?',

        options: [
          'Headache',
          'Better focus',
          'Cold hands',
          'Fast healing',
        ],

        answer: 'Headache',
      },

      {
        question:
          'Why is water important?',

        options: [
          'Body temperature regulation',
          'Phone charging',
          'Makes bones glow',
          'Stops sleep',
        ],

        answer:
          'Body temperature regulation',
      },

      {
        question:
          'Which drink hydrates best?',

        options: [
          'Water',
          'Soft drinks',
          'Energy drinks',
          'Coffee only',
        ],

        answer: 'Water',
      },

      {
        question:
          'Your body is mostly made of?',

        options: [
          'Water',
          'Sugar',
          'Air',
          'Salt',
        ],

        answer: 'Water',
      },
    ],
  },

  {
    level: 2,
    questions: [
      {
        question:
          'Why is handwashing important?',

        options: [
          'Prevents disease',
          'Changes eye color',
          'Improves height',
          'Prevents sleep',
        ],

        answer: 'Prevents disease',
      },

      {
        question:
          'How long should hands be washed?',

        options: [
          '5 seconds',
          '10 seconds',
          '20 seconds',
          '1 second',
        ],

        answer: '20 seconds',
      },

      {
        question:
          'Clean water helps prevent?',

        options: [
          'Waterborne diseases',
          'Homework',
          'Rain',
          'Sleepiness',
        ],

        answer: 'Waterborne diseases',
      },

      {
        question:
          'Which is proper hygiene?',

        options: [
          'Washing hands before eating',
          'Skipping baths',
          'Dirty towels',
          'Not brushing teeth',
        ],

        answer:
          'Washing hands before eating',
      },

      {
        question:
          'Hydration improves?',

        options: [
          'Focus and energy',
          'Phone battery',
          'Internet speed',
          'Noise levels',
        ],

        answer: 'Focus and energy',
      },

      {
        question:
          'Soap removes?',

        options: [
          'Bacteria and germs',
          'Sunlight',
          'Clouds',
          'Electricity',
        ],

        answer: 'Bacteria and germs',
      },

      {
        question:
          'Best hydration habit?',

        options: [
          'Drink water regularly',
          'Drink once a day',
          'Avoid water',
          'Only drink soda',
        ],

        answer:
          'Drink water regularly',
      },
    ],
  },

  {
    level: 3,
    questions: Array(10).fill({
      question:
        'Which behavior helps prevent dehydration?',

      options: [
        'Drink water regularly',
        'Avoid liquids',
        'Only drink soda',
        'Skip meals',
      ],

      answer: 'Drink water regularly',
    }),
  },

  {
    level: 4,
    questions: Array(14).fill({
      question:
        'What helps prevent waterborne disease?',

      options: [
        'Clean sanitation',
        'Dirty water',
        'Skipping hygiene',
        'No handwashing',
      ],

      answer: 'Clean sanitation',
    }),
  },

  {
    level: 5,
    questions: Array(20).fill({
      question:
        'A person exercises in hot weather. What should they prioritize?',

      options: [
        'Hydration',
        'Avoid water',
        'Sleep outside',
        'Skip meals',
      ],

      answer: 'Hydration',
    }),
  },
]

export default function QuizSection() {
  const [level, setLevel] = useState(1)

  const [xp, setXp] = useState(0)

  const [currentQuestion, setCurrentQuestion] =
    useState(0)

  const [selectedAnswer, setSelectedAnswer] =
    useState('')

  const [feedback, setFeedback] = useState('')

  const currentLevel =
    quizLevels[level - 1]

  const question =
    currentLevel.questions[currentQuestion]

  const xpNeeded = level * 100

  const progressWidth = Math.min(
    (xp / xpNeeded) * 100,
    100
  )

  const levelTitle = useMemo(() => {
    return levelTitles[level - 1]
  }, [level])

  function handleSubmit() {
    if (!selectedAnswer) return

    const isCorrect =
      selectedAnswer === question.answer

    if (isCorrect) {
      setXp((prev) => prev + 15)
      setFeedback('✅ Correct! +15 XP')
    } else {
      setXp((prev) => Math.max(prev - 5, 0))
      setFeedback('❌ Wrong Answer -5 XP')
    }

    setTimeout(() => {
      if (
        currentQuestion <
        currentLevel.questions.length - 1
      ) {
        setCurrentQuestion((prev) => prev + 1)
      } else {
        if (level < 5) {
          setLevel((prev) => prev + 1)
        }

        setCurrentQuestion(0)
      }

      setSelectedAnswer('')
      setFeedback('')
    }, 1200)
  }

  return (
    <div className="edu-section awareness-section">

      <div className="awareness-header">

        <div>
          <h2 className="awareness-title">
            🌍 Hydration Awareness Challenge
          </h2>

          <p className="awareness-subtitle">
            Learn hydration, sanitation, and hygiene through interactive progression.
          </p>
        </div>

        <div className="awareness-level-box">
          <span className="awareness-level-label">
            Level {level}
          </span>

          <h3 className="awareness-level-name">
            {levelTitle}
          </h3>
        </div>

      </div>

      <div className="awareness-progress-wrapper">

        <div className="awareness-progress-bar">
          <div
            className="awareness-progress-fill"
            style={{
              width: `${progressWidth}%`,
            }}
          />
        </div>

        <div className="awareness-progress-meta">
          <span>{xp} XP</span>
          <span>{xpNeeded} XP Needed</span>
        </div>

      </div>

      <div className="awareness-badges">

        {levelTitles.map((title, index) => (
          <div
            key={index}
            className={`awareness-badge ${
              level > index
                ? 'earned-badge'
                : 'locked-badge'
            }`}
          >
            {level > index ? '🏅' : '🔒'}
            <span>
              Level {index + 1}
            </span>
          </div>
        ))}

      </div>

      <div className="awareness-quiz-card">

        <div className="awareness-question-top">

          <span className="awareness-question-count">
            Question {currentQuestion + 1} /
            {currentLevel.questions.length}
          </span>

          <span className="awareness-question-level">
            Level {level}
          </span>

        </div>

        <h3 className="awareness-question">
          {question.question}
        </h3>

        <div className="awareness-options">

          {question.options.map((option) => (
            <button
              key={option}
              className={`awareness-option ${
                selectedAnswer === option
                  ? 'selected-awareness-option'
                  : ''
              }`}
              onClick={() =>
                setSelectedAnswer(option)
              }
            >
              {option}
            </button>
          ))}

        </div>

        <button
          className="awareness-submit-btn"
          onClick={handleSubmit}
        >
          Submit Answer
        </button>

        {feedback && (
          <p className="awareness-feedback">
            {feedback}
          </p>
        )}

      </div>

    </div>
  )
}