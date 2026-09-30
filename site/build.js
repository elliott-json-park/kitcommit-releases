// Kit Commit 소개 사이트 만들기: `node site/build.js` → docs/index.html (영어, 기본) · docs/ko/index.html (한국어)
// GitHub Pages 는 main 브랜치의 docs/ 를 그대로 보여 준다. 문구는 아래 TEXT, 그림 장 수는 SPRITES.
// 그림(docs/assets/sprites/*.png)은 앱의 고양이 렌더러로 뽑은 48px 가로 띠(1초 12장)다. 새 모션을 넣으려면 앱 쪽에서 다시 뽑아 온다.
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', 'docs');
const REL = 'https://github.com/elliott-json-park/kitcommit-releases/releases/latest';
const REPO = 'https://github.com/elliott-json-park/kitcommit-releases';

// 그림 이름 → 장 수 (docs/assets/sprites/<이름>.png)
const SPRITES = {"mood-idle":48,"mood-active":36,"mood-thinking":36,"mood-waiting":36,"mood-sleeping":48,"walk":12,"m-sojuchug":65,"m-darkmode":62,"m-stockup":67,"m-deployrocket":62,"m-cicheck":43,"m-enterwait":62,"m-staticfur":58,"m-donebell":46,"m-giantfist":65,"m-ufo":65,"m-karaoke":48,"m-coffee":53,"a-happy":14,"a-wave":25,"a-eat":88,"a-yawn":34,"a-pounce":13,"a-groom":58,"a-levelup":30,"held":24,"mood-hungry":36,"mood-sleepy":36,"m-stretch":46,"m-fishthink":48,"m-hooray":34,"m-nodoff":50,"m-foodsign":29,"m-zoomies":31,"m-box":48,"m-bath":53,"m-blowkiss":34,"m-melt":41,"m-startle":26,"m-slowblink":36,"m-tapfoot":36,"m-pray":29,"c-magicalgirl":30,"c-holyknight":30,"c-sunwukong":30,"c-dinosuit":30,"c-ironcat":30,"c-mondaydev":30,"c-overtimer":30,"c-seonbi":30,"c-beesuit":30,"c-nyangwarts":30,"f-pigeon":48,"f-hedgehog":48,"f-raccoon":48,"f-dust":36,"f-coal":36,"f-tofu":36,"m-snot":55,"m-raisehand":19,"m-fooddream":58,"t-yarn":29,"t-tangle":31,"t-kick":34,"t-high":43,"t-bat":16,"a-nibble":16,"t-chatter":14,"t-leap":11,"t-pop":8,"t-swipe":8,"t-float":29,"t-wet":17,"t-sulk":24,"t-yay":14,"t-deadpan":24,"f-bolt":36,"f-dondon":36};

// 앱 i18n 의 이름 [한, 영]
const NAMES = {"m":{"sojuchug":["소주 병나발","Soju straight from the bottle"],"darkmode":["다크모드 전환","Dark mode switch"],"stockup":["주식 차트 떡상","Stock to the moon"],"deployrocket":["배포 성공 로켓","Deploy rocket"],"cicheck":["초록 체크 뱃지","Green CI check"],"enterwait":["엔터 키 대기","Waiting on Enter"],"staticfur":["정전기 폭발","Static shock"],"donebell":["끝났다옹 종 울리기","Done! bell"],"giantfist":["거대 주먹 쾅쾅","Giant fist smash"],"ufo":["UFO 납치","UFO abduction"],"karaoke":["노래방 열창","Karaoke belter"],"coffee":["커피 한 잔","Coffee break"],"stretch":["기지개","Big stretch"],"fishthink":["생선 상상하기","Daydreaming of fish"],"hooray":["임무 완료","Mission complete"],"nodoff":["꾸벅꾸벅","Nodding off"],"foodsign":["\"FOOD\" 피켓 시위","\"FOOD\" protest"],"zoomies":["우다다","Zoomies"],"box":["박스 들어가기","If it fits, I sits"],"bath":["거품 목욕","Bubble bath"],"blowkiss":["하트 날리기","Blowing hearts"],"melt":["녹아내리기","Melting"],"startle":["화들짝","Startled"],"slowblink":["고양이 키스 (천천히 깜빡)","Slow blink"],"tapfoot":["발 동동 시계 보기","Foot-tapping clock watch"],"pray":["제발요 기도","Pretty please"],"snot":["코풍선","Snot bubble"],"raisehand":["저요 저요!","Me! Me!"],"fooddream":["맛있는 상상","Daydreaming of food"]},"c":{"magicalgirl":["야옹나라 냥냥공주","Magical girl ☆ Lumi"],"holyknight":["츄르를 수호하는 신의 기사단","Holy Knight Sworn to Guard Churu"],"sunwukong":["근두운 할부 중인 제천대성","Great Sage on a Cloud Payment Plan"],"dinosuit":["크아앙 공룡 잠옷","Rawr dino onesie"],"ironcat":["아이언냥 Mk. 1","Iron Cat Mk. 1"],"mondaydev":["월요일 아침 배포 개발자","Monday-deploy developer"],"overtimer":["야근 요정 김대리 (사원증 포함)","Overtime office fairy"],"seonbi":["과거 낙방 7수 선비","Joseon scholar (7th attempt)"],"beesuit":["꿀 빠는 꿀벌","Busy bee suit"],"nyangwarts":["빗자루 면허 없는 냥그와트 1학년","Meowgwarts First Year (No Broom License)"]},"f":{"pigeon":["구구단","Times Table"],"hedgehog":["고도리","Godori"],"raccoon":["라면이","Ramen"],"dust":["먼지","Dusty"],"coal":["연탄이","Coal"],"tofu":["두부","Tofu"],"bolt":["최번개","Bolt Choi"],"dondon":["돈돈까스","Don Donkatsu"]}};

