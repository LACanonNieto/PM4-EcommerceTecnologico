import { DataSource } from 'typeorm';
export declare const config: {
    type: string;
    database: string | undefined;
    host: string | undefined;
    port: number;
    username: string | undefined;
    password: string | undefined;
    entities: string[];
    dropSchema: boolean;
    synchronize: boolean;
    logging: boolean;
};
declare const _default: (() => {
    type: string;
    database: string | undefined;
    host: string | undefined;
    port: number;
    username: string | undefined;
    password: string | undefined;
    entities: string[];
    dropSchema: boolean;
    synchronize: boolean;
    logging: boolean;
}) & import("@nestjs/config").ConfigFactoryKeyHost<{
    type: string;
    database: string | undefined;
    host: string | undefined;
    port: number;
    username: string | undefined;
    password: string | undefined;
    entities: string[];
    dropSchema: boolean;
    synchronize: boolean;
    logging: boolean;
}>;
export default _default;
export declare const connectionSource: DataSource;
