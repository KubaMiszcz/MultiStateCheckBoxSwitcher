import {
    App,
    Editor,
    MarkdownView,
    // Modal,
    // Notice,
    Plugin,
    PluginSettingTab,
    Setting,
} from "obsidian";

// Remember to rename these classes and interfaces!

interface IStateItem {
    value: string;
    isEnabled: boolean;
}

interface MultiStateCheckBoxSwitcherSettings {
    mySetting: string;
    AdditionalStateNo1: string;
    AdditionalStates: IStateItem[];
}

const DEFAULT_SETTINGS: MultiStateCheckBoxSwitcherSettings = {
    mySetting: "default",
    AdditionalStateNo1: "!",
    AdditionalStates: [
        { value: "!", isEnabled: true },
        { value: "?", isEnabled: true },
        { value: "i", isEnabled: true },
        { value: ">", isEnabled: true },
        { value: "<", isEnabled: true },
        { value: "f", isEnabled: true },
        { value: "I", isEnabled: true },
        { value: "k", isEnabled: true },
        { value: "u", isEnabled: true },
        { value: "d", isEnabled: true },
    ],
};

export default class MultiStateCheckBoxSwitcherPlugin extends Plugin {
    settings: MultiStateCheckBoxSwitcherSettings;

    async onload() {
        await this.loadSettings();

        // This creates an icon in the left ribbon.
        // const ribbonIconEl = this.addRibbonIcon(
        //     "dice",
        //     "Multi State CheckBox Switcher",
        //     (evt: MouseEvent) => {
        //         // Called when the user clicks the icon.
        //         new Notice("This is a notice!");
        //     }
        // );

        // Perform additional things with the ribbon
        // ribbonIconEl.addClass("multi-state-checkbox-switcher-ribbon-class");

        // This adds a status bar item to the bottom of the app. Does not work on mobile apps.
        // const statusBarItemEl = this.addStatusBarItem();
        // statusBarItemEl.setText("Status Bar Text");

        // This adds a simple command that can be triggered anywhere
        // this.addCommand({
        //     id: "open-sample-modal-simple",
        //     name: "Open sample modal (simple)",
        //     callback: () => {
        //         new SampleModal(this.app).open();
        //     },
        // });

        // This adds an editor command that can perform some operation on the current editor instance
        // this.addCommand({
        //     id: "sample-editor-command",
        //     name: "Sample editor command",
        //     editorCallback: (editor: Editor, view: MarkdownView) => {
        //         console.log(editor.getSelection());
        //         editor.replaceSelection("Sample Editor Command");
        //     },
        // });

        // This adds a complex command that can check whether the current state of the app allows execution of the command
        // this.addCommand({
        //     id: "open-sample-modal-complex",
        //     name: "Open sample modal (complex)",
        //     checkCallback: (checking: boolean) => {
        //         // Conditions to check
        //         const markdownView =
        //             this.app.workspace.getActiveViewOfType(MarkdownView);
        //         if (markdownView) {
        //             // If checking is true, we're simply "checking" if the command can be run.
        //             // If checking is false, then we want to actually perform the operation.
        //             if (!checking) {
        //                 new SampleModal(this.app).open();
        //             }

        //             // This command will only show up in Command Palette when the check function returns true
        //             return true;
        //         }
        //     },
        // });

        // This adds a settings tab so the user can configure various aspects of the plugin
        this.addSettingTab(new SampleSettingTab(this.app, this));

        // If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
        // Using this function will automatically remove the event listener when this plugin is disabled.
        // this.registerDomEvent(document, "click", (evt: MouseEvent) => {
        //     console.log("click", evt);
        // });

        // When registering intervals, this function will automatically clear the interval when the plugin is disabled.
        this.registerInterval(
            window.setInterval(() => console.log("setInterval"), 5 * 60 * 1000)
        );

        ////////////////////////
        ////////////////////////
        ////////////////////////
        //My Code
        this.addCommand({
            id: "toggle-state",
            name: "Toggle state",
            editorCallback: (editor: Editor, view: MarkdownView) => {
                const currentLineNumber = editor.getCursor().line;
                const currentCursorPosition = editor.getCursor();
                const currentLine = editor.getLine(currentLineNumber);
                const pattern = /- \[.\] /;
                let newLine = currentLine;

                if (currentLine.startsWith("- [ ] ")) {
                    newLine = currentLine.replace(pattern, "- [/] ");
                } else if (currentLine.startsWith("- [/] ")) {
                    newLine = currentLine.replace(pattern, "- [x] ");
                } else {
                    newLine = currentLine.replace(pattern, "- [ ] ");
                }

                editor.setLine(currentLineNumber, newLine);
                editor.setCursor(currentCursorPosition);
            },
        });

        this.addCommand({
            id: "toggle-additional-states",
            name: "Toggle Additional states",
            editorCallback: (editor: Editor, view: MarkdownView) => {
                const currentLineNumber = editor.getCursor().line;
                const currentCursorPosition = editor.getCursor();
                const currentLine = editor.getLine(currentLineNumber);
                const pattern = /- \[.\] /;
                let newLine = currentLine;

                const allStates = this.settings.AdditionalStates;
                const additionalStates = this.settings.AdditionalStates.filter(
                    (s) => s.isEnabled
                );
                const additionalStatesCount = additionalStates.length;

                let currentStateIdx = allStates.findIndex((s) =>
                    currentLine.trimStart().startsWith(`- [${s.value}] `)
                );
                let currentState = allStates[currentStateIdx];

                console.log(currentStateIdx);

                let nextState = currentState;

                do {
                    currentStateIdx =
                        currentStateIdx + 1 >= allStates.length
                            ? 0
                            : currentStateIdx + 1;
                    nextState = allStates[currentStateIdx];




                    
                } while (!nextState.isEnabled);

                console.log(nextState);

                newLine = currentLine.replace(
                    pattern,
                    `- [${nextState.value}] `
                );
                console.log(currentState, nextState);

                // if (currentLine.startsWith("- [ ] ")) {
                //     newLine = currentLine.replace(pattern, "- [!] ");
                // } else if (currentLine.startsWith("- [!] ")) {
                //     newLine = currentLine.replace(pattern, "- [?] ");
                // } else if (currentLine.startsWith("- [?] ")) {
                //     newLine = currentLine.replace(pattern, "- [>] ");
                // } else if (currentLine.startsWith("- [>] ")) {
                //     newLine = currentLine.replace(pattern, "- [f] ");
                // } else {
                //     newLine = currentLine.replace(pattern, "- [ ] ");
                // }

                // console.log(currentLine,newLine);

                editor.setLine(currentLineNumber, newLine);
                editor.setCursor(currentCursorPosition);
            },
        });
    }