// 동네 친구 소개 (앱 i18n 의 fr.<id>.nick · species · home · like) [한, 영]
const FRIENDS = {
  dust: { nick: ['우리는 광활한 우주의', 'We are all cosmic'], who: ['회색 줄무늬 고양이 · 소파 밑 (본인 말로는 우주)', 'Gray tabby cat · under the sofa (space, he says)'], like: ['햇볕 드는 창틀, 낮잠', 'Sunny windowsills, naps'] },
  coal: { nick: ['까만데 뜨거운 남자', 'Black but burning hot'], who: ['까만 고양이 · 골목 끝 보일러실', 'Black cat · the boiler room down the alley'], like: ['따뜻한 곳, 폼 잡기', 'Warm spots, looking cool'] },
  tofu: { nick: ['후', 'Round-headed'], who: ['하얀 고양이 · 2층 창가', 'White cat · a second-floor window'], like: ['조용한 곳, 부드러운 담요', 'Quiet places, soft blankets'] },
  bolt: { nick: ['노란색 정전기 고양이', 'Yellow static cat'], who: ['노란 고양이 · 멀티탭 옆', 'Yellow cat · next to the power strip'], like: ['충전기 옆자리, 털 부비기', 'Sleeping by chargers, rubbing fur'] },
  dondon: { nick: ['츄르 공장 공장장', 'Churu factory boss'], who: ['샴 고양이 · 언덕 위 츄르 공장 꼭대기 층', 'Siamese cat · top floor of the churu factory'], like: ['대리석 스크래처, 반짝이는 것', 'Marble scratchers, shiny things'] },
  pigeon: { nick: ['눈치 백단 바위처럼 단단', 'Street-smart, rock-solid'], who: ['비둘기 · 탑골공원', 'Pigeon · the park downtown'], like: ['과자 부스러기, 걷기', 'Crumbs, walking'] },
  hedgehog: { nick: ['방배동 타짜', 'The Bangbae hustler'], who: ['고슴도치 · 방배동 어느 화분 밑', 'Hedgehog · under a flowerpot in Bangbae'], like: ['딱지치기, 확률 계산', 'Card flipping, odds'] },
  raccoon: { nick: ['편의점 뒤 단골', 'Convenience-store regular'], who: ['너구리 · 편의점 뒤', 'Raccoon · behind the convenience store'], like: ['컵라면 국물, 밤 산책', 'Cup noodle broth, night walks'] },
};
// 밥 주기에서 떨어지는 음식 (docs/assets/sprites/i-<이름>.png, 16px 도트)
const FOODS = ['churu', 'milk', 'anchovy', 'tuna', 'chicken', 'salmon', 'sushi', 'ramen', 'omurice', 'bento', 'creamtaiyaki', 'tempura', 'fishgrill', 'cookiemilk'];

// 모션 갤러리에 거는 순서 (새 것 먼저)
const GALLERY = ['sojuchug', 'darkmode', 'stockup', 'deployrocket', 'cicheck', 'enterwait', 'staticfur', 'donebell', 'giantfist', 'ufo', 'karaoke', 'raisehand', 'fooddream', 'snot', 'zoomies', 'box', 'bath', 'coffee', 'stretch', 'hooray', 'blowkiss', 'melt', 'slowblink', 'startle', 'fishthink', 'foodsign', 'tapfoot', 'pray'];

