// Kit Commit 소개 사이트 만들기: `node site/build.js` → docs/index.html (영어, 기본) · docs/ko/index.html (한국어)
// GitHub Pages 는 main 브랜치의 docs/ 를 그대로 보여 준다. 문구는 아래 TEXT, 그림 장 수는 SPRITES.
// 그림(docs/assets/sprites/*.png)은 앱의 고양이 렌더러로 뽑은 48px 가로 띠(1초 12장)다. 새 모션을 넣으려면 앱 쪽에서 다시 뽑아 온다.
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', 'docs');
// site.css · site.js 주소 뒤에 내용 해시를 붙인다: 고친 뒤에도 브라우저가 옛 파일(캐시)을 새 HTML 과 섞어 쓰지 않게
const ver = (file) => require('crypto').createHash('sha1').update(fs.readFileSync(path.join(ROOT, 'assets', file))).digest('hex').slice(0, 8);
const REL = 'https://github.com/elliott-json-park/kitcommit-releases/releases/latest';
const REPO = 'https://github.com/elliott-json-park/kitcommit-releases';
const SITE = 'https://elliott-json-park.github.io/kitcommit-releases/';

// 그림 이름 → 장 수 (docs/assets/sprites/<이름>.png)
const SPRITES = {"mood-idle":48,"mood-active":36,"mood-thinking":36,"mood-waiting":36,"mood-sleeping":48,"walk":12,"m-sojuchug":65,"m-darkmode":62,"m-stockup":67,"m-deployrocket":62,"m-cicheck":43,"m-enterwait":62,"m-staticfur":58,"m-donebell":46,"m-giantfist":65,"m-ufo":65,"m-karaoke":48,"m-coffee":53,"a-happy":14,"a-wave":25,"a-eat":88,"a-yawn":34,"a-pounce":13,"a-groom":58,"a-levelup":30,"held":24,"mood-hungry":36,"mood-sleepy":36,"m-stretch":46,"m-fishthink":48,"m-hooray":34,"m-nodoff":50,"m-foodsign":29,"m-zoomies":31,"m-box":48,"m-bath":53,"m-blowkiss":34,"m-melt":41,"m-startle":26,"m-slowblink":36,"m-tapfoot":36,"m-pray":29,"c-magicalgirl":30,"c-holyknight":30,"c-sunwukong":30,"c-dinosuit":30,"c-ironcat":30,"c-mondaydev":30,"c-overtimer":30,"c-xfrostmonarch":30,"c-xphoenixking":30,"c-nyangwarts":30,"f-pigeon":48,"f-hedgehog":48,"f-raccoon":48,"f-dust":36,"f-coal":36,"f-tofu":36,"m-snot":55,"m-raisehand":19,"m-fooddream":58,"t-yarn":29,"t-tangle":31,"t-kick":34,"t-high":43,"t-bat":16,"a-nibble":16,"t-chatter":14,"t-leap":11,"t-pop":8,"t-swipe":8,"t-float":29,"t-wet":17,"t-sulk":24,"t-yay":14,"t-deadpan":24,"f-bolt":36,"f-dondon":36};

// 앱 i18n 의 이름 [한, 영]
const NAMES = {"m":{"sojuchug":["소주 병나발","Soju straight from the bottle"],"darkmode":["다크모드 전환","Dark mode switch"],"stockup":["주식 차트 떡상","Stock to the moon"],"deployrocket":["배포 성공 로켓","Deploy rocket"],"cicheck":["초록 체크 뱃지","Green CI check"],"enterwait":["엔터 키 대기","Waiting on Enter"],"staticfur":["정전기 폭발","Static shock"],"donebell":["끝났다옹 종 울리기","Done! bell"],"giantfist":["거대 주먹 쾅쾅","Giant fist smash"],"ufo":["UFO 납치","UFO abduction"],"karaoke":["노래방 열창","Karaoke belter"],"coffee":["커피 한 잔","Coffee break"],"stretch":["기지개","Big stretch"],"fishthink":["생선 상상하기","Daydreaming of fish"],"hooray":["임무 완료","Mission complete"],"nodoff":["꾸벅꾸벅","Nodding off"],"foodsign":["\"FOOD\" 피켓 시위","\"FOOD\" protest"],"zoomies":["우다다","Zoomies"],"box":["박스 들어가기","If it fits, I sits"],"bath":["거품 목욕","Bubble bath"],"blowkiss":["하트 날리기","Blowing hearts"],"melt":["녹아내리기","Melting"],"startle":["화들짝","Startled"],"slowblink":["고양이 키스 (천천히 깜빡)","Slow blink"],"tapfoot":["발 동동 시계 보기","Foot-tapping clock watch"],"pray":["제발요 기도","Pretty please"],"snot":["코풍선","Snot bubble"],"raisehand":["저요 저요!","Me! Me!"],"fooddream":["맛있는 상상","Daydreaming of food"]},"c":{"xfrostmonarch":["서리 군주","Frost Monarch"],"xphoenixking":["불사조 왕","Phoenix King"],"magicalgirl":["야옹나라 냥냥공주","Magical girl ☆ Lumi"],"holyknight":["츄르를 수호하는 신의 기사단","Holy Knight Sworn to Guard Churu"],"sunwukong":["근두운 할부 중인 제천대성","Great Sage on a Cloud Payment Plan"],"dinosuit":["크아앙 공룡 잠옷","Rawr dino onesie"],"ironcat":["아이언냥 Mk. 1","Iron Cat Mk. 1"],"mondaydev":["월요일 아침 배포 개발자","Monday-deploy developer"],"overtimer":["야근 요정 김대리 (사원증 포함)","Overtime office fairy"],"nyangwarts":["빗자루 면허 없는 냥그와트 1학년","Meowgwarts First Year (No Broom License)"]},"f":{"pigeon":["구구단","Times Table"],"hedgehog":["고도리","Godori"],"raccoon":["라면이","Ramen"],"dust":["먼지","Dusty"],"coal":["연탄이","Coal"],"tofu":["두부","Tofu"],"bolt":["최번개","Bolt Choi"],"dondon":["돈돈까스","Don Donkatsu"]}};

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
const GALLERY = ['deployrocket', 'cicheck', 'darkmode', 'stockup', 'enterwait', 'donebell', 'giantfist', 'ufo', 'karaoke', 'staticfur', 'raisehand', 'zoomies', 'box', 'bath', 'coffee', 'blowkiss', 'melt', 'slowblink'];
// 무작위 모션 단추는 갤러리에 없는 것까지 고른다
const RANDOM = [...GALLERY, 'sojuchug', 'fooddream', 'snot', 'stretch', 'hooray', 'startle', 'fishthink', 'foodsign', 'tapfoot', 'pray'];

