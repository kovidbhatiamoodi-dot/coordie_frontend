import { motion } from 'framer-motion';
import { departments } from '../data/departments';

export default function DepartmentSection() {
  return (
    <section id="departments" className="section section--departments">
      <div className="section__header">
        <h2>About Mood Indigo</h2>
        <p className="section__lead">
          Mood Indigo is the annual cultural festival of IIT Bombay, and Asia's largest college cultural festival. Step into a world of endless energy, unparalleled creativity, and unforgettable moments.
        </p>
      </div>

      <div className="departments">
        {departments.map((department, index) => (
          <motion.article
            key={department.id}
            className="department-card"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
            style={{ borderColor: department.accent }}
          >
            <div className="department-card__tag">{department.tag}</div>
            <h3>{department.name}</h3>
            <p>{department.description}</p>
            <div className="department-card__accent" style={{ background: department.accent }} />
          </motion.article>
        ))}
      </div>
    </section>
  );
}
