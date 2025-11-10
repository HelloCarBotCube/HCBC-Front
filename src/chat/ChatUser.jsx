import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import useChatStore from '../store/useChatStore';
import websocketService from '../services/websocket';
import { deleteRoom, getUserProfile } from '../services/chatApi';
import styles from './ChatUser.module.css';
import profileImg from '../assets/profile-h.svg';

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

const DEFAULT_USER = {
  name: '상대방',
  handle: '@unknown',
  tags: ['채팅 중'],
  age: null,
  address: null,
  gender: null,
};

export default function User() {
  const { currentRoom, leaveRoom, removeRoom } = useChatStore();
  const [user, setUser] = useState(DEFAULT_USER);
  const [showExitModal, setShowExitModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const loadUserProfile = async () => {
      if (!currentRoom) {
        setUser(DEFAULT_USER);
        return;
      }

      // 기본 정보 먼저 표시
      const basicInfo = {
        name: currentRoom.otherUserName || '상대방',
        handle: currentRoom.opponentId ? `@${currentRoom.opponentId}` : '@unknown',
        tags: ['채팅 중'],
        age: null,
        address: null,
        gender: null,
      };
      setUser(basicInfo);

      // API로 상세 정보 불러오기
      if (currentRoom.opponentUserId) {
        try {
          const profile = await getUserProfile(currentRoom.opponentUserId);

          // 태그 생성
          const tags = [];
          if (profile.gender) {
            tags.push(GENDER_LABELS[profile.gender] || profile.gender);
          }
          if (profile.age) {
            tags.push(`${profile.age}살`);
          }
          if (profile.address) {
            tags.push(profile.address);
          }
          if (Array.isArray(profile.categories)) {
            profile.categories.forEach((cat) => {
              tags.push(CATEGORY_LABELS[cat] || cat);
            });
          }

          setUser({
            name: profile.name || currentRoom.otherUserName || '상대방',
            handle: profile.loginId ? `@${profile.loginId}` : basicInfo.handle,
            tags: tags.length > 0 ? tags : ['채팅 중'],
            age: profile.age,
            address: profile.address,
            gender: profile.gender,
          });
        } catch (error) {
          console.error('상대방 프로필 불러오기 실패:', error);
        }
      }
    };

    loadUserProfile();
  }, [currentRoom]);

  const handleExitChat = () => {
    if (!currentRoom) {
      navigate('/main');
      return;
    }
    setShowExitModal(true);
  };

  const handleConfirmExit = async () => {
    setShowExitModal(false);

    if (currentRoom?.roomId) {
      try {
        await deleteRoom(currentRoom.roomId);
        websocketService.leaveRoom(currentRoom.roomId);
        removeRoom(currentRoom.roomId);
      } catch (error) {
        console.error('채팅방 삭제 실패:', error);
        websocketService.leaveRoom(currentRoom.roomId);
        removeRoom(currentRoom.roomId);
      }
    }

    leaveRoom();
    navigate('/main', { replace: true });
  };

  const PER_ROW = 3;
  const tags1 = (user.tags || []).slice(0, PER_ROW);
  const tags2 = (user.tags || []).slice(PER_ROW, PER_ROW * 2);

  return (
    <div className={styles['user-container']}>
      <aside className={styles['user-card']}>
        <div className={styles['user-wrap']}>
          <img src={profileImg} alt="아이콘" className={styles.icon} />
        </div>

        <div className={styles['user-body']}>
          <div className={styles['user-name']}>{user.name}</div>
          <div className={styles['user-id']}>{user.handle}</div>

          <div className={styles['user-tag-card']}>
            <div className={styles['user-tags']}>
              {tags1.map((t, i) => (
                <span key={`t1-${i}`} className={styles['user-tag']}>
                  {t}
                </span>
              ))}
            </div>
            {tags2.length > 0 && (
              <div className={`${styles['user-tags']} ${styles['user-tags2']}`}>
                {tags2.map((t, i) => (
                  <span key={`t2-${i}`} className={styles['user-tag']}>
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
        <button className={styles['user-button']} onClick={handleExitChat}>
          채팅 나가기
        </button>
      </aside>

      {showExitModal && (
        <div className={styles['exit']}>
          <div className={styles['exit-modal']}>
            <h3>대화를 끝내시겠어요?</h3>
            <p>
              채팅을 종료하면 이 대화는 더 이상 볼 수 없어요.
              <br />
              계속 진행할까요?
            </p>
            <div className={styles['modal-actions']}>
              <button className={styles.confirm} onClick={handleConfirmExit}>
                채팅 종료
              </button>
              <button className={styles.cancel} onClick={() => setShowExitModal(false)}>
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