const TEXT = {
  ko: {
    lang: 'ko', other: 'en', otherLabel: 'English',
    title: '킷커밋 — AI와 일할수록 자라는 도트 고양이',
    desc: 'Claude Code · Codex, 브라우저의 Claude · ChatGPT · Gemini 를 쓸수록 자라는 데스크톱 도트 고양이. 같이 일하고, 필요할 때 알려 주고, 수다도 떨고, 점심·휴식·잠잘 시간을 챙겨 줘요. 무료.',
    nav: [['#play', '놀아 보기'], ['#talk', '대화'], ['#day', '고양이의 하루'], ['#gallery', '모션'], ['#download', '받기']],
    eyebrow: 'Claude Code · Codex · 웹 AI 데스크톱 펫',
    news: ['NEW 0.5', '고양이와 대화 · 브라우저의 Claude · ChatGPT · Gemini 지원'],
    h1: 'AI와 일할수록 자라는<br><em>도트 고양이</em>',
    lead: '토큰을 먹고 자라는 작은 고양이가 화면 구석에서 같이 일해요. 허락이 필요하면 손을 흔들고, 새벽 1시엔 이제 자자고 해요. 이제는 말을 걸면 대답도 해요.',
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
      stopLong: ['7분 걸린 답 나왔어! 확인해 봐', '기다렸지? 7분짜리 답 도착!'],
      notifyPermission: ['Bash 써도 되는지 물어봐!', 'Claude가 Bash 허락을 기다려', '허락이 필요해!'],
      lunch: ['점심시간이닷!!!!!', '오늘 뭐 먹을 거야?', '바빠도 점심 꼭 챙겨 먹어!'],
      late: ['1시야… 오늘은 여기까지 할까?', '이제 슬슬 졸리다. 우리 이제 자자', '내일은 내일의 해가 뜨겠지..'],
    },
    featTitle: '그냥 귀엽기만 한 게 아니에요', featLead: 'AI와 함께 일하는 하루에 맞춰 같이 움직이는 고양이예요.',
    feats: [
      ['a-levelup', '토큰을 먹고 자라요', '보낸 메시지와 출력 토큰만큼 경험치가 쌓여 레벨이 오르고, 코인으로 옷·모션·간식을 사요.'],
      ['m-donebell', '같이 일하고 알려 줘요', '답을 만드는 동안 노트북으로 같이 타이핑하고, 허락이 필요하면 손을 흔들고, 오래 걸린 답이 끝나면 말풍선으로 알려 줘요. 짧은 답엔 폴짝 뛰기만 해요.'],
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
    dayLead: 'AI가 일하는 흐름에 맞춰 고양이도 움직여요. 말풍선은 꼭 필요할 때만 띄워요. 아래 말풍선은 앱 속 실제 대사예요.',
    day: [
      ['09:02', 'a-wave', '세션 시작', '(반갑게 손 흔들기)', 'act'],
      ['10:48', 'm-enterwait', '허락이 필요할 때', 'Claude가 Bash 허락을 기다려', 'notify'],
      ['11:20', 'm-donebell', '오래 걸린 답이 끝났을 때', '7분 걸린 답 나왔어! 확인해 봐', ''],
      ['12:00', 'a-eat', '점심시간', '점심시간이닷!!!!!', ''],
      ['14:30', 'm-fishthink', '컨텍스트가 70%를 넘으면', '머릿속이 72% 찼대! 지금 /compact 하면 깔끔해져', ''],
      ['15:30', 'm-stretch', '오래 일했을 때', '벌써 2시간째야. 스트레칭 한 번 할까?', ''],
      ['18:40', 'f-raccoon', '동네 친구가 놀러 옴', '라면이가 놀러 왔어!', ''],
      ['01:10', 'm-nodoff', '늦은 밤', '1시야… 오늘은 여기까지 할까?', ''],
    ],
    galEyebrow: '모션 87개 · 코스튬 320개', galTitle: '매일 다른 모습', galMore: '여기 보이는 건 맛보기예요. 앱에는 모션 87개, 코스튬 320개가 있어요.', galLead: '상황마다 모션을 고르고, 코인으로 새 모션과 옷을 사요.',
    tabs: [['motions', '모션', '일할 때 · 기다릴 때 · 배고플 때 · 잘 때… 상황마다 하나씩 골라 둬요. 여기는 87개 가운데 18개만 골라 보여 드려요.'], ['costumes', '코스튬', '코스튬 320개 가운데 머리부터 발끝까지 한 벌인 세트 몇 벌만 골랐어요. 모자 · 안경 · 목도리처럼 부위별로 따로 입힐 수도 있어요.'], ['friends', '동네 친구', '2시간쯤마다 한 마리씩 놀러 와요. 밥을 주고 보물을 바꾸면 친해지고, 단짝이 되면 불러내고 선물한 옷을 갈아입힐 수 있어요.']],
    growEyebrow: '모으고 꾸미고', growTitle: '쓸수록 할 게 많아져요',
    growLead: '레벨이 오르면 새 물건이 열리고, 놀 거리와 모을 거리가 계속 생겨요.',
    todo: [
      ['🎮', '게임과 장난감 36가지', '두더지 잡기 · 가위바위보 · 줄다리기 같은 게임에, 레이저 포인터 · 비눗방울 · 어항 · 야바위 상자까지. 고양이가 진짜로 쫓아다녀요.'],
      ['💎', '깜짝 보물과 공방', '고양이가 가끔 보물을 물어 와요. 38가지를 모아 공방에서만 나오는 코스튬 24벌을 만들어요.'],
      ['📜', '퀘스트와 업적', '한 번에 퀘스트 3개, 업적은 175개. 깨면 경험치와 간식 · 코인을 받아요.'],
      ['🖼️', '내 맘대로 자랑 카드', '기본 · RPG 상태창 · 영수증 세 가지 모양에 칭호 13가지. 기간 · 숫자 · 색 · 고양이 자세 · 한 줄 문구까지 골라 이미지 한 장으로 자랑해요.'],
      ['🌟', 'Lv80 다음은 별 상점', '최고 레벨을 찍은 뒤에도 끝이 아니에요. 쌓이는 별로만 사는 끝판왕 코스튬과 움직이는 털색이 기다려요.'],
      ['💾', '컴퓨터를 바꿔도 그대로', '기록을 파일 하나로 내보내고 새 컴퓨터에서 가져와요. 하루 한 번 자동 백업도 돼요.'],
    ],
    mobile: '킷커밋은 PC(윈도우 · 맥)에서 쓰는 앱이에요. 나에게 보내 두었다가 PC에서 열어 보세요.', copy: '주소 복사', copied: '복사했어요!', send: 'PC로 보내기', sendTitle: '킷커밋 — PC에서 받기', sendText: 'PC에서 열어서 받기: ', mail: '메일로 보내기',
    stats: [['87', '모션'], ['320', '코스튬'], ['55', '밥 · 간식'], ['36', '장난감'], ['8', '동네 친구'], ['175', '업적']],
    shots: [['home', '홈 — 오늘의 고양이'], ['chat', '대화 — 오늘의 냥운세까지'], ['shop', '상점 — 코인으로 꾸미기'], ['card', '자랑 카드 — RPG 상태창'], ['stats', '통계 — 나의 기록']],
    shotsNote: '스크린샷은 데모 기록으로 찍은 0.5.0 화면이에요. 누르면 크게 보여요.', close: '닫기',
    talk: {
      eyebrow: 'NEW · 동료 고양이', title: '이제 고양이와 대화해요',
      lead: '내가 쓰는 AI를 연결하면 고양이가 진짜로 대답해요. 수다 · 고민 상담 · 간단한 질문에 같이 하는 말놀이까지. 일 비서가 아니라 친구예요.',
      points: [
        ['🎭', '성격 7가지', '다정한 · 츤데레 · 장난꾸러기 · 시크한 · 수다쟁이 · 애늙은이 철학자 · 귀차니스트. 직접 설명을 더할 수 있고, 말풍선도 같은 성격으로 말해요.'],
        ['📝', '기억하고 챙겨 줘요', '기억 노트에 내 얘기를 적어 두고, "30분 뒤에 양치하라고 알려줘" 하면 진짜로 알려 줘요. 집중 시간 타이머도 있어요.'],
        ['⌨️', '언제든 불러요', '<b>Ctrl+Alt+K</b> (맥은 ⌘+Option+K), 트레이, 고양이에 마우스를 올리면 뜨는 "말 걸기"로 열어요.'],
      ],
      connectTitle: '연결은 셋 중 하나면 돼요',
      connect: [['Claude 구독', 'Claude Code 에 로그인돼 있으면 키 없이'], ['ChatGPT 구독', 'Codex CLI 에 로그인돼 있으면 키 없이'], ['Gemini 무료 키', '구독이 없어도 무료로 · 카드 필요 없음']],
      connectNote: 'Anthropic · OpenAI API 키도 돼요. 대화는 이 컴퓨터에 저장되고, 내가 연결한 AI 로만 가요.',
      cta: '앱 받고 대화해 보기 →', ctaNote: 'AI를 연결하지 않아도 고양이는 자라요',
      demoTitle: '맛보기 대화창', demoNote: '냥운세 · 초성 퀴즈는 여기서도 진짜로 돼요. 운세는 앱과 같은 결과예요.',
      persona: '성격', placeholder: '앱에서는 여기에 자유롭게 말을 걸어요', placeholderQuiz: '정답을 써 보세요', send: '보내기',
      sample: '예시 · 앱에서는 연결한 AI가 이어 가요',
      noAi: '여기선 맛보기라 자유 대화는 못 해… 앱에서 AI를 연결하면 뭐든 얘기할 수 있어!',
      greet: {
        angel: '왔구나! 오늘 하루 어땠어? 아래 놀이도 눌러 봐 🐾',
        tsundere: '흥, 이제야 왔어? …딱히 기다린 건 아니거든',
        playful: '헤헤 왔다! 오늘은 뭐 하고 놀까? 나 심심했단 말이야~',
        chic: '왔네. 할 얘기 있으면 해.',
        chatty: '왔어?! 나 오늘 창밖에서 비둘기 세 마리 봤다? 아 맞다, 너는 오늘 뭐 했어?',
        sage: '어서 오게. 오늘은 어떤 생각을 품고 왔는가',
        lazy: '어… 왔어…? 누워서 얘기해도 되지…?',
      },
      bubbleNote: '말풍선도 이 말투예요:',
      balance: {
        q: '{n}번째! 둘 중 하나만 고른다면?',
        pairs: [['평생 여름', '평생 겨울'], ['라면만 먹기', '치킨만 먹기'], ['버그 없는 코드', '야근 없는 회사'], ['고양이랑 말하기', '고양이처럼 낮잠 자기'], ['답장 1초 만에 하는 친구', '선물 잘 고르는 친구']],
        same: ['나도 {x}! 통했다냥', '{x} 고른 거 완전 내 취향!'],
        diff: ['난 {y}… 우리 취향 다르다냥', '앗, 나는 {y} 골랐는데! 그래도 좋아'],
        end: '3판 끝! 앱에서는 매번 새 질문으로 5판 해요 🐾',
      },
      wordchain: [['user', '끝말잇기 하자!'], ['cat', '좋아! 내가 먼저 할게. 「고양이」!'], ['user', '이불'], ['cat', '불고기! 이번엔 「기」로 시작해 봐~']],
      twenty: [['user', '스무고개 하자!'], ['cat', '하나 생각했어! 예 / 아니오로 물어봐 (0/20)'], ['user', '먹을 수 있는 거야?'], ['cat', '응! 먹을 수 있어 (1/20)']],
      chosung: { right: '정답! 「{word}」 맞아! 🎉', wrong: '땡! 아니야~', hint: '힌트: 앞 글자는 「{c}」야. 기회는 그대로!', again: '한 판 더' },
    },
    toolsEyebrow: '어떤 AI를 쓰든', toolsTitle: '쓰는 도구에 맞춰 연결해요', toolsLead: '터미널에서 쓰든 브라우저에서 쓰든 괜찮아요. 처음 켤 때 쓰는 도구를 고르면 연결 방법을 한 단계씩 안내해요.',
    tools: [
      ['mood-thinking', 'Claude Code', '터미널 · IDE 에서', '대화 기록으로 자라고, hook 으로 허락 요청 · 작업 끝에 바로 반응해요.'],
      ['c-mondaydev', 'Codex', '터미널 · IDE 에서', 'Codex 기록으로 자라고, 허락 요청과 작업 끝을 알려 줘요.'],
      ['mood-active', 'Claude · ChatGPT · Gemini', '브라우저에서', '작은 확장(크롬 · 엣지 · 웨일)을 넣으면 웹에서 쓸 때 자라요. 보냈다 · 답 끝 · 글자 수만 알려요.'],
    ],
    dlEyebrow: '무료', dlTitle: '지금 받기', dlLead: '설치는 1분이면 끝나요.',
    win: { title: '윈도우', steps: ['설치 파일을 실행하면 관리자 권한 없이 설치되고 바로 켜져요.', '"Windows의 PC 보호" 창이 뜨면 <b>추가 정보 → 실행</b>.', '<b>새 버전은 자동으로</b> 받아서 설치해요.'], req: '윈도우 10 / 11 (64비트)' },
    mac: { title: '맥', steps: ['dmg 를 열고 Kit Commit 을 응용 프로그램 폴더로 끌어 놓아요.', '처음 한 번만 <b>시스템 설정 → 개인정보 보호 및 보안 → 그래도 열기</b>.', '새 버전이 나오면 새 dmg 로 덮어 설치해요.'], req: 'macOS · M칩 · 인텔' },
    installMore: '자세한 설치 방법',
    official: '<b>공식 다운로드는 이 사이트와 GitHub Releases 뿐이에요.</b> 다른 곳에 올라온 파일은 고쳐진 것일 수 있어요. 받은 파일의 SHA-256 을 위 값과 비교해 확인할 수 있어요.',
    faqTitle: '자주 묻는 질문',
    faq: [
      ['제 대화 내용을 읽나요?', '아니요. Claude Code · Codex 는 이 컴퓨터의 기록 파일에서 <b>개수 · 토큰 수 · 시각 · 도구 이름만</b> 세고, 브라우저 확장은 <b>보냈다 · 답이 끝났다 · 글자 수 · 시각만</b> 앱에 알려요. 대화 내용은 저장하지도 어디로 보내지도 않아요.'],
      ['고양이와 대화하려면 돈이 드나요?', 'Claude · ChatGPT 구독이 있으면 따로 낼 돈 없이 그 구독으로 대화해요 (구독 사용량을 조금 써요). 구독이 없으면 Gemini 무료 키로 시작할 수 있어요. 오늘의 냥운세는 AI 없이도 돼요. 고양이와 나눈 대화는 이 컴퓨터에 저장되고, 내가 연결한 AI 로만 가요.'],
      ['Claude Code 나 Codex 없이 브라우저에서만 써도 되나요?', '네. 처음 안내에서 "브라우저"를 고르고 작은 확장(크롬 · 엣지 · 웨일)을 넣으면 claude.ai · chatgpt.com · gemini.google.com 을 쓸 때 고양이가 자라요. 설치는 앱이 한 단계씩 안내해요.'],
      ['무료인가요?', '네, 무료예요. 결제나 광고가 없어요.'],
      ['Anthropic · OpenAI · Google 이 만든 공식 앱인가요?', '아니요. 개인이 만든 비공식 팬메이드 앱이에요. 세 회사와 관련이 없어요.'],
      ['hook 은 뭐고, 꼭 연결해야 하나요?', 'Claude Code / Codex 가 일을 시작하고 끝낼 때 고양이에게 알려 주는 연결이에요. 연결하지 않아도 기록 파일로 자라지만, 연결하면 작업 끝 · 허락 요청에 바로 반응해요. 기존 설정은 그대로 두고 백업도 만들어요.'],
      ['방해되지 않나요?', '고양이는 화면 맨 아래를 걸어 다니고, 클릭은 고양이 몸 위에서만 받아요. 말풍선은 꼭 필요할 때만 띄우고, 크기 조절 · 음소거 · 한 시간 숨기기 · 방해 금지 모드가 있어요.'],
      ['맥은 왜 경고가 뜨나요?', 'Apple 개발자 서명(유료)이 없는 베타라서, 처음 한 번만 설정에서 열어 줘야 해요. 그다음부터는 그냥 열려요.'],
    ],
    ctaTitle: '오늘부터 같이 일할 고양이', ctaLead: '작은 고양이 한 마리가 일하는 하루를 조금 더 즐겁게 만들어 줄 거예요.',
    footer: ['킷커밋은 비공식 팬메이드 앱으로, Anthropic · OpenAI · Google 과 관련이 없고 세 회사가 만들거나 보증하지 않습니다. Claude 와 Claude Code 는 Anthropic 의, ChatGPT 와 Codex 는 OpenAI 의, Gemini 는 Google 의 상표입니다.', '© 2026 Elliott Park. 무료로 쓸 수 있지만 오픈소스가 아니며, 재배포 · 수정을 허용하지 않습니다.'],
    footLinks: [['GitHub Releases', REL], ['라이선스', REPO + '/blob/main/LICENSE'], ['버그 · 의견', REPO + '/issues']],
  },
  en: {
    lang: 'en', other: 'ko', otherLabel: '한국어',
    title: 'Kit Commit — a pixel cat that grows as you work with AI',
    desc: 'A desktop pixel cat that grows with Claude Code, Codex, and Claude · ChatGPT · Gemini in your browser. It works alongside you, tells you when it matters, chats with you, and reminds you about lunch, breaks and bedtime. Free.',
    nav: [['#play', 'Play'], ['#talk', 'Chat'], ['#day', 'A day'], ['#gallery', 'Motions'], ['#download', 'Download']],
    eyebrow: 'A desktop pet for Claude Code · Codex · web AI',
    news: ['NEW 0.5', 'Talk to your cat · Claude, ChatGPT and Gemini in the browser'],
    h1: 'A pixel cat that grows<br><em>as you work with AI</em>',
    lead: 'A tiny cat feeds on your tokens and works in the corner of your screen. It waves when your OK is needed, tells you to go to bed at 1 a.m., and now it talks back when you say hi.',
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
      stopLong: ['A 7m answer is ready! Take a look', 'Worth the wait? 7m answer arrived!'],
      notifyPermission: ['Can Claude use Bash? It is asking!', 'Claude needs your OK for Bash', 'Permission needed!'],
      lunch: ['Lunch time! Eat well so the afternoon goes well', "Hungry? Let's eat first!"],
      late: ['1 a.m.… shall we stop here?', 'Yawn… let us sleep', 'Tomorrow-you will handle it'],
    },
    featTitle: "It's not just cute", featLead: 'A cat that keeps pace with your day of working with AI.',
    feats: [
      ['a-levelup', 'Grows on your tokens', 'Messages and output tokens become XP. Level up, then spend coins on outfits, motions and snacks.'],
      ['m-donebell', 'Works with you, tells you', 'Types along on a laptop while a reply is being written, waves when your OK is needed, and pops a bubble when a long reply is done. Short replies just get a happy hop.'],
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
    dayLead: 'The cat follows what your AI is doing, and only speaks up when it matters. The bubbles below are real lines from the app.',
    day: [
      ['09:02', 'a-wave', 'Session starts', '(a happy wave)', 'act'],
      ['10:48', 'm-enterwait', 'When your OK is needed', 'Claude needs your OK for Bash', 'notify'],
      ['11:20', 'm-donebell', 'When a long reply is done', 'A 7m answer is ready! Take a look', ''],
      ['12:00', 'a-eat', 'Lunch time', 'Lunch time! Eat well so the afternoon goes well', ''],
      ['14:30', 'm-fishthink', 'When context passes 70%', 'My head is 72% full! A /compact now tidies it up', ''],
      ['15:30', 'm-stretch', 'After a long stretch of work', '2h already. Stretch with me?', ''],
      ['18:40', 'f-raccoon', 'A neighbor drops by', 'Ramen came to visit!', ''],
      ['01:10', 'm-nodoff', 'Late at night', '1 a.m.… shall we stop here?', ''],
    ],
    galEyebrow: '87 motions · 320 costumes', galTitle: 'Different every day', galMore: 'This is just a taste. The app has 87 motions and 320 costumes.', galLead: 'Pick a motion for each situation, and buy new motions and outfits with coins.',
    tabs: [['motions', 'Motions', 'Working, waiting, hungry, asleep… pick one for each situation. Here are 18 of the 87.'], ['costumes', 'Costumes', 'A few full head-to-toe sets out of 320 costumes. You can also mix hats, glasses and scarves piece by piece.'], ['friends', 'Neighbors', 'One drops by every two hours or so. Feed them and trade treasures to become friends; a best friend can be called over and dressed in the outfits you gave them.']],
    growEyebrow: 'Collect & dress up', growTitle: 'More to do the more you use it',
    growLead: 'Levels unlock new items, and there is always something more to play with and collect.',
    todo: [
      ['🎮', 'Games and 36 toys', 'Whack-a-cat, rock-paper-scissors and tug of war, plus a laser pointer, bubbles, a fishbowl, a shell game and more. The cat really chases them.'],
      ['💎', 'Treasures & workshop', 'The cat sometimes brings back a treasure. Collect all 38 kinds and craft 24 workshop-only costumes.'],
      ['📜', 'Quests & achievements', 'Three quests at a time and 175 achievements, paying out XP, snacks and coins.'],
      ['🖼️', 'A show-off card, your way', 'Classic, RPG status window or Receipt, with 13 titles. Choose the period, stats, colors, cat pose and your own line. One image, ready to share.'],
      ['🌟', 'After Lv80: the star shop', 'Max level is not the end. Stars keep piling up and buy end-game costumes and animated fur you cannot get any other way.'],
      ['💾', 'New computer, same cat', 'Export your progress to one file and import it on your new PC. Daily auto backup too.'],
    ],
    mobile: 'Kit Commit runs on a PC (Windows or Mac). Send the link to yourself and open it on your computer.', copy: 'Copy link', copied: 'Copied!', send: 'Send to my PC', sendTitle: 'Kit Commit — get it on your PC', sendText: 'Open this on your computer: ', mail: 'Email it to me',
    stats: [['87', 'motions'], ['320', 'costumes'], ['55', 'foods & snacks'], ['36', 'toys'], ['8', 'neighbors'], ['175', 'achievements']],
    shots: [['home', 'Home — today with your cat'], ['chat', 'Chat — even today’s fortune'], ['shop', 'Shop — dress up with coins'], ['card', 'Show-off card — RPG status window'], ['stats', 'Stats — your history']],
    shotsNote: 'Screenshots of 0.5.0 with made-up demo history. Click to enlarge.', close: 'Close',
    talk: {
      eyebrow: 'NEW · Buddy cat', title: 'Now you can talk to your cat',
      lead: 'Connect the AI you already use and your cat really answers: small talk, worries, simple questions and word games. A friend, not a work assistant.',
      points: [
        ['🎭', '7 personalities', 'Sweet, tsundere, playful, chic, chatty, old-soul philosopher or lazy, plus your own description. Speech bubbles use the same personality.'],
        ['📝', 'Remembers and reminds', 'It keeps memory notes about you, and "remind me to brush my teeth in 30 minutes" just works. There is a focus timer too.'],
        ['⌨️', 'Always a shortcut away', '<b>Ctrl+Alt+K</b> (⌘+Option+K on Mac), the tray, or "Talk" when you hover over the cat.'],
      ],
      connectTitle: 'Connect any one of these',
      connect: [['Claude subscription', 'No key if you are signed in to Claude Code'], ['ChatGPT subscription', 'No key if you are signed in to Codex CLI'], ['Free Gemini key', 'No subscription needed · no card']],
      connectNote: 'Anthropic and OpenAI API keys work too. Chats are saved on your computer and only go to the AI you connected.',
      cta: 'Get the app and say hi →', ctaNote: 'Your cat grows even without connecting an AI',
      demoTitle: 'Try the chat', demoNote: 'Fortune and the initials quiz really work here. The fortune matches the app.',
      persona: 'Personality', placeholder: 'In the app, you can say anything here', placeholderQuiz: 'Type your answer', send: 'Send',
      sample: 'Example · in the app, your connected AI plays along',
      noAi: 'This is just a preview, so I can’t chat freely here… Connect an AI in the app and we can talk about anything!',
      greet: {
        angel: 'You’re here! How was your day? Try a game below 🐾',
        tsundere: 'Hmph, finally. …Not that I was waiting or anything',
        playful: 'Hehe, you came! What shall we play? I was soooo bored~',
        chic: 'Oh, hi. Talk if you want.',
        chatty: 'Hi hi! I saw three pigeons outside today! Oh wait, what did you do today?',
        sage: 'Welcome. What thoughts have you brought with you today?',
        lazy: 'Oh… you’re here…? Can we talk lying down…?',
      },
      bubbleNote: 'Its bubbles talk like this too:',
      balance: {
        q: 'Round {n}! If you could only pick one?',
        pairs: [['Summer forever', 'Winter forever'], ['Only ramen', 'Only fried chicken'], ['Bug-free code', 'No overtime ever'], ['Talk to cats', 'Nap like a cat'], ['A friend who replies in 1 second', 'A friend who picks perfect gifts']],
        same: ['Me too, {x}! Great minds', '{x}? Totally my taste!'],
        diff: ['I picked {y}… different tastes, meow', 'Oh, I went with {y}! Still love you'],
        end: 'That’s 3 rounds! In the app I bring new questions every time, 5 rounds 🐾',
      },
      wordchain: [['user', 'Let’s play word chain!'], ['cat', 'Okay! I’ll start: “cat”!'], ['user', 'tiger'], ['cat', 'Rabbit! Your turn, start with “t”~']],
      twenty: [['user', 'Let’s play twenty questions!'], ['cat', 'I’ve got one! Ask me yes/no questions (0/20)'], ['user', 'Can you eat it?'], ['cat', 'Yes! You can eat it (1/20)']],
      chosung: { right: 'Correct! It’s “{word}”! 🎉', wrong: 'Nope, not that one~', hint: 'Hint: it starts with “{c}”. No try used!', again: 'Play again' },
    },
    toolsEyebrow: 'Whatever AI you use', toolsTitle: 'Connects the way you work', toolsLead: 'Terminal or browser, it works either way. Pick your tool the first time you open it and the app walks you through connecting, one step at a time.',
    tools: [
      ['mood-thinking', 'Claude Code', 'In the terminal or IDE', 'Grows from your history and reacts right away to permission requests and finished work through hooks.'],
      ['c-mondaydev', 'Codex', 'In the terminal or IDE', 'Grows from your Codex sessions and tells you about permission requests and finished replies.'],
      ['mood-active', 'Claude · ChatGPT · Gemini', 'In the browser', 'Add a small extension (Chrome, Edge, Whale) and it grows while you chat on the web. It only reports sent, answered and length.'],
    ],
    dlEyebrow: 'Free', dlTitle: 'Get it now', dlLead: 'Installing takes about a minute.',
    win: { title: 'Windows', steps: ['Run the installer. It installs for your account (no admin rights) and opens right away.', 'If "Windows protected your PC" appears, click <b>More info → Run anyway</b>.', '<b>New versions install automatically.</b>'], req: 'Windows 10 / 11 (64-bit)' },
    mac: { title: 'Mac', steps: ['Open the dmg and drag Kit Commit into Applications.', 'The first time only: <b>System Settings → Privacy & Security → Open Anyway</b>.', 'For a new version, install the new dmg over the old one.'], req: 'macOS · Apple Silicon · Intel' },
    installMore: 'Full install guide',
    official: '<b>The only official downloads are this site and GitHub Releases.</b> Files posted anywhere else may have been modified. You can check a download by comparing its SHA-256 with the value above.',
    faqTitle: 'FAQ',
    faq: [
      ['Does it read my conversations?', 'No. For Claude Code and Codex it counts <b>only message counts, token numbers, timestamps and tool names</b> from the history files on your computer, and the browser extension reports <b>only sent, answered, length and time</b>. Conversation content is never stored or sent anywhere.'],
      ['Does talking to the cat cost money?', 'With a Claude or ChatGPT subscription, the cat talks through that subscription at no extra cost (it uses a little of your plan). No subscription? Start with a free Gemini key. Today’s fortune works with no AI at all. Your chats with the cat are saved on your computer and only go to the AI you connected.'],
      ['Can I use it with only the browser, without Claude Code or Codex?', 'Yes. Choose "Browser" in the intro and add the small extension (Chrome, Edge, Whale). The cat then grows while you use claude.ai, chatgpt.com or gemini.google.com. The app walks you through the install step by step.'],
      ['Is it free?', 'Yes. No payments, no ads.'],
      ['Is this an official Anthropic, OpenAI or Google app?', 'No. It is an unofficial fan-made app, not affiliated with any of them.'],
      ['What are hooks? Do I have to connect them?', 'Hooks let Claude Code / Codex tell the cat when work starts and ends. The cat grows from your history files either way, but with hooks it reacts instantly to finished replies and permission requests. Your existing settings are kept, and a backup is made.'],
      ['Will it get in my way?', 'The cat walks along the bottom of the screen and only takes clicks on its own body. Bubbles appear only when it matters, and you can resize it, mute it, hide it for an hour, or turn on do-not-disturb.'],
      ['Why does my Mac show a warning?', 'This beta is not signed with a paid Apple Developer account, so you allow it once in System Settings. After that it opens normally.'],
    ],
    ctaTitle: 'A cat to work with, starting today', ctaLead: 'One small cat can make a working day a little more fun.',
    footer: ['Kit Commit is an unofficial fan-made app. It is not affiliated with, made by, or endorsed by Anthropic, OpenAI or Google. Claude and Claude Code are trademarks of Anthropic; ChatGPT and Codex are trademarks of OpenAI; Gemini is a trademark of Google.', '© 2026 Elliott Park. Free to use, but not open source; redistribution and modification are not permitted.'],
    footLinks: [['GitHub Releases', REL], ['License', REPO + '/blob/main/LICENSE'], ['Bugs & ideas', REPO + '/issues']],
  },
};

