document.addEventListener('DOMContentLoaded', () => {

    // --- STATE MANAGEMENT ---
    const state = {
        currentStep: -2, // -2: welcome, -1: wine selection, 0-n: questions, n+1: confirm, n+2: result
        selectedWine: null,
        userAnswers: {},
        poemData: null,
    };

    const svgIcons = {
        sparkle: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14l-5-4.87 8.91-1.01L12 2z"/></svg>',
        wineGlass: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 22h8"/><path d="M12 15V3"/><path d="M12 3s7 0 7 5v3c0 2.8-2.2 5-5 5H10c-2.8 0-5-2.2-5-5V8c0-5 7-5 7-5z"/></svg>',
        check: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
        mood: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><path d="M9 9h.01"/><path d="M15 9h.01"/></svg>', // Simple smiley for mood
        journey: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>', // House for journey
        senses: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20v-6"/><path d="M12 14a4 4 0 1 1 0-8 4 4 0 0 1 0 8z"/><path d="M12 4V2"/><path d="M18.5 15.5l-2.5-2.5"/><path d="M22 12h-2"/><path d="M18.5 8.5l-2.5 2.5"/><path d="M12 22v-2"/><path d="M5.5 15.5l2.5-2.5"/><path d="M2 12h2"/><path d="M5.5 8.5l2.5 2.5"/></svg>', // Sun for senses
        imagination: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>', // Shield for imagination
        reflection: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a7 7 0 0 0-7 7c0 4.2 4.3 7.5 7 11 2.7-3.5 7-6.8 7-11a7 7 0 0 0-7-7z"/><path d="M12 9a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/></svg>', // Map pin for reflection
    };

    const wines = [
        { id: 'wine1', name: 'Château Étoile （シャトー・エトワール）', description: 'フランス・ブルゴーニュ地方産 赤ワイン（ピノ・ノワール）。深いルビー色。チェリーやスミレの香りに、スパイスのニュアンス。繊細で長い余韻を持つエレガントなワイン。', image: 'images/wine1.png' },
        { id: 'wine2', name: 'Sol de Verano （ソル・デ・ベラーノ）', description: 'スペイン・リオハ産 白ワイン（ヴィウラ主体）。黄金色。トロピカルフルーツやハーブの香り。フレッシュで爽やか、夏の太陽を思わせる軽快な味わい。', image: 'images/wine2.png' },
        { id: 'wine3', name: 'Luna Rosa （ルナ・ロサ）', description: 'イタリア・シチリア産 ロゼワイン（ネロ・ダヴォラ＆フラッパート）。美しいサーモンピンク。野イチゴやバラの香り、ほのかな塩味が心地よい。優雅でロマンチックな味わい。', image: 'images/wine3.png' },
        { id: 'wine4', name: 'Aurum Fizz （オーラム・フィズ）', description: '南アフリカ・ステレンボッシュ産 スパークリングワイン（シャルドネ＆ピノ・ノワール）。淡い黄金色の泡。青リンゴや焼きたてのパンの香り。爽やかでクリスピー、特別な瞬間を彩る華やかさ。', image: 'images/wine4.png' },
    ];

    const questions = [
        { id: 'q1', category: 'mood', icon: 'mood', title: '今の気分は？', text: '今のあなたの気分に一番近いものを選んでください。', type: 'choice', options: ['穏やか', '活発', '神秘的', '情熱的'] },
        { id: 'q2', category: 'journey', icon: 'journey', title: '理想の旅は？', text: '心惹かれる旅のスタイルを選んでください。', type: 'choice', options: ['自然の中でのんびり', '都会で刺激的に', '歴史を感じる旅', '未知の冒険'] },
        { id: 'q3', category: 'senses', icon: 'senses', title: '好きな音は？', text: '心地よいと感じる音を選んでください。', type: 'choice', options: ['波の音', '鳥のさえずり', '都会の喧騒', '静寂'] },
        { id: 'q4', category: 'imagination', icon: 'imagination', title: 'どんな物語が好き？', text: 'あなたが主人公になりたい物語のジャンルを選んでください。', type: 'choice', options: ['ファンタジー', 'SF', 'ミステリー', 'ロマンス'] },
        // ...existing code...
    ];

    // --- DOM ELEMENTS ---
    const screens = {
        welcome: document.getElementById('welcome-screen'),
        wineSelection: document.getElementById('wine-selection-screen'),
        question: document.getElementById('question-screen'),
        confirm: document.getElementById('confirm-screen'),
        result: document.getElementById('result-screen'),
    };

    const progressBar = document.getElementById('progress-bar');
    const questionElements = {
        categoryIcon: document.getElementById('question-category-icon'),
        title: document.getElementById('question-title'),
        text: document.getElementById('question-text'),
        input: document.getElementById('answer-input'),
    };
    const answersList = document.getElementById('answers-list');
    const wineLabelContainer = document.getElementById('wine-label-container');
    const wineListContainer = document.getElementById('wine-list');

    const buttons = {
        start: document.getElementById('welcome-start-btn'),
        selectWine: document.getElementById('select-wine-btn'),
        backToWelcome: document.getElementById('back-to-welcome-btn'),
        next: document.getElementById('next-btn'),
        back: document.getElementById('back-btn'),
        edit: document.getElementById('edit-btn'),
        submit: document.getElementById('submit-btn'),
        download: document.getElementById('download-btn'),
        restart: document.getElementById('restart-btn'),
        backFromConfirm: document.getElementById('back-from-confirm-btn'),
        backFromResult: document.getElementById('back-from-result-btn'),
    };

    // --- RENDER FUNCTIONS ---

    function navigateTo(step) {
        state.currentStep = step;
        render();
    }

    function render() {
        // Hide all screens
        Object.values(screens).forEach(s => s.classList.remove('active'));

        if (state.currentStep === -2) { // Welcome Screen
            screens.welcome.classList.add('active');
        } else if (state.currentStep === -1) { // Wine Selection Screen
            screens.wineSelection.classList.add('active');
            renderWineSelection();
        } else if (state.currentStep < questions.length) { // Question Screen
            screens.question.classList.add('active');
            renderQuestion();
        } else if (state.currentStep === questions.length) { // Confirm Screen
            screens.confirm.classList.add('active');
            renderConfirmation();
        } else { // Result Screen
            screens.result.classList.add('active');
            renderResult();
        }
    }

    function renderWineSelection() {
        wineListContainer.innerHTML = '';
        wines.forEach(wine => {
            const wineItem = document.createElement('div');
            wineItem.className = 'wine-item';
            wineItem.dataset.id = wine.id;
            wineItem.innerHTML = `
                <img src="${wine.image}" alt="${wine.name}">
                <h3>${wine.name}</h3>
                <p>${wine.description}</p>
            `;
            wineItem.addEventListener('click', () => {
                // Remove active class from previously selected wine
                const currentActive = wineListContainer.querySelector('.wine-item.active');
                if (currentActive) {
                    currentActive.classList.remove('active');
                }
                // Add active class to clicked wine
                wineItem.classList.add('active');
                state.selectedWine = wine.id;
                buttons.selectWine.disabled = false;
            });
            wineListContainer.appendChild(wineItem);
        });
        // Reset select wine button state
        buttons.selectWine.disabled = !state.selectedWine;
    }

    function renderQuestion() {
        const question = questions[state.currentStep];
        questionElements.categoryIcon.innerHTML = svgIcons[question.icon];
        questionElements.title.textContent = question.title;
        questionElements.text.textContent = question.text;

        const answerInput = questionElements.input;
        const choiceButtonsContainer = document.getElementById('choice-buttons-container');

        if (question.type === 'text') {
            answerInput.style.display = 'block';
            choiceButtonsContainer.style.display = 'none';
            answerInput.value = state.userAnswers[question.id] || '';
            answerInput.focus();
            buttons.next.disabled = !answerInput.value.trim(); // Enable/disable next button based on input
            answerInput.oninput = () => {
                buttons.next.disabled = !answerInput.value.trim();
            };
        } else if (question.type === 'choice') {
            answerInput.style.display = 'none';
            choiceButtonsContainer.style.display = 'flex';
            choiceButtonsContainer.innerHTML = '';
            buttons.next.disabled = !state.userAnswers[question.id]; // Disable next button if no choice selected

            question.options.forEach(option => {
                const button = document.createElement('button');
                button.className = 'btn btn-secondary choice-btn';
                button.textContent = option;
                if (state.userAnswers[question.id] === option) {
                    button.classList.add('active');
                }
                button.addEventListener('click', () => {
                    // Remove active from other buttons
                    choiceButtonsContainer.querySelectorAll('.choice-btn').forEach(btn => btn.classList.remove('active'));
                    button.classList.add('active');
                    state.userAnswers[question.id] = option;
                    buttons.next.disabled = false; // Enable next button on choice
                });
                choiceButtonsContainer.appendChild(button);
            });
        }

        // Update progress bar
        const progress = ((state.currentStep + 1) / questions.length) * 100;
        progressBar.style.width = `${progress}%`;

        // Show/hide back button (always visible, logic handled by navigateTo)
        buttons.back.style.visibility = 'visible';
    }

    function renderConfirmation() {
        answersList.innerHTML = '';
        questions.forEach(q => {
            const answer = state.userAnswers[q.id] || '（未回答）';
            const item = document.createElement('div');
            item.className = 'answer-item';
            item.innerHTML = `<h4>${q.title}</h4><p>${answer}</p>`;
            answersList.appendChild(item);
        });
    }

    function renderResult() {
        if (!state.poemData) {
            wineLabelContainer.innerHTML = '<p>ポエムを生成中です...</p>';
            return;
        }
        const { title, verses, art } = state.poemData;

        wineLabelContainer.innerHTML = `
            <div class="wine-label-art" style="background: ${art.background};"></div>
            <div class="wine-label-content" style="color: ${art.textColor};">
                <h3>${title}</h3>
                <div class="poem-animated" style="font-family: 'Dancing Script', cursive; font-size: 1.2em;"></div>
            </div>
        `;
        // アニメーションで詩を一文字ずつ表示
        const poemContainer = wineLabelContainer.querySelector('.poem-animated');
        let verseIdx = 0;
        function showVerse() {
            if (verseIdx < verses.length) {
                const p = document.createElement('p');
                p.className = 'poem-line-animated';
                // 一文字ずつspanでラップ
                p.innerHTML = verses[verseIdx].split('').map((ch, i) => `<span style="opacity:0;display:inline-block;transition:opacity 0.5s ${i*0.07}s;">${ch}</span>`).join('');
                poemContainer.appendChild(p);
                // トリガー: 少し遅延してopacityを1に
                setTimeout(() => {
                    p.querySelectorAll('span').forEach(span => { span.style.opacity = 1; });
                }, 100);
                verseIdx++;
                setTimeout(showVerse, 600); // 次の行を順次表示
            }
        }
        showVerse();
    }

    // --- API & LOGIC ---

    async function handleSubmit() {
        // Show loading spinner
        const originalButtonContent = buttons.submit.innerHTML;
        buttons.submit.innerHTML = '<div class="spinner"></div>';
        buttons.submit.disabled = true;

        try {
            // API送信先IPアドレス（例: 192.168.1.100）
            const API_URL = 'http://192.168.1.100:5000/generate-poem';
            // 送信データ
            const payload = {
                wine: state.selectedWine,
                answers: state.userAnswers
            };
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
            if (!response.ok) {
                throw new Error('API request failed: ' + response.status);
            }
            const poemData = await response.json();
            // poemData: { title, verses, art }
            state.poemData = poemData;
            navigateTo(state.currentStep + 1);
        } catch (error) {
            console.error('Poem generation failed:', error);
            wineLabelContainer.innerHTML = '<p style="color:red;">Failed to generate poem. Please try again later.</p>';
            alert('エラーが発生しました。もう一度お試しください。');
        } finally {
            // Restore button
            buttons.submit.innerHTML = originalButtonContent;
            buttons.submit.disabled = false;
        }
    }

    function mockApiCall(answers) {
        console.log('APIに送信された回答:', answers);
        return new Promise(resolve => {
            setTimeout(() => {
                const allText = Object.values(answers).join(' ');
                const title = allText.includes('sea') ? 'Memory of the Tide' : 'Whisper of the Forest';
                const verses = [
                    'Your words ride on the wind,',
                    'Knocking on the door of distant memories,',
                    'And so, a new story begins.'
                ];
                const art = {
                    background: 'linear-gradient(45deg, #6d3a2d, #c8a575)',
                    textColor: '#ffffff',
                };
                resolve({ title, verses, art });
            }, 1500);
        });
    }

    function handleDownload() {
        const label = wineLabelContainer.innerText;
        const blob = new Blob([label], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `PoeticWineLabel-${Date.now()}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    }

    // --- EVENT LISTENERS ---

    buttons.start.addEventListener('click', () => navigateTo(-1)); // Welcome -> Wine Selection

    buttons.selectWine.addEventListener('click', () => navigateTo(0)); // Wine Selection -> First Question

    buttons.backToWelcome.addEventListener('click', () => navigateTo(-2)); // Wine Selection -> Welcome

    buttons.next.addEventListener('click', () => {
        const currentQuestionId = questions[state.currentStep].id;
        state.userAnswers[currentQuestionId] = questionElements.input.value;
        navigateTo(state.currentStep + 1);
    });

    buttons.back.addEventListener('click', () => {
        if (state.currentStep === 0) { // From first question back to wine selection
            navigateTo(-1);
        } else if (state.currentStep > 0) {
            navigateTo(state.currentStep - 1);
        }
    });

    buttons.edit.addEventListener('click', () => navigateTo(0));

    buttons.backFromConfirm.addEventListener('click', () => navigateTo(questions.length - 1)); // Back to last question

    buttons.submit.addEventListener('click', handleSubmit);

    buttons.download.addEventListener('click', handleDownload);

    buttons.backFromResult.addEventListener('click', () => navigateTo(questions.length)); // Back to confirm screen

    buttons.restart.addEventListener('click', () => {
        state.userAnswers = {};
        state.poemData = null;
        state.selectedWine = null; // Reset selected wine
        navigateTo(-2); // Go back to welcome screen
    });

    // --- INITIALIZATION ---
    render();
});
