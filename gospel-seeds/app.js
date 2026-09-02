// Serious Game PbtA Engine

let state = {
    day: 1,
    ap: 3, maxAp: 3,
    health: 100, maxHealth: 100,
    bonus: 0, // 聖霊の導きボーナス (SuperBetter Action)
    currentNpcId: "1",
    npcs: {
        // Input Metrics & Narrative State
        "1": { 
            id: "1", name: "職場の同僚", 
            prayed: 0, listened: 0, kindness: 0, 
            relationLevel: 0, // Hidden variable for narrative progression
            narrative: "「職場の世間体を気にして、宗教的な話題を避けているようだ。」",
            bg: "assets/bg_office.jpg", char: "assets/char_sheet_coworker.jpg",
            currentNode: "start"
        }
    }
};

const daysOfWeek = ["月曜日", "火曜日", "水曜日", "木曜日", "金曜日", "土曜日", "日曜日"];
let isPlayingScene = false;
let currentSceneNode = null;
let pendingChoice = null;

// DOM Elements
const elGameView = document.getElementById("game-view");
const elCharSprite = document.getElementById("char-sprite");
const elDayDisplay = document.getElementById("day-display");
const elDayDesc = document.getElementById("day-desc");
const elPlayerAp = document.getElementById("player-ap");
const elPlayerHealth = document.getElementById("player-health");
const elPlayerBonus = document.getElementById("player-bonus");

const elTargetNpc = document.getElementById("target-npc");
const elNpcPrayed = document.getElementById("npc-prayed");
const elNpcListened = document.getElementById("npc-listened");
const elNpcNarrative = document.getElementById("npc-narrative");

const elDialogBox = document.getElementById("dialog-box");
const elSpeakerName = document.getElementById("speaker-name");
const elDialogText = document.getElementById("dialog-text");
const elDialogNext = document.getElementById("dialog-next");
const elChoiceMenu = document.getElementById("choice-menu");
const elCommandsPanel = document.getElementById("commands-panel");

const btnTalk = document.getElementById("btn-talk");
const btnIntercede = document.getElementById("btn-intercede");
const btnDevotion = document.getElementById("btn-devotion");
const btnNextTurn = document.getElementById("btn-next-turn");
const btnSave = document.getElementById("btn-save");
const btnRealAction = document.getElementById("btn-real-action");

const elDiceOverlay = document.getElementById("dice-overlay");
const elDie1 = document.getElementById("die1");
const elDie2 = document.getElementById("die2");
const elDiceSum = document.getElementById("dice-sum");
const elDiceMod = document.getElementById("dice-mod");
const elDiceTotal = document.getElementById("dice-total");
const elDiceResultText = document.getElementById("dice-result-text");

