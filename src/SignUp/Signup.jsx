import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css';
import axios from 'axios';
import EyeHide from '../assets/EyeHide';
import EyeShow from '../assets/EyeShow';
import Logo from '../assets/Logo';

// BaseURL
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://gsmsv-1.yujun.kr:27919',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 성별
const genderMap = {
  남자: 'MALE',
  여자: 'FEMALE',
  기타: 'OTHER',
};

const categories = [
  '운동',
  '맛집',
  '동물',
  '여행',
  '영화',
  '게임',
  '독서',
  '공부',
  '음악',
  '🔞',
  '웹툰',
  '외향형',
  '내향형',
  '애니메이션',
];

const categoryMap = {
  운동: 'EXERCISE',
  맛집: 'RESTAURANT',
  동물: 'ANIMAL',
  여행: 'TRIP',
  영화: 'MOVIE',
  게임: 'GAME',
  독서: 'LEADING',
  공부: 'STUDY',
  음악: 'MUSIC',
  '🔞': 'SEXUAL_PLEASURE',
  웹툰: 'WEBTOON',
  외향형: 'EXTROVERT',
  내향형: 'INTROVERT',
  애니메이션: 'ANIMATION',
};

const Signup = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    address: '',
    id: '',
    password: '',
    confirmPassword: '',
    selectedCategories: new Set(),
  });
  const [showGenderOptions, setShowGenderOptions] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [idCheckMessage, setIdCheckMessage] = useState('');
  const [isIdAvailable, setIsIdAvailable] = useState(false);
  const [isIdChecked, setIsIdChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === 'id') {
      setIsIdChecked(false);
      setIsIdAvailable(false);
      setIdCheckMessage('');
    }
  };

  const toggleGenderOptions = () => setShowGenderOptions((prev) => !prev);

  const handleGenderSelect = (gender) => {
    setFormData((prev) => ({ ...prev, gender }));
    setShowGenderOptions(false);
  };

  const execDaumPostcode = () => {
    if (window.daum && window.daum.Postcode) {
      new window.daum.Postcode({
        oncomplete: (data) => {
          const fullAddress = `${data.sido} ${data.sigungu} ${data.bname}`;
          setFormData((prev) => ({ ...prev, address: fullAddress }));
        },
      }).open();
    } else {
      alert('주소 검색 기능을 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
    }
  };

  // 아이디 중복 검사
  const handleCheckId = async () => {
    if (!formData.id.trim()) {
      setIdCheckMessage('아이디를 입력해주세요.');
      setIsIdAvailable(false);
      setIsIdChecked(false);
      return;
    }

    try {
      const res = await API.get('/api/auth/check-id', {
        params: { loginId: formData.id },
      });

      if (res.data.available === true) {
        setIdCheckMessage('사용 가능한 아이디입니다.');
        setIsIdAvailable(true);
        setIsIdChecked(true);
      } else if (res.data.available === false) {
        setIdCheckMessage('이미 사용 중인 아이디입니다.');
        setIsIdAvailable(false);
        setIsIdChecked(true);
      } else {
        setIdCheckMessage('서버 응답 형식이 올바르지 않습니다.');
        setIsIdAvailable(false);
        setIsIdChecked(false);
      }
    } catch (err) {
      if (err.response?.status === 409) {
        setIdCheckMessage('이미 사용 중인 아이디입니다.');
        setIsIdAvailable(false);
        setIsIdChecked(true);
      } else if (err.response?.status === 400) {
        setIdCheckMessage('아이디 형식이 올바르지 않습니다.');
        setIsIdAvailable(false);
        setIsIdChecked(false);
      } else if (err.response?.status === 500) {
        setIdCheckMessage('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
        setIsIdAvailable(false);
        setIsIdChecked(false);
      } else {
        setIdCheckMessage('서버와 연결할 수 없습니다. 네트워크를 확인해주세요.');
        setIsIdAvailable(false);
        setIsIdChecked(false);
      }
    }
  };

  const handleCategorySelect = (category) => {
    setFormData((prev) => {
      const newSet = new Set(prev.selectedCategories);
      if (newSet.has(category)) newSet.delete(category);
      else if (newSet.size < 3) newSet.add(category);
      return { ...prev, selectedCategories: newSet };
    });
  };

  const isStep1Valid = formData.name && formData.age && formData.gender && formData.address;
  const isPasswordMatch = formData.password === formData.confirmPassword;
  const isPasswordValid = formData.password.length >= 8;
  const isStep2Valid =
    formData.id && isPasswordValid && isPasswordMatch && isIdChecked && isIdAvailable;
  const isStep3Valid = formData.selectedCategories.size === 3;

  const handleSubmit = async () => {
    if (!isStep1Valid || !isStep2Valid || !isStep3Valid) {
      alert('입력값을 다시 확인해주세요.');
      return;
    }

    if (isSubmitting) return;
    setIsSubmitting(true);

    const mappedCategories = Array.from(formData.selectedCategories).map(
      (cat) => categoryMap[cat] || 'OTHER'
    );

    const payload = {
      name: formData.name,
      age: Number(formData.age) || 0,
      gender: genderMap[formData.gender] || 'OTHER',
      loginId: formData.id,
      password: formData.password,
      categories: mappedCategories,
      address: formData.address,
    };

    try {
      const res = await API.post('/api/auth/signup', payload);

      if (res.status === 201 || res.status === 200) {
        alert('회원가입이 완료되었습니다!');
        navigate('/');
      }
    } catch (err) {
      if (err.response) {
        switch (err.response.status) {
          case 201:
          case 200:
            alert('회원가입이 완료되었습니다!');
            navigate('/');
            break;
          case 400:
            alert('입력값이 올바르지 않습니다.');
            setIsSubmitting(false);
            break;
          case 409:
            alert('이미 사용 중인 아이디입니다.\n다른 아이디로 다시 시도해주세요.');
            setIdCheckMessage('이미 사용 중인 아이디입니다.');
            setIsIdAvailable(false);
            setIsIdChecked(false);
            setStep(2);
            setIsSubmitting(false);
            break;
          case 500:
            alert('서버 오류가 발생했습니다. 관리자에게 문의해주세요.');
            setIsSubmitting(false);
            break;
          default:
            alert('회원가입 중 오류가 발생했습니다.');
            setIsSubmitting(false);
        }
      } else {
        alert('네트워크 오류가 발생했습니다. 연결 상태를 확인해주세요.');
        setIsSubmitting(false);
      }
    }
  };

  const renderFormStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <div className="input-field">
              <input
                type="text"
                name="name"
                placeholder="이름"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div className="input-field">
              <input
                type="number"
                name="age"
                placeholder="나이"
                value={formData.age}
                onChange={handleChange}
              />
            </div>
            <div className="select-wrap">
              <div className="select-box" onClick={toggleGenderOptions}>
                {formData.gender || '성별'}
                <span className="arrow">{showGenderOptions ? '▲' : '▼'}</span>
              </div>
              {showGenderOptions && (
                <div className="options-list">
                  {['남자', '여자', '기타'].map((g) => (
                    <div key={g} className="option-item" onClick={() => handleGenderSelect(g)}>
                      {g}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="input-field id-field">
              <input
                type="text"
                name="address"
                placeholder="주소"
                value={formData.address}
                readOnly
              />
              <button className="btn-check" onClick={execDaumPostcode}>
                주소 찾기
              </button>
            </div>
            <button className="btn-submit" onClick={() => setStep(2)} disabled={!isStep1Valid}>
              다음으로
            </button>
            <p className="link-login">
              이미 회원이라면? <a href="/">로그인하기</a>
            </p>
          </>
        );

      case 2:
        return (
          <>
            <div className="input-field id-field">
              <input
                type="text"
                name="id"
                placeholder="아이디"
                value={formData.id}
                onChange={handleChange}
              />
              <button
                className="btn-check"
                type="button"
                onClick={handleCheckId}
                disabled={!formData.id.trim()}
              >
                중복 검사
              </button>
            </div>
            <p className={`msg ${isIdAvailable ? 'success' : 'error'}`}>{idCheckMessage}</p>

            <div className="input-field pw-field">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="비밀번호"
                value={formData.password}
                onChange={handleChange}
              />
              <span className="toggle-pw" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeShow /> : <EyeHide />}
              </span>
            </div>
            <p className="msg-error">
              {!isPasswordValid && formData.password ? '비밀번호는 8자 이상이어야 합니다.' : ''}
            </p>

            <div className="input-field pw-field">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                placeholder="비밀번호 확인"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              <span
                className="toggle-pw"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeShow /> : <EyeHide />}
              </span>
            </div>
            <p className="msg-error">
              {formData.confirmPassword && !isPasswordMatch ? '비밀번호가 일치하지 않습니다.' : ''}
            </p>

            <button className="btn-submit" onClick={() => setStep(3)} disabled={!isStep2Valid}>
              다음으로
            </button>
          </>
        );

      case 3:
        return (
          <>
            <div className="category-wrap">
              <p className="category-text">마지막으로 카테고리 3가지를 선택해주세요.</p>
              <div className="category-grid">
                {categories.map((cat) => (
                  <div
                    key={cat}
                    className={`category-item ${
                      formData.selectedCategories.has(cat) ? 'active' : ''
                    }`}
                    onClick={() => handleCategorySelect(cat)}
                  >
                    {cat}
                  </div>
                ))}
              </div>
            </div>
            <button
              className="btn-submit"
              onClick={handleSubmit}
              disabled={!isStep3Valid || isSubmitting}
            >
              {isSubmitting ? '가입 중...' : '회원가입하기'}
            </button>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="wrap">
      <div className="card">
        <Logo />
        <p className="logo-text">HCBC</p>
        {renderFormStep()}
      </div>
    </div>
  );
};

export default Signup;