// 첫 화면 터미널 연기 (영어 그대로). 단계: p 입력 · o 출력 · a 허락 묻기 · d 끝. 고양이가 단계마다 따라 움직인다 (site.js)
const TERM = [
  { cmd: 'fix the login redirect bug', out: ['Reading src/auth/login.ts', 'Editing 2 files'], ask: 'Allow Bash: npm test?', after: ['42 tests passed'], done: 'Done in 7m 12s', end: 'm-donebell', long: true },
  { cmd: 'add a dark mode toggle', out: ['Reading src/theme.css', 'Writing src/ThemeToggle.tsx'], ask: 'Allow Bash: npm run build?', after: ['Build succeeded'], done: 'Done in 1m 52s', end: 'm-cicheck' },
  { cmd: 'deploy to staging', out: ['Checking git status', 'Running release script'], ask: 'Allow Bash: npm run deploy?', after: ['Uploaded 14 files'], done: 'Deployed in 3m 05s', end: 'm-deployrocket' },
];

// 대화 맛보기 (0.5.0): 냥운세 · 초성 퀴즈 문제 · 성격 이름 · 성격별 점심 말풍선은 앱에서 그대로 뽑아 온다
// (스크래치패드 extract-chat.js: 앱 src/renderer/i18n.js + src/main/companion.js → site/chat.json). 운세는 앱과 같은 날짜 시드라 결과도 같다
const CHAT = JSON.parse(fs.readFileSync(path.join(__dirname, 'chat.json'), 'utf8'));

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
  // 모션 · 세트는 일부만 보여 주니 전체 수를 같이 단다 (동네 친구는 전부)
  const totals = { motions: 87, costumes: 320 };
  const motionNames = Object.fromEntries(RANDOM.map((k) => ['m-' + k, NAMES.m[k][i]]));
  const chat = CHAT[t.lang];
  const KC = { base: b + 'assets/sprites/', sprites: SPRITES, lines: t.lines, names: t.names, motionNames, randomMotions: RANDOM.map((k) => 'm-' + k), term: TERM, foods: FOODS, toys: t.toys, ui: t.ui,
    chat: { ...chat, talk: t.talk, lang: t.lang } };
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
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:type" content="website">
<meta property="og:url" content="${SITE}${t.lang === 'en' ? '' : 'ko/'}">
<meta property="og:locale" content="${t.lang === 'en' ? 'en_US' : 'ko_KR'}">
<meta property="og:site_name" content="Kit Commit">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#faf6ef">
<link rel="canonical" href="${SITE}${t.lang === 'en' ? '' : 'ko/'}">
<link rel="alternate" hreflang="en" href="${SITE}">
<link rel="alternate" hreflang="ko" href="${SITE}ko/">
<link rel="alternate" hreflang="x-default" href="${SITE}">
<link rel="icon" href="${b}assets/icon.png">
<link rel="preconnect" href="https://cdn.jsdelivr.net">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/galmuri/dist/galmuri.css">
<link rel="stylesheet" href="${b}assets/site.css?v=${ver('site.css')}">
</head>
<body>
<header class="top"><div class="wrap">
  <a class="brand" href="./"><img src="${b}assets/icon.png" alt="">Kit Commit</a>
  <nav class="nav">${t.nav.map(([h, l]) => `<a href="${h}">${l}</a>`).join('')}</nav>
  <a class="lang" href="${otherHref}">${t.otherLabel}</a>
  <button type="button" class="lang view" data-view-toggle><span class="to-mobile">${t.viewMobile}</span><span class="to-desktop">${t.viewDesktop}</span></button>
  <a class="btn primary sm" href="#download">${t.nav[t.nav.length - 1][1]}</a>
