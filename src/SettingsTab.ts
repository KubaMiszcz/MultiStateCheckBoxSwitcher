import { PluginSettingTab, App, Setting } from "obsidian";
import MultiStateCheckBoxSwitcherPlugin from "./main";

export interface IStateItem {
    value: string;
    isEnabled: boolean;
}

export interface MultiStateCheckBoxSwitcherSettings {
    mySetting: string;
    AdditionalStates: IStateItem[];
}

export const DEFAULT_SETTINGS: MultiStateCheckBoxSwitcherSettings = {
    mySetting: 'default',
    AdditionalStates: [
        { value: '!', isEnabled: true },
        { value: '?', isEnabled: true },
        { value: 'i', isEnabled: true },
        { value: '>', isEnabled: true },
        { value: '<', isEnabled: true },
        { value: 'f', isEnabled: true },
        { value: 'I', isEnabled: true },
        { value: 'k', isEnabled: true },
        { value: 'u', isEnabled: true },
        { value: 'q', isEnabled: true },
        { value: '', isEnabled: false },
        { value: '', isEnabled: false },
    ],
};

export class SettingTab extends PluginSettingTab {
    plugin: MultiStateCheckBoxSwitcherPlugin;

    constructor(app: App, plugin: MultiStateCheckBoxSwitcherPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;

        containerEl.empty();
        const fragment = document.createDocumentFragment();
		containerEl.createEl('h1', { text: 'Multi State CheckBox Switcher' });

		const descriptionEl = containerEl.createEl('div');
        descriptionEl.createEl("p").append(
            "This plugin allows toggles 3 state intead of default two, it works nad looks perfectly when theme supports it eg. ",
            fragment.createEl('a', {
				href: 'https://github.com/colineckert/obsidian-things',
				text: 'Things',
			}),
        );

        ///primaryStatesDescEl
        const primaryStatesDescEl = descriptionEl.createEl('div', {
			cls: 'pattern-defaults',
		});
		primaryStatesDescEl.createEl('h3', { text: `Primary states` });

        const descriptionStatesEl = primaryStatesDescEl.createEl('ul');
		descriptionStatesEl.createEl("li").append('empty: "- [ ] " ');
		descriptionStatesEl.createEl("li").append('partial: "- [/] " ');
		descriptionStatesEl.createEl("li").append('checked: "- [x] " ');

        ///additionalStatesDescEl
        const additionalStatesDescEl = descriptionEl.createEl('div', {
			cls: 'pattern-defaults',
		});
		additionalStatesDescEl.createEl('h3', { text: `Additional states` });
        additionalStatesDescEl.createEl("p").append(
            fragment.createEl('a', {
				href: 'https://github.com/colineckert/obsidian-things/blob/main/assets/checkbox-styles.png',
				text: 'Quick reference',
			}),
        );

        ///additionalStatesSettings
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
