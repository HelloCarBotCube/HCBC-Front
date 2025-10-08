import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';
import HIcon from '../assets/profile-h.svg';

const Profile = () => {
  const [profile, setProfile] = useState({
    name: '한국',
    id: '@h4.zx7',
    age: '16살',
    gender: '남자',
    location: '광산구 평동',
    category: '🔞 | 영화 | 음악',
  });

  const [editingField, setEditingField] = useState(null);
  const [tempValue, setTempValue] = useState('');

  const navigate = useNavigate();
  const goHome = () => navigate('/main');

  const handleEdit = (field) => {
    setEditingField(field);
    setTempValue(profile[field]);
  };

  const handleApply = (field) => {
    setProfile((prev) => ({ ...prev, [field]: tempValue }));
    setEditingField(null);
  };

  const renderField = (fieldKey, buttonLabel) => (
    <div
      className="p-field"
      key={fieldKey}
      onClick={() => {
        if (editingField !== fieldKey) handleEdit(fieldKey);
      }}
    >
      {editingField === fieldKey ? (
        <>
          <input
            type="text"
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.stopPropagation();
                handleApply(fieldKey);
              }
            }}
            autoFocus
          />
          <button
            className="p-apply"
            onClick={(e) => {
              e.stopPropagation();
              handleApply(fieldKey);
            }}
          >
            적용하기
          </button>
        </>
      ) : (
        <>
          <span>{profile[fieldKey]}</span>
          <button
            className="p-edit"
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(fieldKey);
            }}
          >
            {buttonLabel}
          </button>
        </>
      )}
    </div>
  );

  return (
    <div className="p-container">
      <button type="button" className="p-back" onClick={goHome}>
        ← 홈으로 가기
      </button>

      <div className="p-wrap">
        <div className="p-card">
          <div className="p-icon">
            <img src={HIcon} alt="profile icon" />
          </div>

          {renderField('name', '이름 변경')}
          {renderField('id', '아이디 변경')}
          {renderField('age', '나이 변경')}
          {renderField('gender', '성별 변경')}
          {renderField('location', '지역 변경')}
          {renderField('category', '카테고리 변경')}
        </div>
      </div>
    </div>
  );
};

export default Profile;
