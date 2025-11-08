import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";
import HIcon from "../assets/profile-h.svg";
import { getMyProfile, updateMyProfile } from "../api/profile";

const Profile = () => {
  const [profile, setProfile] = useState({
    name: "",
    loginId: "",
    age: "",
    gender: "",
    location: "",
    categories: [],
  });

  const [editingField, setEditingField] = useState(null);
  const [tempValue, setTempValue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const editingRef = useRef(null);

  const navigate = useNavigate();
  const goHome = () => navigate("/main");

  useEffect(() => {
    const script = document.createElement('script');
    script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // 카테고리 옵션들
  const categoryOptions = [
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
    "내향형",
    "외향형",
    "애니메이션",
  ];

  // 카테고리 한글-영어 매핑 (백엔드와 통신용)
  const categoryMap = {
    운동: "EXERCISE",
    맛집: "RESTAURANT",
    동물: "ANIMAL",
    여행: "TRIP",
    영화: "MOVIE",
    게임: "GAME",
    독서: "LEADING",
    공부: "STUDY",
    음악: "MUSIC",
    "🔞": "SEXUAL_PLEASURE",
    웹툰: "WEBTOON",
    내향형: "INTROVERT",
    외향형: "EXTROVERT",
    애니메이션: "ANIMATION",
  };

  // 영어-한글 역매핑
  const categoryReverseMap = Object.fromEntries(
    Object.entries(categoryMap).map(([ko, en]) => [en, ko])
  );

  // 다음 주소 API 실행 함수
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

  // 프로필 조회
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await getMyProfile();
        console.log("=== 백엔드 응답 데이터 ===", data);
        console.log("백엔드 categories:", data.categories);

        // 백엔드에서 받은 영어 카테고리를 한글로 변환
        const categoriesInKorean = Array.isArray(data.categories)
          ? data.categories.map((cat) => {
              const korean = categoryReverseMap[cat];
              console.log(`${cat} → ${korean}`);
              return korean || cat;
            })
          : [];

        console.log("변환된 한글 카테고리:", categoriesInKorean);

        const newProfile = {
          name: data.name || "",
          loginId: data.loginId || "",
          age: data.age || "",
          gender: data.gender || "",
          location: data.address || "",
          categories: categoriesInKorean,
        };

        console.log("=== 설정할 프로필 상태 (한글 변환 후) ===", newProfile);
        setProfile(newProfile);
        setError(null);
      } catch (err) {
        console.error("프로필 조회 실패:", err);
        setError("프로필을 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleEdit = (field) => {
    console.log("=== 편집 모드 시작 ===");
    console.log("편집할 필드:", field);
    console.log("현재 profile 상태:", profile);

    setEditingField(field);

    if (field === "categories") {
      // 배열을 복사해서 설정
      const categoriesCopy = Array.isArray(profile.categories)
        ? [...profile.categories]
        : [];
      console.log("편집 시작 - 현재 카테고리:", categoriesCopy);
      setTempValue(categoriesCopy);
    } else if (field === "age") {
      setTempValue(profile.age.toString());
    } else if (field === "location") {
      // 주소 필드인 경우 현재 주소를 tempValue에 설정하고 바로 다음 주소 API 실행
      setTempValue(profile[field] || "");
      // setTimeout을 사용하여 상태 업데이트 후 API 실행
      setTimeout(() => {
        execDaumPostcode();
      }, 0);
    } else {
      setTempValue(profile[field] || "");
    }
  };

  const handleApply = async (field) => {
    try {
      console.log("=== 적용하기 시작 ===");
      console.log("수정할 필드:", field);
      console.log("tempValue:", tempValue);
      console.log("현재 profile:", profile);

      // 현재 카테고리를 영어로 변환 (모든 요청에서 사용)
      const categoriesInEnglish = profile.categories.map(
        (cat) => categoryMap[cat] || cat
      );

      let payload = {};
      let newProfileState = {};

      if (field === "age") {
        const newAge = parseInt(tempValue, 10);
        if (isNaN(newAge) || newAge <= 0) {
          alert("유효한 나이를 입력해주세요.");
          return;
        }
        payload = {
          name: profile.name,
          gender: profile.gender,
          age: newAge,
          address: profile.location,
          categories: categoriesInEnglish,
        };
        newProfileState = { age: newAge };
      } else if (field === "location") {
        payload = {
          name: profile.name,
          gender: profile.gender,
          age: parseInt(profile.age, 10) || 0,
          address: tempValue,
          categories: categoriesInEnglish,
        };
        newProfileState = { location: tempValue };
      } else if (field === "categories") {
        // 카테고리 업데이트 로직 - 한글을 영어로 변환해서 전송
        const newCategoriesInEnglish = tempValue.map(
          (cat) => categoryMap[cat] || cat
        );
        console.log("한글 카테고리:", tempValue);
        console.log("영어로 변환:", newCategoriesInEnglish);

        payload = {
          name: profile.name,
          gender: profile.gender,
          age: parseInt(profile.age, 10) || 0,
          address: profile.location,
          categories: newCategoriesInEnglish,
        };
        newProfileState = { categories: tempValue }; // 화면에는 한글로 표시
      }

      console.log("수정 요청 데이터:", payload);
      const response = await updateMyProfile(payload);
      console.log("수정 응답 데이터:", response);

      setProfile((prev) => {
        const updated = { ...prev, ...newProfileState };
        console.log("업데이트된 profile:", updated);
        return updated;
      });
      setEditingField(null);
      setTempValue([]);
      alert("프로필이 수정되었습니다.");
    } catch (err) {
      console.error("프로필 수정 실패:", err);
      alert("프로필 수정에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const handleCancel = () => {
    setEditingField(null);
    if (editingField === "categories") {
      setTempValue([]);
    } else {
      setTempValue("");
    }
  };

  const handleCategoryClick = (category) => {
    if (editingField !== "categories") return;

    // tempValue가 배열인지 확인하고, 아니면 빈 배열로 초기화
    const currentCategories = Array.isArray(tempValue) ? tempValue : [];
    console.log("클릭 전 카테고리:", currentCategories);
    console.log("클릭한 카테고리:", category);

    const isSelected = currentCategories.includes(category);
    console.log("선택 여부:", isSelected);

    if (isSelected) {
      // 이미 선택된 카테고리면 제거
      const newCategories = currentCategories.filter((c) => c !== category);
      console.log("제거 후:", newCategories);
      setTempValue(newCategories);
    } else {
      // 선택되지 않은 카테고리면 추가
      console.log("현재 선택된 개수:", currentCategories.length);
      if (currentCategories.length >= 3) {
        alert("카테고리는 최대 3개까지 선택할 수 있습니다.");
        return;
      }
      const newCategories = [...currentCategories, category];
      console.log("추가 후:", newCategories);
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

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
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
              if (e.key === "Enter") {
                e.stopPropagation();
                handleApply(fieldKey);
              } else if (e.key === "Escape") {
                e.stopPropagation();
                handleCancel();
              }
            }}
            autoFocus
            readOnly={fieldKey === "location"}
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
          <span>
            {fieldKey === "age" ? `${profile[fieldKey]}살` : profile[fieldKey]}
          </span>
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
    <div
      className="p-category-section"
      ref={editingField === "categories" ? editingRef : null}
    >
      {editingField === "categories" ? (
        <>
          <div className="p-category-grid">
            {categoryOptions.map((category) => (
              <div
                key={category}
                className={`p-category-item ${
                  (Array.isArray(tempValue) ? tempValue : []).includes(category)
                    ? "active"
                    : ""
                }`}
                onClick={() => handleCategoryClick(category)}
              >
                {category}
              </div>
            ))}
          </div>
          <div style={{ marginTop: "20px", display: "flex", gap: "10px", justifyContent: "center" }}>
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
                handleApply("categories");
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
              handleEdit("categories");
            }}
          >
            <span>관심 카테고리</span>
            <button className="p-edit">카테고리 변경</button>
          </div>
          <div className="p-category-grid" style={{ marginTop: "10px" }}>
            {profile.categories && profile.categories.length > 0 ? (
              profile.categories.map((category) => (
                <div
                  key={category}
                  className="p-category-item active"
                  style={{ cursor: "default" }}
                >
                  {category}
                </div>
              ))
            ) : (
              <span className="p-no-category" style={{ color: "#888" }}>
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
          <div style={{ textAlign: "center", padding: "50px" }}>로딩 중...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-container">
        <div className="p-wrap">
          <div style={{ textAlign: "center", padding: "50px", color: "red" }}>
            {error}
          </div>
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
                {renderTextField("age", "나이 변경")}
                {renderTextField("gender", "")}
                {renderTextField("location", "지역 변경")}
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