const TEXT = {
  ko: {
    lang: 'ko', other: 'en', otherLabel: 'English',
    title: '킷커밋 — AI와 일할수록 자라는 도트 고양이',
    desc: 'Claude Code 나 Codex 를 쓸수록 자라는 데스크톱 도트 고양이. 화면 구석에서 같이 일하고, 작업이 끝나면 알려 주고, 점심·휴식·잠잘 시간을 챙겨 줘요. 무료.',
    nav: ['놀아 보기', '고양이의 하루', '모션', '받기'],
    eyebrow: 'Claude Code · Codex 데스크톱 펫',
    h1: 'AI와 일할수록 자라는<br><em>도트 고양이</em>',
    lead: '토큰을 먹고 자라는 작은 고양이가 화면 구석에서 같이 일해요. 답이 끝나면 박수를 치고, 허락이 필요하면 손을 흔들고, 새벽 1시엔 이제 자자고 해요.',
    dlWin: '윈도우용 받기', dlMac: '맥용 받기', free: '무료',
    meta: '윈도우 10/11 · macOS (M칩·인텔) · 대화 내용은 읽지 않아요',
    hint: '<b>▸</b> 고양이를 눌러 쓰다듬고, 끌어서 들어 올려 보세요',
    viewMobile: '모바일', viewDesktop: '데스크톱', swipe: '◂ 옆으로 넘겨 보세요 ▸',
    termTitle: 'claude — ~/my-app',
    names: { cat: '클로', dur: '2시간' },
    lines: {
      session: ['새 세션이다! 오늘은 뭘 만들어 볼까?', '좋아, 시작해 보자! 뭐부터 건드려 볼까?', '클로 준비 완료! 업무 시작이다!!'],
      poke: ['ㅎㅎ', '간지러워!', '파이팅!', '좋아좋아', '골골골…'],
      held: ['으앗 높다!', '내려 줘~', '어디 가는 거야?'],
      landed: ['휴~ 착지 성공!', '!!', '다시 한 번!'],
      fed: ['우와 맛있겠다!', '잘먹겠습니다!!', '우와 밥이다~~!!'],
      caught: ['잡았다!', '헤헤 내가 이겼어', '한 번 더!', '나.. 혹시 사냥 천재..?'],
      stop: ['끝났다! 확인해 봐', '짠! 답변 나왔다옹', '작업 끝! 일동 박수!!', '됐다옹! 한번 봐 줘'],
      notifyPermission: ['Bash 써도 되는지 물어봐!', 'Claude가 Bash 허락을 기다려', '허락이 필요해!'],
      lunch: ['점심시간이닷!!!!!', '오늘 뭐 먹을 거야?', '바빠도 점심 꼭 챙겨 먹어!'],
      late: ['1시야… 오늘은 여기까지 할까?', '이제 슬슬 졸리다. 우리 이제 자자', '내일은 내일의 해가 뜨겠지..'],
    },
    featTitle: '그냥 귀엽기만 한 게 아니에요', featLead: 'AI와 함께 일하는 하루에 맞춰 같이 움직이는 고양이예요.',
    feats: [
      ['a-levelup', '토큰을 먹고 자라요', '보낸 메시지와 출력 토큰만큼 경험치가 쌓여 레벨이 오르고, 코인으로 옷·모션·간식을 사요.'],
      ['m-donebell', '같이 일하고 알려 줘요', '답을 만드는 동안 노트북으로 같이 타이핑하고, 끝나면 말풍선으로, 허락이 필요하면 손을 흔들어 알려 줘요.'],
      ['m-stretch', '생활을 챙겨 줘요', '점심·저녁 시간, 두 시간째 일할 때의 스트레칭, 늦은 밤 작업할 때 건네는 위로의 말까지. 고양이가 내 생활을 챙겨 줘요.'],
    ],
    playEyebrow: '직접 해 보기', playTitle: '고양이랑 놀아 보세요', playLead: '앱에서와 똑같이 움직여요. 고양이를 쓰다듬고 끌어 올리고, 밥을 주고, 장난감을 꺼내 직접 놀아 주세요.',
    toys: [
      ['bubbles', '비눗방울', '마우스를 휘젓거나 클릭하면 방울 · 꾹 누르면 큰 방울이 고양이를 가둬 둥실 띄워요', '손가락으로 문지르거나 톡 누르면 방울 · 꾹 누르면 큰 방울이 고양이를 가둬 둥실 띄워요'],
      ['ball', '공', '끌었다 놓으면 던지기 · 톡 누르면 뻥 차 올리기'],
      ['domino', '도미노', '더미에서 도미노를 끌어다 세우고, 고양이 머리 위 시작 버튼을 눌러요'],
      ['squirtgun', '물총', '클릭하면 물줄기 슝 · 꾹 누르면 연사', '톡 누르면 물줄기 슝 · 꾹 누르면 연사'],
    ],
    ui: { go: '시작', restand: '다시 세우기', away: '장난감을 넣었어요', feed: '밥이 떨어졌어요. 고양이가 가서 야금야금 먹어요', next: '다음' },
    likes: '좋아하는 것',
    playCaption: '고양이를 눌러 쓰다듬거나, 끌어서 들어 올려 보세요',
    acts: [['feed', '🍚', '밥 주기'], ['toy', '🧸', '장난감 꺼내기'], ['work', '💻', '일 시키기'], ['notify', '❗', '허락 요청'], ['lunch', '🍱', '점심시간'], ['sleep', '🌙', '재우기'], ['motion', '🎲', '아무 모션']],
    dayEyebrow: '어느 하루', dayTitle: '고양이와 함께하는 하루',
    dayLead: 'Claude Code 나 Codex 가 일하는 흐름에 맞춰 고양이도 움직여요. 아래 말풍선은 앱 속 실제 대사예요.',
    day: [
      ['09:02', 'a-wave', '세션 시작', '새 세션이다! 오늘은 뭘 만들어 볼까?', ''],
      ['10:15', 'mood-thinking', '같이 일하는 중', '(노트북 타닥타닥…)', ''],
      ['10:48', 'm-enterwait', '허락이 필요할 때', 'Claude가 Bash 허락을 기다려', 'notify'],
      ['10:51', 'm-donebell', '답이 끝났을 때', '작업 끝! 일동 박수!!', ''],
      ['12:00', 'a-eat', '점심시간', '점심시간이닷!!!!!', ''],
      ['15:30', 'm-stretch', '오래 일했을 때', '벌써 2시간째야. 스트레칭 한 번 할까?', ''],
      ['18:40', 'f-raccoon', '동네 친구가 놀러 옴', '라면이가 놀러 왔어!', ''],
      ['01:10', 'm-nodoff', '늦은 밤', '1시야… 오늘은 여기까지 할까?', ''],
    ],
    galEyebrow: '모션 87개 · 코스튬 264개', galTitle: '매일 다른 모습', galLead: '상황마다 모션을 고르고, 코인으로 새 모션과 옷을 사요.',
    tabs: [['motions', '모션', '일할 때 · 기다릴 때 · 배고플 때 · 잘 때… 상황마다 하나씩 골라 둬요. 87개 가운데 일부예요.'], ['costumes', '코스튬 세트', '머리부터 발끝까지 한 벌이에요. 모자 · 안경 · 목도리처럼 부위별로 따로 입힐 수도 있어요.'], ['friends', '동네 친구', '2시간쯤마다 한 마리씩 놀러 와요. 밥을 주고 보물을 바꾸면 친해지고, 단짝이 되면 불러낼 수 있어요.']],
    growEyebrow: '모으고 꾸미고', growTitle: '쓸수록 할 게 많아져요',
    growLead: '레벨이 오르면 새 물건이 열리고, 놀 거리와 모을 거리가 계속 생겨요.',
    todo: [
      ['🎮', '같이 하는 게임', '두더지 잡기 · 가위바위보 · 도미노 · 줄다리기 · 트램펄린. 기록이 남아요.'],
      ['💎', '깜짝 보물과 공방', '고양이가 가끔 보물을 물어 와요. 38가지를 모아 공방에서만 나오는 코스튬 24벌을 만들어요.'],
      ['📜', '퀘스트와 업적', '한 번에 퀘스트 3개, 업적은 161개. 깨면 경험치와 간식 · 코인을 받아요.'],
      ['📊', '통계와 자랑하기', '요일 × 시간 히트맵과 누적 기록을 보고, 카드 이미지로 복사해 자랑해요.'],
      ['💡', 'AI 활용 팁', '하루 몇 번, 고양이가 말풍선으로 쓸 만한 팁을 하나씩 알려 줘요.'],
      ['🔕', '방해하지 않아요', '크기 조절 · 음소거 · 한 시간 숨기기 · 방해 금지 모드가 있어요.'],
    ],
    mobile: '킷커밋은 PC(윈도우 · 맥)에서 쓰는 앱이에요. 주소를 복사해 두었다가 PC에서 열어 보세요.', copy: '주소 복사', copied: '복사했어요!',
    stats: [['87', '모션'], ['264', '코스튬'], ['55', '밥 · 간식'], ['30', '장난감'], ['8', '동네 친구'], ['161', '업적']],
    shots: [['home', '홈 — 오늘의 고양이'], ['shop', '상점 — 코인으로 꾸미기'], ['stats', '통계 — 나의 코딩 기록']],
    shotsNote: '스크린샷은 데모 기록으로 찍은 영어 화면이에요.',
    toolsTitle: 'Claude Code 도, Codex 도', toolsLead: '처음 안내나 설정에서 쓰는 도구를 고르면 돼요. 도구마다 고양이가 따로 자라요.',
    tools: [['mood-thinking', 'Claude Code', '대화 기록으로 자라고, hook 으로 실시간 반응해요.'], ['c-mondaydev', 'Codex', 'Codex 기록으로 자라고, 허락 요청과 작업 끝을 알려 줘요.']],
    dlEyebrow: '무료', dlTitle: '지금 받기', dlLead: '설치는 1분이면 끝나요.',
    win: { title: '윈도우', steps: ['설치 파일을 실행하면 관리자 권한 없이 설치되고 바로 켜져요.', '"Windows의 PC 보호" 창이 뜨면 <b>추가 정보 → 실행</b>.', '<b>새 버전은 자동으로</b> 받아서 설치해요.'], req: '윈도우 10 / 11 (64비트)' },
    mac: { title: '맥', steps: ['dmg 를 열고 Kit Commit 을 응용 프로그램 폴더로 끌어 놓아요.', '처음 한 번만 <b>시스템 설정 → 개인정보 보호 및 보안 → 그래도 열기</b>.', '새 버전이 나오면 새 dmg 로 덮어 설치해요.'], req: 'macOS · M칩 · 인텔' },
    installMore: '자세한 설치 방법',
    official: '<b>공식 다운로드는 이 사이트와 GitHub Releases 뿐이에요.</b> 다른 곳에 올라온 파일은 고쳐진 것일 수 있어요. 받은 파일의 SHA-256 을 위 값과 비교해 확인할 수 있어요.',
    faqTitle: '자주 묻는 질문',
    faq: [
      ['제 대화 내용을 읽나요?', '아니요. 이 컴퓨터의 기록 파일에서 <b>개수 · 토큰 수 · 시각 · 도구 이름만</b> 세고, 대화 내용은 저장하지도 어디로 보내지도 않아요. 계산은 모두 이 컴퓨터 안에서 해요.'],
      ['무료인가요?', '네, 무료예요. 결제나 광고가 없어요.'],
      ['Anthropic · OpenAI 가 만든 공식 앱인가요?', '아니요. 개인이 만든 비공식 팬메이드 앱이에요. 두 회사와 관련이 없어요.'],
      ['hook 은 뭐고, 꼭 연결해야 하나요?', 'Claude Code / Codex 가 일을 시작하고 끝낼 때 고양이에게 알려 주는 연결이에요. 연결하지 않아도 기록 파일로 자라지만, 연결하면 작업 끝 · 허락 요청에 바로 반응해요. 기존 설정은 그대로 두고 백업도 만들어요.'],
      ['방해되지 않나요?', '고양이는 화면 맨 아래를 걸어 다니고, 클릭은 고양이 몸 위에서만 받아요. 크기 조절, 음소거, 한 시간 숨기기, 방해 금지 모드가 있어요.'],
      ['맥은 왜 경고가 뜨나요?', 'Apple 개발자 서명(유료)이 없는 베타라서, 처음 한 번만 설정에서 열어 줘야 해요. 그다음부터는 그냥 열려요.'],
    ],
    ctaTitle: '오늘부터 같이 일할 고양이', ctaLead: '작은 고양이 한 마리가 일하는 하루를 조금 더 즐겁게 만들어 줄 거예요.',
    footer: ['킷커밋은 비공식 팬메이드 앱으로, Anthropic · OpenAI 와 관련이 없고 두 회사가 만들거나 보증하지 않습니다. Claude 와 Claude Code 는 Anthropic 의 상표이고, Codex 는 OpenAI 의 상표입니다.', '© 2026 Elliott Park. 무료로 쓸 수 있지만 오픈소스가 아니며, 재배포 · 수정을 허용하지 않습니다.'],
    footLinks: [['GitHub Releases', REL], ['라이선스', REPO + '/blob/main/LICENSE'], ['버그 · 의견', REPO + '/issues']],
  },
  en: {
    lang: 'en', other: 'ko', otherLabel: '한국어',
    title: 'Kit Commit — a pixel cat that grows as you work with AI',
    desc: 'A desktop pixel cat that grows with your Claude Code or Codex. It works alongside you, tells you when a reply is done, and reminds you about lunch, breaks and bedtime. Free.',
    nav: ['Play', 'A day', 'Motions', 'Download'],
    eyebrow: 'A desktop pet for Claude Code · Codex',
    h1: 'A pixel cat that grows<br><em>as you work with AI</em>',
    lead: 'A tiny cat feeds on your tokens and works in the corner of your screen. It claps when a reply is done, waves when your OK is needed, and tells you to go to bed at 1 a.m.',
    dlWin: 'Download for Windows', dlMac: 'Download for Mac', free: 'Free',
    meta: 'Windows 10/11 · macOS (Apple Silicon & Intel) · never reads your conversations',
    hint: '<b>▸</b> Click the cat to pet it, drag it to pick it up',
    hintTouch: '<b>▸</b> Tap the cat to pet it, drag it to pick it up',
    viewMobile: 'Mobile', viewDesktop: 'Desktop', swipe: '◂ swipe ▸',
    termTitle: 'claude — ~/my-app',
    names: { cat: 'Klo', dur: '2h' },
    lines: {
      session: ['New session! What are we making today?', "Let's go! I'll cheer from right here", 'Klo is ready!'],
      poke: ['Hehe', 'That tickles!', "Let's keep going!", 'Purr purr…'],
      held: ['Whoa, high!', 'Put me down~', 'Where are we going?'],
      landed: ['Phew, nailed the landing!', '!!', 'Again!'],
      fed: ['Looks yummy!', 'Thank you!'],
      caught: ['Gotcha!', 'Hehe, I win', 'Again!'],
      stop: ['Done! Take a look', 'Ta-da!', 'Ooh, this one looks good', 'Finished! Applause please'],
      notifyPermission: ['Can Claude use Bash? It is asking!', 'Claude needs your OK for Bash', 'Permission needed!'],
      lunch: ['Lunch time! Eat well so the afternoon goes well', "Hungry? Let's eat first!"],
      late: ['1 a.m.… shall we stop here?', 'Yawn… let us sleep', 'Tomorrow-you will handle it'],
    },
    featTitle: "It's not just cute", featLead: 'A cat that keeps pace with your day of working with AI.',
    feats: [
      ['a-levelup', 'Grows on your tokens', 'Messages and output tokens become XP. Level up, then spend coins on outfits, motions and snacks.'],
      ['m-donebell', 'Works with you, tells you', 'Types along on a laptop while a reply is being written, pops a bubble when it is done, and waves when your OK is needed.'],
      ['m-stretch', 'Looks after you', 'Lunch and dinner, a stretch when you are two hours in, and a kind word when you are working late. The cat looks after your day.'],
    ],
    playEyebrow: 'Try it', playTitle: 'Play with the cat', playLead: 'It behaves just like the app. Pet the cat, pick it up, feed it, and take out a toy to play with it yourself.',
    toys: [
      ['bubbles', 'Bubbles', 'Swirl the mouse or click for bubbles · hold to grow a giant bubble that traps the cat and floats it up', 'Swipe or tap for bubbles · hold to grow a giant bubble that traps the cat and floats it up'],
      ['ball', 'Ball', 'Drag & release to throw · click to kick it sky-high', 'Drag & release to throw · tap to kick it sky-high'],
      ['domino', 'Dominoes', 'Drag dominoes from the pile to stand them up, then press start above the cat'],
      ['squirtgun', 'Squirt gun', 'Click to squirt · hold for rapid fire', 'Tap to squirt · hold for rapid fire'],
    ],
    ui: { go: 'Start', restand: 'Stand them up', away: 'Toys put away', feed: 'Food dropped. The cat walks over and nibbles it', next: 'next' },
    likes: 'Likes',
    playCaption: 'Click the cat to pet it, or drag it to pick it up',
    playCaptionTouch: 'Tap the cat to pet it, or drag it to pick it up',
    acts: [['feed', '🍚', 'Feed'], ['toy', '🧸', 'Take out a toy'], ['work', '💻', 'Give it work'], ['notify', '❗', 'Ask permission'], ['lunch', '🍱', 'Lunch time'], ['sleep', '🌙', 'Bedtime'], ['motion', '🎲', 'Random motion']],
    dayEyebrow: 'One ordinary day', dayTitle: 'A day with your cat',
    dayLead: 'The cat follows what Claude Code or Codex is doing. The bubbles below are real lines from the app.',
    day: [
      ['09:02', 'a-wave', 'Session starts', 'New session! What are we making today?', ''],
      ['10:15', 'mood-thinking', 'Working together', '(tap tap tap on the laptop…)', ''],
      ['10:48', 'm-enterwait', 'When your OK is needed', 'Claude needs your OK for Bash', 'notify'],
      ['10:51', 'm-donebell', 'When a reply is done', 'Finished! Applause please', ''],
      ['12:00', 'a-eat', 'Lunch time', 'Lunch time! Eat well so the afternoon goes well', ''],
      ['15:30', 'm-stretch', 'After a long stretch of work', '2h already. Stretch with me?', ''],
      ['18:40', 'f-raccoon', 'A neighbor drops by', 'Ramen came to visit!', ''],
      ['01:10', 'm-nodoff', 'Late at night', '1 a.m.… shall we stop here?', ''],
    ],
    galEyebrow: '87 motions · 264 costumes', galTitle: 'Different every day', galLead: 'Pick a motion for each situation, and buy new motions and outfits with coins.',
    tabs: [['motions', 'Motions', 'Working, waiting, hungry, asleep… pick one for each situation. These are a few of the 87.'], ['costumes', 'Costume sets', 'A full outfit from head to toe. You can also mix hats, glasses and scarves piece by piece.'], ['friends', 'Neighbors', 'One drops by every two hours or so. Feed them and trade treasures to become friends; a best friend can be called over.']],
    growEyebrow: 'Collect & dress up', growTitle: 'More to do the more you use it',
    growLead: 'Levels unlock new items, and there is always something more to play with and collect.',
    todo: [
      ['🎮', 'Games to play together', 'Whack-a-cat, rock-paper-scissors, dominoes, tug of war and a trampoline. Your records are kept.'],
      ['💎', 'Treasures & workshop', 'The cat sometimes brings back a treasure. Collect all 38 kinds and craft 24 workshop-only costumes.'],
      ['📜', 'Quests & achievements', 'Three quests at a time and 161 achievements, paying out XP, snacks and coins.'],
      ['📊', 'Stats to show off', 'A weekday × hour heatmap and lifetime totals, with a card image you can copy and share.'],
      ['💡', 'AI tips', 'A few times a day the cat shares a handy tip in a speech bubble.'],
      ['🔕', 'Stays out of your way', 'Resize it, mute it, hide it for an hour, or switch on do-not-disturb.'],
    ],
    mobile: 'Kit Commit runs on a PC (Windows or Mac). Copy the link and open it on your computer.', copy: 'Copy link', copied: 'Copied!',
    stats: [['87', 'motions'], ['264', 'costumes'], ['55', 'foods & snacks'], ['30', 'toys'], ['8', 'neighbors'], ['161', 'achievements']],
    shots: [['home', 'Home — today with your cat'], ['shop', 'Shop — dress up with coins'], ['stats', 'Stats — your coding history']],
    shotsNote: 'Screenshots use made-up demo history.',
    toolsTitle: 'Claude Code or Codex', toolsLead: 'Pick your tool in the intro or in Settings. Each tool raises its own cat.',
    tools: [['mood-thinking', 'Claude Code', 'Grows from your history and reacts in real time through hooks.'], ['c-mondaydev', 'Codex', 'Grows from your Codex sessions and tells you about permission requests and finished replies.']],
    dlEyebrow: 'Free', dlTitle: 'Get it now', dlLead: 'Installing takes about a minute.',
    win: { title: 'Windows', steps: ['Run the installer. It installs for your account (no admin rights) and opens right away.', 'If "Windows protected your PC" appears, click <b>More info → Run anyway</b>.', '<b>New versions install automatically.</b>'], req: 'Windows 10 / 11 (64-bit)' },
    mac: { title: 'Mac', steps: ['Open the dmg and drag Kit Commit into Applications.', 'The first time only: <b>System Settings → Privacy & Security → Open Anyway</b>.', 'For a new version, install the new dmg over the old one.'], req: 'macOS · Apple Silicon · Intel' },
    installMore: 'Full install guide',
    official: '<b>The only official downloads are this site and GitHub Releases.</b> Files posted anywhere else may have been modified. You can check a download by comparing its SHA-256 with the value above.',
    faqTitle: 'FAQ',
    faq: [
      ['Does it read my conversations?', 'No. It counts <b>only message counts, token numbers, timestamps and tool names</b> from the history files on your computer. Conversation content is never stored or sent anywhere, and everything is calculated locally.'],
      ['Is it free?', 'Yes. No payments, no ads.'],
      ['Is this an official Anthropic or OpenAI app?', 'No. It is an unofficial fan-made app, not affiliated with either company.'],
      ['What are hooks? Do I have to connect them?', 'Hooks let Claude Code / Codex tell the cat when work starts and ends. The cat grows from your history files either way, but with hooks it reacts instantly to finished replies and permission requests. Your existing settings are kept, and a backup is made.'],
      ['Will it get in my way?', 'The cat walks along the bottom of the screen and only takes clicks on its own body. You can resize it, mute it, hide it for an hour, or turn on do-not-disturb.'],
      ['Why does my Mac show a warning?', 'This beta is not signed with a paid Apple Developer account, so you allow it once in System Settings. After that it opens normally.'],
    ],
    ctaTitle: 'A cat to work with, starting today', ctaLead: 'One small cat can make a working day a little more fun.',
    footer: ['Kit Commit is an unofficial fan-made app. It is not affiliated with, made by, or endorsed by Anthropic or OpenAI. Claude and Claude Code are trademarks of Anthropic. Codex is a trademark of OpenAI.', '© 2026 Elliott Park. Free to use, but not open source; redistribution and modification are not permitted.'],
    footLinks: [['GitHub Releases', REL], ['License', REPO + '/blob/main/LICENSE'], ['Bugs & ideas', REPO + '/issues']],
  },
};