</div></header>

<section class="hero"><div class="wrap">
  <div class="hero-grid">
    <div>
      <a class="news" href="#talk"><b>${t.news[0]}</b><span>${t.news[1]}</span><i>→</i></a>
      <span class="eyebrow">${t.eyebrow}</span>
      <h1>${t.h1}</h1>
      <p class="lead">${t.lead}</p>
      <div class="ctas">${dlButtons}
      </div>
      <p class="meta">${t.meta} · <span data-ver></span></p>
      <p class="mobile-note" hidden>${t.mobile} <button type="button" data-send data-title="${t.sendTitle}" data-text="${t.sendText}" hidden>${t.send}</button> <a class="mail" data-mail data-title="${t.sendTitle}" data-text="${t.sendText}" href="#">${t.mail}</a> <button type="button" data-copy data-done="${t.copied}">${t.copy}</button></p>
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

<section class="alt" id="tools"><div class="wrap center">
  <span class="eyebrow">${t.toolsEyebrow}</span>
  <h2>${t.toolsTitle}</h2>
  <p class="lead">${t.toolsLead}</p>
  <div class="tools">
    ${t.tools.map(([s, h, where, p]) => `<div class="card">${sp(s)}<div><span class="where">${where}</span><h3>${h}</h3><p>${p}</p></div></div>`).join('\n    ')}
  </div>
