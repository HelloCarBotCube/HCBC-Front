import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './User.css';
import profileImg from '../assets/profile-h.svg';

const API_BASE_URL = 'http://gsmsv-1.yujun.kr:27919';

const DEFAULT_USER = {
  name: '한국',
  handle: '@h4.zx7',
  tags: ['🔞', '영화', '음악', '남자', '16살', '광산구 평동'],
};

const CATEGORY_LABELS = {
  EXERCISE: '운동',
  RESTAURANT: '맛집',
  ANIMAL: '동물',
  TRIP: '여행',
  GAME: '게임',
  LEADING: '리딩',
  SEXUAL_PLEASURE: '🔞',
  MUSIC: '음악',
  MOVIE: '영화',
  ANIMATION: '애니메이션',
  WEBTOON: '웹툰',
  EXTROVERT: '외향적',
  INTROVERT: '내향적',
  STUDY: '공부',
};

const GENDER_LABELS = {
  MALE: '남자',
  FEMALE: '여자',
  OTHER: '기타',
};

export default function User() {
  const [user, setUser] = useState(DEFAULT_USER);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyProfile();
  }, []);

  const fetchMyProfile = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      
      if (!accessToken) {
        console.error('토큰이 없습니다');
        loadFromLocalStorage();
        setLoading(false);
        return;
      }
      
      const response = await fetch(`${API_BASE_URL}/api/user/myprofile`, {
        method: 'GET',
        headers: {
          'accessToken': accessToken,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 401) {
        console.error('토큰 없음/만료/무효');
        loadFromLocalStorage();
        setLoading(false);
        return;
      }

      if (response.status === 404) {
        console.error('내 프로필 없음');
        loadFromLocalStorage();
        setLoading(false);
        return;
      }

      if (!response.ok) {
        throw new Error(`프로필 조회 실패: ${response.status}`);
      }

      const data = await response.json();
      
      const tags = [];
      
      if (data.gender) {
        tags.push(GENDER_LABELS[data.gender] || data.gender);
      }
      
      if (data.age) {
        tags.push(`${data.age}살`);
      }
      
      if (Array.isArray(data.categories)) {
        data.categories.forEach(cat => {
          tags.push(CATEGORY_LABELS[cat] || cat);
        });
      }
      
      if (data.address) {
        tags.push(data.address);
      }

      setUser({
        name: data.name || DEFAULT_USER.name,
        handle: data.loginId ? `@${data.loginId}` : DEFAULT_USER.handle,
        tags: tags.length > 0 ? tags : DEFAULT_USER.tags,
      });
    } catch (error) {
      console.error('프로필 조회 오류:', error);
      loadFromLocalStorage();
    } finally {
      setLoading(false);
    }
  };

  const loadFromLocalStorage = () => {
    try {
      const raw = localStorage.getItem('hcbc_user');
      if (!raw) return;
      const u = JSON.parse(raw);
      setUser({
        name: u?.name?.trim() || DEFAULT_USER.name,
        handle: u?.id ? `@${u.id}` : DEFAULT_USER.handle,
        tags:
          Array.isArray(u?.categories) && u.categories.length > 0
            ? u.categories
            : DEFAULT_USER.tags,
      });
    } catch {}
  };

  const PER_ROW = 3;
  const tags1 = (user.tags || []).slice(0, PER_ROW);
  const tags2 = (user.tags || []).slice(PER_ROW, PER_ROW * 2);

  if (loading) {
    return (
      <div className="user-container">
        <div>로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="user-container">
      <aside className="user-card">
        <div className="user-wrap">
          <img src={profileImg} alt="아이콘" className="icon" />
        </div>

        <div className="user-body">
          <div className="user-name">{user.name}</div>
          <div className="user-id">{user.handle}</div>

          <div className="user-tag-card">
            <div className="user-tags user-tags1">
              {tags1.map((t, i) => (
                <span key={`t1-${i}`} className="user-tag">
                  {t}
                </span>
              ))}
            </div>
            {tags2.length > 0 && (
              <div className="user-tags user-tags2">
                {tags2.map((t, i) => (
                  <span key={`t2-${i}`} className="user-tag">
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>

          <button type="button" className="user-button" onClick={() => navigate('/Profile')}>
            프로필
          </button>
        </div>
      </aside>
    </div>
  );
}