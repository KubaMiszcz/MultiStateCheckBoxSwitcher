import {
    App,
    Editor,
    EditorPosition,
    MarkdownView,
    // Modal,
    // Notice,
    Plugin,
    PluginSettingTab,
    Setting,
} from "obsidian";
import {
    DEFAULT_SETTINGS,
    IStateItem,
    MultiStateCheckBoxSwitcherSettings,
    SettingTab,
} from "./SettingsTab";

export default class MultiStateCheckBoxSwitcherPlugin extends Plugin {
    settings: MultiStateCheckBoxSwitcherSettings;

    async onload() {
        await this.loadSettings();
        this.validateSettings();

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
        this.addSettingTab(new SettingTab(this.app, this));

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
            id: "toggle-three-state",
            name: "Toggle 3-state checkbox",
            editorCallback: (editor: Editor, view: MarkdownView) => {
                const pattern = /- \[.\] /;
                let currentCursorPosition = editor.getCursor();
                const startSelectionLineNo = editor.getCursor("from");
                const endSelectionLineNo = editor.getCursor("to");

                for (
                    let lineNo = startSelectionLineNo.line;
                    lineNo <= endSelectionLineNo.line;
                    lineNo++
                ) {
                    const currentLine = editor.getLine(lineNo);
                    let newLine = currentLine;

                    if (this.isLineAdditionalStateLine(currentLine)) {
                        continue;
                    }

                    if (currentLine.startsWith("- [ ] ")) {
                        newLine = currentLine.replace(pattern, "- [/] ");
                    } else if (currentLine.startsWith("- [/] ")) {
                        newLine = currentLine.replace(pattern, "- [x] ");
                    } else if (currentLine.startsWith("- [x] ")) {
                        newLine = currentLine.replace(pattern, "- [ ] ");
                    } else {
                        newLine = "- [ ] " + currentLine;
                        currentCursorPosition = {
                            ch: currentCursorPosition.ch + 6,
                            line: lineNo,
                        };
                    }
                    editor.setLine(lineNo, newLine);
                }

                editor.setCursor(currentCursorPosition);
                editor.setSelection(startSelectionLineNo, endSelectionLineNo);
            },
        });

        this.addCommand({
            id: "toggle-additional-states",
            name: "Toggle Additional states",
            editorCallback: (editor: Editor, view: MarkdownView) => {
                const pattern = /- \[.\] /;
                const allStates = this.settings.AdditionalStates;
                const currentCursorPosition = editor.getCursor();
                const startSelectionLineNo = editor.getCursor("from");
                const endSelectionLineNo = editor.getCursor("to");

                for (
                    let lineNo = startSelectionLineNo.line;
                    lineNo <= endSelectionLineNo.line;
                    lineNo++
                ) {
                    const currentLine = editor.getLine(lineNo);
                    let newLine = currentLine;

                    let currentStateIdx = allStates.findIndex((s) =>
                        currentLine.trimStart().startsWith(`- [${s.value}] `)
                    );

                    let nextState: IStateItem;
                    do {
                        currentStateIdx++;

                        if (currentStateIdx >= allStates.length) {
                            nextState = { value: " ", isEnabled: true };
                        } else {
                            nextState = allStates[currentStateIdx];
                        }
                    } while (!nextState.isEnabled);

                    newLine = currentLine.replace(
                        pattern,
                        `- [${nextState.value}] `
                    );

                    editor.setLine(lineNo, newLine);
                }

                editor.setCursor(currentCursorPosition);
                editor.setSelection(startSelectionLineNo, endSelectionLineNo);
            },
        });
    }

    private validateSettings() {
        this.settings.AdditionalStates.forEach((s) => {
            if (s.isEnabled && s.value?.trim().length < 1) {
                s.value = ' ';
            }
            if (s.value?.length > 1) {
                s.value = s.value[0];
            }
        });
    }

    private isLineAdditionalStateLine(currentLine: string) {
        const result = !!this.settings.AdditionalStates.find(
            (s) => s.value === currentLine[3]
        );
        return result;
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
        this.validateSettings()
        await this.saveData(this.settings);
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
