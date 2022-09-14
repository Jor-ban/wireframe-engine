export interface AssetsTree {
    name: string;
    isFolder ?: boolean;
    path: string;
    children?: AssetsTree[];
}