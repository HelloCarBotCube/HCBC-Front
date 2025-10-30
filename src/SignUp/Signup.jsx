import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css';
import axios from 'axios';
import EyeHide from '../assets/eyeHide';
import EyeShow from '../assets/eyeShow';
import Logo from '../assets/logo';

// 카테고리 데이터
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

// 메인 앱 컴포넌트
const App = () => {
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

  useEffect(() => {
    const script = document.createElement('script');
    script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const toggleGenderOptions = () => setShowGenderOptions(!showGenderOptions);

  const handleGenderSelect = (gender) => {
    setFormData((prevData) => ({ ...prevData, gender }));
    setShowGenderOptions(false);
  };

  const execDaumPostcode = () => {
    new window.daum.Postcode({
      oncomplete: function (data) {
        const fullAddress = `${data.sido} ${data.sigungu} ${data.bname}`;

        setFormData((prevData) => ({
          ...prevData,
          address: fullAddress,
        }));
      },
    }).open();
  };

  const handleCategorySelect = (category) => {
    setFormData((prevData) => {
      const newCategories = new Set(prevData.selectedCategories);
      if (newCategories.has(category)) {
        newCategories.delete(category);
      } else {
        if (newCategories.size < 3) {
          newCategories.add(category);
        }
      }
      return { ...prevData, selectedCategories: newCategories };
    });
  };

  const isStep1Valid =
    formData.name.trim() !== '' &&
    formData.age.trim() !== '' &&
    formData.gender !== '' &&
    formData.address !== '';

  const isPasswordMatch = formData.password === formData.confirmPassword;
  const isPasswordValid = formData.password.length >= 8;

  const isStep2Valid = formData.id.trim() !== '' && isPasswordValid && isPasswordMatch;

  const isStep3Valid = formData.selectedCategories.size === 3;

  const renderFormStep = () => {
    switch (step) {
      case 1: {
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
                  <div className="option-item" onClick={() => handleGenderSelect('남자')}>
                    남자
                  </div>
                  <div className="option-item" onClick={() => handleGenderSelect('여자')}>
                    여자
                  </div>
                  <div className="option-item" onClick={() => handleGenderSelect('기타')}>
                    기타
                  </div>
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
      }
      case 2: {
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
                disabled={!formData.id || formData.id.trim() === ''}
              >
                중복 검사
              </button>
            </div>
            {/* 아이디 중복 검사 메시지 */}
            {idCheckMessage && (
              <p className={`msg ${isIdAvailable ? 'success' : 'error'}`}>{idCheckMessage}</p>
            )}
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
            {!isPasswordValid && formData.password.length > 0 && (
              <p className="msg-error">비밀번호는 영문과 숫자를 포함하여 8자 이상이어야 합니다.</p>
            )}
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
            {formData.confirmPassword.length > 0 && !isPasswordMatch && (
              <p className="msg-error">비밀번호가 일치하지 않습니다.</p>
            )}
            <button className="btn-submit" onClick={() => setStep(3)} disabled={!isStep2Valid}>
              다음으로
            </button>
          </>
        );
      }
      case 3: {
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
              onClick={async () => {
                // 간단한 유효성 최종 검사
                if (!isStep1Valid || !isStep2Valid || !isStep3Valid) {
                  alert('입력값을 확인해주세요.');
                  return;
                }

                const newUser = {
                  name: formData.name,
                  age: formData.age,
                  gender: formData.gender,
                  district: formData.district,
                  dong: formData.dong,
                  id: formData.id,
                  password: formData.password,
                  categories: Array.from(formData.selectedCategories),
                };

                // local 저장
                try {
                  const raw = localStorage.getItem('hcbc_users');
                  const users = raw ? JSON.parse(raw) : [];
                  users.push(newUser);
                  localStorage.setItem('hcbc_users', JSON.stringify(users));
                } catch (e) {
                  console.error('localStorage error', e);
                }

                // 서버 전송
                const serverPayload = {
                  name: newUser.name,
                  age: Number(newUser.age) || 0,
                  gender: genderMap[newUser.gender] || 'OTHER',
                  login_id: newUser.id,
                  password: newUser.password,
                  category: newUser.categories,
                  address: `${newUser.district} ${newUser.dong}`.trim(),
                };

                try {
                  const res = await API.post('/signup', serverPayload);
                  console.log('server response', res.data);
                } catch (err) {
                  console.error('server error', err);
                  if (err.response && err.response.data && err.response.data.message) {
                    alert(`서버 오류: ${err.response.data.message}`);
                  } else {
                    alert('서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.');
                  }
                }

                navigate('/'); // 로그인 페이지로 이동
              }}
              disabled={!isStep3Valid}
            >
              회원가입하기
            </button>
          </>
        );
      }
      default:
        return null;
    }
  };

  return (
    <div className="signup-page">
      <div className="card">
        <div className="logo-section">
          <Logo></Logo>
          <p className="logo-text">HCBC</p>
        </div>
        {renderFormStep()}
      </div>
    </div>
  );
};

export default App;
