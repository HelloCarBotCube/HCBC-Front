import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './ChatUser.css';
import profileImg from '../assets/profile-h.svg';

const DEFAULT_USER = {
  name: '한국',
  handle: '@h4.zx7',
  tags: ['🔞', '영화', '음악', '남자', '16살', '광산구 평동'],
};

export default function User() {
  const [user, setUser] = useState(DEFAULT_USER);
  const [showExitModal, setShowExitModal] = useState(false);

  const navigate = useNavigate();
  const handleExitChat = () => setShowExitModal(true);

  const handleConfirmExit = () => {
    setShowExitModal(false);
    navigate('/main'); // 홈으로 이동
  };

  // handleConfirmExit 삭제 (부모에서 처리)
  useEffect(() => {
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
  }, []);

  const PER_ROW = 3;
  const tags1 = (user.tags || []).slice(0, PER_ROW);
  const tags2 = (user.tags || []).slice(PER_ROW, PER_ROW * 2);

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
        </div>
        <button className="exit-chat" onClick={handleExitChat}>
          !채팅 나가기!
        </button>
      </aside>

      {showExitModal && (
        <div className="modal-overlay">
          <div className="exit-modal">
            <h3>대화를 끝내시겠어요?</h3>
            <p>
              채팅을 종료하면 이 대화는 더 이상 볼 수 없어요.
              <br />
              계속 진행할까요?
            </p>
            <div className="modal-actions">
              <button className="confirm" onClick={handleConfirmExit}>
                채팅 종료
              </button>
              <button className="cancel" onClick={() => setShowExitModal(false)}>
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
