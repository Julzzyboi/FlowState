// src/Components/Education/QuizSection.jsx

import React, { useMemo, useState } from 'react'
import '../../Style/Education.css'

import WaterSvg from '../../assets/water.svg'
import FaucetSvg from '../../assets/faucet.svg'
import SoapSvg from '../../assets/soap.svg'
import BrainSvg from '../../assets/brain.svg'

const levelIcons = [
  WaterSvg,
  WaterSvg,
  SoapSvg,
  BrainSvg,
  FaucetSvg,
]

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
          'Which is a common sign of dehydration?',

        options: [
          'Headache',
          'Better focus',
          'Cold skin',
          'Stronger memory',
        ],

        answer: 'Headache',
      },

      {
        question:
          'Which drink hydrates the body best?',

        options: [
          'Soft drinks',
          'Coffee only',
          'Water',
          'Energy drinks',
        ],

        answer: 'Water',
      },

      {
        question:
          'Why is hydration important during hot weather?',

        options: [
          'The body loses more water',
          'Water becomes unhealthy',
          'You sweat less',
          'It improves sleep only',
        ],

        answer:
          'The body loses more water',
      },

      {
        question:
          'Which organ heavily depends on hydration?',

        options: [
          'Brain',
          'Hair',
          'Nails',
          'Teeth',
        ],

        answer: 'Brain',
      },

    ],
  },

  {
    level: 2,

    questions: [

      {
        question:
          'Which habit helps maintain hydration?',

        options: [
          'Drink water regularly',
          'Avoid liquids',
          'Only drink soda',
          'Skip breakfast',
        ],

        answer:
          'Drink water regularly',
      },

      {
        question:
          'What can dehydration affect?',

        options: [
          'Focus and energy',
          'Eye color',
          'Height',
          'Hair texture',
        ],

        answer:
          'Focus and energy',
      },

      {
        question:
          'What should you do after exercising?',

        options: [
          'Rehydrate',
          'Avoid water',
          'Sleep immediately',
          'Skip meals',
        ],

        answer: 'Rehydrate',
      },

      {
        question:
          'What percentage of the body is water?',

        options: [
          '10%',
          '30%',
          '60%',
          '90%',
        ],

        answer: '60%',
      },

      {
        question:
          'Which activity increases water loss quickly?',

        options: [
          'Exercise',
          'Reading',
          'Sleeping',
          'Studying quietly',
        ],

        answer: 'Exercise',
      },

      {
        question:
          'Why should students stay hydrated?',

        options: [
          'To improve concentration',
          'To avoid sleeping',
          'To grow taller instantly',
          'To change metabolism',
        ],

        answer:
          'To improve concentration',
      },

      {
        question:
          'What happens if dehydration worsens?',

        options: [
          'Fatigue occurs',
          'Memory doubles',
          'Skin becomes metallic',
          'Eyes glow',
        ],

        answer: 'Fatigue occurs',
      },

    ],
  },

  {
    level: 3,


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
          'How long should proper handwashing last?',

        options: [
          '5 seconds',
          '10 seconds',
          '20 seconds',
          '1 minute',
        ],

        answer: '20 seconds',
      },

      {
        question:
          'What should be used while washing hands?',

        options: [
          'Soap',
          'Oil',
          'Perfume',
          'Dust',
        ],

        answer: 'Soap',
      },

      {
        question:
          'When should you wash your hands?',

        options: [
          'Before eating',
          'Once a week',
          'Only at night',
          'After sleeping only',
        ],

        answer: 'Before eating',
      },

      {
        question:
          'Which can spread germs quickly?',

        options: [
          'Dirty hands',
          'Clean towels',
          'Fresh water',
          'Soap bubbles',
        ],

        answer: 'Dirty hands',
      },

      {
        question:
          'Why should nails be cleaned too?',

        options: [
          'Germs hide underneath',
          'For decoration only',
          'To reduce height',
          'To increase sweating',
        ],

        answer:
          'Germs hide underneath',
      },

      {
        question:
          'Which water is safest for handwashing?',

        options: [
          'Clean running water',
          'Dirty puddles',
          'Salt water only',
          'Used water',
        ],

        answer:
          'Clean running water',
      },

      {
        question:
          'What does hygiene help protect?',

        options: [
          'Communities',
          'Metal objects',
          'Televisions',
          'Furniture',
        ],

        answer: 'Communities',
      },

      {
        question:
          'Which disease risk decreases with hygiene?',

        options: [
          'Infections',
          'Broken bones',
          'Blindness instantly',
          'Hearing increase',
        ],

        answer: 'Infections',
      },

    ],
  },

  {
    level: 4,

    questions: [

      {
        question:
          'What removes bacteria effectively?',

        options: [
          'Soap',
          'Dust',
          'Air',
          'Heat only',
        ],

        answer: 'Soap',
      },

      {
        question:
          'Why is sanitation important?',

        options: [
          'Prevents disease spread',
          'Changes weather',
          'Increases noise',
          'Improves gaming',
        ],

        answer:
          'Prevents disease spread',
      },

      {
        question:
          'What should be disposed properly?',

        options: [
          'Waste materials',
          'Clean water',
          'Soap',
          'Fresh food',
        ],

        answer:
          'Waste materials',
      },

      {
        question:
          'Which area needs regular cleaning?',

        options: [
          'Bathrooms',
          'Clouds',
          'Road signs',
          'Trees',
        ],

        answer: 'Bathrooms',
      },

      {
        question:
          'Unsafe sanitation may cause what?',

        options: [
          'Water contamination',
          'Better sleep',
          'Cleaner air instantly',
          'Music improvement',
        ],

        answer:
          'Water contamination',
      },

      {
        question:
          'Why should drinking water stay covered?',

        options: [
          'To avoid contamination',
          'To warm it',
          'To change color',
          'To increase sugar',
        ],

        answer:
          'To avoid contamination',
      },

      {
        question:
          'What should communities improve for public health?',

        options: [
          'Sanitation systems',
          'Noise levels',
          'Street lights only',
          'Paint colors',
        ],

        answer:
          'Sanitation systems',
      },

      {
        question:
          'What reduces the spread of bacteria at home?',

        options: [
          'Cleaning surfaces',
          'Ignoring spills',
          'Avoiding soap',
          'Keeping garbage open',
        ],

        answer:
          'Cleaning surfaces',
      },

      {
        question:
          'Which habit promotes hygiene awareness?',

        options: [
          'Regular handwashing',
          'Skipping showers',
          'Avoiding clean water',
          'Sharing dirty towels',
        ],

        answer:
          'Regular handwashing',
      },

      {
        question:
          'What supports healthier environments?',

        options: [
          'Proper sanitation',
          'Polluted water',
          'Dirty surroundings',
          'Waste accumulation',
        ],

        answer:
          'Proper sanitation',
      },

    ],
  },

  {
    level: 5,

    questions: [

      {
        question:
          'What helps prevent waterborne disease?',

        options: [
          'Clean sanitation',
          'Dirty water',
          'Skipping hygiene',
          'No handwashing',
        ],

        answer: 'Clean sanitation',
      },

      {
        question:
          'Why is clean water important?',

        options: [
          'Protects human health',
          'Changes weather',
          'Improves internet speed',
          'Creates electricity',
        ],

        answer:
          'Protects human health',
      },

      {
        question:
          'What can contaminated water spread?',

        options: [
          'Diseases',
          'Fresh oxygen',
          'Electricity',
          'Healthy bacteria only',
        ],

        answer: 'Diseases',
      },

      {
        question:
          'Who is most vulnerable to unsafe water?',

        options: [
          'Children',
          'Robots',
          'Vehicles',
          'Plants only',
        ],

        answer: 'Children',
      },

      {
        question:
          'Which supports global health improvement?',

        options: [
          'Clean water access',
          'Ignoring sanitation',
          'Polluted rivers',
          'Waste dumping',
        ],

        answer:
          'Clean water access',
      },

      {
        question:
          'What is a safe drinking water source?',

        options: [
          'Filtered water',
          'Flood water',
          'Dirty containers',
          'Standing puddles',
        ],

        answer: 'Filtered water',
      },

    ],
  },

]

