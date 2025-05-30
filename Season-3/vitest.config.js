import { DefaultReporter } from 'vitest/reporters'
import { BaseSequencer } from 'vitest/node'
import { defineConfig } from 'vitest/config'

class LevelReporter extends DefaultReporter {
    async onFinished() {
    };
}

class LevelSequencer extends BaseSequencer {
    async sort(files) {
        return files;
    }
}

export default defineConfig({
    test: {
        bail: 1,
        reporters: [new LevelReporter()],
        testTimeout: 1000 * 60 * 2,
        sequence: {
            shuffle: false,
            sequencer: LevelSequencer,
        }
    },
})
