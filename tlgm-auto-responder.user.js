// ==UserScript==
// @name         TLGM Auto Responder
// @namespace    http://tampermonkey.net/
// @version      8.1.EN
// @description  Fast, customizable automatic event responder (Accept/Decline) for TLGM.
// @author       You / AI
// @match        *://tlgm.app/*
// @match        *://*.tlgm.app/*
// @match        *://*.guildmanager.app/*
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==

(function() {
    'use strict';

    // --- Settings Management (Tampermonkey Storage) ---
    const STORAGE_KEY = 'tlgm_bot_settings_en';
    const defaultSettings = {
        acceptWords: "war games",
        declineWords: "",
        unmatchedAction: "no" // 'yes', 'no', 'skip'
    };

    function getSettings() {
        return GM_getValue(STORAGE_KEY, defaultSettings);
    }

    function saveSettings(settings) {
        GM_setValue(STORAGE_KEY, settings);
    }

    // --- Bot Logic ---
    async function runAutoResponder() {
        const settings = getSettings();
        const forceClick = (el) => {
            el.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
            el.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
            el.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }));
            el.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
            el.click();
        };

        const wait = (ms) => new Promise(r => setTimeout(r, ms));

        const eventButtons = Array.from(document.querySelectorAll('a.fc-event-future .fc-event-main button, a.fc-event-today .fc-event-main button'))
            .filter(btn => !btn.querySelector('.lucide-x.text-red-500') && !btn.querySelector('.lucide-check-check.text-green-500'));

        if (eventButtons.length === 0) {
            console.log("%c[INFO] No pending events found in the visible calendar!", "color: cyan; font-weight: bold;");
            return;
        }

        console.log("%c--- 🚀 TLGM AUTO RESPONDER ---", "color: #00ffcc; font-size: 16px; font-weight: bold;");
        console.log(`⚙️ Current settings:`, settings);
        console.log(`📅 Total events to process: ${eventButtons.length}`);

        const acceptList = settings.acceptWords.split(',').map(s => s.trim().toLowerCase()).filter(s => s);
        const declineList = settings.declineWords.split(',').map(s => s.trim().toLowerCase()).filter(s => s);

        for (let i = 0; i < eventButtons.length; i++) {
            let btn = eventButtons[i];
            const eventName = btn.textContent.trim().toLowerCase();

            let targetButtonText = null;
            let matched = false;

            // 1. Check Auto Accept list
            for (let word of acceptList) {
                if (eventName.includes(word)) { targetButtonText = 'Yes'; matched = true; break; }
            }

            // 2. Check Auto Decline list
            if (!matched) {
                for (let word of declineList) {
                    if (eventName.includes(word)) { targetButtonText = 'No'; matched = true; break; }
                }
            }

            // 3. Fallback for unmatched events
            if (!matched) {
                if (settings.unmatchedAction === 'skip') {
                    console.log(`[${i + 1}/${eventButtons.length}] SKIPPED (Manual action required): ${btn.textContent.trim()}`);
                    continue;
                }
                targetButtonText = settings.unmatchedAction === 'yes' ? 'Yes' : 'No';
            }

            console.log(`[${i + 1}/${eventButtons.length}] ${btn.textContent.trim()} -> Clicking: [ ${targetButtonText} ]`);

            forceClick(btn);

            let dialog = null;
            let targetBtn = null;

            for(let w = 0; w < 40; w++) {
                await wait(50);
                dialog = document.querySelector('div[role="dialog"]');
                if (dialog) {
                    let buttons = Array.from(dialog.querySelectorAll('button'));
                    targetBtn = buttons.find(b => b.textContent.trim() === targetButtonText);
                    if (targetBtn) break;
                }
            }

            if (targetBtn) {
                const originalClasses = targetBtn.className;
                forceClick(targetBtn);

                for(let w = 0; w < 40; w++) {
                    await wait(50);
                    if (!document.body.contains(targetBtn)) break;

                    const currentText = targetBtn.textContent.toLowerCase();
                    const currentClasses = targetBtn.className;

                    if (currentText.includes('load') || currentText.includes('updat') || currentText.includes('submit')) continue;
                    if (currentClasses !== originalClasses) break;
                    if (w > 10) break;
                }

                if (document.querySelector('div[role="dialog"]')) {
                    document.dispatchEvent(new KeyboardEvent('keydown', {'key': 'Escape'}));
                    await wait(100);
                }
            } else {
                console.log(`%cError: Could not find '${targetButtonText}' button!`, "color: red;");
                if (document.querySelector('div[role="dialog"]')) {
                    document.dispatchEvent(new KeyboardEvent('keydown', {'key': 'Escape'}));
                    await wait(100);
                }
            }
        }
        console.log("\n%c🎉 DONE! All events processed successfully.", "color: #00FF00; font-size: 14px; font-weight: bold;");
    }

    // --- UI Creation ---
    function createUI() {
        if (document.getElementById('tlgm-bot-container')) return;

        const container = document.createElement('div');
        container.id = 'tlgm-bot-container';
        Object.assign(container.style, {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: '999999',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: '10px',
            fontFamily: 'system-ui, sans-serif'
        });

        // Settings Panel
        const panel = document.createElement('div');
        panel.id = 'tlgm-bot-panel';
        Object.assign(panel.style, {
            display: 'none',
            backgroundColor: '#1e1e24',
            color: '#ffffff',
            padding: '15px',
            borderRadius: '8px',
            border: '1px solid #444',
            boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
            width: '280px',
            flexDirection: 'column',
            gap: '10px'
        });

        // Load settings from Tampermonkey storage
        const settings = getSettings();

        panel.innerHTML = `
            <div style="font-weight: bold; margin-bottom: 5px; border-bottom: 1px solid #444; padding-bottom: 5px;">🤖 Bot Settings</div>

            <label style="font-size: 12px; color: #aaa;">Auto ACCEPT (Yes) if name contains:</label>
            <input type="text" id="tlgm-acc-words" value="${settings.acceptWords}" placeholder="e.g., war games, raid" style="width: 100%; padding: 6px; border-radius: 4px; border: 1px solid #555; background: #2a2a30; color: #00ffcc; font-weight: bold; box-sizing: border-box;">
            <div style="font-size: 10px; color: #777;">(Separate multiple words with commas)</div>

            <label style="font-size: 12px; color: #aaa; margin-top: 5px;">Auto DECLINE (No) if name contains:</label>
            <input type="text" id="tlgm-dec-words" value="${settings.declineWords}" placeholder="e.g., boss, farm" style="width: 100%; padding: 6px; border-radius: 4px; border: 1px solid #555; background: #2a2a30; color: #ff6666; font-weight: bold; box-sizing: border-box;">

            <label style="font-size: 12px; color: #aaa; margin-top: 5px;">What to do with UNMATCHED events?</label>
            <select id="tlgm-fallback-action" style="width: 100%; padding: 6px; border-radius: 4px; border: 1px solid #555; background: #2a2a30; color: white; box-sizing: border-box;">
                <option value="no" ${settings.unmatchedAction === 'no' ? 'selected' : ''}>Decline (No)</option>
                <option value="yes" ${settings.unmatchedAction === 'yes' ? 'selected' : ''}>Accept (Yes)</option>
                <option value="skip" ${settings.unmatchedAction === 'skip' ? 'selected' : ''}>Skip (Manual decision)</option>
            </select>

            <button id="tlgm-save-btn" style="margin-top: 10px; width: 100%; padding: 8px; background: #00ffcc; color: black; border: none; border-radius: 4px; font-weight: bold; cursor: pointer;">Save Settings</button>
        `;

        const btnWrapper = document.createElement('div');
        Object.assign(btnWrapper.style, { display: 'flex', gap: '8px' });

        const configBtn = document.createElement('button');
        configBtn.innerHTML = '⚙️';
        Object.assign(configBtn.style, {
            padding: '12px',
            backgroundColor: '#333',
            color: '#fff',
            border: '1px solid #555',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px'
        });

        configBtn.onclick = () => {
            panel.style.display = panel.style.display === 'none' ? 'flex' : 'none';
        };

        const botBtn = document.createElement('button');
        botBtn.textContent = '🤖 Start Bot';
        Object.assign(botBtn.style, {
            padding: '12px 20px',
            backgroundColor: '#00ffcc',
            color: '#000000',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 'bold',
            fontSize: '14px',
            cursor: 'pointer',
            boxShadow: '0 4px 10px rgba(0,0,0,0.5)',
            transition: 'all 0.2s ease'
        });

        botBtn.onclick = async () => {
            botBtn.textContent = '⏳ Processing...';
            botBtn.style.backgroundColor = '#ffcc00';
            botBtn.disabled = true;
            configBtn.style.display = 'none';
            panel.style.display = 'none';

            await runAutoResponder();

            botBtn.textContent = '✔️ Done!';
            botBtn.style.backgroundColor = '#00ff00';

            setTimeout(() => {
                botBtn.textContent = '🤖 Start Bot';
                botBtn.style.backgroundColor = '#00ffcc';
                botBtn.disabled = false;
                configBtn.style.display = 'flex';
            }, 3000);
        };

        const applyHover = (btn, baseBg, hoverBg, scale) => {
            btn.onmouseenter = () => { if(!btn.disabled) { btn.style.transform = `scale(${scale})`; btn.style.backgroundColor = hoverBg; }};
            btn.onmouseleave = () => { if(!btn.disabled) { btn.style.transform = 'scale(1)'; btn.style.backgroundColor = baseBg; }};
        };
        applyHover(botBtn, '#00ffcc', '#00e6b8', 1.05);
        applyHover(configBtn, '#333', '#444', 1.1);

        btnWrapper.appendChild(configBtn);
        btnWrapper.appendChild(botBtn);
        container.appendChild(panel);
        container.appendChild(btnWrapper);
        document.body.appendChild(container);

        // Save Button Logic
        document.getElementById('tlgm-save-btn').onclick = () => {
            saveSettings({
                acceptWords: document.getElementById('tlgm-acc-words').value,
                declineWords: document.getElementById('tlgm-dec-words').value,
                unmatchedAction: document.getElementById('tlgm-fallback-action').value
            });
            const saveBtn = document.getElementById('tlgm-save-btn');
            saveBtn.textContent = 'Saved Successfully! ✓';
            saveBtn.style.background = '#00ff00';

            console.log("⚙️ New settings saved:", getSettings());

            setTimeout(() => {
                saveBtn.textContent = 'Save Settings';
                saveBtn.style.background = '#00ffcc';
                panel.style.display = 'none';
            }, 1000);
        };
    }

    setTimeout(createUI, 2000);
    const observer = new MutationObserver(() => createUI());
    observer.observe(document.body, { childList: true, subtree: true });

})();