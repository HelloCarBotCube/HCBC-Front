import React, { useState } from "react";
import "./index.css";

// SVG 로고 컴포넌트
const HcbcLogo = () => {
  return (
    <svg
      width="834"
      height="834"
      viewBox="0 0 834 834"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="logo"
    >
      <path
        d="M0 135C0 60.4415 60.4416 0 135 0H699C773.558 0 834 60.4416 834 135V699C834 773.558 773.558 834 699 834H135C60.4415 834 0 773.558 0 699V135Z"
        fill="url(#paint0_linear_211_172)"
      />
      <path
        d="M227 661C210.431 661 197 647.569 197 631V203C197 186.431 210.431 173 227 173H299.381C315.949 173 329.381 186.431 329.381 203V333.625C329.381 350.194 342.812 363.625 359.381 363.625H474.619C491.188 363.625 504.619 350.194 504.619 333.625V203C504.619 186.431 518.050 173 534.619 173H607C623.569 173 637 186.431 637 203V631C637 647.569 623.569 661 607 661H534.619C518.051 661 504.619 647.569 504.619 631V500.375C504.619 483.806 491.188 470.375 474.619 470.375H359.381C342.812 470.375 329.381 483.806 329.381 500.375V631C329.381 647.569 315.949 661 299.381 661H227Z"
        fill="white"
      />
      <defs>
        <linearGradient
          id="paint0_linear_211_172"
          x1="417"
          y1="0"
          x2="417"
          y2="834"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FF649B" />
          <stop offset="1" stopColor="#FF9CB9" />
        </linearGradient>
      </defs>
    </svg>
  );
};

// 비밀번호 숨기기 아이콘 SVG 컴포넌트 (눈 모양)
const EyeShow = (props) => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M20 25.8C24.034 25.8 27.686 23.55 29.648 20C27.686 16.45 24.034 14.2 20 14.2C15.966 14.2 12.314 16.45 10.352 20C12.314 23.55 15.966 25.8 20 25.8ZM20 13C24.808 13 28.972 15.848 31 20C28.972 24.152 24.808 27 20 27C15.192 27 11.028 24.152 9 20C11.028 15.848 15.192 13 20 13ZM20 22.8C20.7426 22.8 21.4548 22.505 21.9799 21.9799C22.505 21.4548 22.8 20.7426 22.8 20C22.8 19.2574 22.505 18.5452 21.9799 18.0201C21.4548 17.495 20.7426 17.2 20 17.2C19.2574 17.2 18.5452 17.495 18.0201 18.0201C17.495 18.5452 17.2 19.2574 17.2 20C17.2 20.7426 17.495 21.4548 18.0201 21.9799C18.5452 22.505 19.2574 22.8 20 22.8ZM20 24C18.9391 24 17.9217 23.5786 17.1716 22.8284C16.4214 22.0783 16 21.0609 16 20C16 18.9391 16.4214 17.9217 17.1716 17.1716C17.9217 16.4214 18.9391 16 20 16C21.0609 16 22.0783 16.4214 22.8284 17.1716C23.5786 17.9217 24 18.9391 24 20C24 21.0609 23.5786 22.0783 22.8284 22.8284C22.0783 23.5786 21.0609 24 20 24Z"
      fill="#858486"
    />
  </svg>
);

