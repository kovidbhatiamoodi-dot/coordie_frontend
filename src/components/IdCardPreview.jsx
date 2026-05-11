import { forwardRef } from 'react';

const IdCardPreview = forwardRef(function IdCardPreview({ formData, registered }, ref) {
  const trimmedName = formData.fullName.trim();
  const displayName = trimmedName || 'Student Name';
  const nameParts = displayName.split(' ');
  const firstName = nameParts[0] || displayName;
  const restName = nameParts.slice(1).join(' ');

  return (
    <div className="id-card id-card--template" ref={ref}>
      <img
        className="id-card__template-image"
        src="/CORDIE_PORTAL_ID_FINAL.png"
        alt="Coordinator ID card template"
      />
      <div className="id-card__template-avatar">
        {formData.avatar ? (
          <img src={formData.avatar} alt="Selected avatar" />
        ) : (
          <span>Avatar</span>
        )}
      </div>
      <div className="id-card__template-name">
        <span>{firstName}</span>
        {restName ? (
          <>
            <br />
            <span>{restName}</span>
          </>
        ) : null}
      </div>
    </div>
  );
});

export default IdCardPreview;
