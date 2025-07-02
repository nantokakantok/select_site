// アプリケーションの状態管理
class DecisionApp {
    constructor() {
        this.historyKey = 'decision_history';
        this.init();
    }

    // アプリケーションの初期化
    init() {
        this.bindEvents();
        this.loadHistory();
        this.updateResultDisplay();
    }

    // イベントリスナーの設定
    bindEvents() {
        const decideBtn = document.getElementById('decide-btn');
        const clearAllBtn = document.getElementById('clear-all-btn');
        const choicesInput = document.getElementById('choices-input');

        decideBtn.addEventListener('click', () => this.makeDecision());
        clearAllBtn.addEventListener('click', () => this.clearAllHistory());
        
        // エンターキーでの決断実行（Ctrl+Enterまたはテキストエリア外でEnter）
        choicesInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
                e.preventDefault();
                this.makeDecision();
            }
        });

        // 入力内容の変化に応じてボタンの状態を更新
        choicesInput.addEventListener('input', () => this.updateDecideButton());
        
        // 初期状態でボタンの状態を設定
        this.updateDecideButton();
    }

    // 決断ボタンの有効/無効状態を更新
    updateDecideButton() {
        const choicesInput = document.getElementById('choices-input');
        const decideBtn = document.getElementById('decide-btn');
        const choices = this.parseChoices(choicesInput.value);
        
        decideBtn.disabled = choices.length < 2;
    }

    // 選択肢の解析（カンマ区切りまたは改行区切り）
    parseChoices(input) {
        if (!input.trim()) return [];

        // 改行区切りを優先的に処理
        let choices = input.split('\n')
            .map(choice => choice.trim())
            .filter(choice => choice.length > 0);

        // 改行区切りで複数の選択肢が見つからない場合、カンマ区切りを試行
        if (choices.length <= 1) {
            choices = input.split(',')
                .map(choice => choice.trim())
                .filter(choice => choice.length > 0);
        }

        return choices;
    }

    // 決断を実行
    makeDecision() {
        const choicesInput = document.getElementById('choices-input');
        const inputValue = choicesInput.value.trim();

        if (!inputValue) {
            alert('選択肢を入力してください。');
            choicesInput.focus();
            return;
        }

        const choices = this.parseChoices(inputValue);

        if (choices.length < 2) {
            alert('2つ以上の選択肢を入力してください。');
            choicesInput.focus();
            return;
        }

        // ランダムに選択
        const randomIndex = Math.floor(Math.random() * choices.length);
        const selectedChoice = choices[randomIndex];

        // 結果を表示
        this.displayResult(selectedChoice);

        // 履歴に保存
        this.saveToHistory(choices, selectedChoice);

        // 履歴を再表示
        this.loadHistory();
    }

    // 結果を画面に表示
    displayResult(result) {
        const resultText = document.getElementById('result-text');
        
        // アニメーションクラスをリセット
        resultText.classList.remove('animate');
        
        // 結果を設定
        resultText.textContent = result;
        
        // アニメーションを適用（非同期で追加）
        setTimeout(() => {
            resultText.classList.add('animate');
        }, 10);

        // スクリーンリーダー用の通知
        this.announceToScreenReader(`決断結果: ${result}`);
    }

    // 初期状態の結果表示を更新
    updateResultDisplay() {
        const history = this.getHistory();
        const resultText = document.getElementById('result-text');
        
        if (history.length > 0) {
            const lastResult = history[0].result;
            resultText.textContent = lastResult;
        } else {
            resultText.textContent = 'ここに結果が表示されます';
        }
    }

    // 履歴をローカルストレージに保存
    saveToHistory(choices, result) {
        const history = this.getHistory();
        const newEntry = {
            date: new Date().toISOString(),
            choices: choices,
            result: result
        };

        // 新しいエントリを先頭に追加
        history.unshift(newEntry);

        // 履歴の上限（例：100件）
        const maxHistorySize = 100;
        if (history.length > maxHistorySize) {
            history.splice(maxHistorySize);
        }

        localStorage.setItem(this.historyKey, JSON.stringify(history));
    }

    // ローカルストレージから履歴を取得
    getHistory() {
        try {
            const historyJson = localStorage.getItem(this.historyKey);
            return historyJson ? JSON.parse(historyJson) : [];
        } catch (error) {
            console.error('履歴の読み込みに失敗しました:', error);
            return [];
        }
    }

    // 履歴を画面に表示
    loadHistory() {
        const historyList = document.getElementById('history-list');
        const history = this.getHistory();

        if (history.length === 0) {
            historyList.innerHTML = '<div class="no-history">まだ履歴がありません</div>';
            return;
        }

        const historyHtml = history.map((entry, index) => {
            const date = new Date(entry.date);
            const formattedDate = this.formatDate(date);
            const choicesText = entry.choices.join(', ');
            
            // 選択肢が長い場合は省略
            const truncatedChoices = choicesText.length > 50 
                ? choicesText.substring(0, 50) + '...' 
                : choicesText;

            return `
                <div class="history-item">
                    <div class="history-content">
                        <div class="history-date">${formattedDate}</div>
                        <div class="history-choices">選択肢: ${this.escapeHtml(truncatedChoices)}</div>
                        <div class="history-result">結果: ${this.escapeHtml(entry.result)}</div>
                    </div>
                    <button class="delete-btn" 
                            onclick="app.deleteHistoryItem(${index})"
                            aria-label="この履歴を削除">
                        削除
                    </button>
                </div>
            `;
        }).join('');

        historyList.innerHTML = historyHtml;
    }

    // 日付をフォーマット
    formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${year}/${month}/${day} ${hours}:${minutes}`;
    }

    // HTMLエスケープ
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // 個別履歴項目の削除
    deleteHistoryItem(index) {
        if (!confirm('この履歴を削除しますか？')) {
            return;
        }

        const history = this.getHistory();
        history.splice(index, 1);
        localStorage.setItem(this.historyKey, JSON.stringify(history));
        
        this.loadHistory();
        this.updateResultDisplay();
        
        this.announceToScreenReader('履歴を削除しました');
    }

    // 全履歴の削除
    clearAllHistory() {
        if (!confirm('すべての履歴を削除しますか？この操作は元に戻せません。')) {
            return;
        }

        localStorage.removeItem(this.historyKey);
        this.loadHistory();
        this.updateResultDisplay();
        
        this.announceToScreenReader('すべての履歴を削除しました');
    }

    // スクリーンリーダー用のアナウンス
    announceToScreenReader(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.style.position = 'absolute';
        announcement.style.left = '-10000px';
        announcement.style.width = '1px';
        announcement.style.height = '1px';
        announcement.style.overflow = 'hidden';
        
        document.body.appendChild(announcement);
        announcement.textContent = message;
        
        // 3秒後に要素を削除
        setTimeout(() => {
            if (announcement.parentNode) {
                announcement.parentNode.removeChild(announcement);
            }
        }, 3000);
    }
}

// アプリケーションの初期化
let app;

document.addEventListener('DOMContentLoaded', () => {
    app = new DecisionApp();
});

// エラーハンドリング
window.addEventListener('error', (event) => {
    console.error('アプリケーションエラー:', event.error);
    alert('申し訳ございません。エラーが発生しました。ページを再読み込みしてください。');
});

// ローカルストレージの容量チェック（オプション）
function checkLocalStorageQuota() {
    try {
        const testKey = 'quota_test';
        const testData = 'x'.repeat(1024); // 1KB
        localStorage.setItem(testKey, testData);
        localStorage.removeItem(testKey);
        return true;
    } catch (error) {
        console.warn('ローカルストレージの容量が不足している可能性があります:', error);
        return false;
    }
}

// サービスワーカーの登録（PWA化する場合の準備）
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // 現時点ではサービスワーカーは実装しないが、将来の拡張のための準備
        console.log('Service Worker対応ブラウザです');
    });
}
