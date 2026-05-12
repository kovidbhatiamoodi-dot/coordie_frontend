import { useMemo, useState } from 'react';
import HeroSection from './components/HeroSection';
import DepartmentSection from './components/DepartmentSection';
import Navbar from './components/Navbar';
import RegisterModal from './components/RegisterModal';
import IntroVideoOverlay from './components/IntroVideoOverlay';
import { useScrollLock } from './hooks/useScrollLock';

const EMPTY_FORM = {
  fullName: '',
  roll: '',
  phone: '',
  whatsapp: '',
  interestedDepartments: [],
  avatar: '',
};

export default function App() {
  const [registerOpen, setRegisterOpen] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [submitState, setSubmitState] = useState({ status: 'idle', message: '' });
  const [showIntro, setShowIntro] = useState(true);

  useScrollLock(showIntro);

  const apiBase = useMemo(() => {
    return import.meta.env.VITE_API_URL || 'http://localhost:5000';
  }, []);

  const updateFormField = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleRegister = async () => {
    setSubmitState({ status: 'loading', message: '' });
    try {
      const payload = {
        ...formData,
        submittedAt: new Date().toISOString(),
      };
      const response = await fetch(`${apiBase}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok || !data.ok) {
        throw new Error(data.error || 'Registration failed');
      }
      setRegistered(true);
      setSubmitState({ status: 'success', message: 'Registered successfully.' });
    } catch (error) {
      setSubmitState({ status: 'error', message: error.message || 'Something went wrong.' });
    }
  };

  const openRegister = () => setRegisterOpen(true);
  const closeRegister = () => setRegisterOpen(false);
  const handleIntroEnd = () => setShowIntro(false);

  return (
    <div className="page">
      {showIntro && <IntroVideoOverlay onEnd={handleIntroEnd} />}
      <Navbar onRegisterClick={openRegister} />
      <main>
        <HeroSection onRegisterClick={openRegister} />
        <DepartmentSection onRegisterClick={openRegister} />
      </main>
      <RegisterModal
        open={registerOpen}
        onClose={closeRegister}
        onSubmit={handleRegister}
        formData={formData}
        onFieldChange={updateFormField}
        registered={registered}
        submitState={submitState}
      />
    </div>
  );
}
