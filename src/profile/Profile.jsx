import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';
import HIcon from '../assets/profile-h.svg';
import { getMyProfile, updateMyProfile } from '../api/profile';
import { getAccessToken } from '../utils/cookies';

const Profile = () => {
  const [profile, setProfile] = useState({
    name: '',
    loginId: '',
    age: '',
    gender: '',
    location: '',
    categories: [],
  });

  const [editingField, setEditingField] = useState(null);
  const [tempValue, setTempValue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const editingRef = useRef(null);

  const navigate = useNavigate();
  const goHome = () => navigate('/main');

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      navigate('/', { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const categoryOptions = [
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
    '내향형',
    '외향형',
    '애니메이션',
  ];

  // 카테고리 한글-영어 매핑 (백엔드와 통신용)
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
    내향형: 'INTROVERT',
    외향형: 'EXTROVERT',
    애니메이션: 'ANIMATION',
  };

  const categoryReverseMap = Object.fromEntries(
    Object.entries(categoryMap).map(([ko, en]) => [en, ko])
  );

  const genderMap = {
    MALE: '남자',
    FEMALE: '여자',
    OTHER: '기타',
  };

  const genderReverseMap = {
    남자: 'MALE',
    여자: 'FEMALE',
    기타: 'OTHER',
  };

  const execDaumPostcode = () => {
    if (window.daum && window.daum.Postcode) {
      new window.daum.Postcode({
        oncomplete: (data) => {
          const fullAddress = `${data.sido} ${data.sigungu} ${data.bname}`;
          setTempValue(fullAddress);
        },
      }).open();
    } else {
      alert('주소 검색 기능을 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await getMyProfile();

        const categoriesInKorean = Array.isArray(data.categories)
          ? data.categories.map((cat) => {
              const korean = categoryReverseMap[cat];
              return korean || cat;
            })
          : [];

        const newProfile = {
          name: data.name || '',
          loginId: data.loginId || '',
          age: data.age || '',
          gender: genderMap[data.gender] || data.gender || '',
          location: data.address || '',
          categories: categoriesInKorean,
        };

        setProfile(newProfile);
        setError(null);
      } catch (err) {
        setError('프로필을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleEdit = (field) => {
    setEditingField(field);

    if (field === 'categories') {
      const categoriesCopy = Array.isArray(profile.categories) ? [...profile.categories] : [];
      setTempValue(categoriesCopy);
    } else if (field === 'age') {
      setTempValue(profile.age.toString());
    } else if (field === 'location') {
      setTempValue(profile[field] || '');
      setTimeout(() => {
        execDaumPostcode();
      }, 0);
    } else {
      setTempValue(profile[field] || '');
    }
  };

  const handleApply = async (field) => {
    try {
      const categoriesInEnglish = profile.categories.map((cat) => categoryMap[cat] || cat);

      let payload = {};
      let newProfileState = {};

      if (field === 'age') {
        const newAge = parseInt(tempValue, 10);
        if (isNaN(newAge) || newAge <= 0 || newAge > 150) {
          alert('나이는 1~150 사이의 숫자를 입력해주세요.');
          return;
        }
        const genderInEnglish = genderReverseMap[profile.gender] || profile.gender;
        payload = {
          name: profile.name,
          gender: genderInEnglish,
          age: newAge,
          address: profile.location,
          categories: categoriesInEnglish,
        };
        newProfileState = { age: newAge };
      } else if (field === 'gender') {
        if (!['남자', '여자', '기타'].includes(tempValue)) {
          alert('올바른 성별을 선택해주세요.');
          return;
        }
        const genderInEnglish = genderReverseMap[tempValue] || tempValue;
        payload = {
          name: profile.name,
          gender: genderInEnglish,
          age: parseInt(profile.age, 10) || 0,
          address: profile.location,
          categories: categoriesInEnglish,
        };
        newProfileState = { gender: tempValue };
      } else if (field === 'location') {
        if (!tempValue || tempValue.trim() === '') {
          alert('주소를 입력해주세요.');
          return;
        }
        const genderInEnglish = genderReverseMap[profile.gender] || profile.gender;
        payload = {
          name: profile.name,
          gender: genderInEnglish,
          age: parseInt(profile.age, 10) || 0,
          address: tempValue,
          categories: categoriesInEnglish,
        };
        newProfileState = { location: tempValue };
      } else if (field === 'categories') {
        if (!Array.isArray(tempValue) || tempValue.length !== 3) {
          alert('카테고리는 정확히 3개를 선택해주세요.');
          return;
        }
        const newCategoriesInEnglish = tempValue.map((cat) => categoryMap[cat] || cat);
        const genderInEnglish = genderReverseMap[profile.gender] || profile.gender;

        payload = {
          name: profile.name,
          gender: genderInEnglish,
          age: parseInt(profile.age, 10) || 0,
          address: profile.location,
          categories: newCategoriesInEnglish,
        };
        newProfileState = { categories: tempValue };
      }

      const response = await updateMyProfile(payload);

      setProfile((prev) => {
        const updated = { ...prev, ...newProfileState };
        return updated;
      });
      setEditingField(null);
      setTempValue([]);
      alert('프로필이 수정되었습니다.');
    } catch (err) {
      alert('프로필 수정에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleCancel = () => {
    setEditingField(null);
    if (editingField === 'categories') {
      setTempValue([]);
    } else {
      setTempValue('');
    }
  };

  const handleCategoryClick = (category) => {
    if (editingField !== 'categories') return;

    // tempValue가 배열인지 확인하고, 아니면 빈 배열로 초기화
    const currentCategories = Array.isArray(tempValue) ? tempValue : [];

    const isSelected = currentCategories.includes(category);

    if (isSelected) {
      // 이미 선택된 카테고리면 제거
      const newCategories = currentCategories.filter((c) => c !== category);
      setTempValue(newCategories);
    } else {
      // 선택되지 않은 카테고리면 추가
      if (currentCategories.length >= 3) {
        alert('카테고리는 최대 3개까지 선택할 수 있습니다.');
        return;
      }
      const newCategories = [...currentCategories, category];
      setTempValue(newCategories);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        editingField !== null &&
        editingRef.current &&
        !editingRef.current.contains(event.target)
      ) {
        handleCancel();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [editingField]);

  const renderTextField = (fieldKey, label, editable = true) => (
    <div
      className="p-field"
      key={fieldKey}
      ref={editingField === fieldKey ? editingRef : null}
      onClick={() => {
        if (editable && editingField !== fieldKey) {
          handleEdit(fieldKey);
        }
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
              } else if (e.key === 'Escape') {
                e.stopPropagation();
                handleCancel();
              }
            }}
            autoFocus
            readOnly={fieldKey === 'location'}
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
          <span>{fieldKey === 'age' ? `${profile[fieldKey]}살` : profile[fieldKey]}</span>
          {editable && (
            <button
              className="p-edit"
              onClick={(e) => {
                e.stopPropagation();
                handleEdit(fieldKey);
              }}
            >
              {label}
            </button>
          )}
        </>
      )}
    </div>
  );

  const renderCategoryField = () => (
    <div className="p-category-section" ref={editingField === 'categories' ? editingRef : null}>
      {editingField === 'categories' ? (
        <>
          <div className="p-category-grid">
            {categoryOptions.map((category) => (
              <div
                key={category}
                className={`p-category-item ${
                  (Array.isArray(tempValue) ? tempValue : []).includes(category) ? 'active' : ''
                }`}
                onClick={() => handleCategoryClick(category)}
              >
                {category}
              </div>
            ))}
          </div>
          <div
            style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'center' }}
          >
            <button
              className="p-cancel"
              onClick={(e) => {
                e.stopPropagation();
                handleCancel();
              }}
            >
              취소
            </button>
            <button
              className="p-apply"
              onClick={(e) => {
                e.stopPropagation();
                handleApply('categories');
              }}
            >
              적용하기
            </button>
          </div>
        </>
      ) : (
        <>
          <div
            className="p-field"
            onClick={(e) => {
              e.stopPropagation();
              handleEdit('categories');
            }}
          >
            <span>관심 카테고리</span>
            <button className="p-edit">카테고리 변경</button>
          </div>
          <div className="p-category-grid" style={{ marginTop: '10px' }}>
            {profile.categories && profile.categories.length > 0 ? (
              profile.categories.map((category) => (
                <div
                  key={category}
                  className="p-category-item active"
                  style={{ cursor: 'default' }}
                >
                  {category}
                </div>
              ))
            ) : (
              <span className="p-no-category" style={{ color: '#888' }}>
                선택된 카테고리가 없습니다.
              </span>
            )}
          </div>
        </>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="p-container">
        <div className="p-wrap">
          <div style={{ textAlign: 'center', padding: '50px' }}>로딩 중...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-container">
        <div className="p-wrap">
          <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-container">
      <button type="button" className="p-back" onClick={goHome}>
        &lt; 홈으로 가기
      </button>

      <div className="p-wrap">
        <div className="p-card">
          <div className="p-content">
            <div className="p-icon">
              <img src={HIcon} alt="profile icon" />
            </div>

            <div className="p-profile-info">
              <div className="p-conTent">
                <div className="p-name-id">
                  <div className="p-name">{profile.name}</div>
                  <div className="p-id">@{profile.loginId}</div>
                </div>
              </div>
              <div className="p-textFields">
                {renderTextField('age', '나이 변경')}
                {renderTextField('gender', '성별 변경')}
                {renderTextField('location', '지역 변경')}
                {renderCategoryField()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