// Microcraft Narrative Scenarios (Branch & Bottleneck)
const npcStoryNodes = {
    "start": {
        text: "同僚はデスクでため息をついている。「あー、なんか最近、仕事ばかりで自分が何のために生きてるのか分からなくなるよ…」",
        expr: "sad", speaker: "同僚",
        choices: [
            { text: "[ただ黙って深く共感して話を聴く]", act: "listen", isRoll: true, rollStat: "listen" },
            { text: "[『神様には計画がある』と論理的に諭す]", act: "preach", isRoll: true, rollStat: "preach" },
            { text: "[自分の弱さや悩みを自己開示する]", act: "share", isRoll: true, rollStat: "share" }
        ]
    },
    // Listen Results
    "listen_strong": {
        text: "「…聞いてくれてありがとう。君に話したら少し楽になった気がするよ。君は他の人とは何か違うね。」",
        expr: "happy", speaker: "同僚", update: { listened: 1, relationLevel: 1, narrative: "あなたの傾聴により、少し心を開き始めている。" },
        next: "end_scene"
    },
    "listen_weak": {
        text: "「ありがとう。でも、話したからって現実が変わるわけじゃないんだよな…。」",
        expr: "neutral", speaker: "同僚", update: { listened: 1, narrative: "話は聞いてくれたが、まだ根本的な虚無感は消えていない。" },
        next: "end_scene"
    },
    "listen_miss": {
        text: "「ごめん、愚痴っぽくなっちゃったね。忘れてくれ。仕事に戻るよ。」",
        expr: "angry", speaker: "同僚", update: { health: -10, narrative: "心の壁が厚く、会話を打ち切られてしまった。" },
        sysMsg: "【牧師からのアドバイス】\n焦る必要はありません。今はただ「私はあなたの味方だ」という姿勢を示すだけで十分です。祈り続けましょう。",
        next: "end_scene"
    },
    // Preach Results
    "preach_strong": {
        text: "「神様の計画か…。そういう考え方もあるんだね。少し興味が湧いてきたよ。」",
        expr: "neutral", speaker: "同僚", update: { relationLevel: 1, narrative: "神の存在について、知的な関心を持ち始めている。" },
        next: "end_scene"
    },
    "preach_weak": {
        text: "「神様がいるなら、なんで世の中こんなに理不尽なことばかりなんだろうね？」",
        expr: "sad", speaker: "同僚", update: { health: -10, narrative: "神についての疑問（苦難の問題）を投げかけられた。" },
        sysMsg: "【牧師からのアドバイス】\n完璧な神学的回答を用意する必要はありません。「私も分からないけれど、神様は共に痛んでくださる」という共感が鍵になります。",
        next: "end_scene"
    },
    "preach_miss": {
        text: "「…そういう宗教っぽい押し付けは勘弁してくれないか。こっちは疲れてるんだ。」",
        expr: "angry", speaker: "同僚", update: { health: -20, narrative: "不用意な発言により、強い警戒心を持たれてしまった。" },
        sysMsg: "【牧師からのアドバイス】\n関係性が構築されていない段階での正論は、時に人を傷つけます。まずは愛と共感を土台にしましょう。",
        next: "end_scene"
    },
    // Share Results
    "share_strong": {
        text: "「君にもそんな時があったんだね…。君がどうやってそれを乗り越えたのか、もう少し教えてくれないか？」",
        expr: "happy", speaker: "同僚", update: { relationLevel: 2, narrative: "あなたの証（体験）を通して、福音の力に心を動かされている。" },
        next: "end_scene"
    },
    "share_weak": {
        text: "「なるほど。君は信仰があったから乗り越えられたんだね。僕にはそういうのは無いからな…。」",
        expr: "sad", speaker: "同僚", update: { narrative: "証を聞いてくれたが、自分には関係のないことだと線を引いている。" },
        next: "end_scene"
    },
    "share_miss": {
        text: "「人それぞれやり方はあるよね。僕は僕のやり方で何とかするよ。」",
        expr: "neutral", speaker: "同僚", update: { health: -5, narrative: "自己開示したが、響かなかったようだ。祈りが必要だ。" },
        next: "end_scene"
    }
};

function init() {
    loadGame();
    updateUI();
    
    btnTalk.addEventListener("click", () => startAction(1));
    btnIntercede.addEventListener("click", doIntercede);
    btnDevotion.addEventListener("click", doDevotion);
    btnNextTurn.addEventListener("click", nextTurn);
    btnSave.addEventListener("click", saveGame);
    btnRealAction.addEventListener("click", doRealAction);
    
    elDialogBox.addEventListener("click", advanceScene);
}

function updateUI() {
    elDayDisplay.textContent = `Day ${state.day}`;
    elDayDesc.textContent = daysOfWeek[(state.day - 1) % 7];
    elPlayerAp.textContent = state.ap;
    elPlayerHealth.textContent = Math.max(0, state.health);
    elPlayerBonus.textContent = state.bonus;
    
    const npc = state.npcs[state.currentNpcId];
    elNpcPrayed.textContent = npc.prayed;
    elNpcListened.textContent = npc.listened;
    elNpcNarrative.textContent = npc.narrative;
    
    if(!isPlayingScene) setExpression("neutral");
    
    const isOver = state.health <= 0;
    document.querySelectorAll(".cmd-btn").forEach(b => b.disabled = isOver || state.ap < 1);
    if(isOver) return;
    
    btnSave.disabled = false;
    btnNextTurn.disabled = false;
}

