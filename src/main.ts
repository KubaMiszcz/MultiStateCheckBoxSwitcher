import { Editor, MarkdownView, Plugin } from "obsidian";
import {
    DEFAULT_SETTINGS,
    IStateItem,
    MultiStateCheckBoxSwitcherSettings,
    SettingTab,
} from "./SettingsTab";
import { simpleStatesList } from "./constants";

export default class MultiStateCheckBoxSwitcherPlugin extends Plugin {
    settings: MultiStateCheckBoxSwitcherSettings;

    async onload() {
        await this.loadSettings();
        this.validateSettings();

        // This adds a settings tab so the user can configure various aspects of the plugin
        this.addSettingTab(new SettingTab(this.app, this));

        this.addCommand({
            id: "toggle-three-state",
            name: "Toggle 3-state checkbox",
            editorCallback: (editor: Editor, view: MarkdownView) => {
                this.toggleAdditionalStates(editor, simpleStatesList, false);
            },
        });

        this.addCommand({
            id: "toggle-three-state-reverse",
            name: "Toggle 3-state checkbox in reverse",
            editorCallback: (editor: Editor, view: MarkdownView) => {
                this.toggleAdditionalStates(
                    editor,
                    [...simpleStatesList].reverse(),
                    false
                );
            },
        });

        this.addCommand({
            id: "toggle-additional-states",
            name: "Toggle Additional states",
            editorCallback: (editor: Editor, view: MarkdownView) => {
                this.toggleAdditionalStates(
                    editor,
                    this.settings.AdditionalStates,
                    true
                );
            },
        });

        this.addCommand({
            id: "toggle-additional-states-reverse",
            name: "Toggle Additional states in reverse",
            editorCallback: (editor: Editor, view: MarkdownView) => {
                this.toggleAdditionalStates(
                    editor,
                    [...this.settings.AdditionalStates].reverse(),
                    false
                );
            },
        });
    }

    private toggleAdditionalStates(
        editor: Editor,
        statesList: IStateItem[],
        isForwardDirection = true
    ) {
        const pattern = /- \[.\] /;
        const allStates = statesList;
        const currentCursorPosition = editor.getCursor();
        const startSelectionLineNo = editor.getCursor("from");
        const endSelectionLineNo = editor.getCursor("to");

        for (
            let lineNo = startSelectionLineNo.line;
            lineNo <= endSelectionLineNo.line;
            lineNo++
        ) {
            let currentLine = editor.getLine(lineNo);
            if (!currentLine.trimStart().startsWith('- [')) {
                currentLine = "- [ ] " + currentLine;
                editor.setLine(lineNo, currentLine);
                continue;
            }

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

            newLine = currentLine.replace(pattern, `- [${nextState.value}] `);

            editor.setLine(lineNo, newLine);
        }

        editor.setCursor(currentCursorPosition);
        editor.setSelection(startSelectionLineNo, endSelectionLineNo);
    }

    private validateSettings() {
        this.settings.AdditionalStates.forEach((s) => {
            if (s.isEnabled && s.value?.trim().length < 1) {
                s.value = " ";
            }
            if (s.value?.length > 1) {
                s.value = s.value[0];
            }
        });
    }

    private isLineAdditionalStateLine(line: string) {
        const result = !!this.settings.AdditionalStates.find(
            (s) => s.value === line[3]
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
        this.validateSettings();
        await this.saveData(this.settings);
    }
}
