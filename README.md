# 🤖 TLGM Auto Responder

This guide explains how to install and use the **TLGM Auto Responder** script. It is a lightweight browser extension that allows you to quickly and automatically accept or decline calendar events on the TLGM (Throne and Liberty Guild Manager) platform.

## 🎯 Why should you use this bot?

Let's face it: managing guild life is hard enough without having to manually click through 20-30 calendar events every single week. Opening the modal, finding the button, submitting, closing... It's a nightmare. This script was built to save you from that.

**Main Benefits:**
* 🦥 **Save Time & Effort:** Just one click on the `🤖 Start Bot` button, and the script grinds through your entire weekly calendar in seconds. No more tedious clicking.
* 🛡️ **Protect Your DKP (No More Penalties):** The TLGM system (and most serious guilds) will heavily penalize you if you simply ignore an event (No Reply). This bot guarantees your "No Reply" count drops to zero, keeping your hard-earned DKP safe!
* 🧠 **Smart Filtering:** Did your leadership make *War Games* or *Raids* mandatory? No problem! You can set up keywords in the settings. The bot will automatically click **Yes** for these specific events, and **No** for everything else you don't need.
* 😌 **Peace of Mind:** Open the calendar once a week, click the bot, and rest easy knowing your official guild administration is fully taken care of.

---

## ⚙️ Step 1: Install the Tampermonkey Extension
To run this script, you need a browser extension that manages custom background code. The best one for this is **Tampermonkey**.

1. Open your browser's web store and install the extension:
   * **Chrome / Brave / Opera:** [Chrome Web Store - Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
   * **Firefox:** [Firefox Add-ons - Tampermonkey](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/)
   * **Edge:** [Edge Add-ons - Tampermonkey](https://microsoftedge.microsoft.com/addons/detail/tampermonkey/iikmkjmpaadaobahmlepeloendndfphd)
2. Click the **"Add"** or **"Install"** button.
3. After installation, it is highly recommended to "Pin" the Tampermonkey icon to your browser's top right corner so it's always accessible.

---

## 📜 Step 2: Install the Script (One-Click Method)

Since the code is hosted in this repository, installation is incredibly simple:

1. Click on the script file in this repository (it should be named `tlgm-auto-responder.user.js`).
2. While viewing the file, look for and click the **"Raw"** button in the top right corner of the code box.
3. Tampermonkey will automatically detect the script and open a new tab with a large **Install** button.
4. Click **Install**, and you are done! You can close that tab.

*(Alternative method: Click the Tampermonkey icon in your browser -> Create a new script -> Delete the default code -> Paste the entire content of the script file from this repo -> Press Ctrl+S to save.)*

---

## 🛠️ Step 3: Usage & Configuration
1. Log in to [TLGM](https://tlgm.app/) and open your guild's calendar.
2. Look at the **bottom right corner** of your screen. You will see a green **"🤖 Start Bot"** button and a **⚙️ (Gear)** icon next to it.
3. Click the **⚙️ icon** to open the settings panel!

### How to set up your filters?
You can define keywords in the settings panel. If an event's title contains one of your keywords, the bot will know exactly what to do.

* **Auto ACCEPT (Yes):** Type the words for events you *always* want to attend. *(e.g.: war games, raid, pvp)*
* **Auto DECLINE (No):** Type the words for events you definitely want to skip. *(e.g.: arch boss, world boss, farm)*
* **Action for UNMATCHED events:** Decide what happens to events that don't match any of your keywords:
  * *Decline (No):* Automatically declines them (Default setting – highly recommended to avoid DKP penalties).
  * *Accept (Yes):* Automatically accepts them.
  * *Skip:* Ignores them completely so you can decide manually later.

*Note: Separate multiple words with commas! Capitalization does not matter.*

4. Once configured, click the **Save Settings** button. (The system remembers your choices, so you only have to do this once!)
5. Finally, click the **🤖 Start Bot** button, sit back, and watch the bot handle your entire calendar in seconds!

---

### 💡 Troubleshooting
* **The button isn't showing up in the bottom right corner:** Refresh the page (F5). Ensure the Tampermonkey extension is turned on and the script is enabled.
* **The button turns red or throws an error:** The website's interface might have been updated. Check back in this repository to see if a newer version of the script is available!


## ☕ Support & Feedback

If this script saved your DKP and made your life easier, please consider supporting the project! **No registration required** for the likes or coffee:

* **Drop a Like:** [![Likes](https://api.lyket.dev/stats/v1/like/buttons/tlgm-auto-responder/github-repo?style=flat&color=green)](https://lyket.dev) (Click the badge!)
* **Buy me a coffee:** [![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-Donate-orange?style=for-the-badge&logo=buy-me-a-coffee)](IDE_MÁSOLD_BE_A_BMC_LINKEDET)
* **Give it a ⭐ Star:** If you have a GitHub account, a star is greatly appreciated!

**Found a bug?** Please open an **Issue** or reach out!
