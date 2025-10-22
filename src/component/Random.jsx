import styles from './Random.module.css';

export default function Random() {
  return (
    <div className={styles.mainContainer}>
    <div className={styles.all}>
      <svg
        className={styles.logo}
        width="2116"
        height="2116"
        viewBox="0 0 216 216"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0 34.964C0 15.6539 15.6539 0 34.964 0H181.036C200.346 0 216 15.6539 216 34.964V181.036C216 200.346 200.346 216 181.036 216H34.964C15.6539 216 0 200.346 0 181.036V34.964Z"
          fill="url(#paint0_linear_122_454)"
        />
        <path
          d="M58.7914 171.194C54.5002 171.194 51.0216 167.716 51.0216 163.424V52.5755C51.0216 48.2844 54.5002 44.8058 58.7914 44.8058H77.5375C81.8286 44.8058 85.3073 48.2844 85.3073 52.5755V86.4065C85.3073 90.6976 88.7859 94.1763 93.0771 94.1763H122.923C127.214 94.1763 130.693 90.6976 130.693 86.4065V52.5755C130.693 48.2844 134.171 44.8058 138.462 44.8058H157.209C161.5 44.8058 164.978 48.2844 164.978 52.5755V163.424C164.978 167.716 161.5 171.194 157.209 171.194H138.462C134.171 171.194 130.693 167.716 130.693 163.424V129.594C130.693 125.302 127.214 121.824 122.923 121.824H93.0771C88.7859 121.824 85.3073 125.302 85.3073 129.594V163.424C85.3073 167.716 81.8286 171.194 77.5375 171.194H58.7914Z"
          fill="white"
        />
        <defs>
          <linearGradient
            id="paint0_linear_122_454"
            x1="108"
            y1="0"
            x2="108"
            y2="216"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="#FF649B" />
            <stop offset="1" stop-color="#FF9CB9" />
          </linearGradient>
        </defs>
      </svg>
      <div className={styles.queto}>오늘은 어떤 사람을 만나게 될까요?</div>
      <div className={styles.longQueto}>
        어떤 인연이 기다리고 있을지 지금 확인해 보세요.<br></br> 대화는 우연처럼 찾아옵니다.
      </div>
      <button className={styles.randomButton}>랜덤매칭</button>
    </div>
    </div>
  );
}
