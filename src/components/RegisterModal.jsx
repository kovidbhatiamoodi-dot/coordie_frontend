import { useMemo, useRef, useState, useEffect } from 'react';
import { toPng } from 'html-to-image';
import IdCardPreview from './IdCardPreview';

export default function RegisterModal({
  open,
  onClose,
  onSubmit,
  formData,
  onFieldChange,
  registered,
  submitState,
}) {
  const cardRef = useRef(null);
  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (!open || !containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width } = entry.contentRect;
        const wScale = width / 540;
        const hScale = (window.innerHeight * 0.65) / 960;
        setScale(Math.min(1, Math.max(0.2, wScale), Math.max(0.2, hScale)));
      }
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [open]);
  const canSubmit = useMemo(() => {
    return (
      formData.fullName.trim() &&
      formData.roll.trim() &&
      formData.phone.trim() &&
      formData.avatar
    );
  }, [formData]);

  const departmentOptions = [
    'Services',
    'Marketing',
    'Informals, Streets and Workshops',
    'Hospitality, Assistance and Public Relations',
    'Media, Publicity and Alumni Relations',
    'Ambience',
    'Web and Tech',
    'Design',
    'Horizons',
    'Pronites',
    'Competitions and LYPs',
    'Food and Beverages',
  ];

  const avatarOptions = [
    '/AVATARS/1.png',
    '/AVATARS/2.png',
    '/AVATARS/3.png',
    '/AVATARS/4.png',
    '/AVATARS/5.png',
    '/AVATARS/6.png',
    '/AVATARS/7.png',
    '/AVATARS/8.png',
    '/AVATARS/9.png',
    '/AVATARS/10.png',
    '/AVATARS/11.png',
    '/AVATARS/12.png',
  ];

  const toggleDepartment = value => {
    const current = formData.interestedDepartments || [];
    const next = current.includes(value)
      ? current.filter(item => item !== value)
      : [...current, value];
    onFieldChange('interestedDepartments', next);
  };

  const downloadCard = async () => {
    if (!registered || !cardRef.current) return;
    const dataUrl = await toPng(cardRef.current, {
      cacheBust: true,
      pixelRatio: 2,
      style: {
        transform: 'scale(1)',
        transformOrigin: 'top left'
      }
    });
    const link = document.createElement('a');
    link.download = `coordie-id-${formData.fullName.trim() || 'student'}.png`;
    link.href = dataUrl;
    link.click();
  };

  if (!open) return null;

  return (
    <div className="modal">
      <div className="modal__overlay" onClick={onClose} />
      <div className="modal__panel">
        <div className="modal__header">
          <div>
            <h3>Register to Coordinate</h3>
            <p>Fill your details. Download is available after registration.</p>
          </div>
          <button className="icon-button" type="button" onClick={onClose} aria-label="Close">
            x
          </button>
        </div>

        <div className="modal__body">
          <form
            className="form"
            onSubmit={event => {
              event.preventDefault();
              if (canSubmit) onSubmit();
            }}
          >
            <div className="form__section">
              <div className="form__section-title">Your Details</div>
              <div className="form__row">
                <label>
                  Name
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={event => onFieldChange('fullName', event.target.value)}
                    placeholder="Your name"
                    required
                  />
                </label>
                <label>
                  Roll number
                  <input
                    type="text"
                    value={formData.roll}
                    onChange={event => onFieldChange('roll', event.target.value)}
                    placeholder="Roll number"
                    required
                  />
                </label>
              </div>

              <div className="form__row">
                <label>
                  Phone number
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={event => onFieldChange('phone', event.target.value)}
                    placeholder="10 digit number"
                    required
                  />
                </label>
                <label>
                  Whatsapp Phone number (if different)
                  <input
                    type="tel"
                    value={formData.whatsapp}
                    onChange={event => onFieldChange('whatsapp', event.target.value)}
                    placeholder="10 digit number"
                  />
                </label>
              </div>

            </div>

            <div className="form__row">
              <div className="form__field">
                <span>Select your avatar</span>
                <div className="avatar-grid">
                  {avatarOptions.map(src => (
                    <label
                      className={`avatar-option${formData.avatar === src ? ' is-selected' : ''}`}
                      key={src}
                    >
                      <input
                        className="avatar-option__input"
                        type="radio"
                        name="avatar"
                        value={src}
                        checked={formData.avatar === src}
                        onChange={() => onFieldChange('avatar', src)}
                        required
                      />
                      <img src={src} alt="Avatar option" />
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="form__row">
              <div className="form__field">
                <span>Department you are interested in</span>
                <div className="form__checkboxes">
                  {departmentOptions.map(option => (
                    <label className="form__checkbox" key={option}>
                      <input
                        type="checkbox"
                        checked={(formData.interestedDepartments || []).includes(option)}
                        onChange={() => toggleDepartment(option)}
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="form__actions">
              <button className="button" type="submit" disabled={!canSubmit || submitState.status === 'loading'}>
                {submitState.status === 'loading' ? 'Submitting...' : 'Submit Registration'}
              </button>
              <button
                className="button button--ghost"
                type="button"
                onClick={downloadCard}
                disabled={!registered}
              >
                Download ID Card
              </button>
            </div>
            {submitState.message && (
              <div className={`form__status form__status--${submitState.status}`}>
                {submitState.message}
              </div>
            )}
          </form>

          <div className="modal__card" ref={containerRef}>
            <div style={{
              width: `${540 * scale}px`,
              height: `${960 * scale}px`,
              position: 'relative',
              margin: '0 auto'
            }}>
              <div style={{
                transform: `scale(${scale})`,
                transformOrigin: 'top left',
                position: 'absolute',
                top: 0,
                left: 0
              }}>
                <IdCardPreview ref={cardRef} formData={formData} registered={registered} />
              </div>
            </div>
            <p className="helper-text">
              ID card preview for the submitted details.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