// 첫 화면 터미널 연기 (영어 그대로). 단계: p 입력 · o 출력 · a 허락 묻기 · d 끝. 고양이가 단계마다 따라 움직인다 (site.js)
const TERM = [
  { cmd: 'fix the login redirect bug', out: ['Reading src/auth/login.ts', 'Editing 2 files'], ask: 'Allow Bash: npm test?', after: ['42 tests passed'], done: 'Done in 2m 14s', end: 'm-donebell' },
  { cmd: 'add a dark mode toggle', out: ['Reading src/theme.css', 'Writing src/ThemeToggle.tsx'], ask: 'Allow Bash: npm run build?', after: ['Build succeeded'], done: 'Done in 1m 52s', end: 'm-cicheck' },
  { cmd: 'deploy to staging', out: ['Checking git status', 'Running release script'], ask: 'Allow Bash: npm run deploy?', after: ['Uploaded 14 files'], done: 'Deployed in 3m 05s', end: 'm-deployrocket' },
];

const I = (lang) => (lang === 'ko' ? 0 : 1);
// 손가락으로 쓰는 기기용 문구가 따로 있으면 data-touch 에 실어 둔다 (site.js 가 바꿔 끼운다)
const touch = (s) => (s ? ` data-touch="${s.replace(/"/g, '&quot;')}"` : '');
// 보기 방식(데스크톱 · 모바일)을 그리기 전에 정한다: 고른 값(localStorage kc-view)이 있으면 그것, 없으면 화면 폭.
// 휴대폰에서 데스크톱 보기를 고르면 viewport 를 넓혀 데스크톱 배치 그대로 보여 준다. 모양은 site.css 의 [data-view="mobile"]
const VIEW_JS = `(function(){var d=document.documentElement,u=navigator.userAgent||'',s=null;try{s=localStorage.getItem('kc-view')}catch(e){}if(/Android|iPhone|iPad|iPod|Mobile/i.test(u)||(/Mac/.test(u)&&navigator.maxTouchPoints>1))d.dataset.phone='1';var set=function(){d.dataset.view=s==='mobile'||s==='desktop'?s:Math.min(innerWidth||9999,screen.width||9999)<=760?'mobile':'desktop'};set();if(d.dataset.view==='desktop'&&screen.width&&screen.width<=760)document.querySelector('meta[name=viewport]').content='width=1100';if(!s)addEventListener('resize',set)})();`;
const sp = (name, extra = '') => `<canvas data-sp="${name}" ${extra} aria-hidden="true"></canvas>`;
const WIN_ICON = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 5.2 10.3 4v7.3H3zm8.2-1.3L21 2.5v8.8h-9.8zM3 12.7h7.3V20L3 18.8zm8.2 0H21v8.8l-9.8-1.4z"/></svg>';
const MAC_ICON = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16.4 12.7c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.1-2.8.9-3.5.9-.7 0-1.8-.9-3-.8-1.5 0-3 .9-3.8 2.3-1.6 2.8-.4 7 1.2 9.3.8 1.1 1.7 2.4 2.9 2.3 1.2 0 1.6-.7 3-.7s1.8.7 3 .7c1.3 0 2.1-1.1 2.8-2.3.9-1.3 1.3-2.6 1.3-2.6s-2.5-1-2.5-3.8zM14.1 5.9c.6-.8 1.1-1.9 1-3-1 0-2.1.7-2.8 1.4-.6.7-1.1 1.8-1 2.9 1.1.1 2.2-.6 2.8-1.3z"/></svg>';

