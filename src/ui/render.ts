import { TestSuiteStats } from '@processing/stats';
import mustache from 'mustache';
import path from 'path';
import { filePromise } from '@util/file';

export default async function render(
    appName: string,
    stats: TestSuiteStats,
    partitions: number,
    theme: string,
    showFailedOnStart: boolean
): Promise<string> {
    return Promise.all(
        [
            'report.mustache',
            'header.mustache',
            'summary.mustache',
            'toolbar.mustache',
        ]
            .map((file) => path.join(__dirname, 'templates', file))
            .map((filePath) => filePromise(filePath))
    ).then((files) => {
        const [report, header, summary, toolbar] = files.map((file) =>
            file.toString()
        );
        return mustache.render(
            report,
            {
                ...stats,
                appName,
                stats,
                theme,
                showFailedOnStart,
                partitions: Array.from({ length: partitions }, (_, i) => i),
            },
            {
                Header: header,
                Summary: summary,
                Toolbar: toolbar,
            }
        );
    });
}
