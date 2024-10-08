import { Feature, Scenario, Status, Step } from '@types';
import { FeatureStats, TestSuiteStats } from '@processing/stats';
import { BeforeAfter, Embedding, Result } from '@types';

export type ProcessedResult = Omit<Result, 'status' | 'duration'> & {
    [val in Status]: boolean;
} & {
    duration: string;
};
export type ProcessedEmbedding = Embedding & {
    isPng: boolean;
    isJpeg: boolean;
    isText: boolean;
};

export type ProcessedBeforeAfter = Omit<
    BeforeAfter,
    'result' | 'embeddings'
> & {
    keyword: 'Before' | 'After';
    result?: ProcessedResult;
    embeddings?: ProcessedEmbedding[];
};

export type ProcessedStep = Omit<Step, 'result' | 'embeddings'> & {
    result?: ProcessedResult;
    embeddings?: ProcessedEmbedding[];
};

export type ProcessedScenario = Omit<Scenario, 'steps' | 'before' | 'after'> & {
    steps: ProcessedStep[];
    before?: ProcessedBeforeAfter[];
    after?: ProcessedBeforeAfter[];
    failed: boolean;
};

export type ProcessedFeature = Omit<Feature, 'elements'> & {
    elements: ProcessedScenario[];
    stats: FeatureStats;
    failed: boolean;
};

export default function prepare(
    feature: Feature,
    testStats: TestSuiteStats
): ProcessedFeature {
    const stats = testStats.features[feature.id];
    const failed = stats.failed > 0;
    return {
        ...feature,
        stats,
        failed,
        elements: feature.elements.map((scenario) => {
            const before = scenario.before?.map((b) =>
                mapBeforeAfter('Before', b)
            );
            const after = scenario.after?.map((a) =>
                mapBeforeAfter('After', a)
            );
            const failed = scenario.steps.some(
                (s) => s.result?.status === 'failed'
            );
            return {
                ...scenario,
                failed,
                before,
                after,
                steps: scenario.steps.map((step) => {
                    const embeddings =
                        step.embeddings && mapEmbeddings(step.embeddings);
                    const result = step.result && mapResult(step.result);
                    return {
                        ...step,
                        embeddings,
                        result,
                    };
                }),
            };
        }),
    };
}

function mapBeforeAfter(
    keyword: 'Before' | 'After',
    beforeAfter: BeforeAfter
): ProcessedBeforeAfter {
    const embeddings =
        beforeAfter.embeddings && mapEmbeddings(beforeAfter.embeddings);
    const result = beforeAfter.result && mapResult(beforeAfter.result);
    return {
        ...beforeAfter,
        keyword,
        embeddings,
        result,
    };
}

function mapResult(result: Result): ProcessedResult {
    const mappedResult = {
        ...result,
        error_message: (result.error_message || '').trim(),
        failed: result.status === 'failed',
        passed: result.status === 'passed',
        skipped: result.status === 'skipped',
        undefined: result.status === 'undefined',
        pending: result.status === 'pending',
        ambiguous: result.status === 'ambiguous',
        duration: formatSeconds(result.duration),
    };
    mappedResult[result.status] = true;
    return mappedResult;
}

function mapEmbeddings(embeddings: Embedding[]): ProcessedEmbedding[] {
    return embeddings.map((embedding) => ({
        ...embedding,
        isPng: embedding.mime_type === 'image/png',
        isJpeg: embedding.mime_type === 'image/jpeg',
        isText:
            embedding.mime_type !== 'image/png' &&
            embedding.mime_type !== 'image/jpeg',
    }));
}

const formatSeconds = (seconds: number) =>
    `${Math.round(seconds * 1e-9 * 100) / 100}s`;
