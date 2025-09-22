// 복사 기능 수정 스크립트

// 탭 전환 함수 수정
window.switchTab = function(event, tabName) {
    // 모든 탭 비활성화
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });

    // 선택된 탭 활성화
    if (event && event.target) {
        event.target.classList.add('active');
    } else {
        // 프로그래밍 방식으로 호출된 경우
        const tabs = ['prd', 'trd', 'userflow', 'prompt', 'oneshot'];
        const index = tabs.indexOf(tabName);
        const tabButtons = document.querySelectorAll('.tab');
        if (tabButtons[index]) {
            tabButtons[index].classList.add('active');
        }
    }

    // 문서 내용 표시
    const content = window.generatedDocuments[tabName] || '문서를 생성 중입니다...';
    document.getElementById('documentText').textContent = content;
};

// 복사 함수 수정
window.copyDocument = function() {
    const activeTab = document.querySelector('.tab.active');
    if (!activeTab) {
        window.showStatus('먼저 문서를 선택해주세요.', 'error');
        return;
    }

    const tabText = activeTab.textContent;
    let docKey = '';

    // 탭 텍스트를 문서 키로 변환
    if (tabText === 'PRD') docKey = 'prd';
    else if (tabText === 'TRD') docKey = 'trd';
    else if (tabText === 'User Flow') docKey = 'userflow';
    else if (tabText === 'Prompt Design') docKey = 'prompt';
    else if (tabText === '원샷 프롬프트') docKey = 'oneshot';

    const content = window.generatedDocuments[docKey];

    if (content) {
        // 먼저 navigator.clipboard 시도
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(content).then(() => {
                window.showStatus('클립보드에 복사되었습니다!', 'success');
            }).catch(err => {
                console.error('Clipboard API 실패:', err);
                // fallback 방법 사용
                fallbackCopyTextToClipboard(content);
            });
        } else {
            // navigator.clipboard를 사용할 수 없는 경우 fallback
            fallbackCopyTextToClipboard(content);
        }
    } else {
        window.showStatus('복사할 문서가 없습니다.', 'error');
    }
};

// Fallback 복사 함수
function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.width = '2em';
    textArea.style.height = '2em';
    textArea.style.padding = '0';
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';
    textArea.style.background = 'transparent';

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        const successful = document.execCommand('copy');
        if (successful) {
            window.showStatus('클립보드에 복사되었습니다!', 'success');
        } else {
            window.showStatus('복사에 실패했습니다.', 'error');
        }
    } catch (err) {
        window.showStatus('복사에 실패했습니다.', 'error');
        console.error('Fallback: 복사 실패', err);
    }

    document.body.removeChild(textArea);
}

console.log('복사 기능 수정 스크립트 로드됨');