export default function QuizSection() {

  const [level, setLevel] = useState(1)

  const [xp, setXp] = useState(0)

  const [currentQuestion, setCurrentQuestion] =
    useState(0)

  const [selectedAnswer, setSelectedAnswer] =
    useState('')

  const [feedback, setFeedback] =
    useState('')

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

  const currentIcon =
    levelIcons[level - 1]

  function handleSubmit() {

    if (!selectedAnswer) return

    const isCorrect =
      selectedAnswer === question.answer

    if (isCorrect) {

      setXp((prev) => prev + 15)

      setFeedback(
        'Correct answer. Knowledge increased.'
      )

    } else {

      setXp((prev) =>
        Math.max(prev - 5, 0)
      )

      setFeedback(
        'Incorrect answer. Review the lesson.'
      )

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

    }, 1400)
  }

  return (
    <div className="edu-section awareness-section">

      {/* TOP */}
      <div className="awareness-top">

        <div>

          <p className="awareness-mini-label">
            INTERACTIVE LEARNING
          </p>

          <h2 className="awareness-main-title">
            Hydration Awareness Module
          </h2>

        </div>

        <div className="awareness-level-card">

          <img
            src={currentIcon}
            alt="Level"
            className="awareness-level-icon"
          />

          <div>

            <span className="awareness-level-small">
              LEVEL {level}
            </span>

            <h3 className="awareness-level-title">
              {levelTitle}
            </h3>

          </div>

        </div>

      </div>

      {/* PROGRESS */}
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

          <span>
            Learning Progress
          </span>

          <span>
            {xp} / {xpNeeded} XP
          </span>

        </div>

      </div>

      {/* QUESTION */}
      <div className="awareness-question-panel">

        <div className="awareness-question-top">

          <span className="awareness-question-count">

            Question {currentQuestion + 1}

          </span>

          <span className="awareness-question-level">

            Module {level}

          </span>

        </div>

        <h3 className="awareness-question">

          {question.question}

        </h3>

        {/* OPTIONS */}
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

              <div className="awareness-option-dot" />

              <span>
                {option}
              </span>

            </button>

          ))}

        </div>

        <button
          className="awareness-submit-btn"
          onClick={handleSubmit}
        >

          Submit Response

        </button>

        {feedback && (

          <p className="awareness-feedback">

            {feedback}

          </p>

        )}

      </div>

      {/* INSIGHT */}
      <div className="awareness-insight-card">


        <p className="awareness-insight-text">

          {currentLevel.insight}

        </p>

      </div>

    </div>
  )
}