function setExpression(expr) {
    elCharSprite.className = `char-sprite ${expr}`;
}

function showSystemMessage(msg) {
    elSpeakerName.textContent = "システム";
    elDialogText.innerHTML = msg;
    setExpression("neutral");
}

function startAction(apCost) {
    if(state.ap < apCost) return;
    state.ap -= apCost;
    
    isPlayingScene = true;
    elCommandsPanel.classList.add("hidden");
    elDialogBox.classList.remove("hidden");
    
    const npc = state.npcs[state.currentNpcId];
    // Load current node (Branch & Bottleneck progression can be added here based on relationLevel)
    currentSceneNode = npcStoryNodes[npc.currentNode] || npcStoryNodes["start"];
    renderNode();
    updateUI();
}

function renderNode() {
    if(currentSceneNode.sysMsg) {
        showSystemMessage(currentSceneNode.sysMsg);
        currentSceneNode.sysMsg = null; // show only once
        elDialogNext.classList.remove("hidden");
        return; // wait for click
    }

    elSpeakerName.textContent = currentSceneNode.speaker;
    elDialogText.innerHTML = currentSceneNode.text;
    if(currentSceneNode.expr) setExpression(currentSceneNode.expr);
    
    if(currentSceneNode.choices) {
        elDialogNext.classList.add("hidden");
        renderChoices(currentSceneNode.choices);
    } else {
        elDialogNext.classList.remove("hidden");
    }
}

function renderChoices(choices) {
    elChoiceMenu.innerHTML = '';
    elChoiceMenu.classList.remove("hidden");
    elDialogBox.classList.add("hidden");
    
    choices.forEach(choice => {
        const btn = document.createElement("button");
        btn.className = "choice-btn";
        btn.innerHTML = choice.text;
        btn.onclick = (e) => {
            e.stopPropagation();
            elChoiceMenu.classList.add("hidden");
            elDialogBox.classList.remove("hidden");
            
            if(choice.isRoll) {
                executePbtARoll(choice);
            } else {
                currentSceneNode = npcStoryNodes[choice.next];
                renderNode();
            }
        };
        elChoiceMenu.appendChild(btn);
    });
}

function executePbtARoll(choice) {
    const npc = state.npcs[state.currentNpcId];
    
    // Calculate modifier based on Input Metrics (Relation Level + Bonus)
    let modifier = Math.floor(npc.relationLevel / 2) + state.bonus;
    
    // Show Dice Overlay
    elDiceOverlay.classList.remove("hidden");
    elDie1.classList.add("rolling");
    elDie2.classList.add("rolling");
    elDiceSum.textContent = "?";
    elDiceMod.textContent = modifier;
    elDiceTotal.textContent = "?";
    elDiceResultText.textContent = "祈りながら結果を待つ...";
    elDiceResultText.className = "dice-result-text";
    
    // Consume bonus
    state.bonus = 0;
    updateUI();
    
    setTimeout(() => {
        elDie1.classList.remove("rolling");
        elDie2.classList.remove("rolling");
        
        let d1 = Math.floor(Math.random() * 6) + 1;
        let d2 = Math.floor(Math.random() * 6) + 1;
        elDie1.textContent = d1;
        elDie2.textContent = d2;
        
        let sum = d1 + d2;
        let total = sum + modifier;
        
        elDiceSum.textContent = sum;
        elDiceTotal.textContent = total;
        
        let resultCategory = "";
        let nextNodeKey = "";
        
        if(total >= 10) {
            resultCategory = "完全な成功 (Strong Hit)";
            elDiceResultText.className = "dice-result-text result-strong";
            nextNodeKey = choice.act + "_strong";
        } else if(total >= 7) {
            resultCategory = "部分的成功 (Weak Hit) - 代償あり";
            elDiceResultText.className = "dice-result-text result-weak";
            nextNodeKey = choice.act + "_weak";
        } else {
            resultCategory = "失敗 (Miss) - 困難の発生";
            elDiceResultText.className = "dice-result-text result-miss";
            nextNodeKey = choice.act + "_miss";
        }
        
        elDiceResultText.textContent = resultCategory;
        
        // Wait then continue to next node
        setTimeout(() => {
            elDiceOverlay.classList.add("hidden");
            currentSceneNode = npcStoryNodes[nextNodeKey];
            applyNodeUpdate(currentSceneNode);
            renderNode();
        }, 3000);
        
    }, 1500);
}

