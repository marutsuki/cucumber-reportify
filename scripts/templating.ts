import { ProcessedFeature } from '@ui/template-prep';
import Mustache from 'mustache';

const beforeAfterTemplate = `
 <li class="pt-2 max-w-full">
        <div>
            <div class="flex flex-row justify-between text-md">
                <div class="flex flex-row">
                    <span class="font-bold">{{keyword}}</span>
                    {{#match.location}}
                        <span class="indent-2">{{match.location}}</span>
                    {{/match.location}}
                </div>
                <div class="flex flex-row items-center">
                    <p class="px-2">
                        {{result.duration}}
                    </p>
                    {{ > status}}
                </div>
            </div>
        </div>
        {{#embeddings}}
            {{#isPng}}
                <img src="data:image/png;base64,{{data}}" />
            {{/isPng}}
            {{#isJpeg}}
                <img src="data:image/jpeg;base64,{{data}}" />
            {{/isJpeg}}
            {{#isText}}
                <pre>{{{data}}}</pre>
            {{/isText}}
        {{/embeddings}}
        {{#result.error_message}}
            {{#match.location}}
                <a class="text-primary underline">
                    {{match.location}}
                </a>
            {{/match.location}}
            <div class="max-h-96 overflow-y-auto p-4">
                <pre class="whitespace-pre-wrap text-xs bg-base-100 text-base-content p-2">{{result.error_message}}</pre>
            </div>
        {{/result.error_message}}
    </li>
`;
const statusTemplate = `
    {{#result.passed}}
    <div class="badge badge-success gap-2">Passed</div>
    {{/result.passed}}
    {{#result.failed}}
    <div class="badge badge-error gap-2">Failed</div>
    {{/result.failed}}
    {{#result.skipped}}
    <div class="badge badge-warning gap-2">Skipped</div>
    {{/result.skipped}}
    {{#result.undefined}}
    <div class="badge badge-warning gap-2">Undefined</div>
    {{/result.undefined}}
    {{#result.ambiguous}}
    <div class="badge badge-warning gap-2">Ambiguous</div>
    {{/result.ambiguous}}
    {{#result.pending}}
    <div class="badge badge-info gap-2">Pending</div>
    {{/result.pending}}
`;
const stepTemplate = `
    <li class="max-w-full px-1 {{#result.failed}} bg-[rgb(255,88,97,0.4)] {{/result.failed}}">
        <div>
            <div class="flex flex-row justify-between text-md">
                <div class="flex flex-row">
                    <span class="font-bold">{{keyword}}</span>
                    <span class="indent-2">{{name}}</span>
                </div>
                <div class="flex flex-row items-center">
                    <p class="px-2">
                        {{result.duration}}
                    </p>
                    {{ > status}}
                </div>
            </div>

            {{#arguments}}
                <div class="w-fit">
                    <table class="table">
                        {{#rows}}
                            <tr>
                                {{#cells}}
                                    <td>
                                        {{.}}
                                    </td>
                                {{/cells}}
                            </tr>
                        {{/rows}}
                    </table>
                </div>
            {{/arguments}}
            <div class="w-fit">
                <table class="table">
                    {{#rows}}
                        <tr>
                            {{#cells}}
                                <td class="w-fit">
                                    {{.}}
                                </td>
                            {{/cells}}
                        </tr>
                    {{/rows}}
                </table>
            </div>
        </div>
        {{#embeddings}}
            {{#isPng}}
                <img src="data:image/png;base64,{{data}}" />
            {{/isPng}}
            {{#isJpeg}}
                <img src="data:image/jpeg;base64,{{data}}" />
            {{/isJpeg}}
            {{#isText}}
                <pre>{{{data}}}</pre>
            {{/isText}}
        {{/embeddings}}
        {{#result.error_message}}
            {{#match.location}}
                <a class="text-primary underline">
                    {{match.location}}
                </a>
            {{/match.location}}
            <div class="max-h-96 overflow-y-auto p-4">
                <pre class="whitespace-pre-wrap text-xs bg-base-100 text-base-content p-2">{{result.error_message}}</pre>
            </div>
        {{/result.error_message}}
    </li>
`;

const scenarioTemplate = `
<div
    {{#failed}}data-status="failed"{{/failed}}
    class="scenario collapse bg-base-300 shadow-lg shadow-base-content"
>
    <input id="checkbox-{{id}}" class="min-h-1" type="checkbox" />
    <label for="checkbox-{{id}}" class="z-10 text-base-content collapse-title text-md select-auto font-medium px-2 py-0.5 min-h-0 bg-opacity-50 {{#failed}}bg-error text-error-content{{/failed}}{{^failed}}bg-neutral text-neutral-content{{/failed}}">
        <b>{{keyword}}:</b>
        {{name}}
    </label>
    <ul class="collapse-content">
        <ul class="my-1">
        {{#tags}}
            <li class="tag">{{name}}</li>
        {{/tags}}
        </ul>
        {{#before}}
            {{> beforeAfter}}
        {{/before}}
        {{#steps}}
            {{> step}}
        {{/steps}}
        {{#after}}
            {{> beforeAfter}}
        {{/after}}
    </ul>
</div>
<div`;

const partial = {
    scenario: scenarioTemplate,
    step: stepTemplate,
    status: statusTemplate,
    beforeAfter: beforeAfterTemplate,
};

const template = `{{#features}}
<div
    id="feature-{{id}}"
    class="page feature collapse bg-base-200 m-1 shadow-xl shadow-base-content"
    data-name="{{name}}"
    data-status="{{status}}"
    {...props}
>
    <input id="checkbox-{{id}}" class="min-h-1" type="checkbox" />
    {{#failed}}
        <label for="checkbox-{{id}}" class="z-10 font-medium text-error-content collapse-title rounded-md p-1 flex flex-row justify-between min-h-0 bg-opacity-50 bg-gradient-to-r from-error from-0% to-50% to-neutral">
    {{/failed}}
    {{^failed}}
        <label for="checkbox-{{id}}" class="z-10 font-medium text-success-content collapse-title rounded-md p-1 flex flex-row justify-between min-h-0 bg-opacity-50 bg-gradient-to-r from-success from-0% to-50% to-neutral">
    {{/failed}}
        {{ name }}
        <div class="flex flex-row">
            <div class="text-success h-full rounded-md w-24">
                {{ stats.passed }} passed
            </div>
            <div class="text-error h-full rounded-md w-20">
                {{ stats.failed }} failed
            </div>
            <div class="text-warning h-full rounded-md w-20">
                {{ stats.skipped }} skipped
            </div>
        </div>
    </label>

    <div class="content collapse-content flex flex-col gap-1">
        <ul class="my-1">
            {{#tags}}
                <li class="tag">{{name}}</li>
            {{/tags}}
        </ul>
        <ul class="flex flex-col gap-1">
            {{ #elements }}
                {{> scenario}}
            {{/ elements}}
        </ul>
    </div>
    </div>
</div>
{{/features}}`;

export const genFeatureHtml = (features: ProcessedFeature[]) => {
    return Mustache.render(template, { features }, partial);
};
