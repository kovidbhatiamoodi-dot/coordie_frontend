import { motion } from 'framer-motion';
import { departments } from '../data/departments';

export default function DepartmentSection({ onRegisterClick }) {
  return (
    <section id="departments" className="section section--departments">
      <div className="section__header">
        <img src="/WHAT IS MI.png" alt="What is Mood Indigo" className="section__header-image" />
        <p className="section__header-text">
          It is not a fest but an emotion, an expression of euphoria, with a footfall of over 1,54,000+ students from over 7000+ colleges. Started in 1971, attracting people from all over the globe ever since. Moodi has lived through decades of musical and cultural change, not only keeping up with the times but setting new standards for cultural fests each year, and this time we are back with the 56th edition.
        </p>
      </div>

      <div className="departments__title-wrap">
        <h2 className="departments__title">DEPARTMENTS</h2>
      </div>

      <div className="departments">
        {departments.map((department, index) => (
          <motion.article
            key={department.id}
            className="department-card"
            initial={{ opacity: 0, scale: 0.8, rotateX: 30, y: 50, z: -50 }}
            whileInView={{ opacity: 1, scale: 1, rotateX: 0, y: 0, z: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ 
              duration: 0.6, 
              ease: "easeOut", 
              delay: (index % 6) * 0.1 
            }}
            style={{ borderColor: department.accent }}
          >
            <h3>{department.name}</h3>
            <p>{department.description}</p>
            <div className="department-card__accent" style={{ background: department.accent }} />
          </motion.article>
        ))}

        <motion.button
          type="button"
          className="department-register-cta"
          initial={{ opacity: 0, scale: 0.8, rotateX: 30, y: 50, z: -50 }}
          whileInView={{ opacity: 1, scale: 1, rotateX: 0, y: 0, z: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{
            duration: 0.6,
            ease: 'easeOut',
            delay: (departments.length % 6) * 0.1,
          }}
          onClick={onRegisterClick}
          aria-label="Open registration"
        >
          <img src="/REGISTER.png" alt="Register" />
        </motion.button>
      </div>
    </section>
  );
}
