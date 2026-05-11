export default function CarouselSection({ onRegisterClick }) {
  return (
    <section id="game" className="section section--game">
      <button
        type="button"
        className="game-register-button"
        onClick={onRegisterClick}
        aria-label="Open registration"
      >
        <img src="/REGISTER.png" alt="Register" />
      </button>
    </section>
  );
}