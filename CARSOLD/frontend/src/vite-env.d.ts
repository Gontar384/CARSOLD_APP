/// <reference types="vite/client" />

import {ModuleRunnerImportMeta} from "vite/module-runner";

interface ImportMetaEnv extends ModuleRunnerImportMeta{
    readonly VITE_BACKEND_URL: string;
    readonly VITE_MAPS_APIKEY: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}