// 비밀번호 보이기 아이콘 SVG 컴포넌트 (눈 가림)
const EyeHide = (props) => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M26.67 24.9762L29.425 27.7318L28.576 28.58L11.85 11.8502L12.697 11L15.552 13.8556C16.932 13.3035 18.432 13.0005 20 13.0005C24.808 13.0005 28.972 15.8491 31 20.002C30.0217 22.0138 28.5276 23.7302 26.67 24.9762ZM16.486 14.7909L18.15 16.4552C18.9049 16.0605 19.7662 15.9171 20.6082 16.046C21.4503 16.1749 22.2292 16.5693 22.8316 17.1718C23.434 17.7743 23.8283 18.5534 23.9572 19.3957C24.086 20.2379 23.9427 21.0994 23.548 21.8545L25.803 24.11C27.377 23.1098 28.707 21.7064 29.648 20.003C27.686 16.4512 24.034 14.2007 20 14.2007C18.8041 14.2015 17.6166 14.4009 16.486 14.7909ZM22.638 20.9443C22.8164 20.4449 22.8495 19.905 22.7332 19.3876C22.6169 18.8702 22.3562 18.3964 21.9812 18.0214C21.6063 17.6464 21.1326 17.3855 20.6153 17.2692C20.098 17.1529 19.5583 17.186 19.059 17.3644L22.638 20.9443ZM24.448 26.1494C23.068 26.7016 21.568 27.0046 20 27.0046C15.192 27.0046 11.028 24.156 9 20.003C9.97832 17.9913 11.4724 16.2749 13.33 15.0289L14.197 15.8961C12.5915 16.9207 11.2693 18.3327 10.352 20.002C12.314 23.5529 15.966 25.8034 20 25.8034C21.1959 25.8026 22.3834 25.6032 23.514 25.2132L24.448 26.1494ZM16.453 18.1516L17.362 19.0618C17.1836 19.5612 17.1505 20.1011 17.2668 20.6185C17.3831 21.1359 17.6438 21.6097 18.0188 21.9847C18.3937 22.3597 18.8674 22.6206 19.3847 22.7369C19.902 22.8532 20.4417 22.8201 20.941 22.6416L21.851 23.5499C21.0961 23.9446 20.2348 24.088 19.3928 23.9591C18.5507 23.8302 17.7718 23.4358 17.1694 22.8333C16.567 22.2308 16.1727 21.4517 16.0438 20.6094C15.915 19.7671 16.0583 18.9067 16.453 18.1516Z"
      fill="#858486"
    />
  </svg>
);

// '구'에 따른 '동' 데이터
const dongData = {
  광산구: [
    "도산동",
    "동곡동",
    "본량동",
    "비아동",
    "삼도동",
    "송정동",
    "수완동",
    "신가동",
    "신창동",
    "신흥동",
    "어룡동",
    "우산동",
    "운남동",
    "월곡동",
    "임곡동",
    "첨단동",
    "평동",
    "하남동",
  ],
  남구: [
    "대촌동",
    "방림동",
    "백운동",
    "봉선동",
    "사직동",
    "송암동",
    "양림동",
    "월산동",
    "일산동",
    "주월동",
    "진월동",
    "효덕동",
  ],
  동구: [
    "계림동",
    "동명동",
    "산수동",
    "서남동",
    "지산동",
    "지원동",
    "충장동",
    "학운동",
    "학동",
  ],
  북구: [
    "건국동",
    "동림동",
    "두암동",
    "매곡동",
    "문화동",
    "문흥동",
    "삼각동",
    "석곡동",
    "신안동",
    "신용동",
    "양상동",
    "오치동",
    "용봉동",
    "우산동",
    "운암동",
    "일곡동",
    "임동",
    "중앙동",
    "중흥동",
    "풍향동",
  ],
  서구: [
    "광천동",
    "금호동",
    "농성동",
    "동천동",
    "상무동",
    "서창동",
    "양동",
    "유덕동",
    "치평동",
    "풍암동",
    "화정동",
  ],
};
// 카테고리 데이터
const categories = [
  "운동",
  "맛집",
  "동물",
  "여행",
  "영화",
  "게임",
  "독서",
  "공부",
  "음악",
  "🔞",
  "웹툰",
  "외향형",
  "내향형",
  "애니메이션",
];

