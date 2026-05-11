import { useEffect, useRef, useState } from 'react';
import { motion, animate, useMotionValue } from 'framer-motion';
import { cardData } from '../data/cardData';

function GameCard({ card, isUnlocked, isFlipped, onAnswer, answer }) {
  return (
    <div className="game-card">
      <div className={`game-card__inner ${isFlipped ? 'is-flipped' : ''}`}>

        <div
          className="game-card__face"
          style={{ borderColor: card.accent }}
        >
          <div className="game-card__content">
            <div className="game-card__meta">
              Que {card.id} / {cardData.length}
            </div>

            <h3>{card.prompt}</h3>
          </div>

          {isUnlocked ? (
            <div className="game-card__options">
              {card.options.map(option => (
                <button
                  key={option}
                  type="button"
                  onClick={() => onAnswer(option)}
                  className="game-card__option"
                >
                  {option}
                </button>
              ))}
            </div>
          ) : (
            <div className="game-card__locked">
              Answer the previous card to unlock.
            </div>
          )}
        </div>

        <div
          className="game-card__face game-card__face--back"
          style={{ borderColor: card.accent }}
        >
          <div className="game-card__troll">
            {typeof card.troll === 'string' ? (
              card.troll
            ) : (
              card.troll && answer && card.troll[answer] ? (
                <>
                  <p>{card.troll[answer].text}</p>
                  {card.troll[answer].gif && (
                    <img 
                      src={card.troll[answer].gif} 
                      alt="troll gif" 
                      style={{ width: '100%', borderRadius: '10px', marginTop: '10px' }} 
                    />
                  )}
                </>
              ) : null
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Cylinder({
  current,
  completed,
  answers,
  onAnswer,
  onWheelNavigate
}) {
  const stageRef = useRef(null);

  const [stageW, setStageW] = useState(360);
  const [isNarrow, setIsNarrow] = useState(false);

  const cylinderY = useMotionValue(0);

  const touchX = useRef(0);
  const touchY = useRef(0);
  const touchActive = useRef(false);
  const touchAxis = useRef('');

  const total = cardData.length;
  const angleStep = 360 / total;

  const cardW = Math.min(
    stageW * (isNarrow ? 0.52 : 0.30),
    isNarrow ? 220 : 320
  );

  const cardH = isNarrow ? 330 : 380;

  const radius = Math.round(cardW * 1.2);

  useEffect(() => {
    const measure = () => {
      if (stageRef.current) {
        setStageW(stageRef.current.offsetWidth);
      }
    };

    const checkNarrow = () => {
      setIsNarrow(window.innerWidth <= 720);
    };

    measure();
    checkNarrow();

    window.addEventListener('resize', measure);
    window.addEventListener('resize', checkNarrow);

    return () => {
      window.removeEventListener('resize', measure);
      window.removeEventListener('resize', checkNarrow);
    };
  }, []);

  useEffect(() => {
    animate(cylinderY, -current * angleStep, {
      type: 'spring',
      stiffness: 260,
      damping: 32
    });
  }, [current]);

  const onTouchStart = event => {
    touchX.current = event.touches[0].clientX;
    touchY.current = event.touches[0].clientY;
    touchActive.current = true;
    touchAxis.current = '';
  };

  const onTouchMove = event => {
    if (!touchActive.current) return;
    const dx = event.touches[0].clientX - touchX.current;
    const dy = event.touches[0].clientY - touchY.current;

    if (!touchAxis.current) {
      if (Math.max(Math.abs(dx), Math.abs(dy)) < 8) return;
      touchAxis.current = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
    }

    if (touchAxis.current === 'x' && event.cancelable) {
      event.preventDefault();
    }
  };

  const onTouchEnd = event => {
    touchActive.current = false;

    const dx =
      touchX.current - event.changedTouches[0].clientX;
    const dy =
      touchY.current - event.changedTouches[0].clientY;

    if (!touchAxis.current) {
      touchAxis.current = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
    }

    if (touchAxis.current !== 'x') return;

    onWheelNavigate(dx, true);
  };

  return (
    <div
      ref={stageRef}
      className="game-stage"
      onWheel={onWheelNavigate}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <motion.div
        className="game-cylinder"
        style={{
          rotateY: cylinderY,
          width: cardW,
          height: cardH,
          marginLeft: -cardW / 2
        }}
      >
        {cardData.map((card, index) => {
          const angle = index * angleStep;

          let rel = index - current;

          if (rel > total / 2) rel -= total;
          if (rel < -total / 2) rel += total;

          const isCenter = rel === 0;
          const isAdjacent = Math.abs(rel) === 1;
          const isVisible = Math.abs(rel) <= 2;

          return (
            <div
              key={card.id}
              className={`game-panel ${isCenter ? 'is-center' : ''
                } ${isAdjacent ? 'is-adjacent' : ''}`}
              style={{
                transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
                opacity: isVisible ? 1 : 0
              }}
            >
              <GameCard
                card={card}
                isUnlocked={
                  index === 0 || completed.has(index - 1)
                }
                isFlipped={completed.has(index)}
                answer={answers[index]}
                onAnswer={option =>
                  onAnswer(index, option)
                }
              />
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}

export default function CarouselSection({
  onRegisterClick,
  onAnswersChange
}) {
  const [current, setCurrent] = useState(0);

  const [completed, setCompleted] = useState(new Set());

  const [answers, setAnswers] = useState({});

  const [allDone, setAllDone] = useState(false);

  useEffect(() => {
    onAnswersChange(
      Object.entries(answers).map(([index, value]) => ({
        index: Number(index),
        answer: value
      }))
    );
  }, [answers]);

  const handleAnswer = (index, option) => {
    if (completed.has(index)) return;

    setAnswers(prev => ({
      ...prev,
      [index]: option
    }));

    setCompleted(prev => {
      const next = new Set(prev);
      next.add(index);
      return next;
    });

    if (index === cardData.length - 1) {
      setTimeout(() => {
        setAllDone(true);
      }, 650);
    }
  };

  const canFwd =
    current < cardData.length - 1 &&
    completed.has(current);

  const handleWheelNavigate = (
    eventOrDx,
    fromTouch = false
  ) => {
    const dx =
      typeof eventOrDx === 'number'
        ? eventOrDx
        : Math.abs(eventOrDx.deltaX) >
          Math.abs(eventOrDx.deltaY)
          ? eventOrDx.deltaX
          : 0;

    if (
      !fromTouch &&
      typeof eventOrDx !== 'number' &&
      dx !== 0
    ) {
      eventOrDx.preventDefault();
    }

    if (dx > 30 && canFwd) {
      setCurrent(value => value + 1);
    } else if (dx < -30 && current > 0) {
      setCurrent(value => value - 1);
    }
  };

  return (
    <section
      id="game"
      className="section section--game"
    >
      <div className="game-header">
        <p className="section__eyebrow">
          The Trolling Ritual
        </p>

        <h2>
          Six cards. Two choices. No escape.
        </h2>

        <p className="section__lead">
          Pick one option to unlock the next card.
          Horizontal swipe to move forward.
        </p>
      </div>

      {!allDone ? (
        <>
          <div className="game-carousel-wrapper">
            <Cylinder
              current={current}
              completed={completed}
              answers={answers}
              onAnswer={handleAnswer}
              onWheelNavigate={handleWheelNavigate}
            />
          </div>

          <div className="game-controls">
            <div className="game-dots">
              {cardData.map((card, index) => (
                <span
                  key={card.id}
                  className={`game-dot ${index === current
                      ? 'is-active'
                      : ''
                    } ${completed.has(index)
                      ? 'is-done'
                      : ''
                    }`}
                />
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="game-finale">
          <h3>
            All this does not matter.
            You can still become a coordinator.
          </h3>

          <p>
            Register now. We will take it from here.
          </p>

          <button
            className="button"
            type="button"
            onClick={onRegisterClick}
          >
            Register Now
          </button>
        </div>
      )}
    </section>
  );
}