import { PluginSettingTab, App, Setting } from "obsidian";
import MultiStateCheckBoxSwitcherPlugin from "./main";

export interface IStateItem {
    value: string;
    isEnabled: boolean;
}

export interface MultiStateCheckBoxSwitcherSettings {
    mySetting: string;
    AdditionalStateNo1: string;
    AdditionalStates: IStateItem[];
}

export const DEFAULT_SETTINGS: MultiStateCheckBoxSwitcherSettings = {
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

export class SampleSettingTab extends PluginSettingTab {
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
                .setName("Additional state #" + idx)
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
