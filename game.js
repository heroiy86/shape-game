document.addEventListener('DOMContentLoaded', () => {
    // ゲームの状態を管理する変数
    let draggedItem = null;
    let matchedPairs = 0;
    let score = 0;
    let level = 1;
    let gameActive = true;
    
    // DOM要素の取得
    const shapesContainer = document.getElementById('shapes-container');
    const targetsContainer = document.getElementById('targets-container');
    const feedbackElement = document.getElementById('feedback');
    const resetButton = document.getElementById('reset-button');
    const successSound = document.getElementById('success-sound');
    const errorSound = document.getElementById('error-sound');
    const scoreElement = document.getElementById('score');
    const levelElement = document.getElementById('level');
    
    // 形の種類とレベルごとの設定
    const allShapes = {
        basic: ['circle', 'square', 'triangle'],
        advanced: ['star', 'heart', 'diamond', 'pentagon']
    };
    
    let currentShapes = [];
    let totalPairs = 0;
    
    // スコア計算の設定
    const BASE_POINTS = 100;
    const LEVEL_UP_THRESHOLD = 3; // レベルアップに必要な正解数
    
    // スコアを更新する関数
    function updateScore() {
        if (scoreElement) {
            scoreElement.textContent = `スコア: ${score}`;
        }
    }
    
    // レベル表示を更新する関数
    function updateLevelDisplay() {
        if (levelElement) {
            levelElement.textContent = `レベル: ${level}`;
        }
    }
    
    // ゲームの初期化
    function initGame() {
        // 既存のイベントリスナーを削除
        removeEventListeners();
        
        // 変数のリセット
        matchedPairs = 0;
        score = 0;
        level = 1;
        gameActive = true;
        
        // 現在のレベルに基づいて形を設定
        updateLevelSettings();
        
        // UIを更新
        updateScore();
        updateLevelDisplay();
        
        // フィードバックメッセージをリセット
        feedbackElement.textContent = 'ブロックを ドラッグして あなに はめよう！';
        
        // 形をシャッフル
        shuffleShapes();
        
        // ドラッグ&ドロップのイベントリスナーを設定
        setupEventListeners();
    }
    
    // レベルに応じた設定を更新
    function updateLevelSettings() {
        // レベルに基づいて形の数を決定
        const shapeCount = Math.min(3 + Math.floor(level / 2), 7);
        
        // 使用する形を決定（レベルが上がるごとに新しい形を追加）
        currentShapes = [...allShapes.basic];
        if (level >= 2) {
            currentShapes = [...currentShapes, ...allShapes.advanced];
        }
        
        // 現在のレベルで使用する形をランダムに選択
        currentShapes = shuffleArray([...currentShapes]).slice(0, shapeCount);
        totalPairs = currentShapes.length;
        
        // ターゲットと形の要素を更新
        updateShapesAndTargets();
    }
    
    // 配列をシャッフルするヘルパー関数
    function shuffleArray(array) {
        return [...array].sort(() => Math.random() - 0.5);
    }
    
    // 形とターゲットを更新
    function updateShapesAndTargets() {
        // 既存の要素をクリア
        shapesContainer.innerHTML = '';
        targetsContainer.innerHTML = '';
        
        // 新しい形とターゲットを作成
        currentShapes.forEach(shape => {
            // 形の要素を作成
            const shapeElement = document.createElement('div');
            shapeElement.className = 'shape';
            shapeElement.setAttribute('data-shape', shape);
            shapeElement.setAttribute('draggable', 'true');
            updateShapeAppearance(shapeElement, shape);
            shapesContainer.appendChild(shapeElement);
            
            // ターゲットの要素を作成
            const targetElement = document.createElement('div');
            targetElement.className = 'target';
            targetElement.setAttribute('data-shape', shape);
            targetsContainer.appendChild(targetElement);
        });
    }
    
    // 形をシャッフルする関数
    function shuffleShapes() {
        // 形をシャッフル
        const shuffledShapes = shuffleArray([...currentShapes]);
        
        // 形の位置を更新
        const shapeElements = Array.from(shapesContainer.children);
        shapeElements.forEach((shape, index) => {
            if (index < shuffledShapes.length) {
                const shapeType = shuffledShapes[index];
                shape.setAttribute('data-shape', shapeType);
                updateShapeAppearance(shape, shapeType);
            }
        });
    }
    
    // 形の見た目を更新する関数
    function updateShapeAppearance(element, shapeType) {
        // 既存のクラスを削除
        element.className = 'shape';
        element.setAttribute('data-shape', shapeType);
        
        // 形に応じたクラスを追加
        if (shapeType === 'circle') {
            element.style.backgroundColor = '#ff9e7d';
            element.style.borderRadius = '50%';
            element.style.width = '80px';
            element.style.height = '80px';
            element.style.transform = 'none';
        } else if (shapeType === 'square') {
            element.style.backgroundColor = 'transparent';
            element.style.borderRadius = '0';
            element.style.width = '56px';
            element.style.height = '56px';
            element.style.transform = 'rotate(45deg)';
            
            // 正方形の疑似要素をクリアして再作成
            const existingSquare = element.querySelector('.square-inner');
            if (existingSquare) {
                element.removeChild(existingSquare);
            }
            
            const squareInner = document.createElement('div');
            squareInner.className = 'square-inner';
            squareInner.style.width = '40px';
            squareInner.style.height = '40px';
            squareInner.style.backgroundColor = '#8ac4d0';
            squareInner.style.transform = 'rotate(45deg)';
            squareInner.style.position = 'absolute';
            element.appendChild(squareInner);
        } else if (shapeType === 'triangle') {
            element.style.backgroundColor = 'transparent';
            element.style.border = 'none';
            element.style.width = '0';
            element.style.height = '0';
            element.style.borderLeft = '40px solid transparent';
            element.style.borderRight = '40px solid transparent';
            element.style.borderBottom = '70px solid #a05cdf';
            element.style.transform = 'none';
        }
    }
    
    // ドラッグ&ドロップのイベントリスナーを設定
    function setupEventListeners() {
        // 形の要素にイベントリスナーを追加
        const shapes = document.querySelectorAll('.shape');
        shapes.forEach(shape => {
            shape.addEventListener('dragstart', handleDragStart);
            shape.addEventListener('dragend', handleDragEnd);
        });
        
        // ターゲット要素にイベントリスナーを追加
        const targets = document.querySelectorAll('.target');
        targets.forEach(target => {
            target.addEventListener('dragover', handleDragOver);
            target.addEventListener('dragenter', handleDragEnter);
            target.addEventListener('dragleave', handleDragLeave);
            target.addEventListener('drop', handleDrop);
        });
        
        // リセットボタンにイベントリスナーを追加
        resetButton.addEventListener('click', initGame);
    }
    
    // イベントリスナーを削除
    function removeEventListeners() {
        const shapes = document.querySelectorAll('.shape');
        shapes.forEach(shape => {
            shape.removeEventListener('dragstart', handleDragStart);
            shape.removeEventListener('dragend', handleDragEnd);
        });
        
        const targets = document.querySelectorAll('.target');
        targets.forEach(target => {
            target.removeEventListener('dragover', handleDragOver);
            target.removeEventListener('dragenter', handleDragEnter);
            target.removeEventListener('dragleave', handleDragLeave);
            target.removeEventListener('drop', handleDrop);
        });
    }
    
    // ドラッグ開始時の処理
    function handleDragStart(e) {
        draggedItem = this;
        this.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', this.innerHTML);
        
        // ドラッグ中のフィードバック
        setTimeout(() => {
            this.style.opacity = '0.4';
        }, 0);
    }
    
    // ドラッグ終了時の処理
    function handleDragEnd() {
        this.classList.remove('dragging');
        this.style.opacity = '1';
        
        // ハイライトを削除
        document.querySelectorAll('.target').forEach(target => {
            target.classList.remove('highlight');
        });
    }
    
    // ドラッグオーバー時の処理
    function handleDragOver(e) {
        if (e.preventDefault) {
            e.preventDefault();
        }
        e.dataTransfer.dropEffect = 'move';
        return false;
    }
    
    // ドラッグエンター時の処理
    function handleDragEnter(e) {
        this.classList.add('highlight');
    }
    
    // ドラッグリーブ時の処理
    function handleDragLeave() {
        this.classList.remove('highlight');
    }
    
    // パーティクルエフェクトを生成する関数
    function createParticles(x, y, color) {
        const particles = [];
        const particleCount = 15;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.backgroundColor = color;
            particle.style.left = `${x}px`;
            particle.style.top = `${y}px`;
            document.body.appendChild(particle);
            
            // ランダムな方向に飛ばす
            const angle = Math.random() * Math.PI * 2;
            const velocity = 2 + Math.random() * 3;
            const vx = Math.cos(angle) * velocity;
            const vy = Math.sin(angle) * velocity;
            
            particles.push({
                element: particle,
                x: x,
                y: y,
                vx: vx,
                vy: vy,
                alpha: 1,
                size: 5 + Math.random() * 5
            });
        }
        
        // アニメーション
        const animateParticles = () => {
            let allDone = true;
            
            particles.forEach(p => {
                if (p.alpha <= 0) return;
                
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.1; // 重力
                p.alpha -= 0.02;
                
                if (p.alpha > 0) {
                    p.element.style.transform = `translate(${p.x - p.size/2}px, ${p.y - p.size/2}px)`;
                    p.element.style.opacity = p.alpha;
                    p.element.style.width = `${p.size}px`;
                    p.element.style.height = `${p.size}px`;
                    allDone = false;
                } else {
                    p.element.remove();
                }
            });
            
            if (!allDone) {
                requestAnimationFrame(animateParticles);
            } else {
                particles.length = 0;
            }
        };
        
        requestAnimationFrame(animateParticles);
    }
    
    // ドロップ時の処理
    function handleDrop(e) {
        e.preventDefault();
        
        // ゲームがアクティブでないか、ドラッグ中のアイテムがなければ何もしない
        if (!gameActive || !draggedItem) return;
        
        const target = e.target.closest('.target');
        
        // ターゲット要素でなければ何もしない
        if (!target) return;
        
        // 既にマッチ済みのターゲットの場合は何もしない
        if (target.classList.contains('matched')) return;
        
        // 形の種類を取得
        const draggedShape = draggedItem.getAttribute('data-shape');
        const targetShape = target.getAttribute('data-shape');
        
        // 正解かどうかをチェック
        if (draggedShape === targetShape) {
            // 正解の処理
            gameActive = false; // 一時的に入力を無効化
            
            // スコアを加算（レベルが高いほど高得点）
            const points = BASE_POINTS * level;
            score += points;
            updateScore();
            
            draggedItem.style.opacity = '0.5';
            draggedItem.style.pointerEvents = 'none';
            target.classList.add('matched');
            
            // 効果音を再生
            successSound.currentTime = 0;
            successSound.play();
            
            // 正解エフェクト
            const rect = target.getBoundingClientRect();
            createParticles(rect.left + rect.width/2, rect.top + rect.height/2, '#4caf50');
            
            // 正解メッセージを表示
            feedbackElement.textContent = `せいかい！ +${points}てん`;
            feedbackElement.style.color = '#4caf50';
            
            // マッチしたペアの数を増やす
            matchedPairs++;
            
            // 少し遅らせてから次のアクションを実行
            setTimeout(() => {
                // すべてのペアが揃ったかチェック
                if (matchedPairs >= totalPairs) {
                    if (level < 5) {
                        // レベルアップ
                        level++;
                        updateLevelDisplay();
                        feedbackElement.textContent = `レベル ${level} に あがった！`;
                        feedbackElement.style.color = '#ff9800';
                        
                        // 新しいレベルの準備
                        setTimeout(() => {
                            initGame();
                        }, 1500);
                    } else {
                        // ゲームクリア
                        feedbackElement.textContent = `かんせい！ さいごまで クリア！ スコア: ${score}`;
                        createConfetti();
                        gameActive = false;
                    }
                }
                gameActive = true; // 入力を再有効化
            }, 1000);
        } else {
            // 不正解の処理
            const points = -Math.floor(BASE_POINTS * 0.5);
            score = Math.max(0, score + points); // スコアが0未満にならないように
            updateScore();
            
            feedbackElement.textContent = `ちがうよ！ ${points}てん`;
            feedbackElement.style.color = '#f44336';
            
            // 効果音を再生
            errorSound.currentTime = 0;
            errorSound.play();
            
            // アニメーションで間違いを表現
            draggedItem.style.animation = 'shake 0.5s';
            const rect = target.getBoundingClientRect();
            createParticles(rect.left + rect.width/2, rect.top + rect.height/2, '#f44336');
            
            setTimeout(() => {
                if (draggedItem) {
                    draggedItem.style.animation = '';
                }
            }, 500);
        }
        
        // ドラッグ中のアイテムをリセット
        draggedItem = null;
    }
                

    
    // 紙吹雪エフェクトを生成する関数
    function createConfetti() {
        const colors = ['#ff9e7d', '#8ac4d0', '#a05cdf', '#ffd166', '#06d6a0'];
        const container = document.querySelector('.game-container');
        const confettiPieces = [];
        
        // 紙吹雪のピースを作成
        for (let i = 0; i < 100; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.width = `${Math.random() * 10 + 5}px`;
            confetti.style.height = `${Math.random() * 10 + 5}px`;
            confetti.style.position = 'absolute';
            confetti.style.left = `${Math.random() * 100}%`;
            confetti.style.top = '-20px';
            confetti.style.opacity = '0';
            confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
            container.appendChild(confetti);
            
            confettiPieces.push({
                element: confetti,
                x: Math.random() * window.innerWidth,
                y: -20,
                rotation: Math.random() * 360,
                rotationSpeed: (Math.random() - 0.5) * 20,
                speed: Math.random() * 3 + 2,
                delay: Math.random() * 1000,
                opacity: 0
            });
        }
        
        // 紙吹雪のアニメーション
        let startTime = null;
        const duration = 5000; // 5秒間表示
        
        function animateConfetti(timestamp) {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            
            confettiPieces.forEach(piece => {
                if (progress > piece.delay) {
                    const pieceProgress = Math.min(1, (progress - piece.delay) / (duration - piece.delay));
                    
                    // 徐々に表示
                    if (piece.opacity < 1) {
                        piece.opacity = Math.min(1, piece.opacity + 0.05);
                        piece.element.style.opacity = piece.opacity;
                    }
                    
                    // 位置を更新
                    piece.y += piece.speed;
                    piece.rotation += piece.rotationSpeed;
                    
                    // 画面外に出たら上から再表示
                    if (piece.y > window.innerHeight) {
                        piece.y = -20;
                        piece.x = Math.random() * window.innerWidth;
                    }
                    
                    // スタイルを適用
                    piece.element.style.transform = `translate(${piece.x}px, ${piece.y}px) rotate(${piece.rotation}deg)`;
                }
            });
            
            // アニメーションを続行
            if (progress < duration) {
                requestAnimationFrame(animateConfetti);
            } else {
                // アニメーション終了後、紙吹雪を削除
                confettiPieces.forEach(piece => {
                    if (piece.element && piece.element.parentNode) {
                        piece.element.parentNode.removeChild(piece.element);
                    }
                });
            }
        }
        
        requestAnimationFrame(animateConfetti);
    }
    
    // ゲームを初期化
    initGame();
});
