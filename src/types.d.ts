export type Match = {
    location: string;
};

export type Status =
    | 'passed'
    | 'failed'
    | 'skipped'
    | 'pending'
    | 'undefined'
    | 'ambiguous'
    | 'ambiguous';

export type Result = {
    status: Status;
    duration: number;
    error_message?: string;
};

export type Embedding = {
    data: string;
    mime_type: string;
};

export type Table = {
    rows: {
        cells: string[];
    }[];
};

export type Argument = Table;

export type Step = {
    keyword: string;
    line: number;
    name: string;
    match?: Match;
    result?: Result;
    embeddings?: Embedding[];
    arguments?: Argument[];
} & Partial<Table>; // For Java Cucumber report compatability

export type Tag = {
    name: string;
    line: number;
};

export type BeforeAfter = {
    embeddings?: Embedding[];
    result: Result;
    match?: Match;
};

export type Scenario = {
    description: string;
    id: string;
    keyword: string;
    line: number;
    name: string;
    steps: Step[];
    tags: Tag[];
    type: string;
    before?: BeforeAfter[];
    after?: BeforeAfter[];
};

export type Feature = {
    id: string;
    line: number;
    description: string;
    elements: Scenario[];
    keyword: string;
    name: string;
    tags: Tag[];
    uri: string;
};
