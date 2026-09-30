[English](README.md) | **한국어**

# Kit Commit (킷커밋) — 공식 다운로드

Claude Code(또는 Codex)를 쓸수록 자라는 데스크톱 도트 고양이. 화면 구석에서 같이 일하고, 점심·휴식·잠잘 시간을 챙겨준다.

**소개 사이트: [elliott-json-park.github.io/kitcommit-releases/ko](https://elliott-json-park.github.io/kitcommit-releases/ko/)** — 움직이는 고양이를 보고 브라우저에서 직접 놀아 볼 수 있다.

> **킷커밋을 받을 수 있는 공식 창구는 여기 하나뿐입니다.**
> 반드시 **[Releases](https://github.com/elliott-json-park/kitcommit-releases/releases)** 에서 받아 주세요. 다른 사이트·파일 공유 서비스·앱 스토어에 올라온 파일은 공식이 아니며, 고쳐진 파일일 수 있습니다. 발견하면 [Issues](https://github.com/elliott-json-park/kitcommit-releases/issues) 로 알려 주세요.

이 저장소에는 배포 파일만 있습니다. 소스 코드는 비공개입니다.

## 받기

**[Releases](https://github.com/elliott-json-park/kitcommit-releases/releases)** 페이지에서 가장 최근 버전을 열고 받는다.

| 컴퓨터 | 파일 |
|---|---|
| 윈도우 10/11 (64비트) | `KitCommit-Setup-<버전>.exe` |
| 맥 (M칩·인텔) | `KitCommit-<버전>.dmg` |

진짜 파일인지 확인하려면, 받은 파일의 SHA-256 값을 릴리스 설명에 적힌 값과 비교한다.

- 윈도우 (PowerShell): `Get-FileHash KitCommit-Setup-<버전>.exe`
- 맥 (터미널): `shasum -a 256 KitCommit-<버전>.dmg`

## 윈도우에 설치하기

`KitCommit-Setup-<버전>.exe` 를 실행한다. 관리자 권한 없이 내 계정에만 설치되고, 끝나면 킷커밋이 켜진다.

- 아직 코드 서명을 하지 않아서 **"Windows의 PC 보호"** 창이 뜰 수 있다. **추가 정보 → 실행** 을 누른다.
- **업데이트는 자동이다.** 앱이 뒤에서 새 버전을 확인해 받아 두고, 다음에 앱을 끄거나 다시 켤 때 설치한다 (트레이 메뉴의 **설치하고 다시 켜기** 로 바로 할 수도 있다).
- 지울 때는 **설정 → 앱** 에서. 키우던 기록(`%APPDATA%/Kit Commit`)은 남는다.
- 설치 없이 켜던 테스트 버전(`.exe` 하나)을 쓰던 사람도 이걸 설치하면 된다. 키우던 기록이 그대로 이어진다.

## 맥에 설치하기

Apple 개발자 계정(유료)으로 서명하지 않은 베타라서, **처음 한 번만** 맥이 막는 걸 풀어 줘야 한다. 그다음부터는 그냥 열린다.

1. `KitCommit-<버전>.dmg` 를 연다
2. 창에 보이는 **Kit Commit** 아이콘을 옆의 **Applications(응용 프로그램)** 폴더로 끌어 놓는다
3. 응용 프로그램 폴더에서 Kit Commit 을 연다 → "확인되지 않은 개발자" 같은 경고가 뜨면 **완료(또는 취소)** 를 누른다
4. **시스템 설정 → 개인정보 보호 및 보안** 을 열고 아래로 내리면 "Kit Commit 이(가) 차단되었습니다" 옆에 **그래도 열기** 가 있다. 누르고 암호를 넣는다
5. 다시 Kit Commit 을 열고 **열기** 를 누른다

"손상되었기 때문에 열 수 없습니다" 가 뜨면 **터미널** 앱을 열고 아래 한 줄을 붙여 넣은 뒤 엔터를 누른다. 그리고 다시 연다.

```bash
xattr -dr com.apple.quarantine "/Applications/Kit Commit.app"
```

맥은 아직 자동 업데이트가 안 된다. 새 버전이 나오면 새 dmg 로 같은 방법으로 덮어 설치한다. 키우던 기록은 그대로 남는다.

## 개인정보

킷커밋은 이 컴퓨터의 Claude Code(`~/.claude/projects`) 또는 Codex(`~/.codex/sessions`) 기록 파일을 읽고 **개수·토큰 수·시각·도구 이름만** 남긴다. 대화 내용은 저장하지도, 어디로 보내지도 않는다. 계산은 모두 이 컴퓨터 안에서 한다.

## 라이선스

무료로 받아 쓸 수 있지만 **오픈소스가 아니며 모든 권리는 저작자에게 있다.** 앱을 다른 곳에 다시 올리거나 팔거나 고쳐 배포할 수 없고, 코드·도트 그림·캐릭터를 다른 곳에 쓸 수 없다. 자세한 내용은 [LICENSE](LICENSE).

> **비공식 팬메이드 앱입니다.** Anthropic·OpenAI 와 관련이 없고, 두 회사가 만들거나 보증하지 않습니다. Claude 와 Claude Code 는 Anthropic 의 상표이고, Codex 는 OpenAI 의 상표입니다.

## 의견 보내기

버그 제보와 아이디어는 [Issues](https://github.com/elliott-json-park/kitcommit-releases/issues) 로 보내 주세요.