function applyNodeUpdate(node) {
    if(!node || !node.update) return;
    const npc = state.npcs[state.currentNpcId];
    if(node.update.listened) npc.listened += node.update.listened;
    if(node.update.relationLevel) npc.relationLevel += node.update.relationLevel;
    if(node.update.narrative) npc.narrative = node.update.narrative;
    if(node.update.health) state.health = Math.max(0, state.health + node.update.health);
    updateUI();
}

function advanceScene() {
    if(!isPlayingScene || !elChoiceMenu.classList.contains("hidden") || !elDiceOverlay.classList.contains("hidden")) return;
    
    if(currentSceneNode.next === "end_scene") {
        endScene();
    } else if(currentSceneNode.next) {
        currentSceneNode = npcStoryNodes[currentSceneNode.next];
        renderNode();
    }
}

function endScene() {
    isPlayingScene = false;
    elCommandsPanel.classList.remove("hidden");
    elDialogNext.classList.add("hidden");
    updateUI();
    
    if(state.health <= 0) {
        showSystemMessage("【バーンアウト（燃え尽き）】<br>あなたは霊的に疲弊しきってしまいました。結果をコントロールしようとする手を離し、神の御腕の中で休む必要があります。");
    } else {
        showSystemMessage("インプット（愛の行動）は神様がご存知です。次はどうしますか？");
    }
}

// System Actions
function doIntercede() {
    if(state.ap < 1) return;
    state.ap -= 1;
    const npc = state.npcs[state.currentNpcId];
    npc.prayed += 1;
    showSystemMessage(`【とりなしの祈り（インプット）】<br>${npc.name}のために時間を取って祈った。結果は神に委ねられている。<br>祈った回数 +1`);
    updateUI();
}

function doDevotion() {
    if(state.ap < 1) return;
    state.ap -= 1;
    state.health = Math.min(state.maxHealth, state.health + 30);
    showSystemMessage("【ディボーション】<br>みことばを読み、静まることで霊的な体力が回復した。<br>霊的健康度 +30");
    updateUI();
}

function doRealAction() {
    state.bonus += 1;
    btnRealAction.innerHTML = "✨ 現実の祈りが届きました！ (+1適用中)";
    btnRealAction.disabled = true;
    setTimeout(() => {
        btnRealAction.innerHTML = "🌍 現実でこの人のために祈った<br><span style='font-size:0.8rem'>(ボーナス獲得)</span>";
        btnRealAction.disabled = false;
    }, 5000); // 5秒後に再度押せるようにする
    updateUI();
}

function nextTurn() {
    state.day++;
    state.ap = state.maxAp;
    
    let msg = `--- Day ${state.day} : ${daysOfWeek[(state.day - 1) % 7]} ---<br>`;
    if((state.day - 1) % 7 === 6) { // Sunday
        msg += "日曜礼拝で神を賛美し、霊と肉が完全に回復した。";
        state.health = state.maxHealth;
    } else {
        msg += "新しい朝が来た。今日も結果を神に委ねよう。";
    }
    
    updateUI();
    showSystemMessage(msg);
}

// Save & Load
function saveGame() {
    localStorage.setItem("gospelSeedsSeriousSave", JSON.stringify(state));
    showSystemMessage("【セーブ完了】進行状況を保存しました。");
}

function loadGame() {
    const saved = localStorage.getItem("gospelSeedsSeriousSave");
    if(saved) {
        try {
            state = JSON.parse(saved);
        } catch(e) {
            console.error("Save file corrupted.");
        }
    }
}

init();