// 영어가 기본(docs/index.html), 한국어는 docs/ko/index.html. b = 이 페이지에서 docs/ 까지의 길
function page(t) {
  const i = I(t.lang);
  const b = t.lang === 'en' ? '' : '../';
  const otherHref = t.lang === 'en' ? 'ko/' : '../';
  const gm = GALLERY.map((k) => `<div class="tile">${sp('m-' + k)}<b>${NAMES.m[k][i]}</b></div>`).join('');
  const gc = Object.keys(NAMES.c).map((k) => `<div class="tile">${sp('c-' + k)}<b>${NAMES.c[k][i]}</b></div>`).join('');
  const gf = Object.keys(FRIENDS).map((k) => `<div class="tile friend">${sp('f-' + k)}<b>${NAMES.f[k][i]}</b><em>${FRIENDS[k].nick[i]}</em><p>${FRIENDS[k].who[i]}</p><p><i>${t.likes}</i> ${FRIENDS[k].like[i]}</p></div>`).join('');
  const counts = { motions: GALLERY.length, costumes: Object.keys(NAMES.c).length, friends: Object.keys(FRIENDS).length };
  const motionNames = Object.fromEntries(GALLERY.map((k) => ['m-' + k, NAMES.m[k][i]]));
  const KC = { base: b + 'assets/sprites/', sprites: SPRITES, lines: t.lines, names: t.names, motionNames, randomMotions: GALLERY.map((k) => 'm-' + k), term: TERM, foods: FOODS, toys: t.toys, ui: t.ui };
  const dlButtons = `
        <a class="btn primary" data-dl="win" href="${REL}">${WIN_ICON}${t.dlWin} <small>${t.free}</small></a>
        <a class="btn primary" data-dl="mac" href="${REL}">${MAC_ICON}${t.dlMac} <small>${t.free}</small></a>`;
  return `<!doctype html>
<html lang="${t.lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<script>${VIEW_JS}</script>
<title>${t.title}</title>
<meta name="description" content="${t.desc}">
<meta property="og:title" content="${t.title}">
<meta property="og:description" content="${t.desc}">
<meta property="og:image" content="https://elliott-json-park.github.io/kitcommit-releases/assets/og.png">
<meta property="og:type" content="website">
<link rel="icon" href="${b}assets/icon.png">
<link rel="alternate" hreflang="${t.other}" href="${otherHref}">
<link rel="preconnect" href="https://cdn.jsdelivr.net">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/galmuri/dist/galmuri.css">
<link rel="stylesheet" href="${b}assets/site.css">
</head>
<body>
<header class="top"><div class="wrap">
  <a class="brand" href="./"><img src="${b}assets/icon.png" alt="">Kit Commit</a>
  <nav class="nav"><a href="#play">${t.nav[0]}</a><a href="#day">${t.nav[1]}</a><a href="#gallery">${t.nav[2]}</a><a href="#download">${t.nav[3]}</a></nav>
  <a class="lang" href="${otherHref}">${t.otherLabel}</a>
  <button type="button" class="lang view" data-view-toggle><span class="to-mobile">${t.viewMobile}</span><span class="to-desktop">${t.viewDesktop}</span></button>
  <a class="btn primary sm" href="#download">${t.nav[3]}</a>
</div></header>

<section class="hero"><div class="wrap">
  <div class="hero-grid">
    <div>
      <span class="eyebrow">${t.eyebrow}</span>
      <h1>${t.h1}</h1>
      <p class="lead">${t.lead}</p>
      <div class="ctas">${dlButtons}
      </div>
      <p class="meta">${t.meta} · <span data-ver></span></p>
      <p class="mobile-note" hidden>${t.mobile} <button type="button" data-copy data-done="${t.copied}">${t.copy}</button></p>
    </div>
    <div>
      <div class="screen">
        <div class="bar"><i></i><i></i><i></i><span>${t.termTitle}</span></div>
        <div class="term" id="term" aria-hidden="true"></div>
        <div class="stage" id="hero-stage">
          <div class="pet"><div class="bubble"></div><canvas></canvas></div>
        </div>
      </div>
      <p class="hint"${touch(t.hintTouch)}>${t.hint}</p>
    </div>
  </div>
</div></section>

<section><div class="wrap center">
  <h2>${t.featTitle}</h2>
  <p class="lead">${t.featLead}</p>
  <div class="grid g3">
    ${t.feats.map(([s, h, p]) => `<div class="card feature"><div class="sp-box">${sp(s)}</div><h3>${h}</h3><p>${p}</p></div>`).join('\n    ')}
  </div>
</div></section>

<section class="alt" id="play"><div class="wrap center">
  <span class="eyebrow">${t.playEyebrow}</span>
  <h2>${t.playTitle}</h2>
  <p class="lead">${t.playLead}</p>
  <div class="play">
    <div class="stage" id="play-stage">
      <canvas class="field" aria-hidden="true"></canvas>
      <div class="pet"><div class="bubble"></div><canvas></canvas></div>
      <button type="button" class="go" hidden></button>
      <div class="caption"${touch(t.playCaptionTouch)}>${t.playCaption}</div>
    </div>
    <div class="actions">
      ${t.acts.map(([a, ico, label]) => `<button class="btn" data-act="${a}" data-label="${label}"><span class="ico">${ico}</span>${label}${a === 'toy' ? ' <small></small>' : ''}</button>`).join('\n      ')}
    </div>
  </div>
</div></section>

<section id="day"><div class="wrap center">
  <span class="eyebrow">${t.dayEyebrow}</span>
  <h2>${t.dayTitle}</h2>
  <p class="lead">${t.dayLead}</p>
  <div class="day">
    ${t.day.map(([time, s, h, line, cls]) => `<div class="moment"><span class="time">${time}</span><div class="card"><div class="sp-box"><div class="bubble ${cls}">${line}</div>${sp(s)}</div><h3>${h}</h3></div></div>`).join('\n    ')}
  </div>
  <p class="swipe">${t.swipe}</p>
</div></section>

<section class="alt" id="gallery"><div class="wrap center">
  <span class="eyebrow">${t.galEyebrow}</span>
  <h2>${t.galTitle}</h2>
  <p class="lead">${t.galLead}</p>
  <div class="tabs" role="tablist">${t.tabs.map(([k, l, note], j) => `<button role="tab" data-tab="${k}" data-note="${note}" aria-selected="${j ? 'false' : 'true'}" class="${j ? '' : 'on'}">${l} <i>${counts[k]}</i></button>`).join('')}</div>
  <p class="tab-note" id="tab-note">${t.tabs[0][2]}</p>
  <div class="grid g6" data-panel="motions">${gm}</div>
  <div class="grid g6" data-panel="costumes" hidden>${gc}</div>
  <div class="grid g4" data-panel="friends" hidden>${gf}</div>
</div></section>

<section><div class="wrap center">
  <span class="eyebrow">${t.growEyebrow}</span>
  <h2>${t.growTitle}</h2>
  <p class="lead">${t.growLead}</p>
  <div class="stats">${t.stats.map(([n, l]) => `<div class="stat"><b>${n}</b><span>${l}</span></div>`).join('')}</div>
  <div class="todo">${t.todo.map(([ico, h, p]) => `<div class="card"><span class="ico">${ico}</span><div><h3>${h}</h3><p>${p}</p></div></div>`).join('')}</div>
  <div class="shots">${t.shots.map(([f, c]) => `<figure><img src="${b}assets/shots/${f}.png" alt="${c}" loading="lazy"><figcaption>${c}</figcaption></figure>`).join('')}</div>
  <p class="note">${t.shotsNote}</p>
</div></section>

<section class="alt"><div class="wrap center">
  <h2>${t.toolsTitle}</h2>
  <p class="lead">${t.toolsLead}</p>
  <div class="tools">
    ${t.tools.map(([s, h, p]) => `<div class="card">${sp(s)}<div><h3>${h}</h3><p>${p}</p></div></div>`).join('\n    ')}
  </div>
</div></section>

<section id="download"><div class="wrap center">
  <span class="eyebrow">${t.dlEyebrow}</span>
  <h2>${t.dlTitle}</h2>
  <p class="lead">${t.dlLead} <span data-ver></span></p>
  <div class="dl">
    <div class="card"><h3>${WIN_ICON} ${t.win.title}</h3><ol>${t.win.steps.map((s) => `<li>${s}</li>`).join('')}</ol>
      <a class="btn primary" data-dl="win" href="${REL}">${WIN_ICON}${t.dlWin} <small>${t.free}</small></a>
      <p class="note">${t.win.req}</p><p class="sha" data-sha="win"></p></div>
    <div class="card"><h3>${MAC_ICON} ${t.mac.title}</h3><ol>${t.mac.steps.map((s) => `<li>${s}</li>`).join('')}</ol>
      <a class="btn primary" data-dl="mac" href="${REL}">${MAC_ICON}${t.dlMac} <small>${t.free}</small></a>
      <p class="note">${t.mac.req}</p><p class="sha" data-sha="mac"></p></div>
  </div>
  <p class="official">${t.official} <a href="${REPO}/blob/main/${t.lang === 'ko' ? 'README.ko.md' : 'README.md'}">${t.installMore} →</a></p>
</div></section>

<section class="alt"><div class="wrap center">
  <h2>${t.faqTitle}</h2>
  <div class="faq">${t.faq.map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join('')}</div>
</div></section>

<section class="cta"><div class="wrap center">
  <h2>${t.ctaTitle}</h2>
  <p class="lead">${t.ctaLead}</p>
  <div class="ctas">${dlButtons}
  </div>
  <div class="stage" id="cta-stage">
    <div class="pet"><div class="bubble"></div><canvas></canvas></div>
  </div>
</div></section>

<footer><div class="wrap">
  <div>${t.footLinks.map(([l, h]) => `<a href="${h}">${l}</a>`).join(' · ')}</div>
  ${t.footer.map((f) => `<div>${f}</div>`).join('\n  ')}
</div></footer>

<script>window.KC = ${JSON.stringify(KC)};</script>
<script src="${b}assets/site.js"></script>
</body>
</html>
`;
}

fs.mkdirSync(path.join(ROOT, 'ko'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'index.html'), page(TEXT.en));
fs.writeFileSync(path.join(ROOT, 'ko', 'index.html'), page(TEXT.ko));
// GitHub Pages 가 Jekyll 로 손대지 않게
fs.writeFileSync(path.join(ROOT, '.nojekyll'), '');
console.log('docs/index.html (en) · docs/ko/index.html');