// 메인 앱 컴포넌트
const App = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    district: "",
    dong: "",
    id: "",
    password: "",
    confirmPassword: "",
    selectedCategories: new Set(),
  });
  const [showGenderOptions, setShowGenderOptions] = useState(false);
  const [showDistrictOptions, setShowDistrictOptions] = useState(false);
  const [showDongOptions, setShowDongOptions] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const toggleGenderOptions = () => setShowGenderOptions(!showGenderOptions);
  const toggleDistrictOptions = () =>
    setShowDistrictOptions(!showDistrictOptions);
  const toggleDongOptions = () => setShowDongOptions(!showDongOptions);

  const handleGenderSelect = (gender) => {
    setFormData((prevData) => ({ ...prevData, gender }));
    setShowGenderOptions(false);
  };

  const handleDistrictSelect = (district) => {
    setFormData((prevData) => ({ ...prevData, district, dong: "" }));
    setShowDistrictOptions(false);
    setShowDongOptions(false);
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
    formData.name.trim() !== "" &&
    formData.age.trim() !== "" &&
    formData.gender !== "" &&
    formData.district !== "" &&
    formData.dong !== "";

  const isPasswordMatch = formData.password === formData.confirmPassword;
  const isPasswordValid = formData.password.length >= 8;

  const isStep2Valid =
    formData.id.trim() !== "" && isPasswordValid && isPasswordMatch;

  const isStep3Valid = formData.selectedCategories.size === 3;

  const renderFormStep = () => {
    switch (step) {
      case 1: {
        const districts = Object.keys(dongData);
        const currentDongs = formData.district
          ? dongData[formData.district]
          : [];
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
                {formData.gender || "성별"}
                <span className="arrow">{showGenderOptions ? "▲" : "▼"}</span>
              </div>
              {showGenderOptions && (
                <div className="options-list">
                  <div
                    className="option-item"
                    onClick={() => handleGenderSelect("남자")}
                  >
                    남자
                  </div>
                  <div
                    className="option-item"
                    onClick={() => handleGenderSelect("여자")}
                  >
                    여자
                  </div>
                  <div
                    className="option-item"
                    onClick={() => handleGenderSelect("기타")}
                  >
                    기타
                  </div>
                </div>
              )}
            </div>
            <div className="select-wrap two-col">
              <div className="select-group">
                <div className="select-box" onClick={toggleDistrictOptions}>
                  {formData.district || "구"}
                  <span className="arrow">
                    {showDistrictOptions ? "▲" : "▼"}
                  </span>
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
                  {formData.dong || "동"}
                  <span className="arrow">{showDongOptions ? "▲" : "▼"}</span>
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
                      <div className="option-item disabled">
                        구를 먼저 선택해주세요.
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            <button
              className="btn-submit"
              onClick={() => setStep(2)}
              disabled={!isStep1Valid}
            >
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
              <button className="btn-check">중복 검사</button>
            </div>
            <div className="input-field pw-field">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="비밀번호"
                value={formData.password}
                onChange={handleChange}
              />
              <span
                className="toggle-pw"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeShow /> : <EyeHide />}
              </span>
            </div>
            {!isPasswordValid && formData.password.length > 0 && (
              <p className="msg-error">
                비밀번호는 영문과 숫자를 포함하여 8자 이상이어야 합니다.
              </p>
            )}
            <div className="input-field pw-field">
              <input
                type={showConfirmPassword ? "text" : "password"}
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
            <button
              className="btn-submit"
              onClick={() => setStep(3)}
              disabled={!isStep2Valid}
            >
              다음으로
            </button>
          </>
        );
      }
      case 3: {
        return (
          <>
            <div className="category-wrap">
              <p className="category-text">
                마지막으로 카테고리 3가지를 선택해주세요.
              </p>
              <div className="category-grid">
                {categories.map((cat) => (
                  <div
                    key={cat}
                    className={`category-item ${
                      formData.selectedCategories.has(cat) ? "active" : ""
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
              onClick={() => alert("회원가입 완료!")}
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
    <div className="wrap">
      <div className="card">
        <div className="logo-section">
          <HcbcLogo />
          <p className="logo-text">HCBC</p>
        </div>
        {renderFormStep()}
      </div>
    </div>
  );
};

export default App;