    onunload() {}

    async loadSettings() {
        this.settings = Object.assign(
            {},
            DEFAULT_SETTINGS,
            await this.loadData()
        );
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }
}

class SampleSettingTab extends PluginSettingTab {
    plugin: MultiStateCheckBoxSwitcherPlugin;

    constructor(app: App, plugin: MultiStateCheckBoxSwitcherPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;

        containerEl.empty();

        this.plugin.settings.AdditionalStates.forEach((state, idx) => {
            new Setting(containerEl)
                .setName("Additional state number " + idx)
                // .setDesc("value")
                .addText((text) =>
                    text
                        .setPlaceholder("Enter single character")
                        .setValue(state.value)
                        .onChange(async (value) => {
                            state.value = value;
                            await this.plugin.saveSettings();
                        })
                )
                .addToggle((toggle) =>
                    toggle.setValue(state.isEnabled).onChange(async (value) => {
                        state.isEnabled = value;
                        await this.plugin.saveSettings();
                    })
                );
        });
    }
}

// class SampleModal extends Modal {
//     constructor(app: App) {
//         super(app);
//     }

//     onOpen() {
//         const { contentEl } = this;
//         contentEl.setText("Woah!");
//     }

//     onClose() {
//         const { contentEl } = this;
//         contentEl.empty();
//     }
// }
