import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css';
import axios from 'axios';
import EyeHide from '../assets/eyeHide';
import EyeShow from '../assets/eyeShow';
import Logo from '../assets/logo';

// '구'에 따른 '동' 데이터
const dongData = {
  광산구: [
    '도산동',
    '동곡동',
    '본량동',
    '비아동',
    '삼도동',
    '송정동',
    '수완동',
    '신가동',
    '신창동',
    '신흥동',
    '어룡동',
    '우산동',
    '운남동',
    '월곡동',
    '임곡동',
    '첨단동',
    '평동',
    '하남동',
  ],
  남구: [
    '대촌동',
    '방림동',
    '백운동',
    '봉선동',
    '사직동',
    '송암동',
    '양림동',
    '월산동',
    '일산동',
    '주월동',
    '진월동',
    '효덕동',
  ],
  동구: ['계림동', '동명동', '산수동', '서남동', '지산동', '지원동', '충장동', '학운동', '학동'],
  북구: [
    '건국동',
    '동림동',
    '두암동',
    '매곡동',
    '문화동',
    '문흥동',
    '삼각동',
    '석곡동',
    '신안동',
    '신용동',
    '양상동',
    '오치동',
    '용봉동',
    '우산동',
    '운암동',
    '일곡동',
    '임동',
    '중앙동',
    '중흥동',
    '풍향동',
  ],
  서구: [
    '광천동',
    '금호동',
    '농성동',
    '동천동',
    '상무동',
    '서창동',
    '양동',
    '유덕동',
    '치평동',
    '풍암동',
    '화정동',
  ],
};
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
    district: '',
    dong: '',
    id: '',
    password: '',
    confirmPassword: '',
    selectedCategories: new Set(),
  });
  const [showGenderOptions, setShowGenderOptions] = useState(false);
  const [showDistrictOptions, setShowDistrictOptions] = useState(false);
  const [showDongOptions, setShowDongOptions] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [idCheckMessage, setIdCheckMessage] = useState('');
  const [isIdAvailable, setIsIdAvailable] = useState(false);

  const API = axios.create({
    baseURL: 'http://gsmsv-1.yujun.kr:27919/api/auth',
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true,
    timeout: 5000,
  });

  const genderMap = {
    남자: 'MALE',
    여자: 'FEMALE',
    기타: 'OTHER',
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const toggleGenderOptions = () => setShowGenderOptions(!showGenderOptions);
  const toggleDistrictOptions = () => setShowDistrictOptions(!showDistrictOptions);
  const toggleDongOptions = () => setShowDongOptions(!showDongOptions);

  const handleGenderSelect = (gender) => {
    setFormData((prevData) => ({ ...prevData, gender }));
    setShowGenderOptions(false);
  };

  const handleDistrictSelect = (district) => {
    setFormData((prevData) => ({ ...prevData, district, dong: '' }));
    setShowDistrictOptions(false);
    setShowDongOptions(false);
  };

  // 아이디 중복 검사
  const handleCheckId = async () => {
    const id = formData.id && formData.id.trim();
    setIdCheckMessage('');
    setIsIdAvailable(false);

    if (!id) {
      setIdCheckMessage('아이디를 입력해주세요.');
      return;
    }

    try {
      const response = await API.post('/signup', { login_id: id });

      // 서버 응답 포맷에 맞춰 처리 (예: { available: true })
      if (response && response.data && response.data.available) {
        setIdCheckMessage('사용 가능한 아이디입니다.');
        setIsIdAvailable(true);
      } else {
        setIdCheckMessage('이미 사용 중인 아이디입니다.');
        setIsIdAvailable(false);
      }
    } catch (error) {
      console.error('ID 중복 검사 중 오류 발생:', error);
      // 서버에서 반환한 메시지가 있으면 보여주고, 없으면 일반 메시지
      if (error.response && error.response.data && error.response.data.message) {
        setIdCheckMessage(error.response.data.message);
      } else if (error.response && error.response.status) {
        setIdCheckMessage(`서버 오류: ${error.response.status}`);
      } else {
        setIdCheckMessage('ID 중복 검사 중 네트워크 오류가 발생했습니다.');
      }
      setIsIdAvailable(false);
    }
  };

  const handleDongSelect = (dong) => {
    setFormData((prevData) => ({ ...prevData, dong }));
    setShowDongOptions(false);
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
    formData.district !== '' &&
    formData.dong !== '';

  const isPasswordMatch = formData.password === formData.confirmPassword;
  const isPasswordValid = formData.password.length >= 8;

  const isStep2Valid = formData.id.trim() !== '' && isPasswordValid && isPasswordMatch;

  const isStep3Valid = formData.selectedCategories.size === 3;

  const renderFormStep = () => {
    switch (step) {
      case 1: {
        const districts = Object.keys(dongData);
        const currentDongs = formData.district ? dongData[formData.district] : [];
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
            <div className="select-wrap two-col">
              <div className="select-group">
                <div className="select-box" onClick={toggleDistrictOptions}>
                  {formData.district || '구'}
                  <span className="arrow">{showDistrictOptions ? '▲' : '▼'}</span>
                </div>
                {showDistrictOptions && (
                  <div className="options-list">
                    {districts.map((dist) => (
                      <div
                        key={dist}
                        className="option-item"
                        onClick={() => handleDistrictSelect(dist)}
                      >
                        {dist}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="select-group">
                <div className="select-box" onClick={toggleDongOptions}>
                  {formData.dong || '동'}
                  <span className="arrow">{showDongOptions ? '▲' : '▼'}</span>
                </div>
                {showDongOptions && (
                  <div className="options-list">
                    {currentDongs.length > 0 ? (
                      currentDongs.map((dong) => (
                        <div
                          key={dong}
                          className="option-item"
                          onClick={() => handleDongSelect(dong)}
                        >
                          {dong}
                        </div>
                      ))
                    ) : (
                      <div className="option-item disabled">구를 먼저 선택해주세요.</div>
                    )}
                  </div>
                )}
              </div>
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