</div></section>

<section id="features"><div class="wrap center">
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

<section id="talk"><div class="wrap">
  <div class="talk-grid">
    <div class="talk-copy">
      <span class="eyebrow">${t.talk.eyebrow}</span>
      <h2>${t.talk.title}</h2>
      <p class="lead">${t.talk.lead}</p>
      <ul class="talk-points">${t.talk.points.map(([ico, h, p]) => `<li><span class="ico">${ico}</span><div><h3>${h}</h3><p>${p}</p></div></li>`).join('')}</ul>
      <div class="connect">
        <h3>${t.talk.connectTitle}</h3>
        <ol>${t.talk.connect.map(([h, p]) => `<li><b>${h}</b><span>${p}</span></li>`).join('')}</ol>
        <p class="note">${t.talk.connectNote}</p>
      </div>
      <p class="talk-cta"><a class="btn primary" href="#download">${t.talk.cta}</a><span>${t.talk.ctaNote}</span></p>
    </div>
    <div class="talk-demo">
      <div class="chatdemo" id="chatdemo">
        <div class="cd-head">${sp('a-wave', 'class="cd-cat"')}<div><b>${t.names.cat}</b><span>${t.talk.demoTitle}</span></div></div>
        <div class="cd-persona" role="radiogroup" aria-label="${t.talk.persona}"><span>${t.talk.persona}</span>${chat.personas.map(([k, l], j) => `<button type="button" role="radio" data-persona="${k}" aria-checked="${j ? 'false' : 'true'}">${l}</button>`).join('')}</div>
        <div class="cd-log" aria-live="polite"></div>
        <div class="cd-chips">${['wordchain', 'twenty', 'balance', 'chosung', 'fortune'].map((g) => `<button type="button" data-game="${g}">${g === 'fortune' ? '✨ ' : ''}${chat.games[g][1]}</button>`).join('')}</div>
        <form class="cd-input"><input type="text" maxlength="40" autocomplete="off" placeholder="${t.talk.placeholder}" aria-label="${t.talk.placeholder}"><button type="submit">${t.talk.send}</button></form>
      </div>
      <p class="note">${t.talk.demoNote}</p>
    </div>
  </div>
</div></section>

<section class="alt" id="day"><div class="wrap center">
  <span class="eyebrow">${t.dayEyebrow}</span>
  <h2>${t.dayTitle}</h2>
  <p class="lead">${t.dayLead}</p>
  <div class="day">
    ${t.day.map(([time, s, h, line, cls]) => `<div class="moment"><span class="time">${time}</span><div class="card"><div class="sp-box"><div class="bubble ${cls}">${line}</div>${sp(s)}</div><h3>${h}</h3></div></div>`).join('\n    ')}
  </div>
  <p class="swipe">${t.swipe}</p>
</div></section>

<section id="gallery"><div class="wrap center">
  <span class="eyebrow">${t.galEyebrow}</span>
  <h2>${t.galTitle}</h2>
  <p class="lead">${t.galLead}</p>
  <div class="tabs" role="tablist">${t.tabs.map(([k, l, note], j) => `<button role="tab" data-tab="${k}" data-note="${note}" aria-selected="${j ? 'false' : 'true'}" class="${j ? '' : 'on'}">${l} <i>${counts[k]}${totals[k] ? `<span class="of"> / ${totals[k]}</span>` : ''}</i></button>`).join('')}</div>
  <p class="tab-note" id="tab-note">${t.tabs[0][2]}</p>
  <div class="grid g6" data-panel="motions">${gm}</div>
  <div class="grid g6" data-panel="costumes" hidden>${gc}</div>
  <div class="grid g4" data-panel="friends" hidden>${gf}</div>
  <p class="gal-more">${t.galMore}</p>
</div></section>

<section class="alt" id="more"><div class="wrap center">
  <span class="eyebrow">${t.growEyebrow}</span>
  <h2>${t.growTitle}</h2>
  <p class="lead">${t.growLead}</p>
  <div class="stats">${t.stats.map(([n, l]) => `<div class="stat"><b>${n}</b><span>${l}</span></div>`).join('')}</div>
  <div class="todo">${t.todo.map(([ico, h, p]) => `<div class="card"><span class="ico">${ico}</span><div><h3>${h}</h3><p>${p}</p></div></div>`).join('')}</div>
  <div class="shots" data-close-label="${t.close}">${t.shots.map(([f, c]) => `<figure><button type="button" class="shot" aria-label="${c}"><img src="${b}assets/shots/${t.lang}/${f}.png" alt="${c}" width="544" height="741" loading="lazy"></button><figcaption>${c}</figcaption></figure>`).join('')}</div>
  <p class="note">${t.shotsNote}</p>
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

<section class="alt" id="faq"><div class="wrap center">
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
<script src="${b}assets/site.js?v=${ver('site.js')}"></script>
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
